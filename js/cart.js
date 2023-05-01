$(document).ready(function () {
    // Cart - load cart
    var listBook = JSON.parse(localStorage.getItem("listBook"));
    var content = "";
    var totalPrice = 0;
    for (var i = 0; i < listBook.length; i++) {
        content += "<tr>";
        content += "<td><input style='width: 30px;height:30px' type='checkbox' name='select' value='" + listBook[i].bookName + "'></td>";
        content += "<td><img src='" + listBook[i].bookImage + "' width='100px' height='100px'></td>";
        content += "<td>" + listBook[i].bookName + "</td>";
        content += "<td>" + listBook[i].bookPrice + "</td>";
        content += "<td><button class='btn btn-primary' onclick='minusBook(\"" + listBook[i].bookName + "\")'>-</button>";
        content += "<input type='text' name='bookNumber' class='p-1' value='" + listBook[i].bookNumber + "' style='width: 50px; text-align: center;' readonly>";
        content += "<button class='btn btn-primary' onclick='plusBook(\"" + listBook[i].bookName + "\")'>+</button></td>";
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
                location.reload();
            }
        }
    });

    // Minus book
    $(".btnMinusBook").click(function () {
        var bookName = $(this).parent().parent().find("td:eq(2)").text();
        minusBook(bookName);
    });
});