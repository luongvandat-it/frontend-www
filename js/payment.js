var emailLogin = localStorage.getItem("emailLogin");
var listBookCheckout = JSON.parse(localStorage.getItem("listBookCheckout"));
var listBook = JSON.parse(localStorage.getItem("listBook"));
var listBookNumber = JSON.parse(localStorage.getItem("listBookSelectedQuantity"));
var totalPrice = localStorage.getItem("totalPrice");
var totalAllBookPrice = 0
var totalBill = 0;
var userLogin = {};
var bookToCheckout = {};

function getUserByMail(email) {
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + email,
        dataType: "json",
        success: function (data) {
            userLogin.userName = data.userName;
            userLogin.userPassword = data.userPassword;
            userLogin.userFirstName = data.userFirstName;
            userLogin.userLastName = data.userLastName;
            userLogin.userPhoneNumber = data.userPhoneNumber;
            userLogin.userEmail = data.userEmail;
            userLogin.userCreatedDate = data.userCreatedDate;
            userLogin.userUpdatedDate = data.userUpdatedDate;
            userLogin.role = {
                roleId: "R006",
                roleName: "Guest"
            }
        }
    });
}

$(document).ready(function () {
    // Payment - Show
    getUserByMail(emailLogin);
    $.ajax({
        url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + emailLogin,
        success: function (data) {
            $("#txtName").val(data.userFirstName + " " + data.userLastName);
            $("#txtEmail").val(data.userEmail);
            $("#txtPhone").val(data.userPhoneNumber);
        }
    });
    var tableBodyContent = "";
    for (var i = 0; i < listBookCheckout.length; i++) {
        tableBodyContent += "<tr>";
        tableBodyContent += "<td>" + (i + 1) + "</td>";
        tableBodyContent += "<td>";
        tableBodyContent += "<img src='" + listBookCheckout[i].bookImage + "' height='100px' />";
        tableBodyContent += "</td>";
        tableBodyContent += "<td>" + listBookCheckout[i].bookName + "</td>";
        tableBodyContent += "<td>" + listBookCheckout[i].bookPrice + "</td>";
        tableBodyContent += "<td>" + listBookNumber[i] + "</td>";
        var bookPrice = listBookCheckout[i].bookPrice.split(" ")[0];
        var bookPriceNumber = parseFloat(bookPrice);
        var totalBookPrice = bookPriceNumber * listBookNumber[i];
        totalAllBookPrice += totalBookPrice;
        totalBill += totalBookPrice;
        tableBodyContent += "<td>" + totalBookPrice + " $</td>";
        tableBodyContent += "</tr>";
    }
    tableBodyContent += "<tr>";
    tableBodyContent += "<td colspan='5'>Total Price</td>";
    tableBodyContent += "<td>" + (totalAllBookPrice * 1.03).toFixed(2) + " $</td>";
    tableBodyContent += "<tr>";
    tableBodyContent += "<td colspan='5'>Transport Fee (8%)</td>";
    tableBodyContent += "<td>" + (totalAllBookPrice * 0.08).toFixed(2) + " $</td>";
    tableBodyContent += "</tr>";
    tableBodyContent += "<tr>";
    tableBodyContent += "<td colspan='5'>Discount</td>";
    tableBodyContent += "<td> 0 </td>";
    tableBodyContent += "</tr>";
    tableBodyContent += "<tr class='text-light bg-danger h4'>";
    tableBodyContent += "<td colspan='5'><b>Total Bill</b></td>";
    tableBodyContent += "<td><b>" + (totalBill * 1.11).toFixed(2) + " $</b></td>";
    tableBodyContent += "</tr>";
    $("tbody").append(tableBodyContent);

    // Switch between Momo and Cast
    $("#clickMomo").click(function () {
        $("#momo").prop("checked", true);
        $("#cast").prop("checked", false);
    });
    $("#clickCast").click(function () {
        $("#cast").prop("checked", true);
        $("#momo").prop("checked", false);
    });

    // Payment - Confirm
    $("#btnConfirmPay").click(function () {
        var address = $("#address").val();
        var note = $("#note").val();
        var orderId = "";

        var regexAddress = /^[a-zA-Z0-9 ]{2,30}$/;
        if (regexAddress.test(address) == false) {
            $("#errPayment").text("Address Invalid!");
        } else {
            // save order
            var order = {
                orderDate: new Date(),
                shippingAddress: address,
                orderNote: note,
                orderDiscount: "0%",
                orderStatus: "Processing",
                user_: userLogin
            };
            localStorage.setItem("order", JSON.stringify(order));
            $.ajax({
                url: "http://localhost:8080/api/order_s/add",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(order),
                success: function (data) {
                    orderId += data;
                    localStorage.setItem("orderIdTemp", JSON.stringify(orderId));
                    alert(orderId)
                }
            });

            // save order detail
            for (var i = 0; i < listBookCheckout.length; i++) {
                console.log({
                    price: parseFloat(listBookCheckout[i].bookPrice.split(" ")[0]),
                    quantity: parseInt(listBookCheckout[i].bookNumber),
                    orderId: JSON.parse(localStorage.getItem("orderIdTemp")),
                    bookTitle: listBookCheckout[i].bookName
                })

                $.ajax({
                    url: "http://localhost:8080/api/orderDetails/add",
                    type: "POST",
                    contentType: "application/json",
                    async: false,
                    data: {
                        price: parseFloat(listBookCheckout[i].bookPrice.split(" ")[0]),
                        quantity: parseInt(listBookCheckout[i].bookNumber),
                        orderId: JSON.parse(localStorage.getItem("orderIdTemp")),
                        bookTitle: listBookCheckout[i].bookName
                    },
                    success: function (data) {
                        alert("Order Detail Success!");
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Order Detail Error!");
                    }
                });
            }

            // process after payment
            $("#errPayment").text("");
            alert("Payment Success!");
            for (var i = 0; i < listBookCheckout.length; i++) {
                for (var j = 0; j < listBook.length; j++) {
                    if (listBookCheckout[i].bookName == listBook[j].bookName) {
                        listBook.splice(j, 1);
                    }
                }
            }
            localStorage.setItem("listBook", JSON.stringify(listBook));
            // location.reload();
        }

        // send mail
        $.get("http://localhost:8080/api/user_s/mail?email=" + emailLogin + "&text=Thanks+for+buy+book!+You+can+check+your+order+at+Leaf+Book+page");
    });
});