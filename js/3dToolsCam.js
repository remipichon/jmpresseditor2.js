/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



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

    var prefix = (pfx('transform'));
    var trans = $("#slideArea>div")[0].style['' + prefix + ''].match(/.+?\(.+?\)/g);
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
function setTrans3D(dico) {
    //var transform = "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") rotateX(" + dico.rotateX + "deg) rotateY(" + dico.rotateY + "deg) rotateZ(" + dico.rotateZ + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)";
    var transform = "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") translate3d(0px,0px,0px) scaleX(1) scaleY(1) scaleZ(1) rotateZ(" + dico.rotateZ + "deg) rotateY(" + dico.rotateY + "deg) rotateX(" + dico.rotateX + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)";
    $("#slideArea>div").css({'transform': transform});
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

