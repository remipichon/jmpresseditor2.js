/* ======================================================================================
 * GESTION DU DRAGNDROP
 * ======================================================================================*/
/* ewG.attr('style', 'position:absolute; left: 300px; top: 300px;');

*/

/*
 * Il suffit de d'écrire $(element).draggablekiki(); pour que l'element soit draggable avec ma méthode
 * Plus tard il sera possible de gérer le déplacement de plusieurs élements (si on les selectionne avec ctrl ou
 * par un selection de souris)
 */
$(document).on('mousemove', function(event) {
    //zone ou sont stocker les slides (slideArea)
    var $slideArea = $("#zoneCreation");


    $(".dragged").each(function() {
        var offX = $(this).attr("offX");
        var offY = $(this).attr("offY");

        $(".dragged").css("left", "" + event.pageX - $slideArea.offset().left - offX + "px");
        $(".dragged").css("top", "" + event.pageY - $slideArea.offset().top - offY + "px");

    });
});

jQuery.fn.draggableKiki = function() {
    $(this).mousedown(function(event) {
        $(this).addClass("dragged");
        var pos = $(this).offset();
        //alert(event.pageX+" "+Math.round(pos.left));
        $(this).attr("offX", "" + event.pageX - Math.round(pos.left) + "");
        $(this).attr("offY", "" + event.pageY - pos.top + "");
});



    