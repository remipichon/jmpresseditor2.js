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





$(document).keypress(function(event) {
    console.log(event.which);

    var objEvt = new ObjectEvent({
        matricule: '',
        action: '',
        event: {
        }
    });

    //creation slide
    switch (event.which) {
        //creation slide
        case 106 :
            objEvt.action = 'createSlide';
            break;
        case 107 :
            objEvt.action = 'createText';
            break;

    }
    

    callModelGUI(objEvt);




//        if (event.which === 116) {
//            var objetEvent = {
//                matricule : 'createTexte',
//                action : 'keyboard',            
//                event : {
//                    type : 's'                
//                }           
//
//            };
//
//            callModel(objetEvent);
//            
//        }


});