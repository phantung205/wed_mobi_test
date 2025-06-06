// script.js
document.addEventListener("DOMContentLoaded", function () {
  // ========== CART FUNCTIONALITY ==========
  const cartIcon = document.getElementById("cart-icon");
  const cartOverlay = document.querySelector(".cart-overlay");
  const closeCart = document.querySelector(".close-cart");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".total-amount");
  const cartCount = document.querySelector(".cart-count");
  const checkoutBtn = document.querySelector(".checkout-btn");
  const clearCartBtn = document.querySelector(".clear-cart-btn");
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Open cart
  cartIcon.addEventListener("click", () => {
    cartOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  // Close cart
  closeCart.addEventListener("click", () => {
    cartOverlay.classList.remove("show");
    document.body.style.overflow = "auto";
  });

  // Add to cart
  addToCartBtns.forEach((btn) => {
    btn.addEventListener("click", addToCart);
  });

  window.addToCart = function (e) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseInt(e.target.dataset.price);
    const image = e.target.dataset.image;

    // Check if item already in cart
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      });
    }

    updateCart();

    // Show success message
    showNotification("Đã thêm sản phẩm vào giỏ hàng");
  };

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

    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(
                      item.price
                    )}đ</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${
                          item.id
                        }">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${
                          item.id
                        }">+</button>
                        <button class="remove-item" data-id="${item.id}">
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
    const id = e.target.dataset.id;
    const item = cart.find((item) => item.id === id);

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart = cart.filter((item) => item.id !== id);
    }

    updateCart();
  }

  // Increase quantity
  function increaseQuantity(e) {
    const id = e.target.dataset.id;
    const item = cart.find((item) => item.id === id);
    item.quantity += 1;
    updateCart();
  }

  // Remove item
  function removeItem(e) {
    const id = e.target.closest(".remove-item").dataset.id;
    cart = cart.filter((item) => item.id !== id);
    updateCart();
  }

  // Render cart total
  function renderCartTotal() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
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

  // ========== FILTER PRODUCTS ==========
  const filterBtns = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", filterProducts);
  });

  function filterProducts(e) {
    const filter = e.target.dataset.filter;
    const products = document.querySelectorAll(".product");

    // Update active button
    filterBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.filter === filter) {
        btn.classList.add("active");
      }
    });

    // Filter products
    products.forEach((product) => {
      if (filter === "all" || product.dataset.category === filter) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  }

  // ========== BACK TO TOP BUTTON ==========
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // ========== MOBILE MENU ==========
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav ul");

  hamburger.addEventListener("click", () => {
    nav.classList.toggle("show");
  });

  // Close menu when clicking on a link
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
    });
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // ========== LOAD MORE PRODUCTS ==========
  const loadMoreBtn = document.querySelector(".load-more-btn");
  let visibleProducts = 8; // Initial number of visible products

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      const allProducts = document.querySelectorAll(".product");
      const totalProducts = allProducts.length;

      for (
        let i = visibleProducts;
        i < visibleProducts + 4 && i < totalProducts;
        i++
      ) {
        allProducts[i].style.display = "block";
      }

      visibleProducts += 4;

      if (visibleProducts >= totalProducts) {
        loadMoreBtn.style.display = "none";
      }
    });

    // Initially hide products beyond the first 8
    const allProducts = document.querySelectorAll(".product");
    if (allProducts.length > 8) {
      for (let i = 8; i < allProducts.length; i++) {
        allProducts[i].style.display = "none";
      }
    } else {
      loadMoreBtn.style.display = "none";
    }
  }

  // Initialize cart
  updateCart();

  // ========== USER ICON REDIRECT ==========
  const userIcon = document.querySelector(".user-icon");
  if (userIcon) {
    userIcon.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }

  // ========== VIEW DETAILS BUTTON ==========
  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const product = btn.closest(".product");
      const name = product.querySelector(".product-title").textContent;
      const price = product.querySelector(".price")
        ? product.querySelector(".price").textContent.replace(/\D/g, "")
        : "";
      const oldPrice = product.querySelector(".old-price")
        ? product.querySelector(".old-price").textContent.replace(/\D/g, "")
        : "";
      const image = product.querySelector("img").src;
      const rating = product.querySelectorAll(
        ".fa-star, .fa-star-half-alt"
      ).length;
      const reviews = product.querySelector(".product-rating span")
        ? product
            .querySelector(".product-rating span")
            .textContent.replace(/\D/g, "")
        : "";
      const category = product.dataset.category || "";

      // Tạo URL với tham số sản phẩm
      const url = `detail.html?name=${encodeURIComponent(
        name
      )}&price=${price}&old_price=${oldPrice}&image=${encodeURIComponent(
        image
      )}&rating=${rating}&reviews=${reviews}&category=${encodeURIComponent(
        category
      )}`;
      window.location.href = url;
    });
  });

  // Tìm kiếm sản phẩm theo tên
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  function searchProducts() {
    const keyword = searchInput.value.trim().toLowerCase();
    const products = document.querySelectorAll(".product");
    let found = false;
    products.forEach((product) => {
      const title = product
        .querySelector(".product-title")
        .textContent.toLowerCase();
      if (title.includes(keyword)) {
        product.style.display = "block";
        found = true;
      } else {
        product.style.display = "none";
      }
    });
    // Nếu không tìm thấy sản phẩm nào, bạn có thể hiển thị thông báo tùy ý
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", searchProducts);
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") searchProducts();
    });
  }

  // --- AUTOCOMPLETE SUGGESTIONS FOR SEARCH ---
  const searchSuggestions = document.getElementById("searchSuggestions");

  // Lấy danh sách sản phẩm từ DOM
  function getProductList() {
    return Array.from(document.querySelectorAll(".product")).map((product) => {
      return {
        name: product.querySelector(".product-title").textContent.trim(),
        image: product.querySelector("img").src,
        price: product.querySelector(".price")
          ? product.querySelector(".price").textContent
          : "",
        oldPrice: product.querySelector(".old-price")
          ? product.querySelector(".old-price").textContent
          : "",
        rating: product.querySelectorAll(".fa-star, .fa-star-half-alt").length,
        reviews: product.querySelector(".product-rating span")
          ? product
              .querySelector(".product-rating span")
              .textContent.replace(/\D/g, "")
          : "",
        category: product.dataset.category || "",
      };
    });
  }

  // Hiển thị gợi ý
  searchInput.addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();
    const list = getProductList();
    if (!keyword) {
      searchSuggestions.classList.remove("active");
      searchSuggestions.innerHTML = "";
      return;
    }
    const matches = list.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    if (matches.length === 0) {
      searchSuggestions.classList.remove("active");
      searchSuggestions.innerHTML = "";
      return;
    }
    searchSuggestions.innerHTML = matches
      .map(
        (item) => `<div class="suggestion-item" tabindex="0">${item.name}</div>`
      )
      .join("");
    searchSuggestions.classList.add("active");

    // Xử lý click vào gợi ý
    document.querySelectorAll(".suggestion-item").forEach((el) => {
      el.addEventListener("click", function () {
        const selected = list.find(
          (item) => item.name === this.textContent.trim()
        );
        if (selected) {
          // Tạo URL chi tiết sản phẩm
          const url = `detail.html?name=${encodeURIComponent(
            selected.name
          )}&price=${selected.price.replace(
            /\D/g,
            ""
          )}&old_price=${selected.oldPrice.replace(
            /\D/g,
            ""
          )}&image=${encodeURIComponent(selected.image)}&rating=${
            selected.rating
          }&reviews=${selected.reviews}&category=${encodeURIComponent(
            selected.category
          )}`;
          window.location.href = url;
        }
      });
    });
  });

  // Ẩn gợi ý khi blur khỏi input
  searchInput.addEventListener("blur", function () {
    setTimeout(() => {
      searchSuggestions.classList.remove("active");
      searchSuggestions.innerHTML = "";
    }, 200);
  });
});

// Add some styles for the notification
const style = document.createElement("style");
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #27ae60;
        color: white;
        padding: 12px 24px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);
