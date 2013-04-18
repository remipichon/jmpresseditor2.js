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
//            height: 1000        // permet d'avoir vue d'ensemble + large. Se déclenche que à partir 1er navigable
//        }
    });

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
        $('#layout').removeClass();
        $('#layout').addClass('creationText');
        createText();
        $('#layout').removeClass();
    });


// function Creation text
    function createText() {
        $('.creationText').on('click', function(event) {
            $(this).unbind('click');                    // permet de désactiver le clic sur la surface
            var content = prompt("Entrez le texte : ");
            if (content === null) {
                return;
            }
            
            // Ratio : prendre en compte la perspective de la grand-mère (hauteur de zoom)
            // + les values de translate3D de la mère (angle de vue) ? 
            var $GMother = $('#slideArea');
            var dataGM = $GMother.jmpress('dataset');
            console.log(dataGM);
            
            var x = -(window.innerWidth / 2 - event.pageX); // ok pour perspective = 1000
            var y = -(window.innerHeight / 2 - event.pageY);
          
            var stringText = '{"type": "text", "pos": {"x" : "' + x + '", "y": "' + y + '"}, "hierarchy":"h1", "content": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText);     // transforme le string 'slide' en objet JSON
            pressjson.component.push(jsonComponent);        // ajout de l'element à pressjson
            console.log(pressjson);
            jsonToHtml(jsonComponent);
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
            var x = -(window.innerWidth / 2 - event.pageX);
            var y = -(window.innerHeight / 2 - event.pageY);
            var stringSlide = '{"type": "slide","pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "1", "elements": []}';
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
//            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
            pressjson.slide.push(jsonSlide); // ajout de la slide à pressjson
            console.dir(pressjson);
            jsonToHtml(jsonSlide);
            $('#layout').removeClass();
        });
    }

    /* ======================================================================================
     * UTILITAIRES COMMUNS ELEMENTS et SLIDE
     * ======================================================================================*/


// transforme un objet (une slide ou un element) json en html
//appelé à chaque création d'instance
    function jsonToHtml(data) {
        console.log("getjson");
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

        $('#slideArea >').append(html);
        var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)
//        var $newSlide2 = $('#slideArea').children(); // div step element
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
    }
    ;

});

