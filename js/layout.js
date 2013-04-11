/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function() {
//    $('#arrow-nav').on('click', function(){
//        console.log("arrow clicked");
//        $('#sidebar').css('margin-left', "-200px");
//    });

//    $('#arrow-nav').on('click', function() {
//        $("this").toggle(function() {
//            console.log("add arrow");
//            $('#sidebar').addClass("hidden-bar");
//        }
//        , function() {
//            console.log("remove arrow");
//            $('#sidebar').removeClass("hidden-bar");
//        });
//    });


    $('#arrow-nav').on('click', function() {
        $('#sidebar').toggleClass("hidden-bar");

    });

});