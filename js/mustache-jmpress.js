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
    var $slideArea = $("#slideArea");


    $(".dragged").each(function() {/*
     var offX = $(this).attr("offX");
     var offY = $(this).attr("offY");*/

        // $(".dragged").css("left", "" + event.pageX - $slideArea.offset().left - offX + "px");
        // $(".dragged").css("top", "" + event.pageY - $slideArea.offset().top - offY + "px");
        $(this).html("left : " + parseInt(pos.left) + "  top : " + parseInt(pos.top));
        $('#slideArea').jmpress('deinit', $(this));
        $(this).attr("data-x", event.pageX);
        $(this).attr("data-y", event.pageY);
        $('#slideArea').jmpress('init', $(this));

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







////////////////////mustache jmpress////////////////////////////
//fonction qui recup�re le fichier json et stocke les donn�es dans data

    $.getJSON('json/architecture-pressOLD.json', function(data) {
        var widthSlide = 900;
        var heightSlide = 700;


        //template
        var template = $('#templateJmpress').html();

        //generation du html
        var html = Mustache.to_html(template, data);
        alert(html);        //ne pas commenter car le jmpress ne fonctionne pas sans


        //ajout du html � la div 
        $('#slideArea').append(html);

        //chargement des css propre � la pr�sentation puis lancement de la pr�sentation
        $('#scriptImpress').append('<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
        $('#slideArea').jmpress();
        console.log("go jimpress");

});

