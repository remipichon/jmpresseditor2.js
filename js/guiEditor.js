/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

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
            console.log('objectEvent');
        } else {
            console.log('objectEvent');
        }
    },
    destroy: function() {
        console.log('nothing to delete');
    }



});


Transform3D = Class.extend({
    init: function() {
        var transform = getTrans3D();
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
//            console.log('transform :', transform);
//            $("#slideArea>div").css({'transform': transform});
//            $("#slideArea").css({'transform': transform});


            //magouille qui fera fonctionner
            var dico = getTrans3D();
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
            console.log(dico);

        });


        watch(this.rotate, function(attr, action, newVal, oldVal) {

            WatchJS.noMore = true; //prevent invoking watcher in this scope
            this.x = 0;
            this.y = 0;
            this.z = 0;

//            var transform = 'translate(-50%, -50%),  scaleX(1), scaleY(1),  scaleZ(1),  rotateZ(0deg),  rotateY(0deg),  rotateX(0deg), \n\
//                 translate3d(' + this.x + 'px, ' + this.y + 'px, ' + this.z + 'px)';
//            console.log('transform :', transform);
//            $("#slideArea>div").css({'transform': transform});
//            $("#slideArea").css({'transform': transform});


            //magouille qui fera fonctionner
            var dico = getTrans3D();
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
            console.log(dico);

        });

    }
});


var composantCatchEvent = false;
//var documentCatchEvent = false;

$(document).keypress(function(event) {
    console.log(event.which);
    if (composantCatchEvent) {
        console.log('document capte event mais ne fait rien');
        return;
    }

    var objEvt = new ObjectEvent({
        matricule: '',
        action: '',
        event: {
            cran: 300 //puour le navigable
        }
    });


    switch (event.which) {
        //creation composant
        case 106 :
            objEvt.action = 'createSlide';
            break;
        case 107 :
            objEvt.action = 'createH1Text';
            break;
        case 108 :
            objEvt.action = 'createH2Text';
            break;
        case 109 :
            objEvt.action = 'createH3Text';
            break;
        case 249 :
            objEvt.action = 'createBodyText';
            break;

            //gestion navigation
            //deplacement      
        case 97:
            objEvt.action = 'navigable';
            objEvt.event.direction = 'z+';
            break;
        case 122:
            objEvt.action = 'navigable';
            objEvt.event.direction = 'y-';
            break;
        case 113:
            objEvt.action = 'navigable';
            objEvt.event.direction = 'x-';
            break;
        case 115:
            objEvt.action = 'navigable';
            objEvt.event.direction = 'x+';
            break;
        case 119:
            objEvt.action = 'navigable';
            objEvt.event.direction = 'y+';
            break;
        case 120:
            objEvt.action = 'navigable';
            objEvt.event.direction = 'z-';
            break;

            //rotation
            objEvt.event.cran = 10;
        case 114:
            objEvt.action = 'rotate';
            objEvt.event.direction = 'z+';
            break;
        case 102:
            objEvt.action = 'rotate';
            objEvt.event.direction = 'y-';
            break;
        case 118:
            objEvt.action = 'rotate';
            objEvt.event.direction = 'x-';
            break;
        case 116:
            objEvt.action = 'rotate';
            objEvt.event.direction = 'x+';
            break;
        case 103:
            objEvt.action = 'rotate';
            objEvt.event.direction = 'y+';
            break;
        case 98:
            objEvt.action = 'rotate';
            objEvt.event.direction = 'z-';
            break;

    }


    switch (objEvt.action) {
        case 'navigable':
            objEvt.event.cran = 100;
            break;
        case 'rotate' :
            objEvt.event.cran = 10;
            break;
    }


    callModelGUI(objEvt);

});