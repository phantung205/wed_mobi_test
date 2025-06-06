// Lấy thông tin từ URL
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const price = params.get("price");
const oldPrice = params.get("old_price");
const image = params.get("image");
const rating = params.get("rating");
const reviews = params.get("reviews");
const category = params.get("category");

// Đổ dữ liệu vào trang
if (name) document.getElementById("productName").textContent = name;
if (price)
  document.getElementById("productPrice").textContent =
    parseInt(price).toLocaleString("vi-VN") + "đ";
if (oldPrice) {
  document.getElementById("productOldPrice").textContent =
    parseInt(oldPrice).toLocaleString("vi-VN") + "đ";
} else {
  document.getElementById("productOldPrice").style.display = "none";
}
if (image) document.getElementById("productImage").src = image;
if (category)
  document.getElementById("productCategory").textContent =
    "Danh mục: " + category;
if (rating || reviews)
  document.getElementById("productRating").textContent =
    "★★★★☆ (" + (reviews || 0) + " đánh giá)";

// ========== CART FUNCTIONALITY ==========
const cartIcon = document.getElementById("cart-icon");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const addToCartBtn = document.getElementById("addToCartBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Open cart
cartIcon.addEventListener("click", () => {
  cartOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
  renderCartItems();
});

// Close cart
closeCart.addEventListener("click", () => {
  cartOverlay.classList.remove("show");
  document.body.style.overflow = "auto";
});

// Add to cart
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", function () {
    const name = document.getElementById("productName").textContent;
    const price = parseInt(
      document.getElementById("productPrice").textContent.replace(/\D/g, "")
    );
    const image = document.getElementById("productImage").src;

    // Check if item already in cart
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
      showNotification(
        "Sản phẩm đã có trong giỏ hàng, đã tăng số lượng lên 1!"
      );
    } else {
      cart.push({
        name,
        price,
        image,
        quantity: 1,
      });
      showNotification("Đã thêm vào giỏ hàng!");
    }

    updateCart();
  });
}

// Update cart UI
function updateCart() {
  renderCartItems();
  renderCartTotal();
  updateCartCount();
  saveCartToLocalStorage();
}

// Render cart items
function renderCartItems() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Giỏ hàng của bạn đang trống</p>';
    return;
  }

  cart.forEach((item, idx) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-price">${formatPrice(item.price)}đ</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn minus" data-idx="${idx}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-idx="${idx}">+</button>
          <button class="remove-item" data-idx="${idx}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Add event listeners to new buttons
  document.querySelectorAll(".minus").forEach((btn) => {
    btn.addEventListener("click", decreaseQuantity);
  });

  document.querySelectorAll(".plus").forEach((btn) => {
    btn.addEventListener("click", increaseQuantity);
  });

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });
}

// Decrease quantity
function decreaseQuantity(e) {
  const idx = e.target.dataset.idx;
  if (cart[idx].quantity > 1) {
    cart[idx].quantity -= 1;
  } else {
    cart.splice(idx, 1);
  }
  updateCart();
}

// Increase quantity
function increaseQuantity(e) {
  const idx = e.target.dataset.idx;
  cart[idx].quantity += 1;
  updateCart();
}

// Remove item
function removeItem(e) {
  const idx = e.target.closest(".remove-item").dataset.idx;
  cart.splice(idx, 1);
  updateCart();
}

// Render cart total
function renderCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatPrice(total) + "đ";
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống!");
    return;
  }

  if (confirm("Xác nhận thanh toán?")) {
    cart = [];
    updateCart();
    showNotification("Thanh toán thành công! Cảm ơn bạn đã mua hàng");
  }
});

// Clear cart
clearCartBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  if (confirm("Bạn có chắc chắn muốn xóa giỏ hàng?")) {
    cart = [];
    updateCart();
    showNotification("Đã xóa giỏ hàng");
  }
});

// Format price
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Khởi tạo cart UI
updateCart();
