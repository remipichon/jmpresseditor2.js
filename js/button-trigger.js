/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {
    

    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================*/


    var i = 1; // id unique des slides      -> utile pour conversion json <-> html
    var j = 1; // id unique des éléments    -> utile pour conversion json <-> html

    // REINITIALISATION DE LA PRESENTATION SAUVEE
    if (localStorage.getItem('savedPress')) {
        $('#slideArea').html(localStorage.getItem('savedPress'));
        $(".step").each(function() {     //ce n'est pas forcément un .each dansc ette fonction (ajout d'une seule slide)
            $(this).draggableKiki();
            $(this).children().each(function() {
                $(this).draggableKiki();
            });
        });
    }
    ;
    if (localStorage.getItem('savedjson')) {
        var savedjson = JSON.parse(localStorage.getItem('savedjson'));
        pressjson = savedjson;
        i = pressjson.increment['i'];
        j = pressjson.increment['j'];
    }
    ;
    
//       initialisation jmpress :
    $('#slideArea').jmpress({
//        viewPort: {
//            height: 1000       // permet d'avoir vue d'ensemble + large. Se déclenche que à partir 1er navigable
//        }
    });
    
    $('#profondeur').remove();
    //  initPresent();  //decommenter/commenter cette ligne pour activer ou non l'initialisation depuis le fichier architecture-pressOLD.json (pour debug plus rapide)


    /* ======================================================================================
     * TRIGGERS CREATE TITLE
     * ======================================================================================*/
    $(document).keypress(function(event) {
        if (event.which ===116) {
        $('li').removeClass("buttonclicked");
        $('#text-tool').parent().addClass("buttonclicked");     // mise en forme css
        
        $('#layout').removeClass().addClass('creationTitle');
        $(".slide").each(function() {
            $(this).removeClass('creationBody creationGeek').addClass('creationTitle');
        });
        }
    });
    $('#text-tool-title').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#text-tool').parent().addClass("buttonclicked");     // mise en forme css
        event.preventDefault();
        $('#layout').removeClass().addClass('creationTitle');
        $(".slide").each(function() {
            $(this).removeClass('creationBody creationGeek').addClass('creationTitle');
        });
    });

    $(document).on('click', '.creationTitle', function(event) {
        $('.creationTitle').removeClass('creationTitle');
        createText('h1', event);
    });

    /* ======================================================================================
     * TRIGGERS CREATE BODY
     * ======================================================================================*/
    $('#text-tool-body').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#text-tool').parent().addClass("buttonclicked"); 
        event.preventDefault();
        $('#layout').removeClass().addClass('creationBody');
        $(".slide").each(function() {
            $(this).removeClass('creationTitle creationGeek').addClass('creationBody');
        });
    });

    $(document).on('click', '.creationBody', function(event) {
        event.stopPropagation();
        $('.creationBody').removeClass('creationBody');
        createText('p', event);
    });


    /* ======================================================================================
     * FONCTION CREATE TEXT (body or h1)
     * triggered by 2 consecutive events : 
     *   "create title/body" button clicked 
     * + layout or slide with ".creationTitle/Body" class clicked
     * ======================================================================================*/

    function createText(hierarchy, event) {
        var container = $(event.target);
        (container).unbind('click'); // permet de désactiver le clic sur la surface
        var content = prompt("Entrez le texte : ");
        if (content === null) {                      // pour annuler l'action si on clique sur annuler ds le prompt
            $('#text-tool').parent().removeClass("buttonclicked");
            return;
        }
        var dico = getTrans3D();
        var currentScale = dico.scaleZ;
        var x = (event.pageX - (window.innerWidth / 2) - parseFloat(dico.translate3d[0])) * (currentScale);
        var y = (event.pageY - (window.innerHeight / 2) - parseFloat(dico.translate3d[1])) * (currentScale);
        var z = 0;//dico.translate3d[2];
        var idElement = "element-" + j++; // id unique élément -> ds json + ds html
        pressjson.increment['j'] = j;
        if (container.hasClass("slide"))      // element créé directement dans une slide
        {
            var idContainer = container.attr('id');
            var containerX = pressjson.slide[idContainer].pos.x,
                    containerY = pressjson.slide[idContainer].pos.y;
            var containerWidth = Math.floor(container.width()),
                    containerHeight = Math.floor(container.height());
            x = x - containerX + (containerWidth / 2);
            y = y - containerY + (containerHeight / 2);
            var containerScale = pressjson.slide[idContainer].scale;
//                console.log("scale" + containerScale);
            var stringText = '{"class": "element","type": "text", "id" : "' + idElement + '", "pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + containerScale + '", "hierarchy":"' + hierarchy + '", "content": "' + content + '"}';
//            console.log(stringText);
            var jsonComponent = JSON.parse(stringText);
            pressjson.slide[idContainer].element[idElement] = jsonComponent;
            jsonToHtmlinSlide(jsonComponent, container);
        } else {                            // création élément libre sur layout
            var stringText = '{"class": "element","type": "text", "id" : "' + idElement + '", "pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + currentScale + '", "hierarchy":"' + hierarchy + '", "content": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText);
            pressjson.component[idElement] = jsonComponent; // ajout de l'element à pressjson, à l'index idElement
            jsonToHtml(jsonComponent);
        }
        console.log(pressjson);
        $('#text-tool').parent().removeClass("buttonclicked");  // mise en forme css
    }
    ;


    /* ======================================================================================
     * CREATION DES SLIDES
     * ======================================================================================*/

