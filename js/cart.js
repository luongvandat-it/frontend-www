function loadCartPage() {
    var listBook = JSON.parse(localStorage.getItem("listBook"));
    var content = "";
    var totalPrice = 0;
    for (var i = 0; i < listBook.length; i++) {
        content += "<tr>";
        if (listBook[i].bookStatus == true) {
            content += "<td><input type='checkbox' name='select' style='width: 40px; height: 40px; cursor:pointer' value='" + listBook[i].bookName + "' checked></td>";
            totalPrice += parseFloat(listBook[i].bookPrice.replace(" $", "").trim()).toFixed(2) * listBook[i].bookNumber * 1.03;
        } else {
            content += "<td><input type='checkbox' name='select' style='width: 40px; height: 40px; cursor:pointer' value='" + listBook[i].bookName + "'></td>";
        }
        content += "<td><img src='" + listBook[i].bookImage + "' width='100px' height='100px'></td>";
        content += "<td>" + listBook[i].bookName + "</td>";
        content += "<td>" + listBook[i].bookPrice + "</td>";
        content += "<td><button class='btn-primary' style='border:none; border-radius: 4px;padding:10px' onclick='minusBook(\"" + listBook[i].bookName + "\"," + listBook[i].bookNumber + ");'>-</button>";
        content += "<input type='text' name='bookNumber' class='p-1' value='" + listBook[i].bookNumber + "' style='width: 50px; text-align: center; border:none' readonly>";
        content += "<button class='btn-primary' style='border:none; border-radius: 4px;padding:10px' onclick='plusBook(\"" + listBook[i].bookName + "\"," + listBook[i].bookNumber + ");'>+</button></td>";
        var price = listBook[i].bookPrice.replace(" $", "");
        var totalPriceOfOne = parseFloat(price.trim()).toFixed(2) * listBook[i].bookNumber;
        content += "<td>" + totalPriceOfOne.toFixed(2) + " $</td>";
        content += "</tr>";
    }
    content += "<tr>";
    content += "<td colspan='3'>Total Price Selected Book (Tax 3% Included)</td>";
    content += "<td colspan='3'><b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b></td>";
    content += "</tr>";
    localStorage.setItem("totalPriceInCart", totalPrice.toFixed(2));
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

function minusBook(bookName, bookNumber) {
    var listBook = JSON.parse(localStorage.getItem("listBook"));
    for (var i = 0; i < listBook.length; i++) {
        if (listBook[i].bookName == bookName) {
            if (bookNumber == 1) {
                if (confirm("Do you want to remove this book from cart?")) {
                    listBook.splice(i, 1);
                    localStorage.setItem("listBook", JSON.stringify(listBook));
                    $("tbody").empty();
                    loadCartPage();
                    return;
                }
            } else {
                listBook[i].bookNumber = bookNumber - 1;
            }
        }
        localStorage.setItem("listBook", JSON.stringify(listBook));

        if ($("input[name='select'][value='" + bookName + "']").is(":checked")) {
            var totalPrice = JSON.parse(localStorage.getItem("totalPriceInCart"));
            totalPrice -= parseFloat(listBook[i].bookPrice.replace(" $", "").trim()).toFixed(2) * 1.03;
            localStorage.setItem("totalPriceInCart", totalPrice);
            $("tbody tr:last td:last").html("<b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b>");
        }
        $("tbody").empty();
        loadCartPage();
    }
}

function plusBook(bookName, bookNumber) {
    var listBook = JSON.parse(localStorage.getItem("listBook"));
    for (var i = 0; i < listBook.length; i++) {
        if (listBook[i].bookName == bookName) {
            if (bookNumber == 10) {
                alert("You can only buy 10 books at a time!");
            } else {
                listBook[i].bookNumber = bookNumber + 1;
            }
        }
        localStorage.setItem("listBook", JSON.stringify(listBook));

        if ($("input[name='select'][value='" + bookName + "']").is(":checked")) {
            var totalPrice = JSON.parse(localStorage.getItem("totalPriceInCart"));
            totalPrice += parseFloat(listBook[i].bookPrice.replace(" $", "").trim()).toFixed(2) * 1.03;
            localStorage.setItem("totalPriceInCart", totalPrice);
            $("tbody tr:last td:last").html("<b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b>");
        }
        $("tbody").empty();
        loadCartPage();
    }
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
            totalPrice += parseFloat(price.trim()).toFixed(2) * bookNumber * 1.03;
        });
        $("tbody tr:last td:last").html("<b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b>");
        // change listBook.bookStatus
        var listBook = JSON.parse(localStorage.getItem("listBook"));
        for (var i = 0; i < listBook.length; i++) {
            listBook[i].bookStatus = this.checked;
        }
        localStorage.setItem("listBook", JSON.stringify(listBook));
    }
    );

    // Cart - Select one
    $("input[name='select']").click(function () {
        var totalPrice = 0;
        $("input[name='select']:checked").each(function () {
            var price = $(this).parent().parent().find("td:eq(3)").text().replace(" $", "");
            var bookNumber = $(this).parent().parent().find("input[name='bookNumber']").val();
            totalPrice += parseFloat(price.trim()).toFixed(2) * bookNumber * 1.03;
        });
        $("tbody tr:last td:last").html("<b class='text-danger h3'>" + totalPrice.toFixed(2) + " $</b>");
        // change listBook.bookStatus
        var listBook = JSON.parse(localStorage.getItem("listBook"));
        for (var i = 0; i < listBook.length; i++) {
            if (listBook[i].bookName == $(this).val()) {
                listBook[i].bookStatus = this.checked;
            }
        }
        localStorage.setItem("listBook", JSON.stringify(listBook));
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

    // process check one -> all
    $("input[name='select']").click(function () {
        if ($("input[name='select']:checked").length == $("input[name='select']").length) {
            $("#checkAllCart").prop('checked', true);
        } else {
            $("#checkAllCart").prop('checked', false);
        }
    });

    // uncheck one -> uncheck all then recalculate total price
    $("input[name='select']").click(function () {
        if ($("input[name='select']:checked").length == 0) {
            $("tbody tr:last td:last").html("<b class='text-danger h3'>0.00 $</b>");
        }
    }
    );
});