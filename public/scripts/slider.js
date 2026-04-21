export function initSlider() {
    const slider = document.querySelector("[data-slider]");
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const thumbs = slider.querySelectorAll(".thumb");
    const prev = slider.querySelector("[data-prev]");
    const next = slider.querySelector("[data-next]");

    let current = 0;

    function show(index) {
        slides.forEach((el, i) => {
            el.style.display = i === index ? "block" : "none";

            const video = el.querySelector("video");
            if (video && i !== index) video.pause();
        });

        // 👇 activar thumbnail
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle("active", i === index);
        });

        // 👇 auto-scroll del thumbnail activo
        const activeThumb = thumbs[index];
        activeThumb?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });
    }

    prev?.addEventListener("click", () => {
        current = (current - 1 + slides.length) % slides.length;
        show(current);
    });

    next?.addEventListener("click", () => {
        current = (current + 1) % slides.length;
        show(current);
    });

    // 👇 click en thumbnails
    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            current = Number(thumb.dataset.thumb);
            show(current);
        });
    });

    show(current);
}

document.addEventListener("astro:page-load", initSlider);