// load list added to cart from local storage and add to table in cart.html
$(document).ready(function () {
    var listBook = JSON.parse(localStorage.getItem("listBook"));
    var content = "";
    for (var i = 0; i < listBook.length; i++) {
        content += "<tr>";
        content += "<td><img src='" + listBook[i].bookImage + "' width='100px' height='100px'></td>";
        content += "<td>" + listBook[i].bookName + "</td>";
        content += "<td>" + listBook[i].bookPrice + "</td>";
        content += "<td>" + listBook[i].bookNumber + "</td>";
        content += "<td>" + listBook[i].bookPrice * listBook[i].bookNumber + "</td>";
        content += "</tr>";
    }
    $("tbody").append(content);
});