import { STORAGE_TYPES } from "@/store/consts.js";
// =====================================================
// store/user/index.js (Redux Toolkit style)
// =====================================================

import { createModule } from "@/store/index.js";

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

// import user from "@/store/user/index.js"

// user.actions.login({ name: "William" })

// user.select(state => state, console.log)

// GLOBAL STATE
// import { getGlobalState } from "@/store/index.js"
// console.log(getGlobalState())