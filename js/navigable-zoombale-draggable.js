
/* ======================================================================================
 * position de l'event (souris) dans le monde des slides  (real to virtual)
 * argument(s) : *event (souris)
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getVirtualCoord(event, $slideArea, flag, $objet) {   //flag = 0 -> slide
//    console.log("entree getvirtual");
//    var heightSlide = 700; //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight



    //var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000); //MaxVirtualHeight //prise en compte deu zoom
    // var scale = ($slideArea.hasClass("step"))? parseInt(parseFloat($slideArea.css("perspective")) / 1000) : 1;
    var scale = $objet.attr("data-scale");
    //console.log($qui);
    if (flag === 0) {
        scale = parseFloat($slideArea.css("perspective")) / (1000);
    }
    else {
        scale = 1;
    }

//    console.log("scale " + scale + " " + parseFloat($slideArea.css("perspective")) + " " + $objet.attr("data-scale"));
    var MVH = parseFloat($slideArea.css("perspective"));//heightSlide * scale; //MaxVirtualHeight //prise en compte deu zoom
    var RTop = event.pageY; //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VTop = MVH * RTop / MRH; //prise en compte de la proportion
    VTop = Math.round(VTop);

    var MRL = window.innerWidth; //MaxRealWidth
    var ratio = MRL / MRH; //rapport de zone d'Ã©cran du navigateur
    var MVL = ratio * MVH; //MaxVirtualWidth
    var RLeft = event.pageX; //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VLeft = MVL * RLeft / MRL; //prise en compte de la proportion
    VLeft = Math.round(VLeft);

    //console.log("MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop);
    //console.log("MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

    var tab = new Array(VTop, VLeft);
//    console.log("sortie getvirtual");
    return tab;

}
//
//
///* ======================================================================================
// * position de l'element dans le monde reel (de l'Ã©cran du navigateur (virtualto real)
// * argument(s) : *element
// *               *div qui contient les slides (en object Jquery)
// * return : Array[ virtualTop, virtualLeft]
// * callBy : draggableKiki
// * ====================================================================================== */
//function getRealCoord(element, $slideArea) {        //semble bien fonctionner
//    //console.log("element select :" + element.html());
//
//    var heightSlide = 700;      //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
//    var MRH = window.innerHeight; //MaxRealHeight
//    var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight
//    var VTop = element.offset().top * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //VirtualTop (de l'element)
//
//    var RTop = MRH * VTop / MVH; //prise en compte de la proportion
//    RTop = Math.round(RTop);    //prise en compte du zoom
//
//
//
//    var MRL = window.innerWidth; //MaxRealWidth
//    var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
//    var MVL = ratio * MVH;    //MaxVirtualWidth
//    var VLeft = element.offset().left * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //RealTop (de la souris)
//
//    //VirtualTop (position dans le monde des slides)
//    var RLeft = MRL * VLeft / MVL; //prise en compte de la proportion
//    RLeft = Math.round(RLeft);  //prise en compte du zoom
//
//
//    //console.log("position de element calculÃ© ds l'Ã©cran MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop + "     fameux coef : " + parseInt(parseFloat($slideArea.css('perspective')) / 1000));
//    //console.log("position de element calculÃ© ds l'Ã©cran MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);
//
//    var tab = new Array(RTop, RLeft);
//    return tab;
//}


/* ======================================================================================
 * permet de rendre draggable un element sur chacun des axes x,y,z
 * 
 * $(element).draggableKiki();
 * 
 * ====================================================================================== */

/* 
 * obtenir la distance depuis un evenement (marqué par l'initialisation du posData
 * @param {type} event
 * @returns {getDistanceMouseMove.distance}
 */
function getDistanceMouseMove(event) {

    //recupération de déplacement de la souris
    var distance = {//element différentiel reel
        x: event.pageX - $("#slideArea").data('event').pos.x,
        y: event.pageY - $("#slideArea").data('event').pos.y
    };
    return distance;
}

