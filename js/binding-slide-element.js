/* 
 * outils pour la creation d'element texte
 * 
 */


function getMouseUpContainer(evt, slide)
{
    var mouseX = evt.pageX;
    var mouseY = evt.pageY;
    var i = 0;
    var $this = slide;
    var scale = $this.attr("data-scale");
    var o = $this.offset();
    var w = $this.width() * scale;
    var h = $this.height() * scale;
    if (evt.pageX >= o.left && evt.pageX <= o.left + w && evt.pageY >= o.top && evt.pageY <= o.top + h)
    {
        return ($this);
    }
    return 0;                  // 
}


function elementToElement(element, slideDest, evt)
{
//    var scaleSlideDest = slideDest.attr("data-scale");
    
    var slideSource = element.parent();
    var idSlideSource = slideSource.attr('id');
    var idSlideDest = slideDest.attr('id');
    if (idSlideSource === idSlideDest)
        return element;
    var offsetSlideDest = slideDest.offset();
    var idElement = element.attr('id');
    var elementLeft = evt.pageX - offsetSlideDest.left;
    var elementTop = evt.pageY - offsetSlideDest.top;
//     deplacement DOM element
    var elementClone = element.clone();
    elementClone.css({"left": elementLeft, "top": elementTop});
    slideDest.append(elementClone);
    element.remove();
    // MaJ json
    if (pressjson.slide[idSlideSource].element[idElement]) {
        pressjson.slide[idSlideDest].element[idElement] = pressjson.slide[idSlideSource].element[idElement];
        pressjson.slide[idSlideDest].element[idElement].pos.x = elementLeft;
        pressjson.slide[idSlideDest].element[idElement].pos.y = elementTop;
        pressjson.slide[idSlideDest].element[idElement].content = elementClone.text();
        delete pressjson.slide[idSlideSource].element[idElement];
        console.log("pressjson :");
        console.log(pressjson);
    }
    return elementClone;
}
;

function elementToStep($objet) {
    var $container = $objet.parent();
    var idContainer = $container.attr('id');
    var idObjet = $objet.attr('id');
    var elementTxt = $objet.text();
    if (pressjson.slide[idContainer].element[idObjet]) {
        $('#' + idObjet + '').remove();
        var jsonComponent = pressjson.slide[idContainer].element[idObjet];
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
//        console.log("x : " + x + "  y : " + y);
        pressjson.component[idObjet].pos.x = x;
        pressjson.component[idObjet].pos.y = y;
        pressjson.component[idObjet].content = elementTxt;
        $objet = jsonToHtml(jsonComponent);         // recupère $newSlide, Step element qui viet d'etre créée
        console.log("pressjson :");
        console.log(pressjson);
        delete pressjson.slide[idContainer].element[idObjet];
        return  $objet;         // objet = step element
    }
    ;
}

function steptoElement($objet, $slide) {
    var $container = $slide;
    var idContainer = $container.attr('id');
    var idObjet = $objet.attr('id');
    var elementTxt = $objet.text();
    if (pressjson.component[idObjet]) {
        $('#' + idObjet + '').remove();
        var jsonComponent = pressjson.component[idObjet];
        // create new element json 
        pressjson.slide[idContainer].element[idObjet] = jsonComponent;

        var currentPerspective = parseFloat($('#slideArea').css("perspective")) / 1000;
        var containerX = pressjson.slide[idContainer].pos.x,
                containerY = pressjson.slide[idContainer].pos.y;
        var containerWidth = Math.floor($container.width()),
                containerHeight = Math.floor($container.height());
        var x = jsonComponent.pos.x,
                y = jsonComponent.pos.y;
        x = (x + (containerWidth / 2) - containerX);
        y = (y + (containerHeight / 2) - containerY);
//        console.log("x : " + x + "  y : " + y);
        pressjson.slide[idContainer].element[idObjet].pos.x = x;
        pressjson.slide[idContainer].element[idObjet].pos.y = y;
        pressjson.component[idObjet].content = elementTxt;
        $objet = jsonToHtmlinSlide(jsonComponent, $container);         // recupère $newSlide, Step element qui viet d'etre créée
        console.log("pressjson :");
        console.log(pressjson);
        delete pressjson.component[idObjet];
        console.log("objet sortie steptoelement :");
        console.log($objet);
        return  $objet;         
        
    }

}
;
