/* 
 * Scripts regarding only animation of layout (slidding menu, etc)
 * 
 */


$(document).ready(function() {

//$('#arrow-nav').on('click', function() {
//$('#sidebar').toggleClass("hidden-bar");
//});

    $('#arrow-nav').on('click', function() {
        $sidebar = $('#sidebar');
        $sidebar.toggleClass('hidden-bar');
        if ($sidebar.hasClass('hidden-bar')) {
            $('#sidebar').animate({marginLeft: "-200"}, 300);
        }
        else {
            $('#sidebar').animate({marginLeft: "0"}, 300);
        }
    });




});