/*
 * determine le déplacement dans le plan tangent à l'objet d'un deplacement reel
 * @param {type} dReal   différentiel du déplacement reel : dictionnaire {x,y}
 * @param {type} $objet
 * @returns {undefined}
 */
function reScale(dReal, $objet) {
    var MRH = window.innerHeight;                       //MaxRealHeight
    var MVH = parseFloat($slideArea.css("perspective"));   //MaxVirtualHeight
    var MRL = window.innerWidth;                        //MaxRealWidth
    var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
    var MVL = ratio * MVH;                              //MaxVirtualWidthe


}


/*
 * effectue le deplacement en x et y de $objet (objet jquery)
 * compatible pour les slides et les elements
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function move(event, $objet) {
    var idObjet = $objet.attr('id');
    if ($objet.hasClass('element'))
    {
        if (!$objet.parent().hasClass("slide"))
        {
            $objet = $objet.parent();           // element libre -> selectionne la div englobante
        }
    }
    var $slideArea = $("#slideArea");

    var offX = $objet.attr("offX");
    var offY = $objet.attr("offY");
    if ($objet.hasClass("step")) {
        var flag = 0;
    }
    else {
        var flag = 1;
    }

    var tab = getVirtualCoord(event, $slideArea, flag, $objet);      //recupÃ©ration des coord virtuelle de la souris
    var VTop = tab[0];
    var VLeft = tab[1];

    //compension du lieu de click
    VTop = VTop - offY;
    VLeft = VLeft - offX;

    //mise à jour de la position
    if ($objet.hasClass("element")) {           // element dans slide
        var $container = $objet.parent();
        var idContainer = $container.attr('id');
        $('#slideArea').jmpress('deinit', $container);
        //màj du json :
        pressjson.slide[idContainer].element[idObjet].pos.x = VLeft;                /////////////////////////
        pressjson.slide[idContainer].element[idObjet].pos.y = VTop;
        $objet.css("left", VLeft);
        $objet.css("top", VTop);
        $('#slideArea').jmpress('init', $container);
    }

    if ($objet.hasClass("step")) {
        $('#slideArea').jmpress('deinit', $objet);
        // màj du json
        if ($objet.hasClass("slide")) {          // cas slide
            pressjson.slide[idObjet].pos.x = VLeft;                                 /////////////////////////
            pressjson.slide[idObjet].pos.y = VTop;
        }
        else {                                  // cas step element libre
            pressjson.component[idObjet].pos.x = VLeft;
            pressjson.component[idObjet].pos.y = VTop;
            ;
        }
        $objet.attr("data-x", VLeft);
        $objet.attr("data-y", VTop);
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

    var $slideArea = $("#slideArea");
//
//
//    if ($objet.hasClass("step")) {            // Claire : au final, avec modif que j'ai fait, pas besoin de faire de distinction
//        var $slideArea = $("#slideArea");
//    }
//
//    if ($objet.hasClass("element")) {
//        var $slideArea = $objet.parent();
//    }

    //position virtuelle dans le monde des slides de la souris
    if ($objet.hasClass("step")) {
        var flag = 0;
    }
    else {
        var flag = 1;
    }
    var tab = getVirtualCoord(event, $slideArea, flag, $objet);
    var VTopMouse = tab[0];
    var VLeftMouse = tab[1];

//    console.log("VLeftMouse :" + VLeftMouse);

/////////////////////////////////////////////////////////////////////
////    DANGER LORS DU PASSAGE a la 3D  data-x va posser de GROS probleme lorsqu'on sera en 3D (il faudra faire des projetÃ©
///la solution pourrait être de ne pas permettre de selectionner un element n'importe ou mais par endroit (pt d'ancrage) particulier
///en effet, ici il y a un soucis au niveau du projeté de la slide si elle est de travers
///que choisit on ? 
    if ($objet.hasClass("step")) {
        var offTop = $objet.attr("data-y");//$objet.offset().top;          
        var offLeft = $objet.attr("data-x");//$objet.offset().left;
//        console.log("offLeft step :" + offLeft);
    }


    if ($objet.hasClass("element")) {
        var offTop = parseFloat($objet.css("top"));
        var offLeft = parseFloat($objet.css("left"));
//        console.log("offLeft element :" + offLeft);
    }

////////////////////////////////////:

    $objet.attr("offX", "" + VLeftMouse - offLeft + "");
    $objet.attr("offY", "" + VTopMouse - offTop + "");
//    console.log("sortie offset");
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
    //console.log("distance " + distance.x + "  " + distance.y);
    var tolerance = 40;
    var ratio = 100;
    /* explication du bout de code ci dessous :
     * idem que pour rotate, sauf que cette fois ci on ne permet pas de distance en diagonale (ceci afin de permettre d'assigner
     * un autre comportement à distance.x)
     */
    var newZ = ((Math.abs(distance.y) - tolerance) >= 0 && Math.abs(distance.x) < tolerance ?
            $objet.data('pos').z - (distance.y - tolerance * Math.abs(distance.y) / distance.y) * ratio
            : $objet.attr("data-z"));



    $('#slideArea').jmpress('deinit', $objet);
    //TODO màj du json
    var idObjet = $objet.attr('id');
    if ($objet.hasClass("slide")) {          // cas step slide
        pressjson.slide[idObjet].pos.z = newZ;
    }
    else {        // cas step element
        pressjson.component[idObjet].pos.z = newZ;
    }
    $objet.attr("data-z", newZ);
    $('#slideArea').jmpress('init', $objet);
}
;


