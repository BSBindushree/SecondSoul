
const API = "http://localhost:5000/api";

function authToken() {
  return localStorage.getItem("token");
}

function setAuth(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

async function apiFetch(path, opts={}) {
  opts.headers = opts.headers || {};
  if (authToken()) opts.headers["Authorization"] = "Bearer " + authToken();
  const res = await fetch(API + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "index") initIndex();
  if (page === "login") initLogin();
  if (page === "register") initRegister();
  if (page === "dashboard") initDashboard();
  if (page === "addProduct") initAddProduct();
  if (page === "myListings") initMyListings();
  if (page === "productDetail") initProductDetail();
  if (page === "cart") initCart();
  if (page === "purchases") initPurchases();
});

// INDEX - browse products
function productCard(p) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <img src="${p.image || 'https://via.placeholder.com/400x300?text=No+Image'}" alt="${p.title}" />
    <h3>${p.title}</h3>
    <p>₹ ${p.price}</p>
    <p>Seller: ${p.seller || 'Unknown'}</p>
    <a class="btn" href="productDetail.html?id=${p.id}">View</a>
  `;
  return div;
}

async function initIndex() {
  const productsEl = document.getElementById("products");
  const load = async () => {
    const search = document.getElementById("search").value;
    const category = document.getElementById("category").value;
    const q = new URLSearchParams();
    if (search) q.append("search", search);
    if (category) q.append("category", category);
    const rows = await fetch(API + "/products?" + q.toString()).then(r => r.json());
    productsEl.innerHTML = "";
    rows.forEach(p => productsEl.appendChild(productCard(p)));
  };
  document.getElementById("searchBtn").addEventListener("click", load);
  await load();
}

// LOGIN
function initLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const res = await fetch(API + "/login", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})}).then(r=>r.json());
      if (res.token) {
        setAuth(res.token);
        alert("Logged in");
        window.location.href = "dashboard.html";
      } else alert("Login failed");
    } catch (err) { alert("Error logging in"); }
  });
}

// REGISTER
function initRegister() {
  const form = document.getElementById("registerForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const res = await fetch(API + "/register", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,email,password})}).then(r=>r.json());
      if (res.success) {
        alert("Registered! Please login.");
        window.location.href = "login.html";
      } else alert("Register failed");
    } catch (err) { alert("Error registering"); }
  });
}

// DASHBOARD
async function initDashboard() {
  try {
    const profile = await apiFetch("/profile");
    document.getElementById("uname").textContent = profile.username || "";
    document.getElementById("uemail").textContent = profile.email || "";
    document.getElementById("saveProfile").addEventListener("click", async () => {
      const newusername = document.getElementById("newusername").value;
      await apiFetch("/profile", {method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({username:newusername})});
      alert("Saved");
      location.reload();
    });
  } catch (err) {
    alert("Please login first");
    window.location.href = "login.html";
  }
}

// ADD PRODUCT
function initAddProduct() {
  const form = document.getElementById("productForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const price = Number(document.getElementById("price").value || 0);
    const image = document.getElementById("image").value;
    try {
      await apiFetch("/products", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({title,category,description,price,image})});
      alert("Product added");
      window.location.href = "myListings.html";
    } catch (err) { alert("Error: " + (err.error || JSON.stringify(err))); }
  });
}

// MY LISTINGS
async function initMyListings() {
  try {
    const rows = await apiFetch("/myproducts");
    const cont = document.getElementById("myProducts");
    cont.innerHTML = "";
    rows.forEach(p => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `<img src="${p.image || 'https://via.placeholder.com/400x300?text=No+Image'}"><h3>${p.title}</h3><p>₹ ${p.price}</p>
      <a class="btn" href="productDetail.html?id=${p.id}">View</a>
      <button class="btn" onclick="editProduct(${p.id})">Edit</button>
      <button class="btn" onclick="deleteProduct(${p.id})">Delete</button>`;
      cont.appendChild(d);
    });
  } catch (err) { alert("Please login"); window.location.href="login.html"; }
}

window.deleteProduct = async function(id) {
  if (!confirm("Delete this product?")) return;
  try { await apiFetch("/products/" + id, {method:"DELETE"}); alert("Deleted"); location.reload(); } catch (e){ alert("Error"); }
}

window.editProduct = function(id) {
  // For simplicity, redirect to addProduct and use query param to load editing (not implemented fully)
  const url = new URL(location.href);
  window.location.href = "addProduct.html?edit=" + id;
}

// PRODUCT DETAIL
async function initProductDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  if (!id) { alert("No product specified"); window.location.href="index.html"; return; }
  const p = await fetch(API + "/products/" + id).then(r=>r.json());
  const container = document.getElementById("product");
  container.innerHTML = `<div class="product-detail"><img src="${p.image || 'https://via.placeholder.com/600x400?text=No+Image'}"><h2>${p.title}</h2><p>₹ ${p.price}</p><p>${p.description||''}</p><p>Category: ${p.category||''}</p><p>Seller: ${p.seller||''}</p>
  <button class="btn primary" id="addToCart">Add to Cart</button>
  <button class="btn" id="buyNow">Buy Now</button></div>`;
  document.getElementById("addToCart").addEventListener("click", async ()=>{
    try { await apiFetch("/cart/" + id, {method:"POST"}); alert("Added to cart"); } catch(e){ alert("Please login"); window.location.href="login.html"; }
  });
  document.getElementById("buyNow").addEventListener("click", async ()=>{
    try { await apiFetch("/purchase/" + id, {method:"POST"}); alert("Purchased"); window.location.href="purchases.html"; } catch(e){ alert("Please login"); window.location.href="login.html"; }
  });
}

// CART
async function initCart() {
  try {
    const rows = await apiFetch("/cart");
    const cont = document.getElementById("cartItems");
    cont.innerHTML = "";
    rows.forEach(r => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `<h3>${r.title}</h3><p>₹ ${r.price}</p><button class="btn primary" onclick="purchaseFromCart(${r.id})">Buy</button><button class="btn" onclick="removeFromCart(${r.cart_id})">Remove</button>`;
      cont.appendChild(d);
    });
  } catch (err) { alert("Please login"); window.location.href="login.html"; }
}

window.removeFromCart = async function(cartId) {
  try { await apiFetch("/cart/" + cartId, {method:"DELETE"}); alert("Removed"); location.reload(); } catch(e){ alert("Error"); }
}

window.purchaseFromCart = async function(productId) {
  try { await apiFetch("/purchase/" + productId, {method:"POST"}); alert("Purchased"); location.reload(); } catch(e){ alert("Error"); }
}

// PURCHASES
async function initPurchases() {
  try {
    const rows = await apiFetch("/purchases");
    const cont = document.getElementById("purchasesList");
    cont.innerHTML = "";
    rows.forEach(p => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `<img src="${p.image || 'https://via.placeholder.com/400x300?text=No+Image'}"><h3>${p.title}</h3><p>₹ ${p.price}</p><p>Purchased on: ${p.created_at || ''}</p>`;
      cont.appendChild(d);
    });
  } catch (err) { alert("Please login"); window.location.href="login.html"; }
}
