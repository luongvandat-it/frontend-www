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
        $('#searchResult').html("");
        $.ajax({
            url: "http://localhost:8080/api/books/search/findBooksByBookTitleContainsIgnoreCase?bookTitle=" + $('#searchBookTitle').val(),
            success: function (data) {
                var books = data._embedded.books;
                var content = "";
                if (books.length == 0) {
                    content += "<div class='col-12 mt-4'>";
                    content += "<h3 class='text-center'>No books found!</h3>";
                    content += "</div>";
                } else {
                    content += "<div class='col-12 mt-5'>";
                    content += "<h5 class='text-center'>Search results for: <b> <span class='text-success'>" + $('#searchBookTitle').val() + "</span></b></h5>";
                    content += "</div>";
                    for (var i = 0; i < books.length; i++) {
                        content += "<div class='col-3 mt-5'>";
                        content += "<div class='card'>";
                        content += "<img src='./imgs/static/img-book-1.jpg' class='card-img-top'>";
                        content += "<div class='card-body'>";
                        content += "<h6 class='card-title'>" + books[i].bookTitle + "</h6>";
                        content += "<p class='card-text text-success'>" + books[i].bookPrice + "$</p>";
                        content += "<a class='btn btn-primary mt-0' name=" + books[i].bookTitle + ">ADD TO CART</a>";
                        content += "</div>";
                        content += "</div>";
                        content += "</div>";
                    }
                }
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
    });

    // Header - Switch Login to Register
    $("#notHaveAccount").click(function () {
        $("#btnSubmitLoginClose").click();
        $("#loginModal").modal("hide");
        $("#registerModal").modal();
    });

    // Header - Register
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



    // $('#showIntroduction').click(function () {
    //     $('#content').load('../html/introduction.html');
    // });

    // $('#showOrders').click(function () {
    //     $('#content').load('../html/orders.html');
    // });

    // $("#btnPay").click(function () {
    //     if (
    //         $("input[name='productInCart1']").is(":checked") ||
    //         $("input[name='productInCart2']").is(":checked") ||
    //         $("input[name='productInCart3']").is(":checked")
    //     ) {
    //         window.location.href = "./html/payment.html";
    //     } else {
    //         alert("Vui lòng chọn sản phẩm để thanh toán");
    //     }
    // });
});