/*
 * resize d'une slide
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function resize(event, $objet) {
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");

    var distance = getDistanceMouseMove(event);

    var tolerance = 40;
    var ratio = 1 / 15;
    var newScale = ((Math.abs(distance.x) - tolerance) >= 0 && Math.abs(distance.y) < tolerance ?
            $objet.data("scale") - (distance.x - tolerance * Math.abs(distance.x) / distance.x) * ratio
            : $objet.attr("data-scale"));


    $('#slideArea').jmpress('deinit', $objet);
    //TODO màj du json
    var idObjet = $objet.attr('id');
    if ($objet.hasClass("slide")) {          // cas step slide
        pressjson.slide[idObjet].scale = newScale;
    }
    else {        // cas step element
        pressjson.component[idObjet].scale = newScale;
    }
    $objet.attr("data-scale", newScale);
    $('#slideArea').jmpress('init', $objet);

}


/*
 * rotate X et Y
 * deplacement en left (x) -> rotation d'axe Y
 * @param {type} event
 * @param {type} $objet
 */
function rotate(event, $objet) {

    var distance = getDistanceMouseMove(event);

    //tolerance de 20 pixel de deplacement reel, peut etre faudrait il connecter cette tolerance à la taille de l'écran -> ergonomie
    var tolerance = 20;
    var ratioX = 1;
    var ratioY = ratioX;
    var rotate = {
        /* explication du bout de code ci dessous :
         * condition ternaire, si la distance est inférieur à la tolérance, aucune rotation
         * sinon on soustrait à la distance la tolérance doté du signe de la distance (abs(x)/x = signe de x)
         */
        x: ((Math.abs(distance.y) - tolerance) >= 0 ? $objet.data('rotate').x - (distance.y - tolerance * Math.abs(distance.y) / distance.y) * ratioX : $objet.data('rotate').x),
        y: ((Math.abs(distance.x) - tolerance) >= 0 ? $objet.data('rotate').y - (distance.x - tolerance * Math.abs(distance.x) / distance.x) * ratioY : $objet.data('rotate').y)
    };


    //console.log("distance " + distance.x + "  " + distance.y + " rotate " + rotate.x + " " + rotate.y);


    $('#slideArea').jmpress('deinit', $objet);
    //TODO màj du json
    var idObjet = $objet.attr('id');
    if ($objet.hasClass("slide")) {          // cas step slide
        pressjson.slide[idObjet].rotate.x = rotate.x;
        pressjson.slide[idObjet].rotate.y = rotate.y;
    }
    else {        // cas step element
        pressjson.slide[idObjet].rotate.x = rotate.x;
        pressjson.slide[idObjet].rotate.y = rotate.y;
    }
    $objet.attr("data-rotate-x", rotate.x);
    $objet.attr("data-rotate-y", rotate.y);

    $('#slideArea').jmpress('init', $objet);
}



