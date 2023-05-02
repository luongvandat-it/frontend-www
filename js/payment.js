var emailLogin = localStorage.getItem("emailLogin");
var listBookCheckout = JSON.parse(localStorage.getItem("listBookCheckout"));
var listBook = JSON.parse(localStorage.getItem("listBook"));
var listBookNumber = JSON.parse(localStorage.getItem("listBookSelectedQuantity"));
var totalPrice = localStorage.getItem("totalPrice");
var totalAllBookPrice = 0
var totalBill = 0;

$(document).ready(function () {
    // Payment - Show
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
    tableBodyContent += "<td>" + totalAllBookPrice + " $</td>";
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
    tableBodyContent += "<td><b>" + (totalBill * 1.08).toFixed(2) + " $</b></td>";
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

        var regexAddress = /^[a-zA-Z0-9 ]{2,30}$/;
        if (regexAddress.test(address) == false) {
            $("#errPayment").text("Address Invalid!");
        } else {
            $("#errPayment").text("");
            alert("Payment Success!");
            // Remove after confirm
            for (var i = 0; i < listBookCheckout.length; i++) {
                for (var j = 0; j < listBook.length; j++) {
                    if (listBookCheckout[i].bookName == listBook[j].bookName) {
                        listBook.splice(j, 1);
                    }
                }
            }
            localStorage.setItem("listBook", JSON.stringify(listBook));
            location.reload();
        }
    });
});