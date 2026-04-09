// own
import { STORAGE_TYPES } from "@store/consts.js";

// =====================================================
// PROJECT STRUCTURE
// =====================================================

// store/
//   ├── index.js          (core + registry)
//   ├── consts.js         (constants globales)
//   ├── products/
//   │     └── index.js    (products module - localStorage)
//   └── user/
//         └── index.js    (user module - sessionStorage)

// =====================================================
// 🧠 ULTIMATE STORE (CLEAN VERSION)
// Minimal, modular, documented for future maintenance
// =====================================================

// =====================================================
// 📦 GLOBAL REGISTRY
// Stores all modules automatically
// =====================================================
const modules = {};

// =====================================================
// 🌍 ENV DETECTION (SSR SAFE)
// =====================================================
const isBrowser = typeof window !== "undefined";

// =====================================================
// 🧠 DEVTOOLS (simple timeline logger)
// =====================================================
export const devtools = {
    enabled: true,
    timeline: [],

    log(entry) {
        if (!this.enabled) return;
        this.timeline.push({ ...entry, time: Date.now() });
    }
};

// =====================================================
// 🔌 GLOBAL PLUGINS
// Allows extending behavior globally
// =====================================================
const plugins = [];

export const usePlugin = (plugin) => plugins.push(plugin);

const runPlugins = (ctx) => {
    for (const plugin of plugins) plugin(ctx);
};

// =====================================================
// ⚡ SCHEDULER (microtask queue)
// Ensures async + batched execution
// =====================================================
const queue = [];
let flushing = false;

const schedule = (job) => {
    queue.push(job);

    if (!flushing) {
        flushing = true;

        Promise.resolve().then(() => {
            while (queue.length) queue.shift()();
            flushing = false;
        });
    }
};

// =====================================================
// ⚡ BATCH
// Groups multiple updates into one render
// =====================================================
let isBatching = false;
let pending = new Set();

export const batch = (fn) => {
    isBatching = true;
    fn();
    isBatching = false;

    // flush all pending signals
    pending.forEach(signal => signal._flush());
    pending.clear();
};

// =====================================================
// 🧠 REACTIVITY CORE (Signals)
// =====================================================
let activeEffect = null;

// Track dependencies
const track = (signal) => {
    if (!activeEffect) return;

    signal.subs.add(activeEffect);
    activeEffect.deps.add(signal);
};

// Cleanup dependencies
const cleanup = (effect) => {
    effect.deps.forEach(signal => signal.subs.delete(effect));
    effect.deps.clear();
};

// Create reactive signal
const createSignal = (initialValue) => {
    let current = initialValue;
    let next = initialValue;
    const subs = new Set();

    const get = () => {
        track(api);
        return current;
    };

    const _flush = () => {
        if (Object.is(current, next)) return;

        current = next;
        subs.forEach(effect => schedule(effect.run));
    };

    const set = (value) => {
        if (Object.is(next, value)) return;

        next = value;

        if (isBatching) pending.add(api);
        else _flush();
    };

    const api = { get, set, _flush, subs };
    return api;
};

// Run reactive effect
export const effect = (fn) => {
    const eff = {
        deps: new Set(),

        run: () => {
            cleanup(eff);
            activeEffect = eff;
            fn();
            activeEffect = null;
        }
    };

    eff.run();

    // return cleanup
    return () => cleanup(eff);
};

// Derived state
export const computed = (fn) => {
    const signal = createSignal();

    effect(() => signal.set(fn()));

    return {
        get: signal.get
    };
};

// =====================================================
// 🧠 STORE CORE
// Handles state, persistence, middleware, history
// =====================================================
class Store {
    constructor({ key = "app", storage = STORAGE_TYPES.LOCAL } = {}) {
        // 🔑 clave única en storage
        this.key = key;
        // 💾 tipo de almacenamiento
        this.storage = isBrowser
            ? storage === STORAGE_TYPES.SESSION ? sessionStorage : localStorage
            : null;
        // 🧩 middlewares
        this.middlewares = [];
        // time travel
        this.history = [];
        this.pointer = -1;
        // 📦 estado inicial (desde storage)
        const initialState = this._load() || {};
        this.signal = createSignal(initialState);
    }

