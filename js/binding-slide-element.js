/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function elementToStep($objet) {
    var $container = $objet.parent();
    console.log("parent : " + $container.html());     // slide
    console.log("$objet : " + $objet.html());         // h1
    var idContainer = $container.attr('id');
    var idObjet = $objet.attr('id');
    if (pressjson.slide[idContainer].element[idObjet]) {
        $('#' + idObjet + '').remove();
        var jsonComponent = pressjson.slide[idContainer].element[idObjet];

//    console.log("jsonComponent :");
//    console.log(pressjson.slide[idContainer].element[idElement]);
        // create new element json 
        pressjson.component[idObjet] = jsonComponent;

        var currentPerspective = parseFloat($('#slideArea').css("perspective")) / 1000;
        var containerX = pressjson.slide[idContainer].pos.x,
                containerY = pressjson.slide[idContainer].pos.y;
        var containerWidth = Math.floor($container.width()),
                containerHeight = Math.floor($container.height());
        var x = jsonComponent.pos.x,
                y = jsonComponent.pos.y;
        x = (containerX - (containerWidth / 2) + x) ;
        y = (containerY - (containerHeight / 2) + y) ;
        console.log("x : " + x + "  y : " + y);
        pressjson.component[idObjet].pos.x = x;
        pressjson.component[idObjet].pos.y = y;



        $objet = jsonToHtml(jsonComponent);         // recupère $newSlide, Step element qui viet d'etre créée

        console.log("pressjson :");
        console.log(pressjson);
        delete pressjson.slide[idContainer].element[idObjet];
        return  $objet;         // objet = step element

    }



    // conversion top - left -> pos x
    // remove element from slide json
//    $objet.addClass("step");
}
