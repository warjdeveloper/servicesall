// store
import products from "./store/products/index.js";
import { effect } from "./store/index.js";

export function initCart(element) {
    const root = element;

    if (!root) return;

    const id = root.dataset.id;
    const product = JSON.parse(root.dataset.product);

    // UI refs (más seguras)
    const btnAdd = root.querySelector("[data-action='add']");
    const controls = root.querySelector("[data-controls]");
    const btnMinus = root.querySelector("[data-action='minus']");
    const btnPlus = root.querySelector("[data-action='plus']");
    const input = root.querySelector("input");

    if (!btnAdd || !controls || !btnMinus || !btnPlus || !input) return;

    // EFFECT: sync UI with store
    effect(() => {
        const item = products.state.get().list.find(p => p.id === id);

        if (!item) {
            btnAdd.style.display = "block";
            controls.style.display = "none";
            input.value = 1;
        } else {
            btnAdd.style.display = "none";
            controls.style.display = "flex";
            input.value = item.quantity;
        }
    });

    // ADD
    btnAdd.addEventListener("click", () => {
        products.actions.add({
            id,
            product,
            quantity: Number(input.value || 1)
        });
    });

    // MINUS
    btnMinus.addEventListener("click", () => {
        const item = products.state.get().list.find(p => p.id === id);
        if (!item) return;

        products.actions.subtrac(id);
    });

    // PLUS
    btnPlus.addEventListener("click", () => {
        const item = products.state.get().list.find(p => p.id === id);
        if (!item) return;

        products.actions.add({
            id,
            product: item.product,
            quantity: item.quantity + 1
        });
    });
}

// INIT (Astro navigation safe)
document.addEventListener("astro:page-load", () => {
    document.querySelectorAll("[data-cart-item]").forEach(initCart);
});