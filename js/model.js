/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/* trouve l'object en fonction du matricule (que ce soit une slide ou un composant
 * 
 * @type object composant
 */
function findObjectOfComposant(matricule) {

    if (typeof container.slide[matricule] === 'undefined') {   //si le matricule n'est pas celui d'une slide
        for (var slide in container.slide) {                //parcours des slides
            if (typeof container.slide[slide].element[matricule] === 'undefined') {
                console.log('pas dans la slide ', slide);
            } else {
                return container.slide[slide].element[matricule];  //si le matricule est un element de la slide, on return l'object complet
            }
        }
    } else {                                            //si le matricule est celui d'une slide
        return container.slide[matricule];
    }

    return 'Error : matricule doesn\'t existe';
}


/* Controler de slideshowEditor
 * permet de diriger les interactions avec les composants
 * deplacement, rotation, édition (texte, image)
 * 
 */
function callModel(objectEvent) {
    console.log(objectEvent);

    if (objectEvent.matricule === '') {
        //creation de composant
        console.log('warning : mauvais appel de fonction (callModel instead of callModelGui');
        callModelGUI(objectEvent);
    } else {
        //modification de composant
        var composant = findObjectOfComposant(objectEvent.matricule);
//        console.log('avant', composant.show());
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
//            console.log('après', composant.show());


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
//            console.log('après', composant.show());


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
        new Text({properties: {hierarchy: 'H1Text'}}, $target);
//        console.log('new text H1');
    } else if (objectEvent.action === 'createH2Text') {
        new Text({properties: {hierarchy: 'H2Text'}}, $target);
//        console.log('new text');
    } else if (objectEvent.action === 'createH3Text') {
        new Text({properties: {hierarchy: 'H2Text'}}, $target);
//        console.log('new text');
    } else if (objectEvent.action === 'createBodyText') {
        new Text({}, $target);
//        console.log('new text');
    } else if (objectEvent.action === 'createImage') {
        new Image({source:objectEvent.source}, $target);
//        console.log('new ');
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
        var $target = selectSlide(createComposant, objectEvent);
        console.log('after selectc', $target);
    }


//    console.log(objectEvent);
    if (objectEvent.action === 'createSlide') {
        new Slide();
        console.log('new slide');
    }
//    else if (objectEvent.action === 'createH1Text') {                 //voir fonction createComposant
//        new Text({properties: {hierarchy: 'H1Text'}}, $target);
//        console.log('new text H1');
//    } else if (objectEvent.action === 'createH2Text') {
//        new Text({properties: {hierarchy: 'H2Text'}}, $target);
//        console.log('new text');
//    } else if (objectEvent.action === 'createH3Text') {
//        new Text({properties: {hierarchy: 'H2Text'}}, $target);
//        console.log('new text');
//    } else if (objectEvent.action === 'createBodyText') {
//        new Text({}, $target);
//        console.log('new text');
//    } 
    else if (objectEvent.action === 'navigable') {
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


        transform3D.pos[attr] = val;

        console.log('navigable');

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

        console.log('rotate');
    }

}



function test() {
    //differents moyen de créer une slide
    //juste avec les coord
    new Slide({rotate: {x: 10, y: 5, z: 0}});
//    //avec coord et rotate
//    var s2 = new Slide({pos: {x: 900, y: 5, z: 0}});
////    s2.watch('pos', function(attribut, newVal, oldVal){
////       console.log(this, attribut, newVal, oldVal); 
////    });
//    //avec coord et texte (several)
//
    var e1 = new Text({pos: {x: 10}}, 'slide0');

    new Element({pos: {y: 300}}, 'slide0');
    new Text({properties: {content: 'test'}, pos: {y: 500}}, 'slide0');

//    new Image({pos: {y: 500}}, 'slide0');


    //s1.show();
    //s1.pos.x = 100;

//    container.slide['slide0'].show();
////    //watch des modifications
////    watch(container.slide['slide0'].pos, 'x', function(attr, action, newVal, oldVal) {
////        console.log('màj', this.matricule, ' propriété ', attr, ' avec ', newVal);
////    });
//     
//    
//    container.slide['slide1'].show();

}
;