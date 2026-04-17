document.addEventListener('click', (e) => {
    if (e.target.id === 'menu-btn') {
        const menu = document.getElementById('menu');
        menu.classList.toggle('open');
        e.target.textContent = menu.classList.contains('open') ? '✕' : '☰';
    }
});