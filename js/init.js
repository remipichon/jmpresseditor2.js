/* 
 * script qui lance l'editeur
 */


$(document).ready(function() {

    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================*/

    i = 1; // id unique des slides      -> utile pour conversion json <-> html
    j = 1; // id unique des éléments    

    // empêcher le parasitage de navigable par sortable
    $("#sortable").click(function(event) {
        event.stopPropagation();
    });

    // initialisation jmpress :
    $('#slideArea').jmpress({
//        viewPort: {
//            height: 1000       // permet d'avoir vue d'ensemble + large. Se déclenche que à partir 1er navigable
//        }
    });

    //le move ne fonctionne bien que lorsque les slides sont en data-z=1000, le zone de vue doit etre vers -5000 pour qu'on les voit en entier
    var dico = getTrans3D();
    dico.translate3d[2] = -6000;
    setTrans3D(dico);

    $('#profondeur').remove();


    // REINITIALISATION DE LA PRESENTATION SAUVEE
    if (localStorage.getItem('savedJson')) {
        var restoreJson = JSON.parse(localStorage.getItem('savedJson'));
        restorePressJson(restoreJson);
           
    }
    
    //INITIALISATION DE LA PRESENTATION DEPUIS LA LISTE A PUCE ORDONNEE
//     /*           Il suffit d'enlever le commentaire de ligne pour desactiver le chargement de la présentation
    if ( $('#tree').lenght !== 0 ) {
        goCK();
        goDepth();
        goJmpress();
        
    }

   //*/

});