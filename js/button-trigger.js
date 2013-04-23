/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {


    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================*/

//       initialisation jmpress :
    $('#slideArea').jmpress({
//        viewPort: {
//            height: 1000       // permet d'avoir vue d'ensemble + large. Se déclenche que à partir 1er navigable
//        }
    });

//    var pressjson = {data: null, slide: new Array(), component: new Array()};
    var i = 1; // id unique des slides      -> utile pour conversion json <-> html
    var j = 1; // id unique des éléments    -> utile pour conversion json <-> html

    //  initPresent();  //decommenter/commenter cette ligne pour activer ou non l'initialisation depuis le fichier architecture-pressOLD.json (pour debug plus rapide)



    /* ======================================================================================
     * CREATION DES ELEMENTS
     * ======================================================================================*/

// Trigger sur bouton "creation text h1"
// -> créer un élément sur layout (step element) ou dans une slide (element)
    $('#text-tool-title').on('click', function(event) {
        event.preventDefault();
        $('#layout').removeClass().addClass('creationText');
        $(".slide").each(function() {
            $(this).addClass('creationText');
        });
        createText();
        $('#layout').removeClass();
        $(".slide").each(function() {
            $(this).removeClass('creationText');
        });
    });


// function Creation text
    function createText() {
        $('.creationText').on('click', function(event) {
            var container = $(this);
            (container).unbind('click');                    // permet de désactiver le clic sur la surface
            var content = prompt("Entrez le texte : ");    
            if (content === null) {                      // pour annuler l'action si on clique sur annuler ds le prompt
                return;
            }
            // Ratio : prendre en compte la perspective de la grand-mère (hauteur de zoom)
            // + les values de translate3D de la mère (angle de vue) ? 

            //recupération des coord du translate 3D
            var posView = getTransformCoord($('#slideArea>'));
            console.log("coord Slide area x = " + posView.x + "  coordCont y = " + posView.y);

            //recupération de la perspective courante -> marche pas encore tout à fait (car notre donnée perspective est trafiquée)
            // Test 1 : via currentScale GrandMother
//            var currentScale = getScaleGM();
//            console.log("current Scale : " + currentScale);
//            var x = (event.pageX - (window.innerWidth / 2) - parseFloat(posView.x)) / currentScale;
//            var y = event.pageY - (window.innerHeight / 2) - parseFloat(posView.y) / currentScale;

            // Test 2 : via currentPerspective GrandMother
            var currentPerspective = parseFloat($('#slideArea').css("perspective")) / 1000;
            var x = (event.pageX - (window.innerWidth / 2) - parseFloat(posView.x))* (currentPerspective);
            var y = (event.pageY - (window.innerHeight / 2) - parseFloat(posView.y))* (currentPerspective);

            var idElement = "element-" + j++;     // id unique élément -> ds json + ds html

            if (container.hasClass("slide"))      // this = élément sur lequel on a cliqué
            {
                var idContainer = container.attr('id');
                var containerX = pressjson.slide[idContainer].pos.x,
                        containerY = pressjson.slide[idContainer].pos.y;
                var containerWidth = Math.floor(container.width()),
                        containerHeight = Math.floor(container.height());
                x = x - containerX + (containerWidth / 2);
                y = y - containerY + (containerHeight / 2);
                var containerScale = pressjson.slide[idContainer].scale;
                console.log("scale" + containerScale);
                var stringText = '{"type": "text", "id" : "' + idElement + '", "pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "' + containerScale + ' ", "hierarchy":"h1", "content": "' + content + '"}';
                var jsonComponent = JSON.parse(stringText);
                pressjson.slide[idContainer].element[idElement] = jsonComponent;
                jsonToHtmlinSlide(jsonComponent, container);

            } else {                            // création élément libre sur layout
                var currentScale = getScaleGM();
                var stringText = '{"type": "text", "id" : "' + idElement + '", "pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "'+currentPerspective+'", "hierarchy":"h1", "content": "' + content + '"}';
                var jsonComponent = JSON.parse(stringText);
                pressjson.component[idElement] = jsonComponent; // ajout de l'element à pressjson, à l'index idElement
                jsonToHtml(jsonComponent);
            }
            console.log(pressjson);

            $('#layout').removeClass('creationText');

        });

    }

    /* ======================================================================================
     * EDITION DES ELEMENTS
     * ======================================================================================*/

    /*EDITER CONTENU TEXTE
     * met l'attribut contenteditable à true pour les fichiers texte, sur un doubleclick
     * En cours ! (marche pas pour le moment)
     */
    $('div [contenteditable="false"]').dblclick(function() {
        console.log("contenteditable click");
    });


    /* ======================================================================================
     * CREATION DES SLIDES
     * ======================================================================================*/

// Trigger sur bouton "creation slide"
    $('#slide-tool').on('click', function(event) {
        console.log("creation slide enclenchee");
        event.preventDefault();
        $('#layout').removeClass();
        $('#layout').addClass('creationSlide');
        createSlide();
        $('#layout').removeClass();
    });

    function createSlide() {
        $('.creationSlide').on('click', function(event) {
            $(this).unbind('click'); // pour obliger à reappuyer sur bouton pour rajouter une slide (solution temporaire)
            var oldposView = $('#slideArea>').css("transform");
            oldposView = oldposView.split('(')[1];
            oldposView = oldposView.split(')')[0];
            oldposView = oldposView.split(',');
            var posView = {
                x: oldposView[4],
                y: oldposView[5]
            };
            var currentPerspective = parseFloat($('#slideArea').css("perspective")) / 1000;
//            console.log("current prespective : " + currentPerspective);
            var x = (event.pageX - (window.innerWidth / 2) - parseFloat(posView.x)) * currentPerspective;
            var y = event.pageY - (window.innerHeight / 2) - parseFloat(posView.y) * currentPerspective;
//            var x = -(window.innerWidth / 2 - event.pageX);
//            var y = -(window.innerHeight / 2 - event.pageY);
            var idSlide = "slide-" + i++;
            var stringSlide = '{"type": "slide", "id" : "' + idSlide + '","pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "1", "element": {}}';
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
            pressjson.slide[idSlide] = jsonSlide;
            console.dir(pressjson);
            jsonToHtml(jsonSlide);
            $('#layout').removeClass();
        });
    }

});

