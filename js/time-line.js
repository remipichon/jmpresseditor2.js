

$(document).ready(function() {
    
    $('#previous-a').on('click',function(){
       $('#slideArea').jmpress('prev'); 
    });
    $('#next-a').on('click',function(){
       $('#slideArea').jmpress('next'); 
    });

    var $sortableList = $("#sortable");
    var $removeLink = $('#sortable li a');

//  // pour que le tri ne déclanche pas navigable sur surface travail
//  $sortableList.mousedown(function(evt) {
//    evt.stopPropagation();
//    return false;
//  });

    // événements hover button navigable
    $sortableList.on('mouseenter', 'li',function() {
        //console.log('hoverred');
        var $link = $(this).find('a');              // apparition croix
        $link.stop(true, true).fadeIn();
        var $idSlide = $(this).attr('matricule');       // surbrillance slide
        $('#' + $idSlide + '').addClass('hovered');
//        //console.log("mouseenter sur li");
    })
            .on('mouseleave', 'li', function() {
        var $link = $(this).find('a');
        $link.stop(true, true).fadeOut();
        var $idSlide = $(this).attr('matricule');
        $('#' + $idSlide + '').removeClass('hovered');
//        //console.log("mouseleave sur li");
    });

// remove slides
    $sortableList.on('click', 'li a', function(e) {
        var $link = $(this);
        e.preventDefault();
        ////console.log("link  " + $link);
        $link.parent().fadeOut(function() {
            $link.parent().remove();
            var $idSlide = $(this).attr('matricule');
//      $('#' + $idSlide + '').remove();
            container.getSlide($idSlide).destroy();
        });
    });
});
