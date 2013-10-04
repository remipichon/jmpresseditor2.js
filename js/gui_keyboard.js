/* 
 * gestion de la partie interface utilisateur de l'editeur (navigable, creation) :
 *      listerner keyboard :
 *          creation
 *          navigable
 *      class Transform3D
 *  
 */

 $(document).on('keypress',function(event){
    //si la souris est sur le body, et que le body, call keyboarGUI
    if( $('.slide:hover').length === 0 &&
            $('.sidebar:hover').length === 0 &&
            $('#topbar:hover').length === 0 && 
            $('.buttonclicked').length === 0 ){
        keyboardGUI(event);
    }
 });
    
function keyboardGUI(event) {

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
        case 42 :
            objEvt.action = 'createImage';
            break;
    }
    
    
  
    switch (event.which) {
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

}


