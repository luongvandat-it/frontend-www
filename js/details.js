$(document).ready(function () {
    var bookNameShowDetail = localStorage.getItem('bookNameShowDetail');
    $.ajax({
        url: "http://localhost:8080/api/books/search/findBookByBookTitleIgnoreCase?bookTitle=" + bookNameShowDetail,
        success: function (data) {
            var book = data;
            var content = "";
            content += '<div class="row m-4 justify-content-center">' +
                '<div class="col-2"></div>' +
                '<div class="col-4">' +
                '<img src="' + book.bookImage + '" height="400px" width="80%" class="bookImageDetail">' +
                '</div>' +
                '<div class="col-6">' +
                '<div class="row mt-3">' +
                '<h5><b class="bookTitle">' + book.bookTitle + '</b></h5>' +
                '</div>' +
                '<div class="row mt-2">' +
                '<div class="col-7">' +
                '<p>Authors: <span class="bookAuthor">Nguyễn Mạnh Hùng</span></p>' +
                '</div>' +
                '</div>' +
                '<div class="row">' +
                '<div class="col">' +
                '<h2 class="text-danger mt-2 mb-4"><b class="bookPrice">' + book.bookPrice + ' $</b></h1>' +
                '</div>' +
                '<div>Delivery time: <b>1 - 3 days</b> from the order date</div>' +
                '<div>Returns policy: <b>1 - 1</b> within <b>30 days</b></div>' +
                '</div>' +
                '<div class="row">' +
                '<span class="mt-3 mb-1"><b>Quantity:</b></span>' +
                '<div class="input-group mb-3" style="width: 130px;">' +
                '<div class="input-group-prepend">' +
                '<button class="btn-outline-secondary p-2" type="button" id="btnMinus">-</button>' +
                '</div>' +
                '<input type="text" class="form-control text-center" id="quantityDetail" value="1" readonly>' +
                '<div class="input-group-append">' +
                '<button class="btn-outline-secondary p-2" type="button" id="btnPlus">+</button>' +
                '</div>' +
                '</div>' +
                '<div class="row mt-3">' +
                '<div class="col-4">' +
                '<button class="btn-danger btn-outline-light p-3 btnAddToCardFromDetail"' +
                'style="border: none; border-radius: 4px;" id="btnAddToCart">Add to cart</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="ml-4">' +
                '<div class="row mt-5 text-left ml-5">' +
                '<div class="col-2"></div>' +
                '<div class="col-8">' +
                '<h4><b>Book Information</b></h4>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Provider</div>' +
                '<div class="col-4 bookProvider">Thái Hà</div>' +
                '</div>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Author</div>' +
                '<div class="col-4 bookAuthor">Nguyễn Mạnh Hùng</div>' +
                '</div>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Publisher</div>' +
                '<div class="col-4 bookPublisher">NXB Lao Động</div>' +
                '</div>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Publishing year</div>' +
                '<div class="col-4">2010</div>' +
                '</div>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Weight (kg)</div>' +
                '<div class="col-4 bookWeight">' + book.bookWeight + '</div>' +
                '</div>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Size (cm)</div>' +
                '<div class="col-4">' + book.bookSize + '</div>' +
                '</div>' +
                '<div class="row mt-1">' +
                '<div class="col-4 text-secondary">Number of pages</div>' +
                '<div class="col-4">280</div>' +
                '</div>' +
                '<div class="row mt-1 mb-5">' +
                '<div class="col-4 text-secondary">Slug</div>' +
                '<div class="col-4 bookSlug">' + book.bookSlug + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'

            $('.showDetails').append(content);
        }
    });

    $(document).on('click', '#btnMinus', function () {
        var quantity = $('#quantityDetail').val();
        if (quantity > 1) {
            quantity--;
        }
        $('#quantityDetail').val(quantity);
    });

    $(document).on('click', '#btnPlus', function () {
        var quantity = $('#quantityDetail').val();
        if (quantity < 10) {
            quantity++;
        }
        $('#quantityDetail').val(quantity);
    });

    $(document).on('click', '#btnAddToCart', function () {
        var bookName = $('.bookTitle').text();
        var bookPrice = $('.bookPrice').text();
        var bookImage = $('.bookImageDetail').attr('src');
        var bookNumber = $('#quantityDetail').val();

        var book = {
            bookName: bookName,
            bookImage: bookImage,
            bookPrice: bookPrice,
            bookNumber: bookNumber
        };

        var listBook = JSON.parse(localStorage.getItem('listBook'));
        if (listBook == null) {
            listBook = [];
        }

        var check = false;
        for (var i = 0; i < listBook.length; i++) {
            if (listBook[i].bookName == bookName) {
                listBook[i].bookNumber = parseInt(listBook[i].bookNumber) + parseInt(bookNumber);
                check = true;
            }
        }

        if (check == false) {
            listBook.push(book);
        }

        localStorage.setItem('listBook', JSON.stringify(listBook));
        alert('Add to cart successfully');
    });
});