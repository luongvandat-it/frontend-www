$(document).ready(function () {
    $('#content').load('./html/home.html');
    var navbar = $(".navbar-container");

    $(window).scroll(function () {
        if ($(window).scrollTop() > navbar.position().top) {
            navbar.addClass("sticky-navbar");
        } else {
            navbar.removeClass("sticky-navbar");
        }
    });

    $('#searchForm').submit(function (e) {
        e.preventDefault();
        $('#searchResult').html("");
        $.ajax({
            url: "http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase?bookTitle=" + $('#searchBookTitle').val(),
            success: function (data) {
                var books = data._embedded.books;
                var content = "";
                if (books.length == 0) {
                    content += "<div class='col-12 mt-3'>";
                    content += "<h3 class='text-center'>Không tìm thấy sách nào</h3>";
                    content += "</div>";
                } else {
                    content += "<div class='col-12 mt-3'>";
                    content += "<h5 class='text-center'>Kết quả tìm kiếm cho: <span class='text-success'>" + $('#searchBookTitle').val() + "</span></h5>";
                    content += "</div>";
                    for (var i = 0; i < books.length; i++) {
                        content += "<div class='col-3 mt-3'>";
                        content += "<div class='card'>";
                        content += "<img src='./imgs/img-book-1.jpg' class='card-img-top'>";
                        content += "<div class='card-body'>";
                        content += "<h5 class='card-title'>" + books[i].bookTitle + "</h5>";
                        content += "<p class='card-text'>" + "120.000" + "</p>";
                        content += "<a href='#' class='btn btn-primary'>THÊM VÀO GIỎ HÀNG</a>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                    }
                }
                $('#searchResult').append(content);
            }
        });
    });

    $('#showCart').click(function () {
        $('#content').load('./html/cart.html');
    });

    $('#btnCartToPay').click(function () {
        $('#content').load('../html/payment.html');
    });

    $('#showIntroduction').click(function () {
        $('#content').load('../html/introduction.html');
    });

    $('#showOrders').click(function () {
        $('#content').load('../html/orders.html');
    });

    $("#btnPay").click(function () {
        if (
            $("input[name='productInCart1']").is(":checked") ||
            $("input[name='productInCart2']").is(":checked") ||
            $("input[name='productInCart3']").is(":checked")
        ) {
            window.location.href = "./html/payment.html";
        } else {
            alert("Vui lòng chọn sản phẩm để thanh toán");
        }
    });


});