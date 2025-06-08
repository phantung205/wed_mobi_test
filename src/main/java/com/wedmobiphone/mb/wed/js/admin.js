// Biến global để kiểm soát trạng thái loading
let isLoading = false;
let loadingTimeout = null;

// Hàm hiển thị loading spinner
function showLoading() {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }

  if (!isLoading) {
    isLoading = true;
    if ($(".loading-spinner").length === 0) {
      $("body").append(
        '<div class="loading-spinner"><div class="spinner"></div></div>'
      );
    }
  }
}

// Hàm ẩn loading spinner
function hideLoading() {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
  }

  loadingTimeout = setTimeout(() => {
    isLoading = false;
    $(".loading-spinner").fadeOut(200, function () {
      $(this).remove();
    });
  }, 300);
}

// Hàm tạo HTML cho một sản phẩm
function createProductRow(p) {
  // Xử lý đường dẫn ảnh
  let imageUrl = p.image || p.img;

  // Nếu không có ảnh hoặc URL không hợp lệ, sử dụng ảnh mặc định
  if (!imageUrl || imageUrl.trim() === "") {
    imageUrl =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
  // Nếu là URL từ FPT Shop, giữ nguyên URL
  else if (imageUrl.includes("cdn2.fptshop.com.vn")) {
    // Giữ nguyên URL
  }
  // Nếu là đường dẫn tương đối
  else if (!imageUrl.startsWith("http")) {
    imageUrl = "assets/images/" + imageUrl;
  }

  return `
    <tr>
      <td>${p.name}</td>
      <td>${p.price ? p.price.toLocaleString("vi-VN") + "đ" : ""}</td>
      <td>${p.old_price ? p.old_price.toLocaleString("vi-VN") + "đ" : ""}</td>
      <td>
        <img src="${imageUrl}" 
             alt="${p.name}" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Crect width=\'60\' height=\'60\' fill=\'%23f1f5f9\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'12\' fill=\'%2394a3b8\'%3ENo Image%3C/text%3E%3C/svg%3E'"
             style="width:60px;height:60px;object-fit:cover;border-radius:4px;">
      </td>
      <td>${p.category || ""}</td>
      <td>
        <button class="edit-btn" data-id="${p.id}">Sửa</button>
        <button class="delete-btn" data-id="${p.id}">Xóa</button>
      </td>
    </tr>
  `;
}

$(document).ready(function () {
  // Load products khi trang được tải
  loadProducts();

  // Xử lý form submit
  $("#productForm").on("submit", function (e) {
    e.preventDefault();

    if (isLoading) return;

    // Validate required fields
    const name = $("#name").val();
    const price = $("#price").val();
    const stock = $("#stock").val();

    if (!name || !price || !stock) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    // Create product data object
    const productData = {
      name: name,
      description: $("#description").val() || "",
      price: parseInt(price),
      old_price: $("#oldPrice").val() ? parseInt($("#oldPrice").val()) : null,
      image: $("#image").val() || "",
      category: $("#category").val() || "",
      discount: $("#discount").val() ? parseInt($("#discount").val()) : 0,
      stock: parseInt(stock),
    };

    showLoading();

    // Send POST request to API
    $.ajax({
      url: "http://localhost:8080/produce/products",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify([productData]),
      success: function (response) {
        if (response.data && response.data.length > 0) {
          alert("Thêm sản phẩm thành công!");
          $("#productForm")[0].reset();
          loadProducts();
        } else {
          alert("Có lỗi xảy ra khi thêm sản phẩm!");
        }
      },
      error: function (xhr, status, error) {
        let errorMessage = "Có lỗi xảy ra khi thêm sản phẩm!";
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage += "\n" + xhr.responseJSON.message;
        }
        alert(errorMessage);
        console.error("Error:", error);
      },
      complete: function () {
        hideLoading();
      },
    });
  });

  // Handle edit button click
  $(document).on("click", ".edit-btn", function () {
    if (isLoading) return;
    const id = $(this).data("id");
    editProduct(id);
  });

  // Handle delete button click
  $(document).on("click", ".delete-btn", function () {
    if (isLoading) return;
    const id = $(this).data("id");
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct(id);
    }
  });

  // Handle logout
  $("#logoutBtn").on("click", function () {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});

function loadProducts() {
  if (isLoading) return;

  showLoading();

  $.ajax({
    url: "http://localhost:8080/produce/products",
    type: "GET",
    success: function (response) {
      if (response.data) {
        const products = response.data;
        const $tbody = $("#productTable tbody");

        // Tạo HTML cho tất cả sản phẩm
        const html = products.map(createProductRow).join("");

        // Cập nhật bảng một lần duy nhất
        $tbody.html(html);
      }
    },
    error: function (xhr, status, error) {
      alert("Có lỗi xảy ra khi tải danh sách sản phẩm!");
      console.error("Error:", error);
    },
    complete: function () {
      hideLoading();
    },
  });
}

function deleteProduct(id) {
  if (isLoading) return;

  showLoading();

  $.ajax({
    url: `http://localhost:8080/produce/products/${id}`,
    type: "DELETE",
    success: function (response) {
      if (response.data) {
        // Xóa sản phẩm khỏi bảng với hiệu ứng fade
        const $row = $(`tr:has(button[data-id="${id}"])`);
        $row.fadeOut(300, function () {
          $(this).remove();
          // Kiểm tra nếu bảng trống
          if ($("#productTable tbody tr").length === 0) {
            $("#productTable tbody").html(
              '<tr><td colspan="6" style="text-align: center;">Không có sản phẩm nào</td></tr>'
            );
          }
        });

        // Hiển thị thông báo thành công
        alert("Xóa sản phẩm thành công!");
      }
    },
    error: function (xhr, status, error) {
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
      console.error("Error:", error);
    },
    complete: function () {
      hideLoading();
    },
  });
}

function editProduct(id) {
  if (isLoading) return;

  showLoading();

  $.ajax({
    url: `http://localhost:8080/produce/products/${id}`,
    type: "GET",
    success: function (response) {
      if (response.data) {
        const product = response.data;
        $("#editIndex").val(product.id);
        $("#name").val(product.name);
        $("#description").val(product.description);
        $("#price").val(product.price);
        $("#oldPrice").val(product.old_price);
        $("#image").val(product.image || product.img);
        $("#category").val(product.category);
        $("#discount").val(product.discount);
        $("#stock").val(product.stock);

        // Scroll to form
        $("html, body").animate(
          {
            scrollTop: $("#productForm").offset().top - 100,
          },
          500
        );
      }
    },
    error: function (xhr, status, error) {
      alert("Có lỗi xảy ra khi tải thông tin sản phẩm!");
      console.error("Error:", error);
    },
    complete: function () {
      hideLoading();
    },
  });
}
