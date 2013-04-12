/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
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