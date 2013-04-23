

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
 * fonction utilitaire : récupération des coord scale de slideGrandMother
 * argument(s) : /
 * return : Scale (float) = current scale of grandmother
 * callBy : creationElement(button-trigger.js)
 * ====================================================================================== */
function getScaleGM() {
    var $slideGrandMother = $("#slideArea");

    //recupération des coord du transform scale
    var oldScale = $slideGrandMother.css("transform");
    oldScale = oldScale.split('(')[1];
    oldScale = oldScale.split(')')[0];
    oldScale = oldScale.split(',');

    var newScale = parseFloat(oldScale[0]);

    if (newScale < 0.001) {
        console.log("zoom out max");
        newScale = 0.001;
    } else if (newScale > 10) {
        console.log("zomm in max");
        newScale = 10;
    }

    return newScale;
}

/* ======================================================================================
 * fonction utilitaire : récupération des coord scale de slideGrandMother
 * argument(s) : /
 * return : Scale (float) = current scale of grandmother
 * callBy : creationElement(button-trigger.js)
 * ====================================================================================== */
function getTransformCoord(objet) {
    var oldposView = objet.css("transform");
    console.log("oldposView : " + oldposView);
    oldposView = oldposView.split('(')[1];
    oldposView = oldposView.split(')')[0];
    oldposView = oldposView.split(',');
    var posView = {
        x: oldposView[4],
        y: oldposView[5]
    };

    return posView;
}



/* ======================================================================================
 * permet de rendre draggable un element sur chacun des axes x,y,z
 * 
 * $(element).draggableKiki();
 * 
 * ====================================================================================== */

/* permet de stocker des positions d'event, utile pour recupérer la distance d'un mousemouve depuis un mousedown */
var posData = {
    x: 0,
    y: 0
};

/* 
 * obtenir la distance depuis un evenement (marqué par l'initialisation du posData
 * @param {type} event
 * @returns {getDistanceMouseMove.distance}
 */
function getDistanceMouseMove(event) {

    //recupération de déplacement de la souris
    var distance = {//element différentiel reel
        x: event.pageX - posData.x,
        y: event.pageY - posData.y
    };
    return distance;
}

/*
 * effectue le deplacement en x et y de $objet (objet jquery)
 * compatible pour les slides et les elements
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function move(event, $objet) {
    var $slideArea = $("#slideArea");
    var idObjet = $objet.attr('id');
    var offX = $objet.attr("offX");
    var offY = $objet.attr("offY");
    if ($objet.hasClass("step")) {
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

    //mise à jour de la position
    // CLAIRE : chgt condition ci-dessous (car les éléments ont la classe step ET élément
    if (!$objet.hasClass("step")) {         // = element dans une slide
        var idContainer = $objet.parent().attr('id');
        $('#slideArea').jmpress('deinit', $objet.parent());
        //màj du json
        pressjson.slide[idContainer].element[idObjet].pos.x = VLeft;
        pressjson.slide[idContainer].element[idObjet].pos.y = VTop;
        $objet.css("left", VLeft);
        $objet.css("top", VTop);
        $('#slideArea').jmpress('init', $objet.parent());

        $objet.parent().on('mouseleave', function() {   // passage d'element à step-element
//            console.log("entree mouseleave");
            $objet = elementToStep($objet); // donnée retour = step element
//            console.log("objet sortie mouseleave" + $objet.html());
        });
    }

    if ($objet.hasClass("step")) {
        $('#slideArea').jmpress('deinit', $objet);
        //MaJ du json : 
        if ($objet.hasClass("slide")) {          // cas step slide
            pressjson.slide[idObjet].pos.x = VLeft;
            pressjson.slide[idObjet].pos.y = VTop;
        }
        if ($objet.hasClass("element")) {        // cas step element
            pressjson.component[idObjet].pos.x = VLeft;
            pressjson.component[idObjet].pos.y = VTop;
            $('.slide').mouseenter(function() {         // passage de step-element à element
                var $slide = $(this);
                steptoElement($objet, $slide);
            });
        }
        $objet.attr("data-x", VLeft)
                .attr("data-y", VTop);
        $('#slideArea').jmpress('init', $objet);
    }
}
;


/*
 * determine l'offset pour le drag en x et y
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function offSet(event, $objet) {

    if ($objet.hasClass("step")) {
        var $slideArea = $("#slideArea");
    }

    if (!$objet.hasClass("step")) {
        var $slideArea = $objet.parent();
//        console.log("offset txt in slide 1");
    }

    //position virtuelle dans le monde des slides de la souris
    // CLAIRE : chgt condition ci-dessous (car les éléments ont la classe step ET élément
    if ($objet.hasClass("step")) {
        var flag = 0;
    }
    if (!$objet.hasClass("step")) {
        var flag = 1;
//        console.log("offset txt in slide 2");
    }
    var tab = getVirtualCoord(event, $slideArea, flag);
    var VTopMouse = tab[0];
    var VLeftMouse = tab[1];


/////////////////////////////////////////////////////////////////////
////    DANGER LORS DU PASSAGE a la 3D  data-x va posser de GROS probleme lorsqu'on sera en 3D (il faudra faire des projetÃ©
///la solution pourrait être de ne pas permettre de selectionner un element n'importe ou mais par endroit (pt d'ancrage) particulier
///en effet, ici il y a un soucis au niveau du projeté de la slide si elle est de travers
///que choisit on ? 
    if ($objet.hasClass("step")) {
        var offTop = $objet.attr("data-y");//$objet.offset().top;          
        var offLeft = $objet.attr("data-x");//$objet.offset().left;
    }
    if (!$objet.hasClass("step")) {
        var offTop = parseFloat($objet.css("top"));
        var offLeft = parseFloat($objet.css("left"));
//        console.log("offset txt in slide 3");
    }

    $objet.attr("offX", "" + VLeftMouse - offLeft + "");
    $objet.attr("offY", "" + VTopMouse - offTop + "");
}
;



/*
 * deplacement d'une slide en z
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function moveZ(event, $objet) {
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");

    var distance = getDistanceMouseMove(event);
    var newZ = -distance.y * 100;

    $('#slideArea').jmpress('deinit', $objet);
    //TODO màj du json
    $objet.attr("data-z", newZ);
    $('#slideArea').jmpress('init', $objet);


}

//rotate x,y
// deplacement en left (x) rotation -> y
function rotate(event, $objet) {
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");

    var distance = getDistanceMouseMove(event);

    //tolerance de 20 pixel de deplacement reel, peut etre faudrait il connecter cette tolerance à la taille de l'écran -> ergonomie
    var tolerance = 20;
    var rotate = {
        /* explication du bout de code ci dessous :
         * condition ternaire, si la distance est inférieur à la tolérance, aucune rotation
         * sinon on soustrait à la distance la tolérance doté du signe de la distance (abs(x)/x = signe de x)
         */
        x: ((Math.abs(distance.y) - tolerance) >= 0 ? distance.y - tolerance * Math.abs(distance.y) / distance.y : 0),
        y: ((Math.abs(distance.x) - tolerance) >= 0 ? distance.x - tolerance * Math.abs(distance.x) / distance.x : 0)
    };


    //console.log("distance " + distance.x + "  " + distance.y + " rotate " + rotate.x + " " + rotate.y);



    $('#slideArea').jmpress('deinit', $objet);
    //TODO màj du json
    $objet.attr("data-rotate-x", rotate.x);
    $objet.attr("data-rotate-y", rotate.y);

    $('#slideArea').jmpress('init', $objet);
}


