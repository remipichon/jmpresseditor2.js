/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



function createTimeLine(idSlide) {

    var $slideButton = $('<li class="' + idSlide + '"><p>' + idSlide + '</p></li>');
    $('#sortable').append($slideButton);

    $('#sortable').sortable({
        start: function(event, ui) {
            ui.item.startPos = ui.item.index();
        },
        stop: function(event, ui) {
            var newIndex = ui.item.index();
            var $idSlideSorted = ui.item.attr('class');
//            console.log("Slide: " + $idSlideSorted + ", New position: " + ui.item.index());
//            console.log("inserer apres : ");
//            console.log($('.slide').eq(newIndex));
//            console.log($('.step slide :eq('+newIndex+')''));
//            $('#slideArea >:eq('+newIndex+')').before($('#' + $idSlideSorted + '')) ;  
            if (ui.item.startPos > newIndex)
            {
                $('.slide').eq(newIndex).before($('#' + $idSlideSorted + ''));
            }
            else
            {
                $('.slide').eq(newIndex).after($('#' + $idSlideSorted + ''));
            }
//            var newSlidesJson = {};
//              var pressjson = {data: {}, slide: {}, component: {}, increment: {}};
            $(".slide").each(function(index) {
//                console.log
                var idSlide = $(this).attr('id');
                pressjson.slide[idSlide].index = index;     // MaJ de l'index des slide

//                var idSlide = $(this).attr('id');
//                newSlidesJson[idSlide] = pressjson.slide[idSlide];
//                delete pressjson.slide[idSlide];
//                console.log("newSlidesJson");
//                console.log(newSlidesJson);
//                console.log("pressjson");
//                console.log(pressjson);
////                pressjson.slide[idSlide]= newSlidesJson[idSlide];
            });
//            console.log("sortie de boucle");
////            pressjson["slide"] = newSlidesJson;
            console.log("pressjson");
            console.log(pressjson);

        },
        axis: "y"
    })
            .disableSelection();
    ;
}
;




$(document).ready(function() {

    $("#sortable").mousedown(function(evt) {
        evt.stopPropagation();
        return false;
    });

    $(" #sortable").on('mouseenter', 'li', function() {
        var $idSlide = $(this).attr('class');
        $('#' + $idSlide + '').addClass('hovered');
//        console.log("mouseenter sur li");
    })
            .on('mouseleave', 'li', function() {
        var $idSlide = $(this).attr('class');
        $('#' + $idSlide + '').removeClass('hovered');
//        console.log("mouseleave sur li");
    });

});

