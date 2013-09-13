








/* 
 * Gère l'édition de la présentation (des composants, après création) :
 *      handlerComposant : listener de hover et keyboard pour le deplatement/rotation des composants
 *      
 */



/*
 * call après l'insertion dans le DOM
 */
function handlerComposant($composant) {
    $composant.on('mouseenter', function(event) {
//        ('#sidebar:hover').length
        composantCatchEvent = true;
        event.stopPropagation();
        var $target = $(this);
        //console.log('hover', $target.attr('matricule'));


        //fire contenteditable
        if ($target.hasClass('texte')) {  //si c'est du texte on place un trigger pour rendre le contenu editable via un click

//            $target.on('click', function(){
//               //console.log('click texte');
//               $target.attr('contenteditable','true');
//               
//            });
            $target.children().one('click', lauchCK);
        }



        //fire keyboard event
        $(document).on('keypress.keySlide', function(event) {

            //console.log('key ', $(this).attr('id'));
            var matricule = $target.attr('matricule');
            var obj = findObjectOfComposant(matricule);



            var objEvt = new ObjectEvent({
                matricule: matricule,
                event: {
                }
            });
            switch (event.which) {
                //deplacement composant
                case 97:
                    objEvt.action = 'move';
                    objEvt.event.direction = 'z+';
                    break;
                case 122:
                    objEvt.action = 'move';
                    objEvt.event.direction = 'y-';
                    break;
                case 113:
                    objEvt.action = 'move';
                    objEvt.event.direction = 'x-';
                    break;
                case 115:
                    objEvt.action = 'move';
                    objEvt.event.direction = 'x+';
                    break;
                case 119:
                    objEvt.action = 'move';
                    objEvt.event.direction = 'y+';
                    break;
                case 120:
                    objEvt.action = 'move';
                    objEvt.event.direction = 'z-';
                    break;
                    
                   


                    //rotation composant
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
                case 'move':
                    if (obj.type === 'slide') {
                        objEvt.event.cran = 100;
                    } else {
                        objEvt.event.cran = 10;
                    }
                    break;
                case 'rotate' :
                    objEvt.event.cran = 10;
                    break;
            }


            callModel(objEvt);
            //console.log('key slide ', objEvt);
        });


    });

    $composant.mouseleave(function() {
        var $target = $(this);
        var matricule = $target.attr('matricule');
        $(document).off('.keySlide');
        //console.log('fin hover', $target.attr('matricule'));
        composantCatchEvent = false;


        if ($target.hasClass('texte') && $target.children().children('textarea').length !== 0) {  //si c'est du texte on place un trigger pour rendre le contenu editable via un click            

//            $target.attr('contenteditable', 'false');
            var $textarea = $(this).children().children('textarea');
            var txt = CKEDITOR.instances[$textarea.attr('id')].getData();
            //console.log('leave cke', txt);
            $(this).children().one('click', lauchCK);
            $(this).children().html(txt);

            
            var slideMother = getSlideMother(matricule);
            console.log('maj texte dans container', slideMother, matricule,txt);
            //mise à jour de l'objet dans le conteneur
            container.getSlide(slideMother).element[matricule].properties.content = txt;



        }
    });

}