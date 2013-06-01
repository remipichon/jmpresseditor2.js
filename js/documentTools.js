/*
 * contient les outils permettant le deplacement (navigable) et le zoom au sein de la présentation
 * 
 */


/*
 * ce listener contient une ébauche de gestion du déplacement en 3d, l'ensemble est commenté car ne fonctionne pas
 * asser bien pour être exploiter. Il semble que les simples projections ne sont pas assez puissantes, il faudra implémenter
 * 
 */
$(document).on('mousedown', function(event) {           
    
    //init du posData qui permet de stocker les caractéristiques de l'objet lors du mousedown
    $("#slideArea").data('event', {
        pos: {
            x: event.pageX,
            y: event.pageY
        }
    });


    if (event.which === 1) {
        $(this).on('mousemove.moveView', function(event) {

            //recupération des attributs de positionnement de la view
            var transform = getTrans3D();
            var alpha = transform.rotateX * 2 * Math.PI / 360;
            var beta = transform.rotateY * 2 * Math.PI / 360;
            var gamma = transform.rotateZ * 2 * Math.PI / 360;

            //recupération de déplacement de la souris
            var dReal = {//element différentiel reel
                x: event.pageX - $("#slideArea").data('event').pos.x,
                y: event.pageY - $("#slideArea").data('event').pos.y
            };

            //calcul du déplacement dans le monde des slides
            /////////////////////////////////////////// fonctione 
            //////////////////////////////////////////dx    dy
            //////////////////////////////////////Z    x     x
            //////////////////////////////////////Y    x(parasité par virtuelX)     v
            //////////////////////////////////////X    v     x(pe bon)
            var scale = -1;
            /*  pour le rotate en Z
             var dVirtuel = {//element différentiel virtuel
             x: (dReal.x*Math.cos(gamma) + dReal.y*Math.sin(gamma) )* scale,
             y: (dReal.y*Math.cos(gamma) - dReal.x*Math.sin(gamma) )* scale,
             z: 0
             };
             */

            /*  //pour le rotate en x
             var dVirtuel = {
             x: ( dReal.x )* scale,
             y: ( dReal.y*Math.cos(alpha) )*scale,               
             z: ( -dReal.y*Math.sin(alpha) )* scale
             };*/

            //pour le rotate en Y
//            var dVirtuel = {
//                x: dReal.x*Math.cos(beta) * scale ,
//                y: (dReal.y*Math.cos(beta) - dReal.y*Math.sin(beta))*scale,//+ dReal.x*Math.sin(beta),
//                z: dReal.x*Math.sin(beta)* scale                   
//            };

            var dVirtuel = {
                x: 0,
                y: 0,
                z: 0
            };

            //pour le rotate en Z
            dVirtuel.x += dReal.x * Math.cos(gamma) + dReal.y * Math.sin(gamma);
            dVirtuel.y += dReal.y * Math.cos(gamma) - dReal.x * Math.sin(gamma);
            dVirtuel.z += 0;

            //pour le rotate en x
            dVirtuel.x += dReal.x;
            dVirtuel.y += dReal.y * Math.cos(alpha);
            dVirtuel.z += -dReal.y * Math.sin(alpha);

            //pour le rotate en Y
            dVirtuel.x += dReal.x * Math.cos(beta);
            dVirtuel.y += dReal.y * Math.cos(beta) - dReal.y * Math.sin(beta);
            dVirtuel.z += dReal.x * Math.sin(beta);

            var dVirtuel = {
                x: 0,
                y: 0,
                z: 0
            };

            dVirtuel.x += dReal.x * (Math.cos(gamma) + Math.cos(beta)) + dReal.y * Math.sin(gamma);
            dVirtuel.y += dReal.y * (Math.cos(gamma) + Math.cos(alpha) + Math.cos(beta) - Math.sin(beta)) - dReal.x * Math.sin(gamma);
            dVirtuel.z += dReal.x * Math.sin(beta) - dReal.y * Math.sin(alpha);
            //
            dVirtuel.x *= scale;
            dVirtuel.y *= scale;
            dVirtuel.z *= scale;

            transform.translate3d[0] = parseInt(transform.translate3d[0] - dVirtuel.x);
            transform.translate3d[1] = parseInt(transform.translate3d[1] - dVirtuel.y);
            transform.translate3d[2] = parseInt(transform.translate3d[2] - dVirtuel.z);

            //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
            $("#slideArea").data('event').pos.x = event.pageX;
            $("#slideArea").data('event').pos.y = event.pageY;

            //deplacement de la zone de vue
            setTrans3D(transform);
        });
    }


    if (event.which === 3) {
        $(this).on('mousemove.rotateView', function(event) {

            //recupération des attributs de positionnement de la view
            var transform = getTrans3D();
            var alpha = transform.rotateX;
            var beta = transform.rotateY;
            var gamma = transform.rotateZ;

            //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
            $("#slideArea").data('event').pos.x = event.pageX;
            $("#slideArea").data('event').pos.y = event.pageY;

            //deplacement de la zone de vue
            setTrans3D(transform);

        });
    }


    $(this).on("mouseup", function() {
        $('body').css('cursor', 'default');
        $(this).off(".moveView");
        $(this).off(".rotateView");
    });
});

/*
 * Zoom en Z
 */
$(document).mousewheel(function(event, delta, deltaX, deltaY) {
    var transform = getTrans3D();
    transform.translate3d[2] = transform.translate3d[2] + deltaY * 10;
    setTrans3D(transform);
});



