/*
 * Contient les élements communs à slideShowEditor et GUIEditor à savoir les outils permettant à l'Editor en lui même de fonctionner
 * Contient :
 *      class objectEvent
 *      listener joystick
 *              appel directement Model avec un objEvt 
 *      orthogonalProjection
 *      
 */

/**
 * jQuery mousehold plugin - fires an event while the mouse is clicked down.
 * Additionally, the function, when executed, is passed a single
 * argument representing the count of times the event has been fired during
 * this session of the mouse hold.
 *
 * @author Remy Sharp (leftlogic.com)
 * @date 2006-12-15
 * @example $("img").mousehold(200, function(i){  })
 * @desc Repeats firing the passed function while the mouse is clicked down
 *
 * @name mousehold
 * @type jQuery
 * @param Number timeout The frequency to repeat the event in milliseconds
 * @param Function fn A function to execute
 * @cat Plugin
 */

/***
 fn.call(thisPerso,params1...)
 permet d'appliquer un this passé en parametre et des parametres
 ***/

/**
 ca fait chier, le mousehold lance la même fonction à chaque fois ! mais l'event n'est jamais le même ! 
 **/

jQuery.fn.mousehold = function(timeout, f) {
    if (timeout && typeof timeout === 'function') {
        f = timeout;
        timeout = 100;
    }
    if (f && typeof f === 'function') {
        var timer = 0;
        var fireStep = 0;
        return this.each(function() {
            //jQuery(this).on('mousedown', function() {
                fireStep = 1;
                var ctr = 0;
                var t = this;
                timer = setInterval(function() {
                    ctr++;
                    f.call(t, ctr);
                    fireStep = 2;
                }, timeout);
            //});

            clearMousehold = function() {
                clearInterval(timer);
                if (fireStep == 1)
                    f.call(this, 1);
                fireStep = 0;
//                if( $(this).attr('id') === 'mouseholdId') $(this).removeAttr('id');
            };
            //pour exclure le joystick du mouseout
            //si this n'a pas d'id => does'nt work !
//            if( typeof $(this).attr('id') === 'undefined' ) $(this).attr('id','mouseholdID');
            var $this = $('#'+$(this).attr('id')+':not(#joystick)');
            $this.mouseout(clearMousehold);
            $(this).mouseup(clearMousehold);
        });
    }
}


/* classe objetEvent
 * matricule
 * action
 * event
 *  des infos
 *  
 *  Est ce que je stocke les objetEvent ? 
 * 
 * 
 */
ObjectEvent = Class.extend({
    init: function(params) {
        //default value

        //matricule du composant
        //sinon c'est de la création
        this.matricule = '';

        /* ce qu'il faut faire sur le composant
         *  +move
         *  
         */
        this.action = '';

        /* caracterique de l'event
         * type : keyboard, souris
         * si move -> direction : z+, z-, y+...
         * si rotate -> sens : x, -x, y, -y
         * si create -> pos : {}, rotate{}
         */
        this.event = {
        };



        if (typeof params !== 'undefined') {
            for (var param in params) {
                if (typeof params[param] === 'object') {
                    for (var paramNested in param) {
                        this[param][paramNested] = param[paramNested];
                    }
                }
                this[param] = params[param];
            }
        }



    },
    show: function(i) {
        if (typeof i === 'undefined') {
            //console.log('objectEvent');
        } else {
            //console.log('objectEvent');
        }
    },
    destroy: function() {
        //console.log('nothing to delete');
    }



});


/* joystick
 * Fournit un ensemble de listener sur le mousedown+mousemove 
 * Detecte la slide et calcul le déplacement de la souris par rapport au centre
 *  
 */


/* effectue le projeté orthogonal du deplacement du joystick
 * 
 * output : sens sur X
 *          sens sur Y
 *          cran sur X
 *          cran sur Y
 */
function orthogonalProjection(current, init, coef) {

    var dx = current.pageX - init.pageX;
    var dy = current.pageY - init.pageY;

    var tolerance = 20;

    var d = {
        /* explication du bout de code ci dessous :
         * condition ternaire, si la distance est infÃ©rieur Ã  la tolÃ©rance, aucune rotation
         * sinon on soustrait Ã  la distance la tolÃ©rance dotÃ© du signe de la distance (abs(x)/x = signe de x)
         */
        y: ((Math.abs(dy) - tolerance) >= 0 ? (dy - tolerance * Math.abs(dy) / dy) : 0),
        x: ((Math.abs(dx) - tolerance) >= 0 ? (dx - tolerance * Math.abs(dx) / dx) : 0)
    };



    //var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));



    var event = {
        cranX: 0,
        directionX: '',
        cranY: 0,
        directionY: ''
    };
    event.cranX = Math.abs(d.x) * coef;
    if (dx < 0) {
        event.directionX = 'x-';
    } else {
        event.directionX = 'x+';
    }
    event.cranY = Math.abs(d.y) / 10;
    if (dy < 0) {
        event.directionY = 'y-';
    } else {
        event.directionY = 'y+';
    }


    return event;
}


function setJoystick($this) {
    var heightJ = parseInt($('#joystick').css('height'));
    var widthJ = parseInt($('#joystick').css('width'));
    $('#joystick').css({
        'top': $this.data('posInitMouse').pageY - heightJ / 2,
        'left': $this.data('posInitMouse').pageX - widthJ / 2,
        'display': 'inline'

    });

}


/* Pour faire les choses bien : 
 * https://github.com/sebastien-p/jquery.hasEventListener
 * Permet de savoir si un element du DOM a déjà un listener
 * 
 * Bricollage : 
 *      variable globale pour savoir si le mousemove a été capté 
 * mouseMove = false -> mousemove libre
 */
