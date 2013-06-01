/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/*/////////////////////////////////////////////////////////////
 
 CONCERNANT L'orgaNISATION DU FICHIER
 Je te conseille de mettre toutes les fonction au début du script
 et tous les listeners au même endroit, à la suite
 ainsi il sera plus facile de factoriser les listener si c'est possible
 et surtout ca evitera de naviguer dans le fichier à chaque fois (penible !)
 
 
 
 
 //////////////////////////////////////////////////////////*/

$(document).ready(function() {


    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================*/


    var i = 1; // id unique des slides      -> utile pour conversion json <-> html
    var j = 1; // id unique des éléments    -> utile pour conversion json <-> html

    $("#sortable").click(function(event) {
        console.log('sorting stop prop');
        event.stopPropagation();
    });

    //       initialisation jmpress :
    $('#slideArea').jmpress({
//        viewPort: {
//            height: 1000       // permet d'avoir vue d'ensemble + large. Se déclenche que à partir 1er navigable
//        }
    });

    $('#profondeur').remove();


    // REINITIALISATION DE LA PRESENTATION SAUVEE
    if (localStorage.getItem('savedJson')) {
        savedJsonTruc = JSON.parse(localStorage.getItem('savedJson'));

        for (var slide in savedJsonTruc.slide) {
            //parser le json, pour chaque slide
            var evCodeSlide = ({
                type: 'code',
                rotateX: savedJsonTruc.slide[slide].rotate.x,
                rotateY: savedJsonTruc.slide[slide].rotate.y,
                rotateZ: savedJsonTruc.slide[slide].rotate.z,
                scale: savedJsonTruc.slide[slide].scale,
                x: savedJsonTruc.slide[slide].pos.x,
                y: savedJsonTruc.slide[slide].pos.y,
                z: savedJsonTruc.slide[slide].pos.z,
                id: savedJsonTruc.slide[slide].id,
                typeEl: savedJsonTruc.slide[slide].type
            });

            createSlide('inutile', evCodeSlide);

            for (var elmt in savedJsonTruc.slide[slide].element) {
                var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)

                var evCodeText = ({
                    type: 'code',
                    container: $newSlide,
                    x: savedJsonTruc.slide[slide].element[elmt].pos.x,
                    y: savedJsonTruc.slide[slide].element[elmt].pos.y,
                    z: savedJsonTruc.slide[slide].element[elmt].pos.z,
                    content: savedJsonTruc.slide[slide].element[elmt].content
                });
                
                createText(savedJsonTruc.slide[slide].element[elmt].hierarchy,evCodeText);

            }

        }







        //il n'y a que les increment à recuperer
//       
    }

    //plus besoin de renseigner le json, ce sont les appels de fonctions createSlide et createText qui s'en charge
//    if (localStorage.getItem('savedJson')) {
//        var savedjson = JSON.parse(localStorage.getItem('savedJson'));
//        pressjson = savedjson;
//        i = pressjson.increment['i'];
//        j = pressjson.increment['j'];
//    }



    //  initPresent();  //decommenter/commenter cette ligne pour activer ou non l'initialisation depuis le fichier architecture-pressOLD.json (pour debug plus rapide)


    /* ======================================================================================
     * TRIGGERS CREATE TITLE1
     * ======================================================================================*/
    $('#text-tool-title').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#text-tool').parent().addClass("buttonclicked");     // mise en forme css
        event.preventDefault();
        event.stopPropagation();
        $('body').css('cursor', 'crosshair');
        $('body').removeClass().addClass('creationTitle');

//        $(".slide").each(function() {
//            $(this).removeClass('creationBody creationGeek').addClass('creationTitle');
//        });
    });

    $(document).on('click', '.creationTitle', function(event) {
        $('.creationTitle').removeClass('creationTitle');
        $('body').css('cursor', 'default');
        createText('title1', event);
    });

    /* ======================================================================================
     * TRIGGERS CREATE BODYTEXT
     * ======================================================================================*/
    $('#text-tool-body').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#text-tool').parent().addClass("buttonclicked");
        event.preventDefault();
        event.stopPropagation();
        $('body').css('cursor', 'crosshair');
        $('body').removeClass().addClass('creationBody');
    });

    $(document).on('click', '.creationBody', function(event) {
        event.stopPropagation();
        $('.creationBody').removeClass('creationBody');
        createText('bodyText', event);
        $('body').css('cursor', 'default');
    });


    /* ======================================================================================
     * FONCTION CREATE TEXT (body or h1)
     * triggered by 2 consecutive events : 
     *   "create title/body" button clicked 
     * + layout or slide with ".creationTitle/Body" class clicked
     * ======================================================================================*/
    function createText(hierarchy, event) {
        

        var content = "Entrer du texte";
        var dico = getTrans3D();
        var currentScale = dico.scaleZ;

        //si le texte est crée depuis du code
        if (event.type === "code") {
            var container = event.container;
            var x = event.x;
            var y = event.y;
            var z = event.z;
            var content = event.content;
        } else {
            //si le texte est crée via un vrai event
            var container = $(event.target);
            (container).unbind('click'); // permet de désactiver le clic sur la surface
            var x = (event.pageX - (window.innerWidth / 2) - parseFloat(dico.translate3d[0])) * (currentScale);
            var y = (event.pageY - (window.innerHeight / 2) - parseFloat(dico.translate3d[1])) * (currentScale);
            var z = dico.translate3d[2];
        }

        var idElement = "element-" + j++; // id unique élément -> ds json + ds html
        pressjson.increment['j'] = j;
        if (container.hasClass("slide"))      // element créé directement dans une slide
        {
            var idContainer = container.attr('id');

            if (event.type !== "code") {
                var parentOffset = container.offset();
                //or $(this).offset(); if you really just want the current element's offset
                x = event.pageX - parentOffset.left;
                y = event.pageY - parentOffset.top;

//
//                var containerX = pressjson.slide[idContainer].pos.x,
//                        containerY = pressjson.slide[idContainer].pos.y;
//                var containerWidth = Math.floor(container.width()),
//                        containerHeight = Math.floor(container.height());
//                x = x - containerX + (containerWidth / 2);
//                y = y - containerY + (containerHeight / 2);
            }

            var containerScale = pressjson.slide[idContainer].scale;
//                console.log("scale" + containerScale);
            var stringText = '{"class": "element text","type": "text", "id" : "' + idElement + '", "pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + containerScale + '", "hierarchy":"' + hierarchy + '", "content": "' + content + '"}';
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

    /*
     * Function type jquery qui permet de rendre une balise (dotée d'un id) editable via ckeditor
     * manageCkeditor() utilise le double click pour rendre contenteditable et init le ckeditor inline
     * tout en desactivant les actions permettant de déplacer la slide et de naviguer de sorte qu'il est possible de selectionner
     * du texte intuitivement. 
     * Elle detruit l'instance ckeditor et permet les deplacements lorsqu'on quitte l'edition (un peu de bricolage ici)
     * @param {type} bool
     * 
     */
    jQuery.fn.manageCkeditor = function(bool) {
        var $this = $(this);

        $this.dblclick(function(event) {
            $this.attr('contenteditable', 'true');
            CKEDITOR.disableAutoInline = true;
            CKEDITOR.inline($this.attr('id'));




            CKEDITOR.instances[$this.attr('id')].on('change', function(e) {
                console.log("le changement c'est maintenant :" + CKEDITOR.instances[$this.attr('id')].getData());
                /////METTRE A JOUR LE JSON//////
            });


            $this.on('mousemove', function() {
                if (!$this.hasClass('cke_focus')) {
                    $this.unbind('mousemove');
                    CKEDITOR.instances[$this.attr('id')].destroy(false); //possible de passer un 'false' a destroy pour ne pas update le dom
                    $this.attr('contenteditable', 'false');
                    console.log('destroy');
                }
                event.stopPropagation();
                $this.removeClass('move');
                $this.parent().removeClass('move');
                console.log('active');
            });
        });
    };



    /* ======================================================================================
     * CREATION DES SLIDES
     * ======================================================================================*/

// Trigger sur bouton "creation slide"
    $('#slide-tool').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#slide-tool').parent().addClass("buttonclicked");    // css
        event.preventDefault();
        event.stopPropagation();
        $('body').removeClass().addClass('creationSlide');
        $('body').css('cursor', 'crosshair');
    });

    $('#slide-tool-title').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#slide-tool').parent().addClass("buttonclicked");    // css
        event.preventDefault();
        event.stopPropagation();
        $('body').removeClass().addClass('creationSlideTitle');
        $('body').css('cursor', 'crosshair');
    });

    $(document).on('click', '.creationSlide', function(event) {
        event.stopPropagation();
        $('.creationSlide').removeClass('creationSlide');
        createSlide('slide', event);
        $('body').css('cursor', 'default');
    });

    $(document).on('click', '.creationSlideTitle', function(event) {
        event.stopPropagation();
        $('.creationSlideTitle').removeClass('creationSlideTitle');
        createSlide('slideText', event);

        $('body').css('cursor', 'default');
    });

    function createSlide(typeCreation, event) {


        if (event.type === 'code') {
            var dico = {
                rotateX: event.rotateX,
                rotateY: event.rotateY,
                rotateZ: event.rotateZ
            };
            var currentScale = event.scale;
            var x = event.x;
            var y = event.y;
            var z = event.z;
            var idSlide = event.id;


        } else {
            $(this).unbind('click'); // pour obliger à reappuyer sur bouton pour rajouter une slide
            var dico = getTrans3D();
            var currentScale = dico.scaleZ;
            var x = (event.pageX - (window.innerWidth / 2) - parseFloat(dico.translate3d[0])) * currentScale;
            var y = event.pageY - (window.innerHeight / 2) - parseFloat(dico.translate3d[1]) * currentScale;
            var z = 1000; //dico.translate3d[2];
            var idSlide = "slide-" + i++;
            pressjson.increment['i'] = i;


        }
        var type = "slide";


        var stringSlide = '{"type": "' + type + '", "id" : "' + idSlide + '", "index" : "' + (i - 2) + '","pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + currentScale + '", "element": {}}';
        var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
        if (false) {//(typeCreation === 'slideText') {
            jsonSlide.type = "slideText";
        }
        pressjson.slide[idSlide] = jsonSlide;
        console.dir(pressjson);
        jsonToHtml(jsonSlide);
        createTimeLine(idSlide);
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

    });

    $(document).on('click', '.creationGeek', function(event) {
        event.stopPropagation();
        $('.creationGeek').removeClass('creationGeek');
        console.log('creation geek html enclenchee');
//        createHtml();
    });





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
        if (data.type === "slide" || data.type === "slideText") {
            var template = $('#templateSlide').html();
        }
        var html = Mustache.to_html(template, data);
        $('#slideArea >').append(html);
        var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)

        //ajout des elements textes
        if (data.type === "slideText") {
            //creation du titre1
            var evCode = ({
                type: 'code',
                container: $newSlide,
                x: 10,
                y: 90,
                z: 0
            });
            createText('title1', evCode);

            //creation du bodyText
            evCode.x = 40;
            evCode.y = 160;
            createText('bodyText', evCode);


        }





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

        //gestion de ckeditor
        if (data.type === 'text') {
            var $newTxt = container.children().last();
            //$newTxt.manageCkeditor(true);   KIKI
        }

        var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)                
        $('#slideArea').jmpress('init', container); // initilisation step

        container.draggableKiki();
        container.children().each(function() {
            $(this).draggableKiki();
        });
        return($newSlide);
    }
    ;



}); // fin document.ready