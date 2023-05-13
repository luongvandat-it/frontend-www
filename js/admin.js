function reload(body) {
    $('.bodyql').empty()
    $('.bodyql').load(body)
}
$(document).ready(function() {
    $('.bodyql').load('../html/bodyProductManage.html')
    $(".sub-btn").click(function() {
        $(".sub-menu").slideToggle("slow")
    });
    $(".btnProductManage").click(function() {
        $('.bodyql').load('../html/bodyProductManage.html')
    });
    $(".btnCategoryManage").click(function() {
        $('.bodyql').load('../html/bodyCategoryManage.html')
    });
    $(".btnOrderManage").click(function() {
        $('.bodyql').load('../html/bodyOrderManage.html')
    });
    $(".btnAccountManage").click(function() {
        $('.bodyql').load('../html/bodyAccountManage.html')
    });
    $(".btnAuthorManage").click(function() {
        $('.bodyql').load('../html/bodyAuthorManage.html')
    });
    $(".btnPublisherManage").click(function() {
        $('.bodyql').load('../html/bodyPublisherManage.html')
    });
    $(".btnSupplierManage").click(function() {
        $('.bodyql').load('../html/bodySupplierManage.html')
    });
})