simpleHasMouseMove = false;
longHasMouseMove = false;

/* listeners pour le joystick
 * Un mousedown n'importe 
 * 
 */
$(document).on('mousedown', function(event) {

    if (
            $('.sidebar:hover').length === 0 &&
            $('#topbar:hover').length === 0 &&
            $('.buttonclicked').length === 0) {
        joystickHandler(event);
    }

});


function joystickHandler(event) {

    var $this = $(event.target);

    if ($('body')[0] === $this[0]) {
        var matricule = 'document';
    } else {
        var matricule = $this.attr('matricule');

        //stockage des données initiales
        var composant = findObjectOfComposant(matricule);
        $this.data('pos', {
            x: composant.pos.x,
            y: composant.pos.y,
            z: composant.pos.z
        });
        $this.data('rotate', {
            x: composant.rotate.x,
            y: composant.rotate.y,
            z: composant.rotate.z

        });
        $this.data('scale', composant.scale);
    }

    $this.data('posInitMouse', {
        pageX: event.pageX,
        pageY: event.pageY
    });

    var objEvt = new ObjectEvent({
        matricule: matricule,
        action: 'joystick',
        event: {
            cran: 0,
            direction: ''
        }
    });

    setJoystick($this);

    /*
     * gestion des long press click
     */ /*
    if (event.which === 1) {        //longpress left        
        $this.data('checkdown', setTimeout(function() {
            //console.log('long left press sur', matricule);
            if (simpleHasMouseMove) {
                //console.log('long left : mouse move déja pris ');

            } else {
                $(document).on('mousemove.longLeft', function(event) {       //si on move penant un click long
                    longHasMouseMove = true;
                    //console.log('mousemove après long left sur', matricule);
                });
            }
        }, 500)).on('mousemove', function() {
            clearTimeout($(this).data('checkdown'));
        });
    }

    if (event.which === 3) {        //longpress right      
        $this.data('checkdown', setTimeout(function() {
            //console.log('long right press sur', matricule);
            if (simpleHasMouseMove) {
                //console.log('long right : mouse move déja pris ');

            } else {
                $(document).on('mousemove.longRight', function(event) {       //si on move penant un click long
                    longHasMouseMove = true;
                    //console.log('mousemove après long right sur', matricule);
                });
            }
        }, 500)).on('mousemove', function() {
            clearTimeout($(this).data('checkdown'));
        });
    }
    */


    /*
     * gestion des simple click
     */

    if (event.which === 1) {
//        $(document).on('mousemove.simpleLeft',function() {       //si on move penant un click court
        $(document).mousehold(function() {       //si on move penant un click court
            if (longHasMouseMove) {
                console.log('long click a pris le mousemove');
                $(this).off('.simpleLeft');
            } else {
                simpleHasMouseMove = true;
                //console.log('mousemove left sur', matricule);
     
                var event = {
                    pageX: parseInt($('body').data('pageX')),
                    pageY: parseInt($('body').data('pageY'))
                };

                var eventXY = orthogonalProjection(event, $this.data('posInitMouse'), 0.1);
                //console.log(eventXY.pageX, eventXY.pageY);
                objEvt.action = 'move';

                //maj position X
                objEvt.event.direction = eventXY.directionX;
                objEvt.event.cran = eventXY.cranX;
                //console.log('avant appel call model', objEvt);
                callModel(objEvt);
                //maj position Y
                objEvt.event.direction = eventXY.directionY;
                objEvt.event.cran = eventXY.cranY;
                //console.log('avant appel call model', objEvt);
                callModel(objEvt);

            }
        }); 
    }

    if (event.which === 3) {
//        $(document).on('mousemove.simpleLeft',function(event) {       //si on move penant un click court
        $(document).mousehold(function(event) {       //si on move penant un click court
            if (longHasMouseMove) {
                //console.log('long click a pris le mousemove');
                $(this).off('.simpleRight');
            } else {
                simpleHasMouseMove = true;
                console.log('mousemove right sur', matricule);
                
                var event = {
                    pageX: parseInt($('body').data('pageX')),
                    pageY: parseInt($('body').data('pageY'))
                };                
                var eventXY = orthogonalProjection(event, $this.data('posInitMouse'), 0.1);
                objEvt.action = 'rotate';

                //maj position X
                objEvt.event.direction = eventXY.directionX;
                objEvt.event.cran = eventXY.cranX;
                //console.log('avant appel call model', objEvt);
                callModel(objEvt);
                //maj position Y
                objEvt.event.direction = eventXY.directionY;
                objEvt.event.cran = eventXY.cranY;
                //console.log('avant appel call model', objEvt);
                callModel(objEvt);
            }
        });
    }



//annulation des listeners sur mouseup
    $(document).one('mouseup', function(event) {
//        $('.buttonclicked"').removeClass("buttonclicked");
        simpleHasMouseMove = false;
        longHasMouseMove = false;
        $(this).off('.longClick');
        $(this).off('.longLeft');
        $(this).off('.longRight');
        //$(this).off('.simpleClick');
        //$(this).off('.simpleLeft');
        //$(this).off('.simpleRight');
        console.log('annulation des events mouse');
        $('#joystick').css('display', 'none');

    });

}

/*
 * pour le mousehold
 */
$(document).on('mousemove', function(event) {
    $('body').data('pageX', event.pageX);
    $('body').data('pageY', event.pageY);
    //console.log($('body').css('cursor'));
});





/* permet de savoir qui de document ou de slide doit capter les touches de clavier en fonction du hover 
 * 
 */
var composantCatchEvent = false;
//var documentCatchEvent = false;