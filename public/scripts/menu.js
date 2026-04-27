function initMenu() {
    const btn = document.getElementById("menu-btn");
    const menu = document.getElementById("menu");

    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
        const isHidden = menu.classList.contains("hidden");

        if (isHidden) {
            menu.classList.remove("hidden");
            menu.classList.add("flex");
            btn.textContent = "✕";
            document.body.style.overflow = "hidden"; // bloquea scroll
        } else {
            menu.classList.add("hidden");
            menu.classList.remove("flex");
            btn.textContent = "☰";
            document.body.style.overflow = "";
        }
    });

    // cerrar al hacer click en un link
    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.add("hidden");
            menu.classList.remove("flex");
            btn.textContent = "☰";
            document.body.style.overflow = "";
        });
    });
}

document.addEventListener("astro:page-load", initMenu);