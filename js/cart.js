function loadCartPage() {
    var listBook = JSON.parse(localStorage.getItem("listBook"));
    var content = "";
    var totalPrice = 0;
    for (var i = 0; i < listBook.length; i++) {
        content += "<tr>";
        content += "<td><input style='width: 30px;height:30px' type='checkbox' name='select' value='" + listBook[i].bookName + "'></td>";
        content += "<td><img src='" + listBook[i].bookImage + "' width='100px' height='100px'></td>";
        content += "<td>" + listBook[i].bookName + "</td>";
        content += "<td>" + listBook[i].bookPrice + "</td>";
        content += "<td><button hidden class='btn btn-primary' onclick='minusBook(\"" + listBook[i].bookName + "\")'>-</button>";
        content += "<input type='text' name='bookNumber' class='p-1' value='" + listBook[i].bookNumber + "' style='width: 50px; text-align: center; border:none' readonly>";
        content += "<button hidden class='btn btn-primary' onclick='plusBook(\"" + listBook[i].bookName + "\")'>+</button></td>";
        var price = listBook[i].bookPrice.replace(" $", "");
        var totalPriceOfOne = parseFloat(price.trim()).toFixed(2) * listBook[i].bookNumber;
        content += "<td>" + totalPriceOfOne + " $</td>";
        content += "</tr>";
    }
    content += "<tr>";
    content += "<td colspan='3'>Total Price Selected Book (Tax Included)</td>";
    content += "<td colspan='3'><b class='text-danger h3'>" + totalPrice + " $</b></td>";
    content += "</tr>";
    $("tbody").append(content);
}

function checkLogin() {
    if (localStorage.getItem("emailLogin") != null) {
        $("#btnLogin").hide();
        $("#btnLogout").removeAttr("hidden");
        $("#hiUser").removeAttr("hidden");
        $.ajax({
            url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + localStorage.getItem("emailLogin"),
            success: function (data) {
                $("#hiUser").text("Hi, " + data.userFirstName + " " + data.userLastName);
            }
        });
        return true;
    }
    return false;
}

$(document).ready(function () {
    // Cart - load cart
    loadCartPage();

    // Cart - Select all
    $("#checkAllCart").click(function () {
        $("input[name='select']").prop('checked', this.checked);
        var totalPrice = 0;
        $("input[name='select']:checked").each(function () {
            var price = $(this).parent().parent().find("td:eq(3)").text().replace(" $", "");
            var bookNumber = $(this).parent().parent().find("input[name='bookNumber']").val();
            totalPrice += parseFloat(price.trim()).toFixed(2) * bookNumber;
        });
        $("tbody tr:last td:last").html("<b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b>");
    }
    );

    // Cart - Select one
    $("input[name='select']").click(function () {
        var totalPrice = 0;
        $("input[name='select']:checked").each(function () {
            var price = $(this).parent().parent().find("td:eq(3)").text().replace(" $", "");
            var bookNumber = $(this).parent().parent().find("input[name='bookNumber']").val();
            totalPrice += parseFloat(price.trim()).toFixed(2) * bookNumber;
        });
        $("tbody tr:last td:last").html("<b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b>");
    });

    // Delete book
    $("#btnDeleteSelected").click(function () {
        var listBook = JSON.parse(localStorage.getItem("listBook"));
        var listBookSelected = [];
        $("input[name='select']:checked").each(function () {
            listBookSelected.push($(this).val());
        });
        if (listBookSelected.length == 0) {
            alert("Please select book(s) to delete!");
        } else {
            var confirmDelete = confirm("Are you sure to delete selected book(s)?");
            if (confirmDelete) {
                for (var i = 0; i < listBookSelected.length; i++) {
                    for (var j = 0; j < listBook.length; j++) {
                        if (listBookSelected[i] == listBook[j].bookName) {
                            listBook.splice(j, 1);
                        }
                    }
                }
                localStorage.setItem("listBook", JSON.stringify(listBook));
                $("tbody").empty();
                loadCartPage();
            }
        }
    });

    // Checkout
    $("#btnCheckout").click(function () {
        var listBook = JSON.parse(localStorage.getItem("listBook"));
        var listBookSelected = [];
        $("input[name='select']:checked").each(function () {
            listBookSelected.push($(this).val());
        });
        if (!checkLogin()) {
            alert("Please login to checkout!");
        } else if (listBookSelected.length == 0) {
            alert("Please select book(s) to checkout!");
        } else {
            var confirmCheckout = confirm("Are you sure to checkout selected book(s)?");
            if (confirmCheckout) {
                var listBookCheckout = [];
                for (var i = 0; i < listBookSelected.length; i++) {
                    for (var j = 0; j < listBook.length; j++) {
                        if (listBookSelected[i] == listBook[j].bookName) {
                            listBookCheckout.push(listBook[j]);
                        }
                    }
                }
                localStorage.setItem("listBookCheckout", JSON.stringify(listBookCheckout));

                // save quantity of selected book
                var listBookSelectedQuantity = [];
                $("input[name='select']:checked").each(function () {
                    var bookQuantity = $(this).parent().parent().find("input[name='bookNumber']").val();
                    listBookSelectedQuantity.push(bookQuantity);
                });
                localStorage.setItem("listBookSelectedQuantity", JSON.stringify(listBookSelectedQuantity));

                var listBookTotalPrice = [];
                $("tbody tr").each(function () {
                    var bookTotalPrice = $(this).find("td:eq(5)").text().replace(" $", "");
                    listBookTotalPrice.push(bookTotalPrice);
                });
                localStorage.setItem("listBookTotalPrice", JSON.stringify(listBookTotalPrice));

                var totalPrice = $("tbody tr:last td:last").text().replace(" $", "");
                localStorage.setItem("totalPrice", totalPrice);
                $("#bodyCart").empty();
                $("#bodyCart").load("../html/payment.html");
            }
        }
    });
});