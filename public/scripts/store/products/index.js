import { STORAGE_TYPES } from "../consts.js";
// =====================================================
// rute (Redux Toolkit style)
// =====================================================

import { createModule } from "../index.js";

const products = createModule({
    name: "products",
    storage: STORAGE_TYPES.LOCAL,
    // 🧾 STATE
    state: {
        list: []
    },
    // 🎬 ACTIONS (reducers puros)
    actions: {
        add: (state, product) => {
            const existing = state.list.find(prod => prod.id === product.id);

            if (existing) {
                return {
                    list: state.list.map(prod => prod.id === product.id ? { ...prod, quantity: prod.quantity + 1 } : prod)
                };
            }

            return {
                list: [...state.list, product]
            };
        },

        subtrac: (state, id) => {
            const existing = state.list.find(prod => prod.id === id);

            if (!existing) return state;

            if (existing.quantity <= 1) {
                return {
                    list: state.list.filter(prod => prod.id !== id)
                };
            }

            return {
                list: state.list.map(prod => prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod )
            };
        },

        remove: (state, id) => {
            const existing = state.list.find(prod => prod.id === id);

            if (!existing) return state;

            return {
                list: state.list.filter(prod => prod.id !== id)
            };
        },

        clear: () => ({ list: [] })
    },
    // 🧩 MIDDLEWARES
    middlewares: [
        (next, prev, action) => {
            // console.log("[PRODUCTS]", action, next);
            return next;
        }
    ]
});

export default products;

// =====================================================
// USAGE (ANYWHERE)
// =====================================================

// import products from "rute"

// products.actions.add({ id: 1, name: "Laptop" })

// products.select(state => state.list, console.log)

// GLOBAL STATE
// import { getGlobalState } from "rute"
// console.log(getGlobalState())