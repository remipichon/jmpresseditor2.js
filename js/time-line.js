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
//        start : function(event, ui){
//            ui.item.bind("click.prevent",
//                function(event) { 
//                    event.stopImmediatePropagation(); 
//                    console.log('sorting stop');
//                });
//            },
//        containment: $('#time-line')
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
//            console.log("ui.item");
//            console.log(ui.item);
//            console.log($idSlideSorted);
            }

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

    $(" #sortable").children().on('mouseover', function(evt) {
        console.log($(" #sortable").children());
        console.log("hover sur li");
    })

    $(" #sortable").on('mouseenter', 'li', function() {
        var $idSlide = $(this).attr('class');
        $('#' + $idSlide + '').addClass('hovered');
//        console.log($(" #sortable").children());
        console.log("mouseenter sur li");
    })
            .on('mouseleave', 'li', function() {
        var $idSlide = $(this).attr('class');
        $('#' + $idSlide + '').removeClass('hovered');
        console.log("mouseleave sur li");
    });

});

