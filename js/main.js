$(document).ready(function () {
    // Load content home page
    $('#content').load('./html/home.html');
    var navbar = $(".navbar-container");
    $(window).scroll(function () {
        if ($(window).scrollTop() > navbar.position().top) {
            navbar.addClass("sticky-navbar");
        } else {
            navbar.removeClass("sticky-navbar");
        }
    });

    // Header - Search
    $('#searchForm').submit(function (e) {
        e.preventDefault();
        $('#content').load('./html/home.html');
        $('#searchResult').html("");
        $.ajax({
            url: "http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase?bookTitle=" + $('#searchBookTitle').val(),
            success: function (data) {
                var books = data._embedded.books;
                var content = "";
                content += '<div class="col-12 mt-2">';
                content += '<h5 class="text-center mt-3">Result search for: <b class="text-success">' + $('#searchBookTitle').val() + '</b></h5>';
                content += '</div>';
                for (var i = 0; i < books.length; i++) {
                    content += '<div class="col-4 mt-2">';
                    content += '<a href="#" class="bookCart">';
                    content += '<div class="card">';
                    content += '<div class="card-body">';
                    content += '<div class="card-img-actions">';
                    content += '<img src="' + books[i].bookImage + '" class="card-img img-fluid book-img bookCardImage" id="bookImage">';
                    content += '</div>';
                    content += '<div class="mb-2">';
                    content += '<h6 class="font-weight-semibold m-3">';
                    content += '<a href="#" class="text-default" id="bookName">' + books[i].bookTitle + '</a>';
                    content += '</h6>';
                    content += '</div>';
                    content += '<h5 id="bookPrice">' + books[i].bookPrice + ' $</h5>';
                    content += '<button type="button" class="btn btn-primary text-light btnAddToCard"> Add to cart</button>';
                    content += '</div>';
                    content += '</div>';
                    content += '</a>';
                    content += '</div>';
                }
                content += '<div class="col-12 mt-2">';
                content += '<h5 class="text-center text-success m-5">--- End Search Result ---</h5>';
                content += '</div>';
                $('#searchResult').append(content);
            }
        });
    });

    // Header - Cart
    $('#showCart').click(function () {
        $('#searchResult').html('');
        $('#content').load('./html/cart.html');
    });
    $('#btnCartToPay').click(function () {
        $('#content').load('../html/payment.html');
    });

    // Header - Login
    $("#btnLogin").click(function () {
        $("#loginModal").modal();
    });
    $("#btnSubmitLogin").click(function () {
        var email = $("#txtEmailLogin").val();
        var pass = $("#txtPassLogin").val();
        var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regexEmail.test(email) == false) {
            $("#errLogin").text("Invalid Email");
            return false;
        } else if (pass.length < 8) {
            $("#errLogin").text("Invalid Password");
            return false;
        } else {
            $.ajax({
                url: "http://localhost:8080/api/user_s/search/findUser_ByUserEmail?email=" + email,
                error: function () {
                    $("#errLogin").text("Email Not Found");
                },
                success: function (data) {
                    if (data.userPassword == pass) {
                        $("#errLogin").text("");
                        $("#btnLogin").hide();
                        $("#btnSubmitLoginClose").click();
                        $("#loginModal").modal("hide'");
                    } else {
                        $("#errLogin").text("Wrong Password !!");
                    }
                }
            });
        }

        $("#btnLogout").show();
        $("#btnLogout").click(function () {
            $("#btnLogin").show();
            $("#btnLogout").hide();
        });
    });

    // Header - Switch Login to Register
    $("#notHaveAccount").click(function () {
        $("#btnSubmitLoginClose").click();
        $("#loginModal").modal("hide");
        $("#registerModal").modal();
    });

    // Header - Register -- ERROR
    $("#btnSubmitRegister").click(function () {
        var name = $("#txtName").val().trim();
        var fullname = name.split(" ");
        var email = $("#txtEmail").val();
        var phone = $("#txtPhone").val();
        var pass = $("#txtPass").val().trim();
        var repass = $("#txtRepass").val();

        var regexName = /^[a-zA-Z ]{2,30}$/;
        var regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        var regexPhone = /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

        // if (regexName.test(name) == false) {
        //     $("#errRegister").text("Invalid Name!");
        // } else if (regexEmail.test(email) == false) {
        //     $("#errRegister").text("Invalid Email!");
        // } else if (regexPhone.test(phone) == false) {
        //     $("#errRegister").text("Invalid Phone Number!");
        // } else if (pass.length < 6) {
        //     $("#errRegister").text("Invalid Password!");
        // } else if (pass != repass) {
        //     $("#errRegister").text("Retype password not match!");
        // } else {
        //     $("#errRegister").text("");
        $.ajax({
            url: "http://localhost:8080/api/user_s/add",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                "userEmail": "a@gmail.com",
                "userPassword": "123456",
                // "role": {
                //     "roleId": "R001",
                //     "roleName": "Admin"
                // }
            }),
            success: function (data) {
                console.log(data + "success");
                alert("Register Success!");
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr.responseText);
                alert("Register Error!");
            }
        });

        //     $("#btnSubmitSignUpClose").click();
        //     $("#registerModal").modal("hide");
        // }
    });

    // Navbar - Sales
    $('#showSales').click(function () {
        $('#content').load('./html/home.html');
        $('html, body').animate({
            scrollTop: $("#contentSales").offset().top - 100
        }, 1);
    });

    // Navbar - Orders
    $('#showOrders').click(function () {
        $('#content').load('../html/orders.html');
    });

    // Navbar - About
    $('#showIntroduction').click(function () {
        $('#content').load('../html/introduction.html');
    });

    // Book - Add to cart
    $(document).on('click', '.btnAddToCard', function () {
        var bookName = $(this).parent().parent().parent().find('#bookName').text();
        var bookPrice = $(this).parent().parent().parent().find('#bookPrice').text();
        var bookImage = $(this).parent().parent().parent().find('#bookImage').attr('src');
        var bookNumber = 1;

        var book = {
            bookName: bookName,
            bookPrice: bookPrice,
            bookImage: bookImage,
            bookNumber: bookNumber
        };
        var listBook = [];
        listBook.push(book);

        if (localStorage.getItem('listBook') == null) {
            localStorage.setItem('listBook', JSON.stringify(listBook));
        } else {
            var listBook = JSON.parse(localStorage.getItem('listBook'));
            var flag = false;
            for (var i = 0; i < listBook.length; i++) {
                if (listBook[i].bookName == bookName) {
                    listBook[i].bookNumber += 1;
                    flag = true;
                }
            }
            if (flag == false) {
                listBook.push(book);
            }
            localStorage.setItem('listBook', JSON.stringify(listBook));
        }
        alert('Add to cart success!');
    });

    // Book - Details
    $(document).on('click', '.bookCardImage', function () {
        var bookNameShowDetail = $(this).parent().parent().find('#bookName').text();
        localStorage.setItem('bookNameShowDetail', bookNameShowDetail);
        $('#content').load('../html/details.html');
    });
});

/*
    ERROR NOTE:
        1. Cant view details of book after search
        2. After remove book from cart page being reload to home page
        3. Login and Register :> Error sml
*/