/*
 * mise en mouvement/rotation des objets en fonction de leur classe
 */
$(document).on('mousemove', function(event) {
    //deplacement Z de la slide
    $('.moveZ').each(function() {
        moveZ(event, $(this));
    });
    $(".dragged").each(function() {
        move(event, $(this));
    });
    $(".rotate").each(function() {
        rotate(event, $(this));
    });

});



/*
 * annulation de la mise en mouvement/rotation des objets
 */
$(document).on('mouseup', function(event) {
//    console.log('mouseup');
    $('.moveZ').each(function() {
        $(this).removeClass('moveZ');
    });
    $(".dragged").each(function() {
        $(this).removeClass("dragged");
    });
    $(".rotate").each(function() {
        $(this).removeClass("rotate");
    });
    $('.step').unbind('mouseleave');
    $('.slide').unbind('mouseenter');        
}); 

///bricolage pour le long press

function DIYllgpress($object) {
    //gestion du deplacement z via longclick
    $object.one('mousedown', function() {
        var $objet = $(this);
        posData.x = event.pageX;
        posData.y = event.pageY;
        window.setTimeout(function() {
            console.log("Z edit");
            $objet.addClass("moveZ");
            $objet.removeClass('dragged');
        }, 700);
    });


}


///fin bricolage du ling press



/*
 * permet de rendre draggable (en x,y,z) un objet (slide ou element)
 */
