/* 
 * Ensemble des outils ne gérant que le déplacement et la rotation des slides et des elements
 */



/*
 * effectue le deplacement en x et y de $objet (objet jquery)
 * compatible pour les slides et les elements
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function move(event, $objet) {
    var idObjet = $objet.attr('id');
//    if ($objet.hasClass('element'))
//    {
//        if (!$objet.parent().hasClass("slide"))
//        {
//            $objet = $objet.parent();           // element libre -> selectionne la div englobante
//        }
//    }
    var $slideArea = $("#slideArea");

// $objet.attr("data-x", VLeft);
    var offX = $objet.data('off').x;
    var offY = $objet.data('off').y;
    if ($objet.hasClass("slide")) {
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

    if ($objet.hasClass("slide")) {                     // cas slide
        $('#slideArea').jmpress('deinit', $objet);
        // màj du json
        pressjson.slide[idObjet].pos.x = VLeft;                                 /////////////////////////
        pressjson.slide[idObjet].pos.y = VTop;

//        if ($objet.hasClass("slide")) {
//
//        }
//        else {                                  // cas step element libre
//            pressjson.component[idObjet].pos.x = VLeft;
//            pressjson.component[idObjet].pos.y = VTop;
//
//        }
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

    //position virtuelle dans le monde des slides de la souris
    if ($objet.hasClass("slide")) {
        var flag = 0;
    }
    else {
        var flag = 1;
    }
    var tab = getVirtualCoord(event, $slideArea, flag, $objet);
    var VTopMouse = tab[0];
    var VLeftMouse = tab[1];

    if ($objet.hasClass("slide")) {
        var offTop = $objet.attr("data-y");
        var offLeft = $objet.attr("data-x");
    }

    if ($objet.hasClass("element")) {
        var offTop = parseFloat($objet.css("top"));
        var offLeft = parseFloat($objet.css("left"));
    }

    $objet.data('off', {
        x: VLeftMouse - offLeft,
        y: VTopMouse - offTop
    });

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
    var idObjet = $objet.attr('id');
    pressjson.slide[idObjet].pos.z = newZ;

//    if ($objet.hasClass("slide")) {          // cas step slide
//
//    }
//    else {        // cas step element
//        pressjson.component[idObjet].pos.z = newZ;
//    }

    $objet.attr("data-z", newZ);
    $('#slideArea').jmpress('init', $objet);
}
;


/*
 * resize d'une slide (data-scale)
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
    var idObjet = $objet.attr('id');
//    if ($objet.hasClass("slide")) {          // cas step slide
    pressjson.slide[idObjet].scale = newScale;
//    }
//    else {        // cas step element
//        pressjson.component[idObjet].scale = newScale;
//    }

    $objet.attr("data-scale", newScale);
    $('#slideArea').jmpress('init', $objet);

}


/*
 * rotate X et Y
 * deplacement en left (x) -> rotation d'axe Y
 * deplacement en top (y) -> rotation d'axe X
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


    $('#slideArea').jmpress('deinit', $objet);
    var idObjet = $objet.attr('id');
//    if ($objet.hasClass("slide")) {          // cas step slide
    pressjson.slide[idObjet].rotate.x = rotate.x;
    pressjson.slide[idObjet].rotate.y = rotate.y;
//    }
//    else {        // cas step element
//        pressjson.slide[idObjet].rotate.x = rotate.x;
//        pressjson.slide[idObjet].rotate.y = rotate.y;
//    }
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
    var idObjet = $objet.attr('id');
//    if ($objet.hasClass("slide")) {          // cas step slide
    pressjson.slide[idObjet].rotate.z = rotate.z;
//    }
//    else {        // cas step element
//        pressjson.component[idObjet].rotate.z = rotate.z;
//    }

    $objet.attr("data-rotate-z", rotate.z);
    $('#slideArea').jmpress('init', $objet);
}

/*
 * mise en mouvement/rotation des objets en fonction de leur classe
 * Seul move concerne les elements texte
 */
$(document).on('mousemove', function(event) {

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
        rotate(event, $(this));
    });
    $(".rotateZ").each(function() {
        rotateZ(event, $(this));
    });

});



/*
 * annulation de la mise en mouvement/rotation des objets
 */
$(document).on('mouseup', function(event) {
    $('body').css('cursor', 'default');

    $('.moveZ').each(function() {
        clearTimeout($(this).data("checkdown"));
        $(this).off('longclick');
        //suppression du listener particulier à la slide (pas utile mais dans l'idéal c'est comme ca qu'il faudrait faire
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
// Gestion du bind element : en fonction des coord du curseur lors du mouseup, 
// lier un element à l'element du Dom sur lequel il se trouve (slideArea ou slide)
        var $this = $(this);
        $this.removeClass("move");
//        if (!$this.hasClass("slide"))                   // EN FAIRE UNE FONCTION BIND ELEMENT ??
//        {
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
            if ($container === undefined) {         // = drop de l'element sur slideArea -> retour à position originale
//                    $this = elementToStep($this);
                $this.css("left", $this.attr("offX"));
                $this.css("top", $this.attr("offY"));
            }
            else {                                  // = drop de l'element sur une slide
                $this = elementToElement($this, $container, event);
            }
        }
//            else {                                      // = element libre
//                var $container;
////                console.log($container !== undefined);
//                $(".slide").each(function() {
//                    $container = getMouseUpContainer(event, $(this));
////                    console.log($container);
//                    if ($container !== undefined)
//                        return false;
//                });
//                //                if ($container !== undefined)          // = drop de l'element sur slideArea                                                   // KIKI annulation du drop d'un element sur le documentS
////                    $this = steptoElement($this, $container);
//            }
//
//        }
//        console.log("this avant draggable");
//        console.log($this);
        $this.draggableKiki();
    });
    $(".rotate").each(function() {
        $(this).removeClass("rotate");
    });
});


/*
 * permet de rendre editable un objet (slide ou element)
 */
jQuery.fn.draggableKiki = function() {



    var $this = $(this); // .data ne fait pas traverser this

    if ($this.hasClass('element'))
    {
        if (!$this.parent().hasClass("slide"))
        {
            $this = $this.parent();           // element libre -> selectionne la div englobante
        }
    }


    //init du posData qui permet de stocker les caractéristiques de l'objet lors du mousedown
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
                //mettre ici les classes à supprimer pour un mousemove sur le meme element
                //par exemple, ici on supprime la classe move qui a été mit par le mousedown simple
                $this.removeClass("move");
                $this.on('mousemove.moveZ', function(event) {       //si on move penant un click long
                    $(this).addClass("moveZ");
                    $(this).addClass("resize");
                });
            }, 500));
        }

        if (event.which === 3) {    //longpress right           rotateZ
            $(this).data('checkdown', setTimeout(function() {
                console.log('long left press sur slide');
                $this.addClass("longclick");
                $this.removeClass("rotate"); //annule l'action mise en place par le mousedown 
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
        if ($this.hasClass('slide')) {
            event.originalEvent.preventDefault();
            $('body').css('cursor', 'move');
        }

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
            offSet(event, $this);
        }

        //gere la rotation d'axe x et y
        if (event.which === 3) {
            $this.addClass("rotate");
        }

    });
};