/* ======================================================================================
 * UTILITAIRES COMMUNS ELEMENTS et SLIDE
 * ======================================================================================*/


// transforme un objet (une slide ou un element) json en html
//appelé à chaque création d'instance
function jsonToHtml(data) {
    if (data.type === "text")
    {
        var template = $('#templateStepElement').html();
    }
    if (data.type === "slide") {
        var template = $('#templateSlide').html();
    }
    var html = Mustache.to_html(template, data);

    $('#slideArea >').append(html);
    var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)
    $('#slideArea').jmpress('init', $newSlide); // initilisation step

    /////////////////////KIKI modifier ce for each car il met draggable toute les step a chaque fois
    //mise a draggable des slides
    //si les elements ont une classe qui les identifie, il sera possible de faire une autre fonction de draggable
    //afin de diffÃ©rencier les deux cas. Par exemple les slides pourraient avoir une restrictions empechant le drop par dessus une autre slide
    $(".step").each(function() {     //ce n'est pas forcément un .each dansc ette fonction (ajout d'une seule slide)
        $(this).draggableKiki();
        $(this).children().each(function() {
            $(this).draggableKiki();
        });
    });
    return($newSlide);
};



function jsonToHtmlinSlide(data, container) {

    var template = $('#templateElement').html();
    var html = Mustache.to_html(template, data);
    container.append(html);
    var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)
    $('#slideArea').jmpress('init', container); // initilisation step

    container.draggableKiki();
    container.children().each(function() {
        $(this).draggableKiki();
    });
};



