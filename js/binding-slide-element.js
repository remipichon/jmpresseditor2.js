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
        x = (containerX - (containerWidth / 2) + x);
        y = (containerY - (containerHeight / 2) + y);
        console.log("x : " + x + "  y : " + y);
        pressjson.component[idObjet].pos.x = x;
        pressjson.component[idObjet].pos.y = y;
        $objet = jsonToHtml(jsonComponent);         // recupère $newSlide, Step element qui viet d'etre créée
        console.log("pressjson :");
        console.log(pressjson);
        delete pressjson.slide[idContainer].element[idObjet];
        return  $objet;         // objet = step element
    }
    ;
}

function steptoElement($objet, $slide) {
    console.log("arrivee d'un step element sur une slide");
    var $container = $slide;
//    console.log("parent : " + $container.html());     // slide
//    console.log("$objet : " + $objet.html());         // h1
    var idContainer = $container.attr('id');
    console.log("idContainer : "+ idContainer);
    var idObjet = $objet.attr('id');


    if (pressjson.component[idObjet]) {
        $('#' + idObjet + '').remove();
        var jsonComponent = pressjson.component[idObjet];

//    console.log("jsonComponent :");
//    console.log(pressjson.slide[idContainer].element[idElement]);
        // create new element json 
        pressjson.slide[idContainer].element[idObjet] = jsonComponent;

        var currentPerspective = parseFloat($('#slideArea').css("perspective")) / 1000;
        var containerX = pressjson.slide[idContainer].pos.x,
                containerY = pressjson.slide[idContainer].pos.y;
        var containerWidth = Math.floor($container.width()),
                containerHeight = Math.floor($container.height());
        var x = jsonComponent.pos.x,
                y = jsonComponent.pos.y;
        x = (x + (containerWidth / 2) - containerX );
        y = (y + (containerHeight / 2) - containerY);
        console.log("x : " + x + "  y : " + y);
        pressjson.slide[idContainer].element[idObjet].pos.x = x;
        pressjson.slide[idContainer].element[idObjet].pos.y = y;
        $objet = jsonToHtmlinSlide(jsonComponent,$container);         // recupère $newSlide, Step element qui viet d'etre créée
        console.log("pressjson :");
        console.log(pressjson);
        delete pressjson.component[idObjet];
        return  $objet;         // objet = step element


    }

}
;