/*
 * rotate Z
 * deplacement en left (x) -> rotation d'axe Z
 * @param {type} event
 * @param {type} $objet
 */
function rotateZ(event, $objet) {
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");

    var distance = getDistanceMouseMove(event);

    //tolerance de 40 pixel de deplacement reel, peut etre faudrait il connecter cette tolerance à la taille de l'écran -> ergonomie
    var tolerance = 40;
    var rotate = {
        /* explication du bout de code ci dessous :
         * condition ternaire, si la distance en y est supérieur à la tolérance, aucune rotation
         * ceci car le rotateZ n'est commandé que par le deplacement en X (le depalcement en Y est dispo pour autre chose
         */
        z: ((Math.abs(distance.x) - tolerance) >= 0 && Math.abs(distance.y) < tolerance ?
                $objet.data('rotate').z - (distance.x - tolerance * Math.abs(distance.x) / distance.x) / 10
                : $objet.attr("data-rotate-z"))
    };

    $('#slideArea').jmpress('deinit', $objet);
    //TODO màj du json
    var idObjet = $objet.attr('id');
    if ($objet.hasClass("slide")) {          // cas step slide
        pressjson.slide[idObjet].rotate.z = rotate.z;
    }
    else {        // cas step element
        pressjson.component[idObjet].rotate.z = rotate.z;
    }
    $objet.attr("data-rotate-z", rotate.z);
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
    $('.resize').each(function() {
        resize(event, $(this));
    });
    $(".move").each(function() {
        move(event, $(this));
    });
    $(".rotate").each(function() {
        //console.log("rotate");
        rotate(event, $(this));
    });
    $(".rotateZ").each(function() {
        //console.log("rotate");
        rotateZ(event, $(this));
    });

});



/*
 * annulation de la mise en mouvement/rotation des objets
 */
$(document).on('mouseup', function(event) {
//    console.log('mouseup');
    $('.moveZ').each(function() {
        clearTimeout($(this).data("checkdown"));
        $(this).off('longclick');
        $(this).off('.moveZ');
        $(this).removeClass('moveZ');
        $(this).removeClass('longclick');

    });
    $('.resize').each(function() {
        clearTimeout($(this).data("checkdown"));
        $(this).off('longclick');
        $(this).off('.resize');
        $(this).removeClass('resize');
        $(this).removeClass('longclick');

    });
    $('.rotateZ').each(function() {
        clearTimeout($(this).data("checkdown"));
        $(this).off('longclick');
        $(this).off('.rotateZ');
        $(this).removeClass('rotateZ');
        $(this).removeClass('longclick');

    });
    $(".move").each(function() {
//        console.log($(this));
// Gestion du bind element : en fonction des coord du curseur lors du mouseup, 
// lier un element à l'element du Dom sur lequel il se trouve (slideArea ou slide)
        var $this = $(this);
        $this.removeClass("move");
        if (!$this.hasClass("slide"))                   // EN FAIRE UNE FONCTION BIND ELEMENT ??
        {
            if ($this.hasClass("element"))              // = element dans slide
            {
                var $container;
//                console.log($container !== undefined);
                $(".slide").each(function() {
                    $container = getMouseUpContainer(event, $(this));
//                    console.log($container);
                    if ($container !== undefined)
                        return false;
                });
                if ($container === undefined) {         // = drop de l'element sur slideArea
                    $this = elementToStep($this);
                }
                else {                                  // = drop de l'element sur une slide
                    $this = elementToElement($this, $container, event);
                }
            }
            else {                                      // = element libre
                var $container;
//                console.log($container !== undefined);
                $(".slide").each(function() {
                    $container = getMouseUpContainer(event, $(this));
//                    console.log($container);
                    if ($container !== undefined)
                        return false;
                });
                if ($container !== undefined)          // = drop de l'element sur slideArea
                    $this = steptoElement($this, $container);
            }
            
        }
        console.log("this avant draggable");
        console.log($this);
        $this.draggableKiki();
    });
    $(".rotate").each(function() {
        $(this).removeClass("rotate");
    });
});

