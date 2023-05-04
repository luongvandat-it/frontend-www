var ordersOfUser = [];
var user = {};

function getUserInfo() {
    var userEmail = localStorage.getItem("emailLogin");
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + userEmail,
        type: "GET",
        dataType: "json",
        success: function (data) {
            user.name = data.userFirstName + " " + data.userLastName;
            user.phone = data.userPhoneNumber;
        },
        error: function (err) {
            alert("Error: " + err.responseText);
        }
    });
}

function getOrders() {
    var userEmail = localStorage.getItem("emailLogin");
    $.ajax({
        url: "http://localhost:8080/api/order_s/search/findOrdersByUserEmail?userEmail=" + userEmail,
        type: "GET",
        dataType: "json",
        success: function (data) {
            ordersOfUser = data._embedded.order_s;
            var html = "";
            var count = 1;
            $.each(ordersOfUser, function (key, item) {
                html += "<tr>";
                html += "<td>" + count + "</td>";
                html += "<td>" + user.phone + "</td>";
                html += "<td>" + user.name + "</td>";
                html += "<td>" + item.orderDate.split("T")[0] + "</td>";
                html += "<td>" + '50 $' + "</td>";
                html += "<td>" + "Paid" + "</td>";
                html += "<td>" + item.orderStatus + "</td>";
                html +=
                    "<td><a style='cursor: pointer' class='showOrderDetail'><img src='../imgs/static/address-icon.png' height='50px'></a></td>";
                html += "</tr>";
                count++;
            });
            $("tbody").append(html);
        },
        error: function (err) {
            alert("Error: " + err.responseText);
        }
    });
}

function getOrderDetail(orderId) {
    $.ajax({
        url: "http://localhost:8080/api/orderDetail_s/search/findOrderDetailByOrderId?orderId=" + orderId,
        type: "GET",
        dataType: "json",
        success: function (data) {
            var orderDetail = data._embedded.orderDetail_s;
            var html = "";
            $.each(orderDetail, function (key, item) {
                html += "<tr>";
                html += "<td>" + item.productName + "</td>";
                html += "<td>" + item.productPrice + "</td>";
                html += "<td>" + item.productQuantity + "</td>";
                html += "<td>" + item.productPrice * item.productQuantity + "</td>";
                html += "</tr>";
            });
            $("tbody").append(html);
        },
        error: function (err) {
            alert("Error: " + err.responseText);
        }
    });
}

$(document).on("click", ".showOrderDetail", function () {
    var orderId = $(this).closest("tr").find("td:eq(0)").text();
    $("tbody").empty();
    getOrderDetail(orderId);
    $("#orderDetailModal").modal("show");
});


$(document).ready(function () {
    getUserInfo();
    getOrders();
});