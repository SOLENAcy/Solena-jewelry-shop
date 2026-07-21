document.addEventListener("DOMContentLoaded", () => {

    let cart = [];

    const buttons = document.querySelectorAll(".add-to-cart");
    const cartButton = document.getElementById("cartButton");
    const cartBox = document.getElementById("cart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    cartButton.addEventListener("click", () => {
        if (cartBox.style.display === "none" || cartBox.style.display === "") {
            cartBox.style.display = "block";
        } else {
            cartBox.style.display = "none";
        }
    });

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const product = button.parentElement;
            const name = product.querySelector("h3").innerText;
            const price = parseFloat(
                product.querySelector(".price").innerText.replace("€", "")
            );

            cart.push({ name, price });
            updateCart();
        });
    });

    function updateCart() {
        cartItems.innerHTML = "";

        let total = 0;

        cart.forEach(item => {
            total += item.price;
            cartItems.innerHTML += `<p>${item.name} - €${item.price}</p>`;
        });

        cartCount.innerText = cart.length;
        cartTotal.innerText = total.toFixed(2);
    }

});
