/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Fonction Jquery permettant d'effectuer un déplacement animé et smooth via la transform3D
 *  from http://cameronspear.com/blog/animating-translate3d-with-jquery/
 *  Great thanks to Cameronspear 2013 !
 */

(function($) {
    var delay = 0;
    $.fn.translate3d = function(translations, speed, easing, complete) {
        var opt = $.speed(speed, easing, complete);
        opt.easing = opt.easing || 'ease';
        translations = $.extend({x: 0, y: 0, z: 0}, translations);

        return this.each(function() {
            var $this = $(this);

            /* tentative avec mes outils */
            var dico = getTrans3D($this);
            if (typeof dico.translate3d === 'undefined') {
                //console.log($this, 'n\'a pas de transform !');
                return;
            }
            dico.translate3d[0] = translations.x;
            dico.translate3d[1] = translations.y;
            dico.translate3d[2] = translations.z;


            $this.css({
                transitionDuration: opt.duration + 'ms',
                transitionTimingFunction: opt.easing,
                transform: "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") translate3d(0px,0px,0px) scaleX(1) scaleY(1) scaleZ(1) rotateZ(" + dico.rotateZ + "deg) rotateY(" + dico.rotateY + "deg) rotateX(" + dico.rotateX + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)"

            });

            setTimeout(function() {
                $this.css({
                    transitionDuration: '0s',
                    transitionTimingFunction: 'ease'
                });

                opt.complete();
            }, opt.duration + (delay || 0));
        });
    };
})(jQuery);

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
function getTrans3D($node) {

    ////console.log('getTrans3D',$node);
    var prefix = (pfx('transform'));
    if (typeof $node[0] === 'undefined')
        return;
    var trans = $node[0].style['' + prefix + ''].match(/.+?\(.+?\)/g);
    var dico = {};
    for (var el in trans) {
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
function setTrans3D(dico, $node) {
    if (typeof $node === 'undefined') {
        $node = $("#slideArea>div");
    }
    //var transform = "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") rotateX(" + dico.rotateX + "deg) rotateY(" + dico.rotateY + "deg) rotateZ(" + dico.rotateZ + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)";
    var transform = "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") translate3d(0px,0px,0px) scaleX(1) scaleY(1) scaleZ(1) rotateZ(" + dico.rotateZ + "deg) rotateY(" + dico.rotateY + "deg) rotateX(" + dico.rotateX + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)";
    $node.css({'transform': transform});
}


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
pfx = (function() {
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




Transform3D = Class.extend({
    init: function() {
        var transform = getTrans3D($('#slideArea >'));
        this.pos = {
            x: 0, //transform.translate3d[0],
            y: 0, //transform.translate3d[1],
            z: 0//transform.translate3d[2]
        };

        this.rotate = {
            x: 0, //transform.translate3d[0],
            y: 0, //transform.translate3d[1],
            z: 0//transform.translate3d[2]
        };

        watch(this.pos, function(attr, action, newVal, oldVal) {

            WatchJS.noMore = true; //prevent invoking watcher in this scope
            this.x = 0;
            this.y = 0;
            this.z = 0;

//            var transform = 'translate(-50%, -50%),  scaleX(1), scaleY(1),  scaleZ(1),  rotateZ(0deg),  rotateY(0deg),  rotateX(0deg), \n\
//                 translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px)';
//            //console.log('transform :', transform);
//            $("#slideArea>div").css({'transform': transform});
//            $("#slideArea").css({'transform': transform});


            //magouille qui fera fonctionner
            var dico = getTrans3D($('#slideArea >'));
            var i;
            switch (attr) {
                case 'x':
                    i = 0;
                    break;
                case 'y':
                    i = 1;
                    break;
                case 'z':
                    i = 2;
                    break;

            }
            dico.translate3d[i] += newVal;

            setTrans3D(dico);
            //console.log(dico);

        });


        watch(this.rotate, function(attr, action, newVal, oldVal) {

            WatchJS.noMore = true; //prevent invoking watcher in this scope
            this.x = 0;
            this.y = 0;
            this.z = 0;

//            var transform = 'translate(-50%, -50%),  scaleX(1), scaleY(1),  scaleZ(1),  rotateZ(0deg),  rotateY(0deg),  rotateX(0deg), \n\
//                 translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px)';
//            //console.log('transform :', transform);
//            $("#slideArea>div").css({'transform': transform});
//            $("#slideArea").css({'transform': transform});


            //magouille qui fera fonctionner
            var dico = getTrans3D($('#slideArea >'));
            var i;
            switch (attr) {
                case 'x':
                    i = 'X';
                    break;
                case 'y':
                    i = 'Y';
                    break;
                case 'z':
                    i = 'Z';
                    break;

            }
            dico['rotate' + i] += newVal;

            setTrans3D(dico);
            //console.log(dico);

        });

    }
});