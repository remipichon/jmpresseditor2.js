
var posData = {
    x: 0,
    y: 0
};

/* ======================================================================================
 * position de l'event (souris) dans le monde des slides  (real to virtual)
 * argument(s) : *event (souris)
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getVirtualCoord(event, $slideArea, flag) {   //flag = 0 -> slide
    var heightSlide = 700;          //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight

    //var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight  //prise en compte deu zoom
    // var scale = ($slideArea.hasClass("step"))? parseInt(parseFloat($slideArea.css("perspective")) / 1000) : 1;  
    var scale;
    //console.log($qui);
    if (flag === 0) {
        scale = parseInt(parseFloat($slideArea.css("perspective")) / 1000);
    }
    else {
        scale = 1;
    }


    console.log("scale " + scale);
    var MVH = heightSlide * scale;      //MaxVirtualHeight  //prise en compte deu zoom
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
    
    console.log("objet que je bouge "+ $(this).html);



    //dragg des elements
    $(".dragged").each(function() {
        var offX = $(this).attr("offX");
        var offY = $(this).attr("offY");
        if ($(this).hasClass("step")) {
            var flag = 0;
        }
        else {
            var flag = 1;
        }
        var tab = getVirtualCoord(event, $slideArea, flag);      //recupÃ©ration des coord virtuelle de la souris
        var VTop = tab[0];
        var VLeft = tab[1];

        //compension du lieu de click
        VTop = VTop - offY;
        VLeft = VLeft - offX;


        //mise à jour du mouvement
        //$('#slideArea').jmpress('deinit', $(this));
        //mise à jour du dom de la slide
        if ($(this).hasClass("element")) {

            $('#slideArea').jmpress('deinit', $(this).parent());
            //TODO màj du json
            $(this).css("left", VLeft);
            $(this).css("top", VTop);
            console.log("nouvel coord " + VTop + "  " + VLeft);
            $('#slideArea').jmpress('init', $(this).parent());

        }



        //desinitiatlisation de la slide concernÃ©e, maj des coord, reinit
        if ($(this).hasClass("step")) {
            $('#slideArea').jmpress('deinit', $(this));
            //TODO màj du json
            $(this).attr("data-x", VLeft);
            $(this).attr("data-y", VTop);
            $('#slideArea').jmpress('init', $(this));

        }




    });

    //  deplacement au sein de la présentation
    if ($slideArea.hasClass("navigable")) {

        //recupération des coord du translate 3D
        var posView = $(".navigable >").css("transform");
        var posView = posView.split('(')[1];
        posView = posView.split(')')[0];
        posView = posView.split(',');
        posView = {
            x: posView[4],
            y: posView[5]
        };


        //recupération de déplacement de la souris
        var dReal = {//element différentiel reel
            x: event.pageX - posData.x,
            y: event.pageY - posData.y
        };

        //calcul du déplacement dans le monde des slides
        var scale = parseInt(parseFloat($slideArea.css("perspective")) / 1000);
        var dVirtuel = {//element différentiel virtuel
            x: dReal.x * scale,
            y: dReal.y * scale
        };


        //console.log(trX + " " + trY + " Virtual event " + event.pageX + "  " + event.pageY + " " + Vevent[1] + " " + Vevent[0]);
        
        //calcul de la nouvelle position du viewport
        var newPosView = {
            x: posView.x - dVirtuel.x,
            y:  posView.y - dVirtuel.y
        };

        //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
        posData.x = event.pageX;
        posData.y = event.pageY;
        
//        console.log("dReal "+ dReal.x + " " + dReal.y + " newPosview "+ newPosView.x + " " + newPosView.y
//                + " posdata " + posData.x + " " + posData.y+ " scale " + scale);


        //màj de la position de la scene
        $(".navigable >").css({
            'transform': 'translate3d(' + newPosView.x + 'px,' + newPosView.y + 'px,0px)'
        });


        //pos est une matrice de 2*3 (tableau [4] = translateX    tablaeu[5] = translateY

        // console.log("translate3d: "+trs3D[0]);


    }
});



/* ======================================================================================
 * permet de rendre draggable un element
 * 
 * $(element).draggableKiki();
 * 
 * ====================================================================================== */