//$(document).on('keypress', function(event){
//   var key = event.keyCode;
//   switch(key) {
//       case (40) ://down
//           
//               
//       
//   
//   }
//});



/*
 * permet de rendre editable un objet (slide ou element)
 */
jQuery.fn.draggableKiki = function() {

//    $(this).on("mouseup", function() {      //le probleme c'est que la slide au dessus capte l'event
//        console.log("mouseup du draggable" + $(this).html());
//        $(this).off(".movable");
//        $(this).off('.moveZ');
//        $(this.off('.rotate');
//        $(this.off('.rotateZ');

    //init du posData qui permet de stocker les caractéristiques de l'objet lors du mousedown

    var $this = $(this); // .data ne fait pas traverser this

    if ($this.hasClass('element'))
    {
        if (!$this.parent().hasClass("slide"))
        {
            $this = $this.parent();           // element libre -> selectionne la div englobante
        }
    }
//    console.log("draggable this");
//    console.log($this);

    $(this).data('pos', {
        x: $this.attr('data-x'),
        y: $this.attr('data-y'),
        z: $this.attr('data-z')});
    $(this).data('rotate', {
        x: $this.attr('data-rotate-x'),
        y: $this.attr('data-rotate-y'),
        z: $this.attr('data-rotate-z')});
    $(this).data('scale', $this.attr('data-scale'));
    /*
     * gestion des long press click
     * left : draggable Z
     * right : rotate Z
     */
    $(this).on('mousedown.longclick', function(event) {

        $("#slideArea").data('event', {
            pos: {
                x: event.pageX,
                y: event.pageY
            }
        });
        //event.stopImmediatePropagation();  //il n'en faut pas ici car il n'en faut qu'un seul par type de trigger


        if (event.which === 1) {        //longpress left        translate z
            $(this).data('checkdown', setTimeout(function() {
                console.log('long right press sur slide');
                $this.addClass("longclick");
                //mettre ici les trigger à annuler pour un mousemove sur le meme element
                //par exemple, ici on supprime le trigger mousemove.simpleclick ddu draggableKiki
                //$this.off(".simpleclick");
                $this.removeClass("move"); //devrait disparaitre avec la resolution du bricolage des move via les class
                $this.on('mousemove.moveZ', function(event) {
                    $(this).addClass("moveZ");
                    $(this).addClass("resize");
                });
            }, 500));
        }

        if (event.which === 3) {//longpress right
            $(this).data('checkdown', setTimeout(function() {
                console.log('long left press sur slide');
                $this.addClass("longclick");
                //mettre ici les trigger à annuler pour un mousemove sur le meme element
                //par exemple, ici on supprime le trigger mousemove.simpleclick ddu draggableKiki
                //$this.off(".simpleclick");
                $this.removeClass("rotate"); //devrait disparaitre avec la resolution du bricolage des move via les class
                $this.on('mousemove.rotateZ', function(event) {
                    $(this).addClass("rotateZ");
                });
            }, 500));
        }
    }).on('mouseup', function() {
        clearTimeout($(this).data("checkdown"));
    }).on('mouseout', function() {
        clearTimeout($(this).data("checkdown"));
    }).on('mousemove', function() {
        clearTimeout($(this).data("checkdown"));
    });



    /*
     * gestion des simple click
     * draggable (left)
     * rotate X et Y (right)
     */
    $(this).on("mousedown.simpleclick", function(event) {

        var $this = $(this);
        if ($this.hasClass('element'))
        {
            if (!$this.parent().hasClass("slide"))
            {
                $this = $this.parent();           // element libre -> selectionne la div englobante
            }
        }

        $("#slideArea").data('event', {
            pos: {
                x: event.pageX,
                y: event.pageY
            }
        });


        event.stopImmediatePropagation();           //empeche l'event de bubble jusqu'à la slide mère et le document, ainsi pas de conflits avec le navigable

        if (event.which === 1) {
            $this.addClass("move");
//           console.log($this);
            offSet(event, $this);
//        $(this).on("mousemove.movable", function(event) {
//            move(event, $(this));
//        });
        }

        //gere la rotation d'axe x et y
        if (event.which === 3 && event.ctrlKey === false) {
            $this.addClass("rotate");
        }

        // clic droit gère le deplacemen en Z
        if (event.which === 3 && event.ctrlKey === true) {
            $this.addClass("moveZ");
//            $(this).on("mousemove.moveZ", function(event) {       //ceci ne fonctionne pas car lorsqu'on descend la slide, on ne la survole plus
//                //deplacement Z de la slide
//                moveZ(event, $(this));
//            });
        }
        ;
    });
};

