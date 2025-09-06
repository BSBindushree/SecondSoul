// Browse, filter, search products
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('productGrid');

  async function loadProducts() {
    const res = await fetch('/products');
    const products = await res.json();

    productGrid.innerHTML = '';
    products.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <img src="${p.img || '/images/placeholder.png'}" alt="${p.title}">
        <h4>${p.title}</h4>
        <p>$${p.price}</p>
        <a href="/products/${p.id}">View</a>
      `;
      productGrid.appendChild(div);
    });
  }

  loadProducts();
});
