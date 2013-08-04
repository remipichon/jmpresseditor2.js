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


/* trouve l'object en fonction du matricule (que ce soit une slide ou un composant)
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

    console.log('Error : matricule doesn\'t existe');
    return false;
}


/* Controler de slideshowEditor
 * permet de diriger les interactions avec les composants
 * deplacement, rotation, édition (texte, image)
 * 
 */
function callModel(objectEvent) {
    console.log(objectEvent);

    if (objectEvent.matricule === '' || objectEvent.matricule === 'document') {
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
        new Image({source: objectEvent.source}, $target);
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

        //s'il y a un matricule
        if (objectEvent.matricule !== '') {
            //si ce matricule existe
            var slide = findObjectOfComposant(objectEvent.matricule);
            if (slide != false) { // pas de !== ivi  
                //si le composant est une slide
                if (slide.type === 'slide') {
                    //alors on peut ajouter directement l'element
                    createComposant(objectEvent.matricule,objectEvent);                   
                    return;
                }
            }
        }
        var $target = selectSlide(createComposant, objectEvent);
        console.log('after selectc', $target);
        return;
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


function test(){
//function testcos(){
    var i = 0;
    var X = 1000;
    var Y = 1000;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;
    var r = 5000; //rayon
    var alpha = 0; //cran de position des slides sur le cercle      //en degré
    var beta;       //orientation de la slide (en z) pour qu'elle soit tangente au cercle  // en degré
    
    var prevX = 0;
    var prevY = 0;
    
   truc = [];
    while( i < 100){
        
        //calcul de la position sur la fonction
        
        //verification de la distance minimum
        while( Math.sqrt(  Math.pow((X-prevX),2) + Math.pow((Y-prevY),2) ) < 1000  ){
             X = X + 100;
             Y = 3000*Math.cos(X/1000);
             console.log(X,Y,Math.sqrt(  Math.pow((X-prevX),2) + Math.pow((Y-prevY),2) ));
             //alert( X+' '+ Y+' '+Math.sqrt(  Math.pow((X-prevX),2) + Math.pow((Y-prevY),2) ) );
             
        }
        
              
        truc.push([X,Y]);
        
        var slide = new Slide({
            pos : {
                x: X,
                y: Y,
                z: Z
            },
            rotate : {
                x: RX,
                y: RY,
                z: RZ
            }
        });
        
        
        Z = Z - 1000;
        prevX = X;
        prevY = Y;
        i++;
    }
    
}



function testCircle(){
//function test(){
     var i = 0;
    var X = 0;
    var Y = 0;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;
    var r = 5000; //rayon
    var alpha = 0; //cran de position des slides sur le cercle      //en degré
    var beta;       //orientation de la slide (en z) pour qu'elle soit tangente au cercle  // en degré
    
    var smaller = true;
   truc = [];
    while( i < 100){
        
        
        
        //calcul de la position autour du cercle 
        var alphaRad = alpha*Math.PI/180;
        X = Math.sin(alphaRad)*r;
        Y = Math.cos(alphaRad)*r;
        
        //calcul de la rotation en Z
//        var signeX = X / Math.abs(X);
//        var a = 2*X / Math.sqrt( Math.pow(r,2) - Math.pow(X,2) ); //coef directeur de la tangent
//        
//        beta = Math.acos(   signeX / Math.sqrt(  Math.pow(a,2) + 1  )   );
////        beta = Math.atan( coef * 2*X / Math.sqrt( Math.pow(r,2) - Math.pow(X,2) ) ) * 180/ Math.PI ;
//        RZ = beta * 180/Math.PI;
//        truc.push(beta);
       
        
        var slide = new Slide({
            pos : {
                x: X,
                y: Y,
                z: Z
            },
            rotate : {
                x: RX,
                y: RY,
                z: RZ
            }
        });
        
        Z = Z - 1000;
        if (smaller) {
            r = r - 300;
        } else {
            r = r + 300;           
        }
        var limite = 1000;
        if ( r < limite ){
            smaller = false;
//            r = limite + 10;
        }
        console.log('RAYON             ',r);
        
        alpha +=20; //en degré
        i++;
    }
    
    
}


function test3(){
    var i = 0;
    var X = 0;
    var Y = 0;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;
    
    while( i < 10){
        
        var slide = new Slide({
            pos : {
                x: X,
                y: Y,
                z: Z
            },
            rotate : {
                x: RX,
                y: RY,
                z: RZ
            }
        });
        Y += 1000;        
        RY +=45;
        i++;
    }
}

function test2() {
    //differents moyen de créer une slide
    //juste avec les coord
    //$('#slideArea>').html('');
    var X = 0;
    var Y = 0;
    var I = 0;
    var slide = new Slide({pos: {x: X, y: Y, z: 0}});
    new Text( {properties: { content: 'slide : '+I }},slide.matricule);
    var slide = new Slide({pos: {x: X, y: Y+1000, z: 0}});
    new Text( {properties: { content: 'slide : '+I+2 }},slide.matricule);
    var slide = new Slide({pos: {x: X+1000, y: Y, z: 0}});
    new Text( {properties: { content: 'slide : '+I+4 }},slide.matricule);
    var slide = new Slide({pos: {x: X+1000, y: Y+1000, z: 0}});
    new Text( {properties: { content: 'slide : '+I+6 }},slide.matricule);
    var slide = new Slide({pos: {x: X+1000, y: Y+2000, z: 0}});
    new Text( {properties: { content: 'slide : '+I+8 }},slide.matricule);
    var slide = new Slide({pos: {x: X+1000, y: Y+3000, z: 0}});
    new Text( {properties: { content: 'slide : '+I+10 }},slide.matricule);
  

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