/* pour modifier le css transform de la mere*/
/*
 * 
 * @returns un objet avec les attributs du transform en key/value
 rotateX: 
 rotateY: 
 rotateZ: 
 scaleX: 
 scaleY: 
 scaleZ: 
 translate: Object
 0: -50
 1: -50
 __proto__: Object
 translate3d: Object
 0: 
 1: 
 2: 
 */
function getTrans3D() {
    // ToDO : récupérer le bon VendorPrefix, suivant le navigateur
    // car "webkit" ne fonctionne que sur certains navigateurs (par ex, suis obligée d'utiliser chromium pour utiliser l'editeur, là)
    
    var trans = (pfx('transform'));
//    console.log("trans : "+ trans);
    
    
    //style.position == style['position']
//    var trans = $("#slideArea>div")[0].style.webkitTransform.match(/.+?\(.+?\)/g);
     var trans = $("#slideArea>div")[0].style[''+trans+''].match(/.+?\(.+?\)/g);
     console.log(trans);
    var dico = {};
    for (el in trans) {
        var ele = trans[el];
        var key = ele.match(/.+?\(/g).join("").match(/[a-zA-Z0-9]/g).join("");
        var value = ele.match(/\(.+\)/g)[0].split(",");
        if (value.length <= 1) {
            value = parseFloat(value[0].match(/-[0-9]+|[0-9]+/g)[0]);
            dico[key] = value;
        } else {
            dico[key] = {};
            for (val in value) {
                var vale = parseFloat(value[val].match(/-[0-9]+|[0-9]+/g)[0]);
                dico[key][val] = vale;
            }
        }
    }
    return dico;

}

/*
 * prend en parametre un object contenant TOUS les attributs du transform
 * @param {type} dico
 * 
 */
function setTrans3D(dico) {
    //var transform = "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") rotateX(" + dico.rotateX + "deg) rotateY(" + dico.rotateY + "deg) rotateZ(" + dico.rotateZ + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)";
    var transform = "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") translate3d(0px,0px,0px) scaleX(1) scaleY(1) scaleZ(1) rotateZ(" + dico.rotateZ + "deg) rotateY(" + dico.rotateY + "deg) rotateX(" + dico.rotateX + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)";
//    console.log(transform);
    $("#slideArea>div").css({'transform': transform});
    //console.log("setter " + transform);
}


/* ======================================================================================
 * 
 * deplacement et zoom au sein de la présentation
 * 
 * ====================================================================================== */
$(document).on('mousedown', function(event) {           //le fucking probleme avec cette methode c'est que le mousemove et mouseup sont absorbé par une autre slide si notre draggable passe dessous
    //init du posData qui permet de stocker les caractéristiques de l'objet lors du mousedown
    $("#slideArea").data('event', {
        pos: {
            x: event.pageX,
            y: event.pageY
        }
    });


    if (event.which === 1) {
        $(this).on('mousemove.moveView', function(event) {

            //recupération des attributs de positionnement de la view
            var transform = getTrans3D();
            var alpha = transform.rotateX * 2 * Math.PI / 360;
            var beta = transform.rotateY * 2 * Math.PI / 360;
            var gamma = transform.rotateZ * 2 * Math.PI / 360;

            //recupération de déplacement de la souris
            var dReal = {//element différentiel reel
                x: event.pageX - $("#slideArea").data('event').pos.x,
                y: event.pageY - $("#slideArea").data('event').pos.y
            };

            //calcul du déplacement dans le monde des slides
            /////////////////////////////////////////// fonctione 
            //////////////////////////////////////////dx    dy
            //////////////////////////////////////Z    x     x
            //////////////////////////////////////Y    x(parasité par virtuelX)     v
            //////////////////////////////////////X    v     x(pe bon)
            var scale = -1;
            /*  pour le rotate en Z
             var dVirtuel = {//element différentiel virtuel
             x: (dReal.x*Math.cos(gamma) + dReal.y*Math.sin(gamma) )* scale,
             y: (dReal.y*Math.cos(gamma) - dReal.x*Math.sin(gamma) )* scale,
             z: 0
             };
             */

            /*  //pour le rotate en x
             var dVirtuel = {
             x: ( dReal.x )* scale,
             y: ( dReal.y*Math.cos(alpha) )*scale,               
             z: ( -dReal.y*Math.sin(alpha) )* scale
             };*/

            //pour le rotate en Y
//            var dVirtuel = {
//                x: dReal.x*Math.cos(beta) * scale ,
//                y: (dReal.y*Math.cos(beta) - dReal.y*Math.sin(beta))*scale,//+ dReal.x*Math.sin(beta),
//                z: dReal.x*Math.sin(beta)* scale                   
//            };

            var dVirtuel = {
                x: 0,
                y: 0,
                z: 0
            };

            //pour le rotate en Z
            dVirtuel.x += dReal.x * Math.cos(gamma) + dReal.y * Math.sin(gamma);
            dVirtuel.y += dReal.y * Math.cos(gamma) - dReal.x * Math.sin(gamma);
            dVirtuel.z += 0;

            //pour le rotate en x
            dVirtuel.x += dReal.x;
            dVirtuel.y += dReal.y * Math.cos(alpha);
            dVirtuel.z += -dReal.y * Math.sin(alpha);

            //pour le rotate en Y
            dVirtuel.x += dReal.x * Math.cos(beta);
            dVirtuel.y += dReal.y * Math.cos(beta) - dReal.y * Math.sin(beta);
            dVirtuel.z += dReal.x * Math.sin(beta);

            var dVirtuel = {
                x: 0,
                y: 0,
                z: 0
            };

            dVirtuel.x += dReal.x * (Math.cos(gamma) + Math.cos(beta)) + dReal.y * Math.sin(gamma);
            dVirtuel.y += dReal.y * (Math.cos(gamma) + Math.cos(alpha) + Math.cos(beta) - Math.sin(beta)) - dReal.x * Math.sin(gamma);
            dVirtuel.z += dReal.x * Math.sin(beta) - dReal.y * Math.sin(alpha);
            //
            dVirtuel.x *= scale;
            dVirtuel.y *= scale;
            dVirtuel.z *= scale;

            transform.translate3d[0] = parseInt(transform.translate3d[0] - dVirtuel.x);
            transform.translate3d[1] = parseInt(transform.translate3d[1] - dVirtuel.y);
            transform.translate3d[2] = parseInt(transform.translate3d[2] - dVirtuel.z);

            //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
            $("#slideArea").data('event').pos.x = event.pageX;
            $("#slideArea").data('event').pos.y = event.pageY;

            //deplacement de la zone de vue
            setTrans3D(transform);
        });
    }


    if (event.which === 3) {
        $(this).on('mousemove.rotateView', function(event) {

            //recupération des attributs de positionnement de la view
            var transform = getTrans3D();
            var alpha = transform.rotateX;
            var beta = transform.rotateY;
            var gamma = transform.rotateZ;

            //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
            $("#slideArea").data('event').pos.x = event.pageX;
            $("#slideArea").data('event').pos.y = event.pageY;

            //deplacement de la zone de vue
            setTrans3D(transform);

        });
    }


    $(this).on("mouseup", function() {
        $(this).off(".moveView");
        $(this).off(".rotateView");
    });
});


$(document).mousewheel(function(event, delta, deltaX, deltaY) {
    var transform = getTrans3D();
//    console.log(transform);
    transform.translate3d[2] = transform.translate3d[2] + deltaY * 10;
    setTrans3D(transform);
});


/* ======================================================================================
 * petits utilitaires
 * from jmpress.js
 * used to get the right vendor prefix
 * ====================================================================================== */


/**
 * Set supported prefixes
 *
 * @access protected
 * @return Function to get prefixed property
 */
var pfx = (function() {
    var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};
    return function(prop) {
        if (typeof memory[ prop ] === "undefined") {
            var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
            memory[ prop ] = null;
            for (var i in props) {
                if (style[ props[i] ] !== undefined) {
                    memory[ prop ] = props[i];
                    break;
                }
            }
        }
        return memory[ prop ];
    };
}());

