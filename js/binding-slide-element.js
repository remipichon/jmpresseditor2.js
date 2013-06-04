/* 
 * outils pour la creation d'element texte
 * 
 */


function getMouseUpContainer(evt, slide)
{
    var mouseX = evt.pageX;
    var mouseY = evt.pageY;
//    var mouseX = element.css("left");
//    var mouseY = element.css("top");
    
    var i = 0;
    var $this = slide;
    var scale = $this.attr("data-scale");
    var o = $this.offset();
    var w = $this.width() * scale;
    var h = $this.height() * scale;
    if (mouseX >= o.left && mouseX <= o.left + w && mouseY >= o.top && mouseY <= o.top + h)
    {
        return ($this);
    }
    return 0;                  // 
}


function elementToElement(element, slideDest, evt)
{
//    var scaleSlideDest = slideDest.attr("data-scale");

    var slideSource = element.parent(),
            idSlideSource = slideSource.attr('id'),
            idSlideDest = slideDest.attr('id');
    if (idSlideSource === idSlideDest)              // move au sein de la même slide
        return element;

// détermination des coordonnées de l'élément au sein de sa nouvelle slide
    var idElement = element.attr('id');
    var offsetSlideDest = slideDest.offset();
    var elementLeft = evt.pageX - offsetSlideDest.left;
    var elementTop = evt.pageY - offsetSlideDest.top;

//     deplacement DOM element


    element.css({"left": elementLeft, "top": elementTop});
    slideDest.append(element);


    // MaJ json
    if (pressjson.slide[idSlideSource].element[idElement])
    {
        pressjson.slide[idSlideDest].element[idElement] = pressjson.slide[idSlideSource].element[idElement];
        pressjson.slide[idSlideDest].element[idElement].pos.x = elementLeft;
        pressjson.slide[idSlideDest].element[idElement].pos.y = elementTop;
        pressjson.slide[idSlideDest].element[idElement].content = element.text();
        delete pressjson.slide[idSlideSource].element[idElement];
        console.log("pressjson :");
        console.log(pressjson);
    }
    return element;
}
;

