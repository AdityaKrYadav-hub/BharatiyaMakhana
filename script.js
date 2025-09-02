// 🛒 CART FUNCTIONALITY
let cart = [];

function addToCart(product, price) {
    cart.push({ product, price, quantity: 1 });
    updateCart();
    toggleCart(); // sidebar open
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
       <li class="flex justify-between items-center py-2">

        <div>
            <p class="font-bold">${item.product}</p>
            <p class="text-sm text-gray-600">₹${item.price}</p>
        </div>

        <div class="flex items-center border border-gray-300 rounded-full">
            
            ${'' /* --- YEH HAI MAIN LOGIC --- */}
            ${item.quantity === 1
                ? `<button onclick="removeFromCart(${index})" class="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-gray-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                   </button>`
                : `<button onclick="decreaseQuantity(${index})" class="w-9 h-9 flex items-center justify-center text-lg font-bold hover:bg-gray-100 rounded-full transition-colors">
                       −
                   </button>`
            }

            <span class="px-3 font-semibold">${item.quantity}</span>

            <button onclick="increaseQuantity(${index})" class="w-9 h-9 flex items-center justify-center text-lg font-bold hover:bg-gray-100 rounded-full transition-colors">
                +
            </button>
        </div>
    </li>
        `;
    });

    cartTotal.innerText = total;
    if (cartCount) cartCount.innerText = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function toggleCart() {
    const sidebar = document.getElementById("cart-sidebar");
    sidebar.classList.toggle("translate-x-full");
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let orderDetails = "Order Summary:\n";
    cart.forEach(item => {
        orderDetails += `- ${item.product} : ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    orderDetails += `\nTotal: ₹${document.getElementById("cart-total").innerText}`;
    alert(orderDetails);

    // Clear cart after checkout
    cart = [];
    updateCart();
    toggleCart(); // close sidebar
}

// 📩 CONTACT FORM FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector("#contact form");

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // prevent actual submission

        // Optional: get values
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        alert(`✅ Thank you for contacting us!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);

        contactForm.reset();
    });
});

// Initialize AOS
AOS.init({
    duration: 800, // Animation duration in milliseconds
    once: true,     // Whether animation should happen only once
});

// 💳 PAYMENT MODAL FUNCTIONALITY
function showPaymentModal() {
    document.getElementById('payment-modal').classList.remove('hidden');
}

// Function to hide the payment modal
function closePaymentModal() {
    document.getElementById('payment-modal').classList.add('hidden');
}

// Main checkout function
function checkout() {
    const total = parseFloat(document.getElementById('cart-total').innerText);
    if (total <= 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }
    toggleCart(); // Close the cart sidebar
    document.getElementById('shipping-details-form').classList.remove('hidden'); // Show the new payment modal
}
window.closeShippingForm = function () {
    const shippingForm = document.getElementById('shipping-details-form');
    const mainHeader = document.getElementById('main-header');

    shippingForm.classList.add('hidden'); // Hide the shipping form
    mainHeader.classList.remove('hidden'); // Show the main navigation bar again
}

// This function is called when you click "Save and Proceed to Payment".
 function proceedToPayment() {
     // Here you can add code to check if all form fields are filled correctly.

     // Hide the shipping form
     document.getElementById('shipping-details-form').classList.add('hidden');

     // Show the payment modal you created earlier
     showPaymentModal();
 }

// Function to show/hide details based on selected payment method
function togglePaymentDetails(method) {
    // First, hide all detail sections
    document.getElementById('cod-details').classList.add('hidden');
    document.getElementById('upi-details').classList.add('hidden');
    document.getElementById('card-details').classList.add('hidden');
    document.getElementById('netbanking-details').classList.add('hidden');

    // Then, show the relevant one
    const detailsId = method + '-details';
    document.getElementById(detailsId).classList.remove('hidden');
}

// Function to simulate confirming the order
function confirmOrder() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const confirmButton = document.getElementById('confirm-order-btn');

    confirmButton.disabled = true;
    confirmButton.innerText = "Processing...";

    // Simulate a 2.5 second processing delay
    setTimeout(() => {
        confirmButton.disabled = false;
        confirmButton.innerText = "Confirm Order";
        closePaymentModal();

        let successMessage = "";
        switch (selectedMethod) {
            case 'cod':
                successMessage = "Order placed successfully! Please pay with cash on delivery.";
                break;
            case 'upi':
                successMessage = "Payment request sent to your UPI app. Please approve to confirm the order.";
                break;
            case 'card':
                successMessage = "Payment successful! Your order has been confirmed.";
                break;
            case 'netbanking':
                successMessage = "You have been redirected to your bank's portal. Your order is confirmed upon payment.";
                break;
        }

        alert(successMessage);
        clearCartAndUI(); // Clear the cart after successful order
    }, 2500);
}


// Function to clear the cart data and update the display
function clearCartAndUI() {
    cart = []; // Reset the cart array
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('cart-total').innerText = '0';
    document.getElementById('cart-count').innerText = '0';
}

// To ensure the default (COD) details are visible on load
document.addEventListener('DOMContentLoaded', () => {
    togglePaymentDetails('cod');
});


// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

