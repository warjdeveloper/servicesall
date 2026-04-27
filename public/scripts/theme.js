function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const root = document.body;

    // cargar estado guardado
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        root.classList.add("light");
        btn.textContent = "☀️";
    } else {
        btn.textContent = "🌙";
    }

    btn.addEventListener("click", () => {
        const isLight = root.classList.toggle("light");

        if (isLight) {
            btn.textContent = "☀️";
            localStorage.setItem("theme", "light");
        } else {
            btn.textContent = "🌙";
            localStorage.setItem("theme", "dark");
        }
    });
}

document.addEventListener("astro:page-load", initThemeToggle);