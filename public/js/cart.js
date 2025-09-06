// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
  const cartButtons = document.querySelectorAll('.add-to-cart');

  cartButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const productId = btn.dataset.productId;
      const res = await fetch('/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) alert('Added to cart!');
      else alert('Error adding to cart');
    });
  });
});
