/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * mapper keyboard
 * move
 * a 97
 * z 122
 * qs 113 115
 * w 119
 * x 120
 * 
 * et
 * 
 * rotate
 * r 114
 * t 116
 * fg 102 103
 * v 118
 * b 98
 * 
 * i : new slide
 */


/*
 * call après l'insertion dans le DOM
 */
function handlerComposant($composant) {
    $composant.on('mouseenter', function(event) {
        composantCatchEvent = true;
        event.stopPropagation();
        var $target = $(this);
        console.log('hover', $target.attr('matricule'));
        $(document).on('keypress.keySlide', function(event) {
            console.log('key ', $(this).attr('id'));
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
            console.log('key slide ', objEvt);
        });


    });
    
    $composant.mouseleave(function() {
        var $target = $(this);
        $(document).off('.keySlide');
        console.log('fin hover', $target.attr('matricule'));
        composantCatchEvent = false;
    });

}