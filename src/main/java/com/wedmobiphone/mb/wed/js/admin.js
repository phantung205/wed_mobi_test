$(document).ready(function () {
  $.get("http://localhost:8080/produce/products", function (res) {
    const products = res.data;
    let html = "";
    products.forEach(function (p) {
      html += `
        <tr>
          <td>${p.name}</td>
          <td>${p.price ? p.price.toLocaleString("vi-VN") + "đ" : ""}</td>
          <td>${p.oldPrice ? p.oldPrice.toLocaleString("vi-VN") + "đ" : ""}</td>
          <td>
            <img src="${p.img || "images/no-image.png"}" alt="${
        p.name
      }" style="width:60px;height:60px;object-fit:cover">
          </td>
          <td>${p.category || ""}</td>
          <td>
            <button class="edit-btn" data-id="${p.id}">Sửa</button>
            <button class="delete-btn" data-id="${p.id}">Xóa</button>
          </td>
        </tr>
      `;
    });
    $("#productTable tbody").html(html);
  });

  $("#logoutBtn").on("click", function () {
    // Xóa token hoặc session nếu có
    // localStorage.removeItem("token"); // Nếu dùng token
    window.location.href = "login.html"; // Chuyển về trang đăng nhập
  });
});
