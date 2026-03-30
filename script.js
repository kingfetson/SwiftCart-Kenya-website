let cart = [];
const container = document.getElementById("productContainer");

document.getElementById("storeName").innerText = CONFIG.storeName;

/* RENDER PRODUCTS */
function renderProducts(category = "all") {
  container.innerHTML = "";

  CONFIG.products
    .filter(p => category === "all" || p.category === category)
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>KES ${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;

      container.appendChild(div);
    });
}

renderProducts();

/* FILTER */
function filterProducts(cat) {
  renderProducts(cat);
}

/* CART */
function addToCart(id) {
  const product = CONFIG.products.find(p => p.id === id);
  cart.push(product);
  document.getElementById("cartCount").innerText = cart.length;
}

/* OPEN CART */
function openCart() {
  const modal = document.getElementById("cartModal");
  const items = document.getElementById("cartItems");

  let total = 0;
  items.innerHTML = "";

  cart.forEach(item => {
    total += item.price;
    items.innerHTML += `<p>${item.name} - KES ${item.price}</p>`;
  });

  document.getElementById("cartTotal").innerText = total;
  modal.style.display = "block";
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}

/* CHECKOUT */
function openCheckout() {
  document.getElementById("checkout").style.display = "block";
}

function closeCheckout() {
  document.getElementById("checkout").style.display = "none";
}

/* SUBMIT ORDER */
async function submitOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;

  if (!/^07\d{8}$/.test(phone)) {
    alert("Invalid phone number");
    return;
  }

  const products = cart.map(p => p.name).join(", ");
  const total = cart.reduce((s, p) => s + p.price, 0);

  try {
    await fetch(CONFIG.googleScriptURL, {
      method: "POST",
      body: JSON.stringify({ name, phone, products, total, location })
    });
  } catch (err) {
    console.log(err);
  }

  const msg = `Order:
${products}
Total: KES ${total}
Name: ${name}
Phone: ${phone}
Location: ${location}`;

  window.location.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

/* TIMER */
let t = 3600;
setInterval(() => {
  let m = Math.floor(t / 60);
  let s = t % 60;
  document.getElementById("timer").innerText = `${m}:${s}`;
  t--;
}, 1000);
