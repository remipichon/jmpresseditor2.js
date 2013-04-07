
/* ======================================================================================
 * position de l'event (souris) dans le monde des slides  (real to virtual)
 * argument(s) : *event (souris)
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getVirtualCoord(event, $slideArea) {   //fonctionne semble t'il trÃ¨s bien
    var heightSlide = 700;          //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight
    var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight  //prise en compte deu zoom
    var RTop = event.pageY;      //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VTop = MVH * RTop / MRH; //prise en compte de la proportion
    VTop = Math.round(VTop);


    var MRL = window.innerWidth; //MaxRealWidth
    var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
    var MVL = ratio * MVH;      //MaxVirtualWidth
    var RLeft = event.pageX;      //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VLeft = MVL * RLeft / MRL; //prise en compte de la proportion
    VLeft = Math.round(VLeft);

    //console.log("MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop);
    //console.log("MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

    var tab = new Array(VTop, VLeft);
    return tab;
}


/* ======================================================================================
 * position de l'element dans le monde reel (de l'Ã©cran du navigateur (virtualto real)
 * argument(s) : *element
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getRealCoord(element, $slideArea) {        //semble bien fonctionner
    //console.log("element select :" + element.html());

    var heightSlide = 700;      //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight
    var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight
    var VTop = element.offset().top * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //VirtualTop (de l'element)

    var RTop = MRH * VTop / MVH; //prise en compte de la proportion
    RTop = Math.round(RTop);    //prise en compte du zoom



    var MRL = window.innerWidth; //MaxRealWidth
    var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
    var MVL = ratio * MVH;    //MaxVirtualWidth
    var VLeft = element.offset().left * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var RLeft = MRL * VLeft / MVL; //prise en compte de la proportion
    RLeft = Math.round(RLeft);  //prise en compte du zoom


    //console.log("position de element calculÃ© ds l'Ã©cran MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop + "     fameux coef : " + parseInt(parseFloat($slideArea.css('perspective')) / 1000));
    //console.log("position de element calculÃ© ds l'Ã©cran MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

    var tab = new Array(RTop, RLeft);
    return tab;
}

/* ======================================================================================
 * deplacement de chaque element ayant la classe .draggable
 * ====================================================================================== */
$(document).on('mousemove', function(event) {
    //zone ou sont stocker les slides 
    var $slideArea = $("#slideArea");

    //dragg des elements
    $(".dragged").each(function() {
        var offX = $(this).attr("offX");
        var offY = $(this).attr("offY");

        var tab = getVirtualCoord(event, $slideArea);      //recupÃ©ration des coord virtuelle de la souris
        var VTop = tab[0];
        var VLeft = tab[1];

        //compension du lieu de click
        VTop = VTop - offY;
        VLeft = VLeft - offX;

        //desinitiatlisation de la slide concernÃ©e, maj des coord, reinit
        $('#slideArea').jmpress('deinit', $(this));
        $(this).attr("data-x", VLeft);
        $(this).attr("data-y", VTop);
        $('#slideArea').jmpress('init', $(this));

    });

    //deplacement au sein de la présentation
    if ($slideArea.hasClasse("navigable")) {

    }
});



/* ======================================================================================
 * permet de rendre draggable un element
 * 
 * $(element).draggableKiki();
 * 
 * ====================================================================================== */
jQuery.fn.draggableKiki = function() {
    var $slideArea = $("#slideArea");
    $(this).mousedown(function(event) {

        //position virtuelle dans le monde des slides de la souris
        var tab = getVirtualCoord(event, $slideArea);
        var VTopMouse = tab[0];
        var VLeftMouse = tab[1];

/////////////////////////////////////////////////////////////////////
////    DANGER LORS DU PASSAGE a la 3D  data-x va posser de GROS probleme lorsqu'on sera en 3D (il faudra faire des projetÃ©
///la solution pourrait être de ne pas permettre de selectionner un element n'importe ou mais par endroit (pt d'ancrage) particulier
///en effet, ici il y a un soucis au niveau du projeté de la slide si elle est de travers
///que choisit on ? 
        var offTop = $(this).attr("data-y");//$(this).offset().top;          
        var offLeft = $(this).attr("data-x");//$(this).offset().left;
        var offElmt = [offTop, offLeft];  //getRealCoord($(this), $slideArea);
        console.log(offElmt[1] + "  " + offElmt[0]);
////////////////////////////////////:


        $(this).addClass("dragged");

        $(this).attr("offX", "" + VLeftMouse - offElmt[1] + "");     //ce n'est pas inversÃ©, pos recoit top puis left (pas logique...)
        $(this).attr("offY", "" + VTopMouse - offElmt[0] + "");

    });

    //ici, dÃ¨s qu'on mouseup les objets sont relachÃ©s, il peut y avoir une condition Ã  la place, du genre dÃ¨s qu'on sort de slideArea ou de l'Ã©cran...
    $(document).mouseup(function() {
        $(".dragged").each(function() {
            $(this).removeClass("dragged");
        });
    });

};

/* ======================================================================================
 * deplacement lateral au sein de la présentation
 * 
 * ====================================================================================== */






/* ======================================================================================
 * Json to Html + init Jmpress via Mustache
 * Initialise une prÃ©sentation Ã  partir d'un fichier Json
 * argument(s) : *fichier Json
 * ====================================================================================== */
$.getJSON('json/architecture-pressOLD.json', function(data) {
    var widthSlide = 900;
    var heightSlide = 700;


    //template
    var template = $('#templateJmpress').html();

    //generation du html
    var html = Mustache.to_html(template, data);
    console.log("html généré");
    alert(html);        //ne pas commenter car le jmpress ne fonctionne pas sans



    //ajout du html Ã¯Â¿Â½ la div 
    $('#slideArea').append(html);

    //mise a draggable des slides
    //si les elements ont une classe qui les identifie, il sera possible de faire une autre fonction de draggable
    //afin de diffÃ©rencier les deux cas. Par exemple les slides pourraient avoir une restrictions empechant le drop par dessus une autre slide


    $(".step").each(function() {
        $(this).draggableKiki();
    });


    //chargement des css propre Ã¯Â¿Â½ la prÃ¯Â¿Â½sentation puis lancement de la prÃ¯Â¿Â½sentation
    $('#scriptImpress').append('<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
    $('#slideArea').jmpress();
    console.log("go jimpress");

});