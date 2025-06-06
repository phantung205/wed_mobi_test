$(document).ready(function () {
  $.get("http://localhost:8080/produce/products", function (res) {
    const products = res.data;
    let html = "";
    products.forEach(function (p) {
      const imgSrc =
        p.img && p.img.trim() !== "" ? p.img : "images/no-image.png";
      const discount = p.discount
        ? `<div class="discount">-${p.discount}%</div>`
        : "";
      const oldPrice = p.oldPrice
        ? `<span class="old-price">${p.oldPrice.toLocaleString(
            "vi-VN"
          )}đ</span>`
        : "";
      let ratingHtml = "";
      if (p.rating) {
        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(p.rating)) {
            ratingHtml += `<i class="fas fa-star"></i>`;
          } else if (i - p.rating < 1) {
            ratingHtml += `<i class="fas fa-star-half-alt"></i>`;
          } else {
            ratingHtml += `<i class="far fa-star"></i>`;
          }
        }
        ratingHtml += `<span>(${p.ratingCount || 0})</span>`;
      }
      html += `
        <div class="product" data-category="${
          p.brand ? p.brand.toLowerCase() : ""
        }">
          <div class="product-img">
            <img src="${imgSrc}" alt="${p.name}" />
            ${discount}
          </div>
          <div class="product-info">
            <div class="product-tag">${p.name}</div>
            <h3 class="product-title">${p.name}</h3>
            <div class="product-rating">
              ${ratingHtml}
            </div>
            <div class="product-price">
              <span class="price">${p.price?.toLocaleString("vi-VN")}đ</span>
              ${oldPrice}
            </div>
            <div class="product-actions">
              <button class="add-to-cart-btn"
                data-id="${p.id}"
                data-name="${p.name}"
                data-price="${p.price}"
                data-image="${imgSrc}">
                Thêm vào giỏ
              </button>
              <button class="view-details-btn">Chi tiết</button>
            </div>
          </div>
        </div>
      `;
    });
    $("#products-container").html(html);
    attachProductEvents(); // Gán lại sự kiện cho các nút mới render
  });

  function attachProductEvents() {
    // Thêm vào giỏ hàng
    $(".add-to-cart-btn")
      .off("click")
      .on("click", function (e) {
        // Gọi đúng hàm addToCart của bạn
        if (window.addToCart) {
          window.addToCart(e);
        }
      });

    // Xem chi tiết
    $(".view-details-btn")
      .off("click")
      .on("click", function () {
        const product = $(this).closest(".product");
        const name = product.find(".product-title").text();
        const price = product.find(".price").text().replace(/\D/g, "");
        const oldPrice = product.find(".old-price").text().replace(/\D/g, "");
        const image = product.find("img").attr("src");
        const rating = product.find(".fa-star, .fa-star-half-alt").length;
        const reviews = product
          .find(".product-rating span")
          .text()
          .replace(/\D/g, "");
        const category = product.data("category") || "";

        const url = `detail.html?name=${encodeURIComponent(
          name
        )}&price=${price}&old_price=${oldPrice}&image=${encodeURIComponent(
          image
        )}&rating=${rating}&reviews=${reviews}&category=${encodeURIComponent(
          category
        )}`;
        window.location.href = url;
      });

    // Gán lại sự kiện filter cho các nút filter-btn
    $(".filter-btn")
      .off("click")
      .on("click", function (e) {
        const filter = $(this).data("filter");
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");
        $(".product").each(function () {
          if (filter === "all" || $(this).data("category") === filter) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });

    // Nếu có logic load more, cần reset lại visibleProducts ở đây nếu muốn
  }
});
