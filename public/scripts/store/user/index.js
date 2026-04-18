import { STORAGE_TYPES } from "../consts.js";
// =====================================================
// rute (Redux Toolkit style)
// =====================================================

import { createModule } from "../index.js";

const user = createModule({
    name: "user",
    storage: STORAGE_TYPES.SESSION,
    // 🧾 STATE
    state: {
        user: null,
        isAuthenticated: false
    },
    // 🎬 ACTIONS (reducers puros)
    actions: {
        login: (_, userData) => ({
            user: userData,
            isAuthenticated: true
        }),

        logout: () => ({
            user: null,
            isAuthenticated: false
        })
    },
    // 🧩 MIDDLEWARES
    middlewares: [
        (next, prev, action) => {
            // console.log("[USER]", action, next);
            return next;
        }
    ]
});

// 🔗 comunicación entre módulos
user.onEvent("user/logout", () => {
    import("@store/products/index.js").then(({ default: products }) => {
        products.actions.clear();
    });
});

export default user;

// =====================================================
// USAGE (ANYWHERE)
// =====================================================

// import user from "rute"

// user.actions.login({ name: "William" })

// user.select(state => state, console.log)

// GLOBAL STATE
// import { getGlobalState } from "rute"
// console.log(getGlobalState())