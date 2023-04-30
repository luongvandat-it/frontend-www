$(document).ready(function () {
    // Home - Product
    $.ajax({
        url: "http://localhost:8080/api/books/search/findBooksByBookIdBetween?low=B001&high=B012",
        success: function (data) {
            var books = data._embedded.books;
            var content = "";
            for (var i = 0; i < books.length; i++) {
                content += '<div class="col-4 mt-2">';
                content += '<a href="#" id="bookCart">';
                content += '<div class="card">';
                content += '<div class="card-body">';
                content += '<div class="card-img-actions">';
                content += '<img src="' + books[i].bookImage + '" class="card-img img-fluid book-img" id="bookImage">';
                content += '</div>';
                content += '<div class="mb-2">';
                content += '<h6 class="font-weight-semibold m-3">';
                content += '<a href="#" class="text-default" id="bookName">' + books[i].bookTitle + '</a>';
                content += '</h6>';
                content += '</div>';
                content += '<h5 id="bookPrice">' + books[i].bookPrice + ' $</h5>';
                content += '<button type="button" class="btn btn-outline-success text-dark"> Add to cart</button>';
                content += '</div>';
                content += '</div>';
                content += '</a>';
                content += '</div>';
                if (i == 5) {
                    $('#trendProducts').append(content);
                    content = "";
                }
            }
            $('#saleProducts').append(content);
        }
    });
});