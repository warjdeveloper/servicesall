function initMenu() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');

    if (!btn || !menu) return;

    // evita duplicar eventos
    btn.onclick = () => {
        menu.classList.toggle('open');
        btn.textContent = menu.classList.contains('open') ? '✕' : '☰';
    };
}

document.addEventListener("astro:page-load", initMenu);