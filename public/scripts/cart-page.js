import products from "./store/products/index.js";
import { effect } from "./store/index.js";

function initCartPage() {
    const container = document.getElementById("cart-list");
    if (!container) return; // 🔥 clave

    function renderCart() {
        const items = products.state.get().list;

        if (!container) return; // doble seguridad

        if (items.length === 0) {
            container.innerHTML = '<h2 class="text-2xl font-bold mb-6 text-center text-white">Tu carrito está vacío</h2>';
            return;
        }

        // container.innerHTML = items.map(item => ``).join("");
        container.innerHTML = `
            <h2 class="text-2xl font-bold mb-6 text-center text-white">Tu Carrito</h2>

            <div class="flex flex-col md:flex-row gap-6">
                <!-- Lista de productos -->
                <div class="flex-1 rounded-lg p-4">
                    <h3 class="font-semibold text-lg mb-4 text-white">Productos</h3>

                    ${items.map(item => `
                        <!-- Producto -->
                        <div class="flex flex-col sm:flex-row items-center justify-between border-b py-3">
                            <div class="flex items-center gap-4">
                                <img src="${item.product.media.imgs[0].src}" alt="${item.product.media.imgs[0].alt}" class="w-20 h-20 object-cover rounded">
                                <div>
                                    <h4 class="font-medium text-white">${item.product.title}</h4>
                                    <p class="text-white text-sm">${item.product.description}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 mt-2 sm:mt-0">
                                <div class="flex items-center gap-1">
                                    <button data-action="minus" data-id="${item.id}" class="w-8 border rounded p-1 text-center text-white bg-transparent">-</button>

                                    <input type="number" min="1" value="${item.quantity}" disabled class="w-16 border rounded p-1 text-center text-white bg-transparent" />

                                    <button data-action="plus" data-id="${item.id}" class="w-8 border rounded p-1 text-center text-white bg-transparent">+</button>
                                </div>
                                <span class="font-semibold text-white">$${(item.product.price * item.quantity).toFixed(2)}</span>
                                <button data-action="remove" data-id="${item.id}" class="text-white hover:text-gray-300 font-bold">Eliminar</button>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <!-- Resumen y Checkout -->
                <div class="w-full md:w-1/3 rounded-lg p-4 flex flex-col gap-4">
                    <h3 class="font-semibold text-lg mb-2 text-white">Resumen</h3>
                    <div class="flex justify-between text-white">
                        <span>Subtotal</span>
                        <span>$${items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between font-bold text-lg text-white">
                        <span>Total</span>
                        <span>$${items.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <button data-action="order-by-whatsapp" class="border border-white text-white rounded-lg py-2 mt-4 hover:bg-white hover:text-black transition">
                        Proceder al Pago
                    </button>
                    <button data-action="generate-invoice" class="border border-white text-white rounded-lg py-2 hover:bg-white hover:text-black transition">
                        Generar Factura del Carrito
                    </button>
                    <button data-action="clear" class="border border-white text-white rounded-lg py-2 hover:bg-white hover:text-black transition">
                        Limpiar carrito
                    </button>
                </div>
            </div>
        `;
    }

    effect(renderCart);
}

document.addEventListener("astro:page-load", initCartPage);

document.addEventListener("click", (e) => {
	const btn = e.target.closest("button");
	if (!btn) return;

	const action = btn.dataset.action;
	const id = btn.dataset.id;

    if (action === "order-by-whatsapp") {
        const items = products.state.get().list;
        if (items.length === 0) return;

        const message = "Hola, quiero proceder con el pago. Adjunto la factura generada del carrito.";

		// ⚠️ reemplaza con tu número (formato internacional sin +)
		const phone = "571234567890";

		const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

		window.open(url, "_blank");
    }

    if (action === "clear") {
        products.actions.clear();
        return;
    }

	if (!action || !id) return;

	const item = products.state.get().list.find(p => p.id === id);
	if (!item) return;

	if (action === "minus") {
		products.actions.subtrac(id);
	}

	if (action === "plus") {
		products.actions.add({
			id,
			product: item.product,
			quantity: 1
		});
	}

    if (action === "remove") {
        products.actions.remove(id);
    }
});

// generate invoice
import "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;

    if (action === "generate-invoice") {
        // ---------------- DATA DUMMY ----------------
        const cartData = products.state.get().list;;
        
        // ---------------- GENERAR PDF ----------------
        const { jsPDF } = window.jspdf;

        const invoiceNumber = 'FAC-' + Math.floor(Math.random() * 100000);
        const date = new Date().toLocaleDateString();
        const clientName = prompt("Ingrese nombre del cliente:", "Cliente Demo") || "Cliente Demo";

        let total = 0;
        
        // Crear un nuevo PDF
        const doc = new jsPDF();

        let y = 10; // posición vertical inicial
        doc.setFontSize(16);
        doc.text("Factura Electrónica", 105, y, { align: "center" });
        y += 10;

        doc.setFontSize(12);
        doc.text(`Factura N°: ${invoiceNumber}`, 10, y);
        y += 6;
        doc.text(`Fecha: ${date}`, 10, y);
        y += 6;
        doc.text(`Cliente: ${clientName}`, 10, y);
        y += 10;

        // Tabla de productos
        doc.text("Producto                  Cantidad                        Precio Unitario                                 Subtotal", 10, y);
        y += 6;

        cartData.forEach(item => {
            const subtotal = item.product.price * item.quantity;
            total += subtotal;

            // Ajustar texto para alinear columnas (simple)
            const line = `${item.product.title.padEnd(18)}                    ${item.quantity.toString().padEnd(8)}                             $${item.product.price.toFixed(2).padEnd(14)}                           $${subtotal.toFixed(2)}`;
            doc.text(line, 10, y);
            y += 6;
        });

        y += 4;
        doc.setFontSize(14);
        doc.text(`Total: $${total.toFixed(2)}`, 177, y, { align: "right" });

        y += 10;
        doc.setFontSize(10);
        doc.text("Gracias por su compra!", 105, y, { align: "center" });

        // ---------------- DESCARGAR PDF ----------------
        doc.save(`Factura_${invoiceNumber}.pdf`);
        return;
    }
});