/* ======================================================================================
 * zone de test
 * ====================================================================================== */
/// du longclick
//$(document).ready(function() {   //avec le longclick de jquery 1.4 -> fail
//    $(this).longclick(500, function() {
//        console.log('long click');
//    });
//
//});

///plugin longclick de jquzry 1.4
//(function($) {
//    $.fn.longClick = function(callback, timeout) {
//        var timer;
//        timeout = timeout || 500;
//        $(this).mousedown(function() {
//            timer = setTimeout(function() { callback(); }, timeout);
//            return false;
//        });
//        $(document).mouseup(function() {
//            clearTimeout(timer);
//            return false;
//        });
//    };
//
//})(jQuery);
//fin plugin
//$(document).longClick(function() { 
//    console.log('long clic"k 1.4');
//});



//avec des timers, WORKS
//$(document).ready(function() {
//    $(this).on('mousedown.longpress', function() {
//        event.stopImmediatePropagation(); 
//        var $this = $(this); // .data ne fait pas traverser this
//        $(this).data('checkdown', setTimeout(function() {
//            console.log('long press sur document');
//            //mettre ici les trigger à annuler pour un mousemove sur le meme element
//            //par exemple, ici on supprime le trigger mousemove.navigable du $(document)
//            $this.off(".navigable");
//            $this.on('mousemove', function() {
//                console.log('move après longpress');
//            });
//
//        }, 500));
//
//    }).on('mouseup', function() {
//        clearTimeout($(this).data("checkdown"));
////        console.log("fin long press sur document");
//
//    }).on('mouseout', function() {
//        clearTimeout($(this).data("checkdown"));
////        console.log("fin long press sur document par mouseout");
//
//    }).on('mousemove', function() {
//        clearTimeout($(this).data("checkdown"));
////        console.log("fin long press sur document via move");
//    });
//});





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
