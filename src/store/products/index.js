import { STORAGE_TYPES } from "@/store/consts.js";
// =====================================================
// store/products/index.js (Redux Toolkit style)
// =====================================================

import { createModule } from "@/store/index.js";

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

        remove: (state, id) => {
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

// import products from "@/store/products/index.js"

// products.actions.add({ id: 1, name: "Laptop" })

// products.select(state => state.list, console.log)

// GLOBAL STATE
// import { getGlobalState } from "@/store/index.js"
// console.log(getGlobalState())