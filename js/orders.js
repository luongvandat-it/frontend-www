// $(document).ready(function () {
//     $.ajax({
//         url: "https://localhost:8080/api/orders",
//         type: "POST",
//         dataType: "json",
//         success: function (data) {
//             var html = "";
//             var count = 1;
//             $.each(data, function (key, item) {
//                 html += "<tr>";
//                 html += "<td>" + count + "</td>";
//                 html += "<td>" + item.phone + "</td>";
//                 html += "<td>" + item.name + "</td>";
//                 html += "<td>" + item.date + "</td>";
//                 html += "<td>" + item.total + "</td>";
//                 html += "<td>" + "Paid" + "</td>";
//                 html += "<td>" + item.ship + "</td>";
//                 html +=
//                     "<td><a href='#'><img src='../imgs/static/address-icon.png' height='50px'></a></td>";
//                 html += "</tr>";
//                 count++;
//             });
//             $("tbody").append(html);
//         },
//         error: function (err) {
//             alert("Error: " + err.responseText);
//         },
//     });
// }
// );