jQuery.fn.draggableKiki = function() {

//    $(this).on("mouseup", function() {      //le probleme c'est que la slide au dessus capte l'event
//        console.log("mouseup du draggable" + $(this).html());
//        $(this).off(".movable");
//
//    });
//    $(this).on('mouseup', function() {            //meme probleme, lorsqu'on descend la slide le mouseup ne sera pas capté par la slide qui deviendra toute petite
//        $(this).off('.moveZ');
//    });


    //gestion du deplacement Z via longclick
//    $(this).longclick(500, function() {
//        //$("#result").html("You longclicked. Nice!");
//        console.log("Z edit");
//        $(this).addClass("moveZ");
//    });



    $(this).on("mousedown", function(event) {
//        console.log('mousedown draggable kiki');
        event.stopImmediatePropagation();           //empeche l'event de bubble jusqu'à la slide mère et le document, ainsi pas de conflits avec le navigable

        if (event.which === 1) {
            // CLAIRE : cas où on clique sur un élément text indépendant(il faut que la div step, et non h1 ou p, soit dragged)
            var $this = $(this);
            if ($this.is("h1") || $this.is("p"))
            {
                if ($this.parent().hasClass("element")) {
                    $this = $this.parent();
                }
            }
            $this.addClass("dragged");
            offSet(event, $this);


//        $(this).on("mousemove.movable", function(event) {
//            move(event, $(this));
//        });
        }

        //gere la rotation d'axe x et y
        if (event.which === 3 && event.ctrlKey === false) {
            $(this).addClass("rotate");
            posData.x = event.pageX;
            posData.y = event.pageY;
        }

        // clic droit gère le deplacemen en Z
        if (event.which === 3 && event.ctrlKey === true) {
            posData.x = event.pageX;
            posData.y = event.pageY;
            console.log("Z edit");
            $(this).addClass("moveZ");

//            $(this).on("mousemove.moveZ", function(event) {       //ceci ne fonctionne pas car lorsqu'on descend la slide, on ne la survole plus
//                //deplacement Z de la slide
//                moveZ(event, $(this));
//            });
        }
        ;
    });
};



/* ======================================================================================
 * 
 * deplacement et zoom au sein de la présentation
 * 
 * ====================================================================================== */
$(document).on('mousedown', function(event) {           //le fucking probleme avec cette methode c'est que le mousemove et mouseup sont absorbé par une autre slide si notre draggable passe dessous

    if (event.which === 1) {
        //zone ou sont stocker les slides 
        var $slideMother = $("#slideArea >");
        var $slideGrandMother = $("#slideArea");
        //initialisation du posData
        posData.x = event.pageX;
        posData.y = event.pageY;
        //console.log("mousedown");


        $(this).on('mousemove.navigable', function(event) {

            //recupération des coord du translate 3D
            var oldposView = $slideMother.css("transform");

            oldposView = oldposView.split('(')[1];
            oldposView = oldposView.split(')')[0];
            oldposView = oldposView.split(',');

            var posView = {
                x: oldposView[4],
                y: oldposView[5]
            };

            //recupération de déplacement de la souris
            var dReal = {//element différentiel reel
                x: event.pageX - posData.x,
                y: event.pageY - posData.y
            };

            //calcul du déplacement dans le monde des slides
            var scale = -parseInt(parseFloat($slideGrandMother.css("perspective")) / 1000);
            var dVirtuel = {//element différentiel virtuel
                x: dReal.x * scale,
                y: dReal.y * scale
            };

            //console.log(trX + " " + trY + " Virtual event " + event.pageX + "  " + event.pageY + " " + Vevent[1] + " " + Vevent[0]);

            //calcul de la nouvelle position du viewport
            var newPosView = {
                x: parseInt(posView.x - dVirtuel.x),
                y: parseInt(posView.y - dVirtuel.y)
            };

            //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
            posData.x = event.pageX;
            posData.y = event.pageY;

            $slideMother.css({
                'transform': 'translate3d(' + newPosView.x + 'px,' + newPosView.y + 'px,0px)'
            });
        });

        $(this).on("mouseup", function() {
//            console.log("mouseup du navigable");
            $(this).off(".navigable");
        });
    }
});


$(document).mousewheel(function(event, delta, deltaX, deltaY) {
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");

    //recupération des coord du transform scale
    var oldScale = $slideGrandMother.css("transform");
    oldScale = oldScale.split('(')[1];
    oldScale = oldScale.split(')')[0];
    oldScale = oldScale.split(',');

    var a = 0.1 / 10;
    var b = 0;
    var coef = a * oldScale[0] + b;
    var diff = deltaY * coef;
    var newScale = parseFloat(oldScale[0]) + diff;

    if (newScale < 0.001) {
        console.log("zoom out max");
        newScale = 0.001;
    } else if (newScale > 10) {
        console.log("zomm in max");
        newScale = 10;
    }

    $slideGrandMother.css({
        'transform': 'scaleX(' + newScale + ') scaleY(' + newScale + ') '
    });

    //màj de la perspective qui est utiliséé par les fonctions de changement de monde
    var perspective = Math.round(1 / newScale * 1000);
    //il faudrait augmenter la précision du newScale afin de palier à l'écart de deplacement lors d'un fort dezoom
    $slideGrandMother.css("perspective", perspective);
});

/* ======================================================================================
 * zone de test
 * ====================================================================================== */


//////////test du both click : echec

//$(document).on('mousedown', function(event) {
//   
//   if (event.which === 1 || event.which === 3) {
//       
//       $(document).on('mousedown', function(event2) {
//           console.log("event2:" + event2.which + " event;" + event.which);
//                if (event.which === 1 && event2.which === 3 || event.which === 3 && event2.which === 1) {
//                    console.log("both click");
//                }
//   });
//   }
//   
//});


////////////fin test