jQuery.fn.draggableKiki = function() {


    //var $slideArea = $("#slideArea");
    $(this).mousedown(function(event) {
        event.stopImmediatePropagation();           //empeche l'event de bubble jusqu'à la slide mère et le document, ainsi pas de conflits avec le navigable
        $("#slideArea").removeClass("navigable");

        if ($(this).hasClass("step")) {
            var $slideArea = $("#slideArea");//$(this).parent();
        }

        if ($(this).hasClass("form")) {
            var $slideArea = $(this).parent();
        }
        //event.stopPropagation();        //empecher la slide de recuperer l'event     

        //position virtuelle dans le monde des slides de la souris
        if ($(this).hasClass("step")) {
            var flag = 0;
        }
        else {
            var flag = 1;
        }
        var tab = getVirtualCoord(event, $slideArea, flag);
        var VTopMouse = tab[0];
        var VLeftMouse = tab[1];

/////////////////////////////////////////////////////////////////////
////    DANGER LORS DU PASSAGE a la 3D  data-x va posser de GROS probleme lorsqu'on sera en 3D (il faudra faire des projetÃ©
///la solution pourrait être de ne pas permettre de selectionner un element n'importe ou mais par endroit (pt d'ancrage) particulier
///en effet, ici il y a un soucis au niveau du projeté de la slide si elle est de travers
///que choisit on ? 
        if ($(this).hasClass("step")) {
            var offTop = $(this).attr("data-y");//$(this).offset().top;          
            var offLeft = $(this).attr("data-x");//$(this).offset().left;
        }

        if ($(this).hasClass("element")) {
            var offTop = parseFloat($(this).css("top"));
            var offLeft = parseFloat($(this).css("left"));
        }
////////////////////////////////////:


        $(this).addClass("dragged");

        $(this).attr("offX", "" + VLeftMouse - offLeft + "");     //ce n'est pas inversÃ©, pos recoit top puis left (pas logique...)
        $(this).attr("offY", "" + VTopMouse - offTop + "");

    });

    //ici, dÃ¨s qu'on mouseup les objets sont relachÃ©s, il peut y avoir une condition Ã  la place, du genre dÃ¨s qu'on sort de slideArea ou de l'Ã©cran...
    /* $(document).mouseup(function() {
     $(".dragged").each(function() {
     $(this).removeClass("dragged");
     });
     });*/

};

/* ======================================================================================
 * deplacement lateral au sein de la présentation
 * 
 * ====================================================================================== */            //passer cela en mode bind (avec le on)
$(document).mousedown(function(event) {
    $("#slideArea").addClass("navigable");
    posData.x = event.pageX;
    posData.y = event.pageY;
    console.log("navigable " + posData);

});

//libère tout 
$(document).mouseup(function(event) {
    $("#slideArea").removeClass("navigable");
    console.log("non navigable");
    $(".dragged").each(function() {
        $(this).removeClass("dragged");
        event.stopImmediatePropagation();
    });
});





/* ======================================================================================
 * Json to Html + init Jmpress via Mustache
 * Initialise une prÃ©sentation Ã  partir d'un fichier Json
 * argument(s) : *fichier Json
 * ====================================================================================== */
$.getJSON('json/architecture-pressOLD.json', function(data) {

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
        $(this).children().each(function() {
            $(this).draggableKiki();
        });
    });




    //chargement des css propre Ã¯Â¿Â½ la prÃ¯Â¿Â½sentation puis lancement de la prÃ¯Â¿Â½sentation
    $('#scriptImpress').append('<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
    $('#slideArea').jmpress();
//    $('#slideArea').jmpress(
//            {
//                viewPort: {     //ce truc est du json
//                    height: 2700,        //taille des slides
//                    width: 900,
//                    maxScale: 10, //capacité du zomm
//                    minScale: 0.01,
//                    zoomable: 10 //vitesse de zomm
//            
//                }
//            }  //il faut que j'arrive à récupérer le viewport pour les fonctions de calculs de coord
//    );

    console.log("go jimpress");

});


