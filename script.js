document.addEventListener("DOMContentLoaded", () => {

    let cart = [];

    const buttons = document.querySelectorAll(".add-to-cart");
    const cartButton = document.getElementById("cartButton");
    const cartBox = document.getElementById("cart");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutForm = document.getElementById("checkoutForm");
    const payBtn = document.getElementById("payBtn");


    cartButton.addEventListener("click", () => {
        cartBox.style.display =
            cartBox.style.display === "block" ? "none" : "block";
    });


    checkoutBtn.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        checkoutForm.style.display = "block";
        cartBox.style.display = "none";

    });


    payBtn.addEventListener("click", async () => {

        const response = await fetch("https://gilded-baklava-cc2ec8.netlify.app/.netlify/functions/create-checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: cart })
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
        } else {
            alert("Payment error.");
        }

    });


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const product = button.parentElement;
            const name = product.querySelector("h3").innerText;
            const colorSelect = product.querySelector(".color-select");

            const color = colorSelect ? colorSelect.value : "";

            const price = parseFloat(
                product.querySelector(".price").innerText.replace("€","")
            );


            cart.push({
                name: color ? `${name} (${color})` : name,
                price: price
            });


            updateCart();

        });

    });


    function updateCart(){

        cartItems.innerHTML = "";

        let total = 0;


        cart.forEach((item,index)=>{

            total += item.price;

            cartItems.innerHTML += `
            <div style="display:flex;justify-content:space-between;align-items:center;margin:10px 0;">
                <span>${item.name} - €${item.price}</span>
                <button class="remove-btn" data-index="${index}">❌</button>
            </div>
            `;

        });


        cartCount.innerText = cart.length;
        cartTotal.innerText = total.toFixed(2);


        document.querySelectorAll(".remove-btn").forEach(btn=>{

            btn.addEventListener("click",()=>{

                const index = Number(btn.dataset.index);

                cart.splice(index,1);

                updateCart();

            });

        });

    }


});
