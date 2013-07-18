/* 
 * Contient l'ensemble des outils communs Ã  elementTools et documentTools
 */



/* ======================================================================================
 * position de l'event (souris) dans le monde des slides  (real to virtual)
 * argument(s) : *event (souris)
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getVirtualCoord(event, $objet) {   
//    console.log("entree getvirtual");
//    var heightSlide = 700; //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ãƒ l'ÃƒÂ©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight


    //var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000); //MaxVirtualHeight //prise en compte deu zoom
    // var scale = ($slideArea.hasClass("step"))? parseInt(parseFloat($slideArea.css("perspective")) / 1000) : 1;
    //scale = $objet.attr("data-scale");
    //console.log($qui);
    var dico = getTrans3D();


    var scale = Math.abs(dico.translate3d[2] / $objet.attr('data-z'))   * 1/1.18;
    //console.log("scale "+scale);


//    console.log("scale " + scale + " " + parseFloat($slideArea.css("perspective")) + " " + $objet.attr("data-scale"));
    var MVH = scale *  700;//$objet.height();//parseFloat($slideArea.css("perspective"));//heightSlide * scale; //MaxVirtualHeight //prise en compte deu zoom
    //console.log( MVH + "  "+ scale + "  " + $objet.attr('data-z') + "  " + $objet.height() );
    var RTop = event.pageY; //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VTop = MVH * RTop / MRH; //prise en compte de la proportion
    VTop = Math.round(VTop);

    var MRL = window.innerWidth; //MaxRealWidth
    var ratio = MRL / MRH; //rapport de zone d'ÃƒÂ©cran du navigateur
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

/*
 * getVirtualCoord fonctionne lorsqu'il s'agit d'un deplacement, getVirtualPos fonctionne pour la creation
 * @param {type} event
 * @param {type} $objet
 * @returns {undefined}
 */
function getVirtualPos(event, $objet) {
    //le code à factoriser se trouve dans createSlide et createText
    
}
//
//
///* ======================================================================================
// * position de l'element dans le monde reel (de l'ÃƒÂ©cran du navigateur (virtualto real)
// * argument(s) : *element
// *               *div qui contient les slides (en object Jquery)
// * return : Array[ virtualTop, virtualLeft]
// * callBy : draggableKiki
// * ====================================================================================== */
//function getRealCoord(element, $slideArea) {        //semble bien fonctionner
//    //console.log("element select :" + element.html());
//
//    var heightSlide = 700;      //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ãƒ  l'ÃƒÂ©cran, lorsque zoomable fonctionnera il faudra un autre repere
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
//    var ratio = MRL / MRH;  //rapport de zone d'ÃƒÂ©cran du navigateur
//    var MVL = ratio * MVH;    //MaxVirtualWidth
//    var VLeft = element.offset().left * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //RealTop (de la souris)
//
//    //VirtualTop (position dans le monde des slides)
//    var RLeft = MRL * VLeft / MVL; //prise en compte de la proportion
//    RLeft = Math.round(RLeft);  //prise en compte du zoom
//
//
//    //console.log("position de element calculÃƒÂ© ds l'ÃƒÂ©cran MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop + "     fameux coef : " + parseInt(parseFloat($slideArea.css('perspective')) / 1000));
//    //console.log("position de element calculÃƒÂ© ds l'ÃƒÂ©cran MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);
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
 * obtenir la distance depuis un evenement (event stockÃ© dans .data() de chaque element)
 * @param {type} event
 * @returns {getDistanceMouseMove.distance}
 */
function getDistanceMouseMove(event) {

    //recupÃ©ration de dÃ©placement de la souris
    var distance = {//element diffÃ©rentiel reel
        x: event.pageX - $("#slideArea").data('event').pos.x,
        y: event.pageY - $("#slideArea").data('event').pos.y
    };
    return distance;
}




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

