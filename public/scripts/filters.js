function initFilters() {
    const input = document.getElementById("search");
    const clearBtn = document.getElementById("clear-search");
    const categoryButtons = document.querySelectorAll(".category-btn");

    // mostrar / ocultar botón
    function toggleClearBtn() {
        if (!clearBtn) return; // 🔥 clave
        if ((input?.value || "").length > 0) {
            clearBtn.classList.remove("hidden");
        } else {
            clearBtn.classList.add("hidden");
        }
    }

    let activeCategories = new Set();

    // cargar desde localStorage (opcional)
    const savedSearch = localStorage.getItem("search") || "";
    const savedCategories = JSON.parse(localStorage.getItem("categories") || "[]");

    if (input) input.value = savedSearch;
    activeCategories = new Set(savedCategories);

    toggleClearBtn();
    filter();

    let debounce;

    input?.addEventListener("input", (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            localStorage.setItem("search", e.target.value);
            toggleClearBtn();
            filter();
        }, 200);
    });

    // click en la X
    clearBtn?.addEventListener("click", () => {
        input.value = "";
        localStorage.setItem("search", "");
        toggleClearBtn();
        filter();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.dataset.category.toLowerCase();

            if (cat === "__all__") {
                // reset total
                activeCategories.clear();
            } else {
                if (activeCategories.has(cat)) {
                    activeCategories.delete(cat);
                } else {
                    activeCategories.add(cat);
                }
            }

            localStorage.setItem("categories", JSON.stringify([...activeCategories]));

            filter();
        });
    });

    function filter() {
        const search = (input?.value || "").toLowerCase().trim();

        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const title = card.dataset.title || "";
            const description = card.dataset.description || "";
            const category = card.dataset.category || "";

            const matchSearch = title.includes(search) || description.includes(search) || category.includes(search);
            const matchCategory = activeCategories.size === 0 || activeCategories.has(category);

            if (matchSearch && matchCategory) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });

        categoryButtons.forEach(btn => {
            const cat = btn.dataset.category.toLowerCase();

            if (cat === "__all__") {
                if (activeCategories.size === 0) {
                    btn.classList.add("bg-blue-500", "text-blue-600");
                } else {
                    btn.classList.remove("bg-blue-500", "text-blue-600");
                }
                return;
            }

            if (activeCategories.has(cat)) {
                btn.classList.add("bg-blue-500", "text-blue-600");
            } else {
                btn.classList.remove("bg-blue-500", "text-blue-600");
            }
        });
    }
}

document.addEventListener("astro:page-load", initFilters);