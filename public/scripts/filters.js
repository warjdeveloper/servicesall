function initFilters() {
    const input = document.getElementById("search");
    const clearBtn = document.getElementById("clear-search");
    const categoryButtons = document.querySelectorAll(".category-btn");

    let activeCategories = new Set();

    function toggleClearBtn() {
        if (!clearBtn || !input) return;

        const show = input.value.length > 0;

        clearBtn.classList.toggle("hidden", !show);
        clearBtn.classList.toggle("flex", show);
    }

    // restore state
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

    clearBtn?.addEventListener("click", () => {
        if (!input) return;

        input.value = "";
        localStorage.setItem("search", "");
        toggleClearBtn();
        filter();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.dataset.category.toLowerCase();

            if (cat === "__all__") {
                activeCategories.clear();
            } else {
                activeCategories.has(cat)
                    ? activeCategories.delete(cat)
                    : activeCategories.add(cat);
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

            const matchSearch =
                title.includes(search) ||
                description.includes(search) ||
                category.includes(search);

            const matchCategory =
                activeCategories.size === 0 ||
                activeCategories.has(category);

            card.classList.toggle("hidden", !(matchSearch && matchCategory));
        });

        categoryButtons.forEach(btn => {
            const cat = btn.dataset.category.toLowerCase();

            const isActive =
                cat !== "__all__"
                    ? activeCategories.has(cat)
                    : activeCategories.size === 0;

            btn.classList.toggle("bg-(--text)", isActive);
            btn.classList.toggle("text-(--bg)", isActive);

            btn.classList.toggle("text-(--text)", !isActive);
        });
    }
}

document.addEventListener("astro:page-load", initFilters);