/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



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
        var composant = container.slide[objectEvent.matricule];
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

/* Controler de gestion de l'interface
 * navigable, bouton creation
 * 
 */
function callModelGUI(objectEvent) {;
    console.log(objectEvent)
    if (objectEvent.action === 'createSlide') {
        new Slide();
        console.log('new slide');
    } else if (objectEvent.action === 'createText') {
        new Text({}, '');  //Text by default
        console.log('new text');
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