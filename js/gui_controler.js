/* 
 * Recupère objEvt et, en fonction de ses paramètres, effectue le traitement adéquat directement sur les instances des 
 * classes composants (Slide, Texte et Image héritées de Element
 * 
 * Contient : 
 *      findObjectOfComposant(matricule)   return object
 *      callModel(objectEvent)
 *      createComposant($target, objectEvent)    appelé une fois la Slide cible sélectionnée
 *      callModelGUI(objectEvent)
 *      test
 *          
 */


/* Controler de slideshowEditor
 * permet de diriger les interactions avec les composants
 * deplacement, rotation, édition (texte, image)
 * 
 */
function callModel(objectEvent) {
//    //console.log(objectEvent);

    if (objectEvent.matricule === '' || objectEvent.matricule === 'document') {
        //creation de composant
        //console.log('warning : bad function call (callModel instead of callModelGui), redirectinnf proceded');
        callModelGUI(objectEvent);
    } else {
        //modification de composant
        var composant = findObjectOfComposant(objectEvent.matricule);
//        //console.log('avant', composant.show());
        if (objectEvent.action === 'move') {
            var attr;
            var val = objectEvent.event.cran;
            switch (objectEvent.event.direction) {
                case 'z+':
                    attr = 'z';
                    val = val;
                    break;
                case 'z-':
                    attr = 'z';
                    val = -val;
                    break;
                case 'x+':
                    attr = 'x';
                    val = val;
                    break;
                case 'x-':
                    attr = 'x';
                    val = -val;
                    break;
                case 'y+':
                    attr = 'y';
                    val = val;
                    break;
                case 'y-':
                    attr = 'y';
                    val = -val;
                    break;
            }

            composant.pos[attr] += val;
//            //console.log('après', composant.show());


        } else if (objectEvent.action === 'rotate') {
            var attr;
            var val = objectEvent.event.cran;
            switch (objectEvent.event.direction) {
                case 'z+':
                    attr = 'z';
                    val = val;
                    break;
                case 'z-':
                    attr = 'z';
                    val = -val;
                    break;
                case 'x+':
                    attr = 'x';
                    val = val;
                    break;
                case 'x-':
                    attr = 'x';
                    val = -val;
                    break;
                case 'y+':
                    attr = 'y';
                    val = val;
                    break;
                case 'y-':
                    attr = 'y';
                    val = -val;
                    break;
            }

            composant.rotate[attr] += val;
//            //console.log('après', composant.show());


        }

    }



}
/* Class gerant la navigation en agissant sur l'attribut CSS transform
 * 
 */
//transform3D = new Transform3D();

/*
 * probleme d'asynchronisme lors de la selection de la slide cible avec le clavier
 * du coup, petite magouille, createComposant est appellée une fois la slide selectionnée
 * 
 */
function createComposant($target, objectEvent) {
    if (objectEvent.action === 'createH1Text') {
        new Text($target, {properties: {hierarchy: 'H1Text'}});
//        //console.log('new text H1');
    } else if (objectEvent.action === 'createH2Text') {
        new Text($target, {properties: {hierarchy: 'H2Text'}});
//        //console.log('new text');
    } else if (objectEvent.action === 'createH3Text') {
        new Text($target, {properties: {hierarchy: 'H2Text'}});
//        //console.log('new text');
    } else if (objectEvent.action === 'createBodyText') {
        new Text($target, {});
//        //console.log('new text');
    } else if (objectEvent.action === 'createImage') {
        new Image($target, {source: objectEvent.source});
//        //console.log('new ');
    }
}




/* Controler de gestion de l'interface
 * navigable, bouton creation
 * 
 */
function callModelGUI(objectEvent) {
    
    //en attente de trouver une meilleure méthode pour récupérer la slide destination d'un element
    if (objectEvent.action === 'createImage' || objectEvent.action === 'createH3Text' || objectEvent.action === 'createH2Text' || objectEvent.action === 'createH1Text' || objectEvent.action === 'createBodyText') {
        if (objectEvent.action === 'createImage') {  //infos suplémentaires propre aux images
            var source = prompt('Sélectionner l\'adresse de votre image (adresse fichier, ou adresse url', 'images/bleu_twitter.png');
            objectEvent.source = source;
        }

        //s'il y a un matricule
        if (objectEvent.matricule !== '') {
            //si ce matricule existe
            var slide = findObjectOfComposant(objectEvent.matricule);
            if (typeof slide !== 'undefined') { // pas de !== ivi  
                //si le composant est une slide
                if (slide.type === 'slide') {
                    //alors on peut ajouter directement l'element
                    createComposant(objectEvent.matricule, objectEvent);
                    return;
                }
            }
        }
        var $target = selectSlide(createComposant, objectEvent);
        //console.log('after selectc', $target);
        return;
    }


//    //console.log(objectEvent);
    if (objectEvent.action === 'createSlide') {
        new Slide();
        //console.log('new slide');
    }
//    else if (objectEvent.action === 'createH1Text') {                 //voir fonction createComposant
//        new Text({properties: {hierarchy: 'H1Text'}}, $target);
//        //console.log('new text H1');
//    } else if (objectEvent.action === 'createH2Text') {
//        new Text({properties: {hierarchy: 'H2Text'}}, $target);
//        //console.log('new text');
//    } else if (objectEvent.action === 'createH3Text') {
//        new Text({properties: {hierarchy: 'H2Text'}}, $target);
//        //console.log('new text');
//    } else if (objectEvent.action === 'createBodyText') {
//        new Text({}, $target);
//        //console.log('new text');
//    } 
    else if (objectEvent.action === 'move' || objectEvent.action === 'navigable') {
        var attr;
        var val = objectEvent.event.cran * 10;
        switch (objectEvent.event.direction) {
            case 'z+':
                attr = 'z';
                val = val;
                break;
            case 'z-':
                attr = 'z';
                val = -val;
                break;
            case 'x+':
                attr = 'x';
                val = val;
                break;
            case 'x-':
                attr = 'x';
                val = -val;
                break;
            case 'y+':
                attr = 'y';
                val = val;
                break;
            case 'y-':
                attr = 'y';
                val = -val;
                break;
        }


        transform3D.pos[attr] = val;

        //console.log('navigable');

    } else if (objectEvent.action === 'rotate') {
        var attr;
        var val = objectEvent.event.cran;
        switch (objectEvent.event.direction) {
            case 'z+':
                attr = 'z';
                val = val;
                break;
            case 'z-':
                attr = 'z';
                val = -val;
                break;
            case 'x+':
                attr = 'x';
                val = val;
                break;
            case 'x-':
                attr = 'x';
                val = -val;
                break;
            case 'y+':
                attr = 'y';
                val = val;
                break;
            case 'y-':
                attr = 'y';
                val = -val;
                break;
        }

        transform3D.rotate[attr] = val;

        //console.log('rotate');
    }

}



/* selection d'une slide par click, 
 *  
 * @returns {string}
 */
function selectSlide(callback, param1, composant) {
    $('#sidebar').parent().addClass("buttonclicked");   //pour empecher le joystick d'apparaitre
    alert('Il faut selectionner une slide');
    $('.slide').one('click', function(event) {
        $('.buttonclicked').removeClass("buttonclicked");       //pour redonner le droit au joystick d'apparaitre
        var slide = $(this).attr('matricule');
        alert('slide selectionnée' + slide);
        if (typeof callback !== 'undefined') {
            callback(slide, param1, composant);
            ////console.log('in select', slide);
            return slide;
        } else {
            ////console.log('in select', slide);
            return slide;
        }
    });
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