// Trigger sur bouton "creation slide"
    $(document).keydown( function(event) {
        if (event.which === 83) {
        $('li').removeClass("buttonclicked");
        $('#slide-tool').parent().addClass("buttonclicked");    // css
        event.preventDefault();
        $('#layout').removeClass().addClass('creationSlide');
        }
    });
    $('#slide-tool').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#slide-tool').parent().addClass("buttonclicked");    // css
        event.preventDefault();
        $('#layout').removeClass().addClass('creationSlide');
    });


    $(document).on('click','.creationSlide', function(event) {
        event.stopPropagation();
        $('.creationSlide').removeClass('creationSlide');
        createSlide();
    });

    function createSlide() {
        $(this).unbind('click'); // pour obliger à reappuyer sur bouton pour rajouter une slide
        var dico = getTrans3D();
        var currentScale = dico.scaleZ;
        var x = (event.pageX - (window.innerWidth / 2) - parseFloat(dico.translate3d[0])) * currentScale;
        var y = event.pageY - (window.innerHeight / 2) - parseFloat(dico.translate3d[1]) * currentScale;
        var z = dico.translate3d[2];
        var idSlide = "slide-" + i++;
        pressjson.increment['i'] = i;
        var stringSlide = '{"type": "slide", "id" : "' + idSlide + '","pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + currentScale + '", "element": {}}';
        var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
        pressjson.slide[idSlide] = jsonSlide;
        console.dir(pressjson);
        jsonToHtml(jsonSlide);
         $('#slide-tool').parent().removeClass("buttonclicked");
    }

  /* ======================================================================================
     * GEEK MODE - création d'element libre en html
     * ======================================================================================*/

$('#geek-tool').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#geek-tool').parent().addClass("buttonclicked"); 
        event.preventDefault();
        $('#layout').removeClass().addClass('creationGeek');
        $(".slide").each(function() {
            $(this).removeClass('creationTitle creationBody').addClass('creationGeek');
        });
    });

    $(document).on('click', '.creationGeek', function(event) {
        event.stopPropagation();
        $('.creationGeek').removeClass('creationGeek');
        console.log('creation geek html enclenchee');
//        createHtml();
    });





}); // fin document.ready


/* ======================================================================================
 * UTILITAIRES COMMUNS ELEMENTS et SLIDE
 * ======================================================================================*/


// transforme un objet (une slide ou un element) json en html
//appelé à chaque création d'instance
function jsonToHtml(data) {
    if (data.class === "element")
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
}
;
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
    return($newSlide);
}
;