    // 📥 carga el estado desde storage
    _load() {
        if (!this.storage) return {};
        try {
            const data = this.storage.getItem(this.key);
            return data ? JSON.parse(data) : {};
        } catch {
            return {};
        }
    }

    // 📤 guarda el estado en storage
    _save(state) {
        if (!this.storage) return;
        this.storage.setItem(this.key, JSON.stringify(state));
    }

    // Save history snapshot
    _commit(action, state, prev) {
        this.history = this.history.slice(0, this.pointer + 1);
        this.history.push({ action, state, prev });
        this.pointer++;
    }

    // 📊 obtiene una copia del estado
    getState() {
        return structuredClone(this.signal.get());
    }

    // ✏️ ACTION PRINCIPAL
    // - actualiza el estado
    // - dispara eventos
    // - persiste cambios
    setState(updater, action = "SET_STATE") {
        const prev = this.getState();
        let next = typeof updater === "function" ? updater(prev) : updater;

        // 🧩 middlewares -> Apply middlewares
        for (const mw of this.middlewares) {
            next = mw(next, prev, action) || next;
        }

        const newState = { ...prev, ...next };

        this.signal.set(newState);
        this._save(newState);

        this._commit(action, newState, prev);

        devtools.log({ action, prev, state: newState });
        runPlugins({ action, state: newState, prev });
    }

    // Async actions
    async dispatchAsync(fn, action = "ASYNC") {
        const res = await fn(this.getState());
        this.setState(res, action);
    }

    // Register middleware
    use(mw) {
        this.middlewares.push(mw);
    }

    // time travel
    undo() {
        if (this.pointer <= 0) return;
        this.pointer--;
        this.signal.set(this.history[this.pointer].state);
    }

    redo() {
        if (this.pointer >= this.history.length - 1) return;
        this.pointer++;
        this.signal.set(this.history[this.pointer].state);
    }
}

// =====================================================
// 🧩 createModule (AUTO REGISTER)
// =====================================================

const createModule = ({
    name,
    storage = STORAGE_TYPES.LOCAL,
    state: initialState = {},
    actions = {},
    middlewares = []
}) => {
    const store = new Store({ key: `store_${name}`, storage });

    // 🧱 inicializar estado si no existe en storage
    if (Object.keys(store.getState()).length === 0) {
        store.setState(initialState, `${name}/INIT`);
    }

    // Register middlewares
    middlewares.forEach((mw) => store.use(mw));

    // 🎬 generar actions automáticamente
    const boundActions = {};

    for (const key in actions) {
        boundActions[key] = (payload) => {
            store.setState((prev) => actions[key](prev, payload), `${name}/${key}`);
        };
    }

    // Selectors (computed)
    const select = (fn) => computed(() => fn(store.getState()));

    const module = {
        name,

        // ⚡ STATE REACTIVO
        state: store.signal,

        // 🧾 getter clásico
        getState: () => store.getState(),

        // 🎬 actions
        actions: boundActions,

        select,

        dispatchAsync: (fn, action) => store.dispatchAsync(fn, action),

        undo: () => store.undo(),
        redo: () => store.redo(),

        // acceso interno si necesitas cosas avanzadas
        _instance: store
    };

    // 🔥 AUTO REGISTER
    if (modules[name]) console.warn(`Module "${name}" already exists`);

    modules[name] = module;

    return module;
};

// =====================================================
// 🌍 GLOBAL STATE ACCESS
// =====================================================
export const getGlobalState = () => {
    const result = {};
    for (const key in modules) {
        result[key] = modules[key].getState();
    }
    return result;
};

// =====================================================
// EXPORT CORE
// =====================================================

export { createModule };

// =====================================================
// USAGE (ANYWHERE)
// =====================================================

// GLOBAL STATE
// import { getGlobalState } from "@/store/index.js"
// console.log(getGlobalState())
