let cart = [];

const container = document.getElementById("productContainer");
const cartCount = document.getElementById("cartCount");

/* LOAD STORE NAME */
document.getElementById("storeName").innerText = CONFIG.storeName;

/* RENDER PRODUCTS */
CONFIG.products.forEach(p => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${p.image}" />
    <h3>${p.name}</h3>
    <p>KES ${p.price}</p>
    <small>Only ${p.stock} left!</small>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
  `;

  container.appendChild(div);
});

/* ADD TO CART */
function addToCart(id) {
  const product = CONFIG.products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

/* UPDATE CART */
function updateCart() {
  cartCount.innerText = cart.length;
}

/* OPEN CHECKOUT */
function openCheckout() {
  const summary = document.getElementById("summary");
  let total = 0;

  summary.innerHTML = "";

  cart.forEach(item => {
    total += item.price;
    summary.innerHTML += `<p>${item.name} - KES ${item.price}</p>`;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("checkout").style.display = "block";
}

/* SUBMIT ORDER */
async function submitOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;

  if (!/^07\d{8}$/.test(phone)) {
    alert("Enter a valid Kenyan number (07XXXXXXXX)");
    return;
  }

  const productNames = cart.map(p => p.name).join(", ");
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  const order = {
    name,
    phone,
    products: productNames,
    total,
    location
  };

  /* SEND TO GOOGLE SHEETS */
  try {
    await fetch(CONFIG.googleScriptURL, {
      method: "POST",
      body: JSON.stringify(order)
    });
  } catch (err) {
    console.log(err);
  }

  /* WHATSAPP MESSAGE */
  const message = `Hello, I want to order:

Products: ${productNames}
Total: KES ${total}
Name: ${name}
Phone: ${phone}
Location: ${location}`;

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}

/* COUNTDOWN TIMER */
let time = 7200;

setInterval(() => {
  let hrs = Math.floor(time / 3600);
  let mins = Math.floor((time % 3600) / 60);
  let secs = time % 60;

  document.getElementById("timer").innerText =
    `${hrs}:${mins}:${secs}`;

  time--;
}, 1000);
