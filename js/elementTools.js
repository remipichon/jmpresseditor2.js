/* 
 * Ensemble des outils ne gÃ©rant que le dÃ©placement et la rotation des slides et des elements
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
    var $slideArea = $("#slideArea");

    var offX = $objet.data('off').x;
    var offY = $objet.data('off').y;

    if ($objet.hasClass('element')) {
        var tab = getVirtualCoord(event, $objet.parent());
    } else {
        var tab = getVirtualCoord(event, $objet);      //recupÃƒÂ©ration des coord virtuelle de la souris
    }

    var VTop = tab[0];
    var VLeft = tab[1];

    //compension du lieu de click
    VTop = VTop - offY;
    VLeft = VLeft - offX;

    //mise Ã  jour de la position
    if ($objet.hasClass("element")) {           // element dans slide
        var $container = $objet.parent();
        var idContainer = $container.attr('id');
        $('#slideArea').jmpress('deinit', $container);
        pressjson.slide[idContainer].element[idObjet].pos.x = VLeft;                /////////////////////////
        pressjson.slide[idContainer].element[idObjet].pos.y = VTop;
        $objet.css("left", VLeft);
        $objet.css("top", VTop);
        $('#slideArea').jmpress('init', $container);
    }

    if ($objet.hasClass("slide")) {
        $('#slideArea').jmpress('deinit', $objet);
        pressjson.slide[idObjet].pos.x = VLeft;                                 /////////////////////////
        pressjson.slide[idObjet].pos.y = VTop;
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
    //position virtuelle dans le monde des slides de la souris

    var tab = getVirtualCoord(event, $objet);

    if ($objet.hasClass("element")) {
        var tab = getVirtualCoord(event, $objet.parent());
    }

    var VTopMouse = tab[0];
    var VLeftMouse = tab[1];

    if ($objet.hasClass("step")) {
        var offTop = $objet.attr("data-y");
        var offLeft = $objet.attr("data-x");
    }


    if ($objet.hasClass("element")) {
        var offTop = parseFloat($objet.css("top"));  //parseFloat parce top:343px
        var offLeft = parseFloat($objet.css("left"));
    }

    $objet.data('off', {
        x: VLeftMouse - offLeft,
        y: VTopMouse - offTop
    });

    //juste utile pour le debug
    //$objet.attr("offX", "" + VLeftMouse - offLeft + "");
    //$objet.attr("offY", "" + VTopMouse - offTop + "");
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
     * un autre comportement Ã  distance.x)
     */
    var newZ = ((Math.abs(distance.y) - tolerance) >= 0 && Math.abs(distance.x) < tolerance ?
            $objet.data('pos').z - (distance.y - tolerance * Math.abs(distance.y) / distance.y) * ratio
            : $objet.attr("data-z"));



    $('#slideArea').jmpress('deinit', $objet);
    var idObjet = $objet.attr('id');
    pressjson.slide[idObjet].pos.z = newZ;


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
 * deplacement en top (y) -> rotation d'axe X
 * @param {type} event
 * @param {type} $objet
 */
function rotate(event, $objet) {

    var distance = getDistanceMouseMove(event);

    //tolerance de 20 pixel de deplacement reel, peut etre faudrait il connecter cette tolerance Ã  la taille de l'Ã©cran -> ergonomie
    var tolerance = 20;
    var ratioX = 1;
    var ratioY = ratioX;
    var rotate = {
        /* explication du bout de code ci dessous :
         * condition ternaire, si la distance est infÃ©rieur Ã  la tolÃ©rance, aucune rotation
         * sinon on soustrait Ã  la distance la tolÃ©rance dotÃ© du signe de la distance (abs(x)/x = signe de x)
         */
        x: ((Math.abs(distance.y) - tolerance) >= 0 ? $objet.data('rotate').x - (distance.y - tolerance * Math.abs(distance.y) / distance.y) * ratioX : $objet.data('rotate').x),
        y: ((Math.abs(distance.x) - tolerance) >= 0 ? $objet.data('rotate').y - (distance.x - tolerance * Math.abs(distance.x) / distance.x) * ratioY : $objet.data('rotate').y)
    };


    $('#slideArea').jmpress('deinit', $objet);
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

    //tolerance de 40 pixel de deplacement reel, peut etre faudrait il connecter cette tolerance Ã  la taille de l'Ã©cran -> ergonomie
    var tolerance = 40;
    var rotate = {
        /* explication du bout de code ci dessous :
         * condition ternaire, si la distance en y est supÃ©rieur Ã  la tolÃ©rance, aucune rotation
         * ceci car le rotateZ n'est commandÃ© que par le deplacement en X (le depalcement en Y est dispo pour autre chose
         */
        z: ((Math.abs(distance.x) - tolerance) >= 0 && Math.abs(distance.y) < tolerance ?
                $objet.data('rotate').z - (distance.x - tolerance * Math.abs(distance.x) / distance.x) / 10
                : $objet.attr("data-rotate-z"))
    };

    $('#slideArea').jmpress('deinit', $objet);
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
        //suppression du listener particulier Ã  la slide (pas utile mais dans l'idÃ©al c'est comme ca qu'il faudrait faire
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
// lier un element Ã  l'element du Dom sur lequel il se trouve (slideArea ou slide)
        var $this = $(this);
        $this.removeClass("move");
        if ($this.hasClass("element"))              // = element dans slide
        {
            var $container;
            $(".slide").each(function() {
                $container = getMouseUpContainer(event, $(this));       // détermination d'où a été droppé l'élément
                if ($container !== 0)
                    return false;
            });
            if ($container === 0) {                         // = drop de l'element hors slide -> retour à position initiale
//                console.log("drop hors slide");
//                console.log("css top : " + $this.css("top") + ", dataoffy : " + $this.data('pos').y);
                $this.css("top", $this.data('pos').y);
                $this.css("left", $this.data('pos').x);
            }
            else {                                          // = drop de l'element sur une slide
//                console.log("drop dans slide");
                $this = elementToElement($this, $container, event);
            }
        }
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

        //init du posData qui permet de stocker les caractÃ©ristiques de l'objet lors du mousedown
    if ($this.hasClass('element'))
    {
        $(this).data('pos', {
            x: $this.css('left'),
            y: $this.css('top')
        });
    }
    else {                  // slide
        $(this).data('pos', {
            x: $this.attr('data-x'),
            y: $this.attr('data-y'),
            z: $this.attr('data-z')});
        $(this).data('rotate', {
            x: $this.attr('data-rotate-x'),
            y: $this.attr('data-rotate-y'),
            z: $this.attr('data-rotate-z')});
        $(this).data('scale', $this.attr('data-scale'));
    }

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
                //mettre ici les classes Ã  supprimer pour un mousemove sur le meme element
                //par exemple, ici on supprime la classe move qui a Ã©tÃ© mit par le mousedown simple
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
        if ($this.hasClass('slide')) {      // transformation du cursor en "move"
            event.originalEvent.preventDefault();
            $('body').css('cursor', 'move');
        }

        $("#slideArea").data('event', {
            pos: {
                x: event.pageX,
                y: event.pageY
            }
        });

        event.stopImmediatePropagation();           //empeche l'event de bubble jusqu'Ã  la slide mÃ¨re et le document, ainsi pas de conflits avec le navigable

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