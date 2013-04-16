/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function() {


    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================*/
alert("...");
//       initialisation jmpress :
    $('#slideArea').jmpress();

    /* presentation au format json (initialisation) -> cf architecture-press.json
     * data = infos sur la présentation
     * slide = tableau de toutes les slides de la présentation (y compris leurs éléments, ajoutés dynamiquement)
     * component = tableau de tous les éléments créés (besoin d'un tableau dédié tant qu'ils sont pas ajoutes aux slides
     */
    var pressjson = {data: null, slide: new Array(), component: new Array()};

    //  initPresent();  //decommenter/commenter cette ligne pour activer ou non l'initialisation depuis le fichier architecture-pressOLD.json (pour debug plus rapide)



    /* ======================================================================================
     * CREATION DES ELEMENTS
     * ======================================================================================*/


// Trigger sur bouton "creation text h1"
    $('#text-tool-title').on('click', function(event) {
        event.preventDefault();
        $('#layout').toggleClass('creationText');
        createText();
    });


// function Creation text
    function createText() {
        $('.creationText').on('click', function(event) {
            $(this).unbind('click');                    // permet de désactiver le clic sur la surface
            var content = prompt("Entrez le texte : ");
            if (content === null) {
                return;
            }

//            // Essais multiples pour avoir les bonnes coord de l'élément
//            // Récupérer les coord top et left de la slide stockElement, et position relative to them ?
//            // ci-dessous, x quasi bon, mais y c'est le bordel. pb de zoom ? scale ? 
//            var $slideArea = $('#slideArea');
//            var heightSlide = 700;          //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
//            var MRH = window.innerHeight; //MaxRealHeight
//            var scale = parseInt(parseFloat($slideArea.css("perspective")) / 1000);
//            var MVH = heightSlide * scale;      //MaxVirtualHeight  //prise en compte deu zoom
//            var RTop = event.pageY;      //RealTop (de la souris)
//
//            //VirtualTop (position dans le monde des slides)
//            var VTop = MVH * RTop / MRH; //prise en compte de la proportion
//            VTop = Math.round(VTop);
//
//            var MRL = window.innerWidth; //MaxRealWidth
//            var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
//            var MVL = ratio * MVH;      //MaxVirtualWidth
//            var RLeft = event.pageX;      //RealTop (de la souris)
//
//            //VirtualTop (position dans le monde des slides)
//            var VLeft = MVL * RLeft / MRL; //prise en compte de la proportion
//            VLeft = Math.round(VLeft);
//            console.log("left : " + VLeft + ", top : " + VTop);
//            // Ci-dessous, x et y sont en gros dans la bonne zone, mais c'est pas encore ça précisément
//            var x = -(window.innerWidth / 2 - VLeft);
//            var y = -(window.innerHeight / 2 - VTop);
//            var stringText = '{"type": "text", "pos": {"x" : "' + x + '", "y": "' + y + '"}, "hierarchy":"h1", "content": "' + content + '"}';
//            var jsonComponent = JSON.parse(stringText);     // transforme le string 'slide' en objet JSON
//            pressjson.component.push(jsonComponent);        // ajout de l'element à pressjson
//            console.log(pressjson);
//            jsonToHtml(jsonComponent);
//            $('#layout').removeClass('creationText');
//            
//            
            
            var x = -(window.innerWidth / 2 - event.pageX);
            var y = -(window.innerHeight / 2 - event.pageY);
            var stringText = '{"type": "text", "pos": {"x" : "' + x + '", "y": "' + y + '"}, "hierarchy":"h1", "content": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText);     // transforme le string 'slide' en objet JSON
            pressjson.component.push(jsonComponent);        // ajout de l'element à pressjson
            console.log(pressjson);
            jsonToHtml(jsonComponent);
            $('#layout').removeClass('creationText');
            
        });

    }

});


/* ======================================================================================
 * CREATION DES SLIDES
 * ======================================================================================*/

// Trigger sur bouton "creation slide"
$('#slide-tool').on('click', function(event) {
    event.preventDefault();
    $('#layout').toggleClass('creationSlide');
    createSlide();
});

function createSlide() {
    $('.CreationSlide').on('click', function(event) {
        $(this).unbind('click'); // pour obliger à reappuyer sur bouton pour rajouter une slide (solution temporaire)
        var $slideArea = $("#slideArea");
        var flag = 0; //car c'est une slide
        var tab = getVirtualCoord(event, $slideArea, flag);
        var y = tab[0];
        var x = tab[1];
//            var x = event.pageX - this.offsetLeft;
//            var y = event.pageY - this.offsetTop;      // decalage du y de 83px, corrige a l'arrache
        // x et y from real to virtual ??
        var stringSlide = '{"type": "slide","pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "0,5", "elements": []}';
        var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON

//            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
        pressjson.slide.push(jsonSlide); // ajout de la slide à pressjson
        //createSlideonSurface(jsonSlide);
        console.dir(pressjson);
        jsonToHtml(jsonSlide);
        $('#surface').removeClass('CreationSlideOn');
    });
}

/* ======================================================================================
 * UTILITAIRES COMMUNS ELEMENTS et SLIDE
 * ======================================================================================*/


// transforme un objet (une slide ou un element) json en html
//appelé à chaque création d'instance
function jsonToHtml(data) {
    console.log("getjson");
//         console.log("data type : " +data.type);  
    if (data.type === "text")
    {
        console.log("Data = texte");
        var template = $('#templateElement').html();
    }
    else {
        console.log("Data = Slide");
        var template = $('#templateSlide').html();
    }
    var html = Mustache.to_html(template, data);
//    console.log("html : " + html);

    $('#slideArea >').append(html);
    var $newSlide = $('#slideArea>').children().last(); // h1 (enfant div sep element)
    var $newSlide2 = $('#slideArea').children(); // div step element
//    console.log("2 avant init ->" + $newSlide2.html()); 
    $('#slideArea').jmpress('init', $newSlide); // initilisation step

//    console.log("1 ->" + $newSlide.html());     // h1 (enfant div sep element)
//    console.log("2 ->" + $newSlide2.html());    // div step element initialisée



    var matrix = getTranslateValue($newSlide2);
    var matrix = $newSlide2.css("transform");
    console.log($newSlide.css("transform"));
    console.log("step1" + $('#step-1').html());
    console.log($('#step-1').css("transform"));
//    var matrix = matrixToArray($newSlide2.css("-moz-transform"));
//
//
//    for (var i = 0; i < matrix.length; i++) {
//        console.log(matrix[1]);
//    }

    //ajout du html à l'enfant de la div des slides

//    /////////////////////KIKI modifier ce for each car il met draggable toute les step a chaque fois
//    //mise a draggable des slides
//    //si les elements ont une classe qui les identifie, il sera possible de faire une autre fonction de draggable
//    //afin de diffÃ©rencier les deux cas. Par exemple les slides pourraient avoir une restrictions empechant le drop par dessus une autre slide
//    $(".step").each(function() {     //ce n'est pas forcément un .each dansc ette fonction (ajout d'une seule slide)
//        $(this).draggableKiki();
//        $(this).children().each(function() {
//            $(this).draggableKiki();
//        });
//    });
}
;
//function matrixToArray(matrix) {
//    return matrix.substr(7, matrix.length - 8).split(', ');
//}

function getTranslateValue(obj) {
    var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
//    if(matrix !== 'none') {
//        var values = matrix.split('(')[1].split(')')[0].split(',');
//        var a = values[0];
//        var b = values[1];
//        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
//    } else { var angle = 0; }
//    return angle;
    return matrix;
}




