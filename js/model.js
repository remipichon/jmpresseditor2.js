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
        console.log('warning : bad function call (callModel instead of callModelGui), redirectinnf proceded');
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
        new Text($target, {properties: {hierarchy: 'H1Text'}});
//        console.log('new text H1');
    } else if (objectEvent.action === 'createH2Text') {
        new Text($target, {properties: {hierarchy: 'H2Text'}});
//        console.log('new text');
    } else if (objectEvent.action === 'createH3Text') {
        new Text($target, {properties: {hierarchy: 'H2Text'}});
//        console.log('new text');
    } else if (objectEvent.action === 'createBodyText') {
        new Text($target, {});
//        console.log('new text');
    } else if (objectEvent.action === 'createImage') {
        new Image($target, {source: objectEvent.source});
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
                    createComposant(objectEvent.matricule, objectEvent);
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


//function test(){
function testcos() {
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
    while (i < 100) {

        //calcul de la position sur la fonction

        //verification de la distance minimum
        while (Math.sqrt(Math.pow((X - prevX), 2) + Math.pow((Y - prevY), 2)) < 1000) {
            X = X + 100;
            Y = 3000 * Math.cos(X / 1000);
            console.log(X, Y, Math.sqrt(Math.pow((X - prevX), 2) + Math.pow((Y - prevY), 2)));
            //alert( X+' '+ Y+' '+Math.sqrt(  Math.pow((X-prevX),2) + Math.pow((Y-prevY),2) ) );

        }


        truc.push([X, Y]);

        var slide = new Slide({
            pos: {
                x: X,
                y: Y,
                z: Z
            },
            rotate: {
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



function testCircle() {
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
    while (i < 100) {



        //calcul de la position autour du cercle 
        var alphaRad = alpha * Math.PI / 180;
        X = Math.sin(alphaRad) * r;
        Y = Math.cos(alphaRad) * r;

        //calcul de la rotation en Z
//        var signeX = X / Math.abs(X);
//        var a = 2*X / Math.sqrt( Math.pow(r,2) - Math.pow(X,2) ); //coef directeur de la tangent
//        
//        beta = Math.acos(   signeX / Math.sqrt(  Math.pow(a,2) + 1  )   );
////        beta = Math.atan( coef * 2*X / Math.sqrt( Math.pow(r,2) - Math.pow(X,2) ) ) * 180/ Math.PI ;
//        RZ = beta * 180/Math.PI;
//        truc.push(beta);


        var slide = new Slide({
            pos: {
                x: X,
                y: Y,
                z: Z
            },
            rotate: {
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
        if (r < limite) {
            smaller = false;
//            r = limite + 10;
        }
        console.log('RAYON             ', r);

        alpha += 20; //en degré
        i++;
    }


}


function test3() {
    var i = 0;
    var X = 0;
    var Y = 0;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;

    while (i < 10) {

        var slide = new Slide({
            pos: {
                x: X,
                y: Y,
                z: Z
            },
            rotate: {
                x: RX,
                y: RY,
                z: RZ
            }
        });
        Y += 1000;
        RY += 45;
        i++;
    }
}
/*
 * 1
 *      1.1
 *          content
 *      1.2
 *          content
 * 2
 *      2.1
 *          content
 *      2.2
 *          2.2.1
 *              content
 *          2.2.2
 *              content
 * 3
 *       content
 *              
 * 
 * 
 * 
 */
 
 /*
 *  test from http://cameronspear.com/blog/animating-translate3d-with-jquery/
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
            dico.translate3d[0] = translations.x;
            dico.translate3d[1] = translations.y;
            dico.translate3d[2] = translations.z;
            

            $this.css({ 
                transitionDuration: opt.duration + 'ms',
                transitionTimingFunction: opt.easing,
                transform: "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") translate3d(0px,0px,0px) scaleX(1) scaleY(1) scaleZ(1) rotateZ(" + dico.rotateZ + "deg) rotateY(" + dico.rotateY + "deg) rotateX(" + dico.rotateX + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)"
    
//                transform: 'translate3d(' + translations.x + 'px, ' + translations.y + 'px, ' + translations.z + 'px)'
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
 
 


function dynamicTest() {
    //au départ, on cache toutes les slides
   $('.slide').each(function() {
       $(this).addClass('hidden');
   });
   
   //mais on affiche les premiers titres
   $('#tree').children('ol').children().each(function(){
      $('#'+$(this).attr('matricule')).removeClass('hidden'); 
   });
    
    //au depart tout le plan est en 'futur'
    $('#tree li').each(function() {
       $(this).addClass('li-slide'); 
       $(this).addClass('future-slide'); 
    });
    
    //au depart tous les titres sont au niveau de leur grande soeur
    $('#tree li').each(function(){
       if( $(this).attr('type') === 'title' ){
           
           var $slideRef = $('#'+$(this).attr('matricule'));
           var dicoRef = getTrans3D($slideRef);
           
           $(this).siblings().each(function(){
               var $slide = $('#'+$(this).attr('matricule'));
               var dico = getTrans3D($slide);
//               console.log($slideRef,dicoRef,$slide,dico);
               dico.translate3d[2] = dicoRef.translate3d[2];
               setTrans3D(dico,$slide);
           });
       } 
    });



    $(document).on('keypress', function(event) {

        if (event.which == 32) { //je n'ai pu récupérer que l'espace
            
           /*
             * each time space bar is pressed on cherche la slide qui a la classe 'active'
             */
            var currentMatricule = $('#slideArea').attr('class').split(' ')[0].replace('step-', '');
            var currentSlide = $('#'+currentMatricule);
            var liCurrent = $('#tree #li_' + currentMatricule);
            //petit effet sur le tree 
            $('.present-slide').removeClass('present-slide').addClass('past-slide');
            liCurrent.removeClass('future-slide').addClass('present-slide');

            //on cache les filles et leurs filles (et ainsi de suite) de ses soeurs
            //pour effectuer le fadeout plus tôt, sur l'arrivée à un overview s'il y en a un
            if( currentSlide.hasClass('overview') ) var aliCurrent = $('#tree #li_'+currentSlide.next().attr('matricule')); //on recupère le matricule de la slide suivant le matricule et on recupere la li correspondante
            else var aliCurrent = liCurrent;
            
            aliCurrent.siblings().each(function() {      //toutes les soeurs
                var allChildren = getChildren($(this), []);  // on recupere un tableau des matricules de toutes les filles
                for (var child in allChildren) {
                    var matriculeChild = allChildren[child];
                    //$('#'+matriculeChild).addClass('hidden');
                    $('#'+matriculeChild).fadeOut(1600);
                }
            });




            /*   affiche certaines slides */
            //ses soeurs
            liCurrent.siblings().each(function() {
                var matricule = $(this).attr('matricule'); //on recuperer le matricule stocké dans la li
//                $('#' + matricule).removeClass('hidden');     //on agit sur la slide qui a ce matricule
                $('#' + matricule).fadeIn(1600);           //on agit sur la slide qui a ce matricule
            });
            
            //ses filles directes
            $(liCurrent.children('ol')[0]).children().each(function() {
                var matricule = $(this).attr('matricule');
//                $('#' + matricule).removeClass('hidden');
                $('#' + matricule).fadeIn(1600);
            });

            //elle meme
//            $('#' + currentMatricule).removeClass('hidden');
            $('#' + currentMatricule).fadeIn(1600);
            
            
            /* mise à niveau des petites soeurs sur la petite soeur de la current*/
            var littleHilly = $('#'+liCurrent.next().attr('matricule'));
            var dicoRef = getTrans3D(littleHilly);
            $('#tree #li_' + currentMatricule +' ~').each(function(){ //pour obtenir les next siblings de la current li
               var $slide = $('#'+$(this).attr('matricule'));
               var dico = getTrans3D($slide);
//               console.log(littleHilly,dicoRef.translate3d,$slide,dico.translate3d);
//                dico.translate3d[2] = littleHilly.attr('data-z');
                 $slide.translate3d({
                     x:parseInt($slide.attr('data-x')),//-700,
                     y:parseInt($slide.attr('data-y')),//-600 ,
                     z:littleHilly.attr('data-z')
                     },1000);
//                setTrans3D(dico,$slide);
           });
        }
    });



}



//function automaticDynamic(){
function test() {
    var cranY = 1000;
    var cranZ = -1000;
    var cranX = 1200;


    new Slide({pos: {x: 0, y: 0, z: 0}, type: 'overview', scale: 2});
//1    
    var slide1 = new Slide({pos: {x: -1500, y: 0, z: 0}});
    new Text(slide1.matricule, {properties: {hierachy: 'H1Text', content: '1'}});

    var nbSoeur = 3;
    new Slide({pos: {x: slide1.pos.x + (nbSoeur - 1) * cranX / 2, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide11 = new Slide({pos: {x: slide1.pos.x, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}});
    new Text(slide11.matricule, {properties: {hierachy: 'H1Text', content: '1.1'}});
    var slide11content = new Slide({pos: {x: slide11.pos.x, y: slide11.pos.y, z: slide11.pos.z + cranZ * 2}});
    new Text(slide11content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    new Slide({pos: {x: slide11.pos.x + cranX + (nbSoeur - 2) * cranX / 2, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide12 = new Slide({pos: {x: slide11.pos.x + cranX, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}});
    new Text(slide12.matricule, {properties: {hierachy: 'H1Text', content: '1.2'}});
    var slide12content = new Slide({pos: {x: slide12.pos.x, y: slide12.pos.y, z: slide12.pos.z + cranZ * 2}});
    new Text(slide12content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide13 = new Slide({pos: {x: slide12.pos.x + cranX, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}});
    new Text(slide13.matricule, {properties: {hierachy: 'H1Text', content: '1.3'}});
    var slide13content = new Slide({pos: {x: slide13.pos.x, y: slide13.pos.y, z: slide13.pos.z + cranZ * 2}});
    new Text(slide13content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});


    new Slide({pos: {x: 750, y: 0, z: 0}, type: 'overview', scale: 2});

//2   
    var slide2 = new Slide({pos: {x: 0, y: 0, z: 0}});
    new Text(slide2.matricule, {properties: {hierachy: 'H1Text', content: '2'}});

    var nbSoeur = 2;
    new Slide({pos: {x: slide2.pos.x + (nbSoeur - 1) * cranX / 2, y: slide2.pos.y + cranY, z: slide2.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide21 = new Slide({pos: {x: slide2.pos.x, y: slide2.pos.y + cranY, z: slide2.pos.z + cranZ}});
    new Text(slide21.matricule, {properties: {hierachy: 'H1Text', content: '2.1'}});
    var slide21content = new Slide({pos: {x: slide21.pos.x, y: slide21.pos.y, z: slide21.pos.z + cranZ * 2}});
    new Text(slide21content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide22 = new Slide({pos: {x: slide21.pos.x + cranX, y: slide2.pos.y + cranY, z: slide2.pos.z + cranZ}});
    new Text(slide22.matricule, {properties: {hierachy: 'H1Text', content: '2.2'}});

    var nbSoeur = 2;
    new Slide({pos: {x: slide22.pos.x + (nbSoeur - 1) * cranX / 2, y: slide22.pos.y + cranY, z: slide22.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide221 = new Slide({pos: {x: slide22.pos.x, y: slide22.pos.y + cranY, z: slide22.pos.z + cranZ}});
    new Text(slide221.matricule, {properties: {hierachy: 'H1Text', content: '2.2.1'}});
    var slide221content = new Slide({pos: {x: slide221.pos.x, y: slide221.pos.y, z: slide221.pos.z + cranZ * 2}});
    new Text(slide221content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide222 = new Slide({pos: {x: slide221.pos.x + cranX, y: slide22.pos.y + cranY, z: slide22.pos.z + cranZ}});
    new Text(slide222.matricule, {properties: {hierachy: 'H1Text', content: '2.2.2'}});
    var slide222content = new Slide({pos: {x: slide222.pos.x, y: slide222.pos.y, z: slide222.pos.z + cranZ * 2}});
    new Text(slide222content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});


//3    
    var slide3 = new Slide({pos: {x: 1500, y: 0, z: 0}});
    new Text(slide3.matricule, {properties: {hierachy: 'H1Text', content: '3'}});
    var slide3content = new Slide({pos: {x: slide3.pos.x, y: slide3.pos.y, z: slide3.pos.z + cranZ * 2}});
    new Text(slide3content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});






}







function automaticEditor() {
//function test() {



    var slide = new Slide({pos: {
            x: 1500,
            y: 0,
            z: 0
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 0,
            y: 0,
            z: 0
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '1'}});

    var slide = new Slide({pos: {
            x: 0,
            y: 1000,
            z: 0
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: -600,
            y: 1000,
            z: 0
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '1.1'}});
    var slide = new Slide({pos: {
            x: -600,
            y: 2000,
            z: 0
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 600,
            y: 1000,
            z: -2000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '1.2'}});
    var slide = new Slide({pos: {
            x: 600,
            y: 2000,
            z: -2000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 2200,
            y: 0,
            z: -4000
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 1500,
            y: 0,
            z: -4000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2'}});

    var slide = new Slide({pos: {
            x: 1100,
            y: 1000,
            z: -4000
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 600,
            y: 1000,
            z: -4000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.1'}});
    var slide = new Slide({pos: {
            x: 600,
            y: 2000,
            z: -4000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 1800,
            y: 1000,
            z: -6000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.2'}});

    var slide = new Slide({pos: {
            x: 1800,
            y: 2000,
            z: -6000
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 1200,
            y: 2000,
            z: -6000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.2.1'}});
    var slide = new Slide({pos: {
            x: 1200,
            y: 3000,
            z: -6000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 2400,
            y: 2000,
            z: -8000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.2.2'}});
    var slide = new Slide({pos: {
            x: 2400,
            y: 3000,
            z: -8000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});


    var slide = new Slide({pos: {
            x: 3000,
            y: 0,
            z: -10000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '3'}});
    var slide = new Slide({pos: {
            x: 3000,
            y: 1000,
            z: -10000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});
















}

//function test() {
function test2() {
    //differents moyen de créer une slide
    //juste avec les coord
    //$('#slideArea>').html('');
    var X = 0;
    var Y = 0;
    var I = 0;
    var slide = new Slide({pos: {x: X, y: Y, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I}});
    var slide = new Slide({pos: {x: X, y: Y + 1000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 2}});
    var slide = new Slide({pos: {x: X + 1000, y: Y, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 4}});
    var slide = new Slide({pos: {x: X + 1000, y: Y + 1000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 6}});
    var slide = new Slide({pos: {x: X + 1000, y: Y + 2000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 8}});
    var slide = new Slide({pos: {x: X + 1000, y: Y + 3000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 10}});


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