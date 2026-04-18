// store
import products from "./store/products/index.js";
import { effect } from "./store/index.js";

export function initCart(element) {
    // definitions
    const main_element = element;
    const id = main_element.dataset.id;
    const product = JSON.parse(main_element.dataset.product);

    const btn_add = main_element.querySelector(".btn-add-cart");
    const controls = main_element.querySelector(".btns-and-input");
    const btn_minus = controls.querySelector(".btn-cart-remove");
    const input = controls.querySelector("input");
    const btn_plus = controls.querySelector(".btn-cart-add");

    // effects
    effect(() => {
        const item = products.state.get().list.find(prod => prod.id === id);
        if (!item) {
            btn_add.style.display = "block";
            controls.style.display = "none";
        } else {
            btn_add.style.display = "none";
            controls.style.display = "flex";
            input.value = item.quantity;
        }
    });

    // actions
    btn_add.addEventListener("click", () => {
        products.actions.add({
            id,
            product: product,
            quantity: Number(input.value)
        })
    });

    btn_minus.addEventListener("click", () => {
        const item = products.state.get().list.find(prod => prod.id === id);

        if (!item) return;

        products.actions.subtrac(id);
    });

    btn_plus.addEventListener("click", () => {
        const item = products.state.get().list.find(prod => prod.id === id);

        if (!item) return;

        products.actions.add({
            id,
            product: item.product,
            quantity: item.quantity + 1
        });
    });
}

// document.querySelectorAll(".product-btns").forEach(initCart);
document.addEventListener("astro:page-load", () => {
    document.querySelectorAll(".product-btns").forEach(initCart);
});