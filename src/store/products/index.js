import { STORAGE_TYPES } from "@store/consts.js";
// =====================================================
// store/products/index.js (Redux Toolkit style)
// =====================================================

import { createModule } from "@store/index.js";

const products = createModule({
    name: "products",
    storage: STORAGE_TYPES.LOCAL,
    // 🧾 STATE
    state: {
        list: []
    },
    // 🎬 ACTIONS (reducers puros)
    actions: {
        add: (state, product) => ({
            list: [...state.list, product]
        }),

        remove: (state, id) => ({
            list: state.list.filter(product => product.id !== id)
        }),

        clear: () => ({ list: [] })
    },
    // 🧩 MIDDLEWARES
    middlewares: [
        (next, prev, action) => {
            console.log("[PRODUCTS]", action, next);
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