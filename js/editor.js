/********************
 * - INFOS : mustach-jmpress.js DIRECTEMENT intégré dans ce fichier !
 * - gérer PROPREMENT pb data-y faux dans l'insertion des slides (et vérifier gestion dans déplacement draggable)
 * - gérer événement "annuler" dans prompt
 * - affichage json : vider l'affichage avant de réafficher
 * - gérer la réaffectation de composants en cas de déplacement du composant hors de la slide d'affectation ? 
 * - réécrire + proprement la génération des slides et components json
 * - trouver combine pour que le snapsht apparaisse en surbrillance avant de le valider, pour faciliter le snapshot
 * - VALIDER VRAIMENT la structure json (fusion à faire avec mustach)
 * - fouiller impress/jmpress
 * - cleaner le code (supprimer ce qui sert à rien)
 * - liste fonctionnalités
 * - régler pb échelle
 * - proposition / laïus graphisme          -> 2 ou 3 configurations de fonctionnalités (use case écrit ?)
 **************/

$(document).ready(function() {

    var pressjson = {data: null, slides: new Array(), components: new Array()}; // presentation au format json -> initialisation
    var idSlide = 0;
    var idComponent = 0;


//// EVENEMENTS CONTENU TEXTE  ////////////////////////////////////////////////////////  
    /* En attendant d etre associe a un slide, les composants sont stockés dans le tableau 'component' dans pressjson */
    $("#insert-text").on('click', function(event) {
        event.preventDefault();
        $('#surface').addClass('surfaceCreationText');
        $('.surfaceCreationText').on('click', function(event) {
            $(this).unbind('click');                    // permet de désactiver le clic sur la surface
            console.log("click creation TEXTE");
            event.preventDefault();
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop - 83;          // decalage du y de 83px, corrige a l'arrache
            var content = prompt("Entrez le texte : ");
            idComponent++;
//            ligne ci-dessous à revoir : il doit y avoir moyen de faire + propre qu'un moche string' 
            var stringText = '{"type": "Component' + idComponent + '","class": "component","pos": {"x" : "' + x + '", "y": "' + y + '"},"description": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText); // transforme le string 'slide' en objet JSON
            console.log(jsonComponent);
            createComponentonSurface(jsonComponent);
            pressjson.components.push(jsonComponent); // ajout de la slide à pressjson
            $('#output-json').empty();                  // a revoir
            $('#output-json').append(JSON.stringify(pressjson)); // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
//        outputSlide();
            $('#surface').removeClass('surfaceCreationText');

        });

    });



    function createComponentonSurface(jsonComponent) {
        var componentOnSurface = $("<div>" + jsonComponent.description + " </div>");
        componentOnSurface.attr({
            class: jsonComponent.class,
            style: 'position : absolute; left : ' + jsonComponent.pos.x + 'px; top : ' + jsonComponent.pos.y + 'px'
        });
        $(componentOnSurface).draggable({
            cursor: 'move', // sets the cursor apperance
            containment: '#surface',
            stop: function() {
                var finalOffset = $(this).offset();
                var parentOffset = $('#surface').offset();
                var x = finalOffset.left - parentOffset.left;
                var y = finalOffset.top - parentOffset.top;
                jsonComponent.pos.x = x;
                jsonComponent.pos.y = y;
                $('#output-json').append(JSON.stringify(pressjson));
            }
        });
        $('#surface').append(componentOnSurface);
    }
    ;

//// EVENEMENTS SLIDES ////////////////////////////////////////////////////////////////////////////////////////////

    // gestion événement bouton slide
    $('#make-slide').on('click', function(event) {
        event.preventDefault();
        $('#surface').addClass('surfaceCreationSlide');
        // une fois le bouton 'make-slide' appuyé, la surface passe en mode creation:
        // cliquer sur la surface pour ajouter un slide aux coord de la souris
        // les infos sont collectées en meme temps pour en faire des JSON
        $('.surfaceCreationSlide').on('click', function(event) {
            $(this).unbind('click');        // pour obliger à reappuyer sur bouton pour rajouter une slide (solution temporaire)
            console.log("click creation SLIDE");
            //event.preventDefault();
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop - 83;      // decalage du y de 83px, corrige a l'arrache
            idSlide++;
//            var stringSlide = '{"step-number": "' + idSlide + '","datax": "' + x + '", "datay": "' + y + '","elements": []}';
            var stringSlide = '{"step-number": "' + idSlide + '","pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "1", "elements": []}';
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
            console.log(jsonSlide);
            createSlideonSurface(jsonSlide);
            pressjson.slides.push(jsonSlide); // ajout de la slide à pressjson
            $('#output-json').append(JSON.stringify(pressjson)); // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
//        outputSlide();
//            getJSONtest(pressjson);
            $('#surface').removeClass('surfaceCreationSlide');
        });

    });

    function gatherComponentsinSlide(jsonSlide)
            /* fonction permettant de regrouper, dans l'objet json "pressjson", les éléments
             * dont les coordonnées sont sous le snapshot de la slide au moment de la prise du snapshot
             */
            {
                var leftMin = Number(jsonSlide.pos.x);
                var topMax = Number(jsonSlide.pos.y);
                var leftMax = leftMin + 390;  // 390 = slide.width
                var topMin = topMax - 310;   // 310 = slide.height
                $.each(pressjson.components, function(key, val) {
//            //htmlSlides += createSlide(this);
//            // console.log("key  "+key+ " ,val : "+val);
//            //console.log("val = "+  JSON.stringify(val));
//            console.log("slide = "+  JSON.stringify(jsonSlide));
//            console.log(" pressjson component = "+pressjson.components);
                    if (val.pos.x > leftMin && val.pos.x < leftMax && val.pos.y > topMin && val.pos.y < topMax)
                    {
                        console.log("leftMin = " + leftMin + ", leftMax = " + leftMax + ", val datax = " + val.datax);
                        console.log("topMax = " + topMax + ", topMin = " + topMin + ", val datay = " + val.datay);
                        jsonSlide.elements.push(val);
                        //jsonSlide[elements] = val; // MARCHE PAAAAAAAAAS
                    }

                });
            }


//
// FONCTION REMI FAITE EN MUSTACH A RAJOUTER ICI A LA PLACE DE MON BRICOLAGE
// faire apparaitre l'element cree sur la surface
// Fonction largement inspirée de 'NewGroupe', dans creation.js
// !!! PROBLEME : forme apparait pas exactement là où elle est supposée apparaitre
    function createSlideonSurface(jsonSlide) {
        var slideOnSurface = $("<div class='slidegroupe' >  </div>");

        slideOnSurface.attr('style', 'position : absolute; left : ' + jsonSlide.pos.x + 'px; top : ' + jsonSlide.pos.y + 'px  ');
        slideOnSurface.css({'top': jsonSlide.pos.x, 'left': jsonSlide.pos.y});


        $(slideOnSurface).draggable({
            cursor: 'move', // sets the cursor apperance
            containment: '#surface',
            stop: function() {
                var finalOffset = $(this).offset();
                var parentOffset = $('#surface').offset();
                var x = finalOffset.left - parentOffset.left;
                var y = finalOffset.top - parentOffset.top;
                jsonSlide.pos.x = x;
                jsonSlide.pos.y = y;
                $('#output-json').append(JSON.stringify(pressjson));
            }
        });

        $('#surface').append(slideOnSurface);
    }
    ;


// a partir d'un objet json 'jsonSlide', créé un string avec toutes les balises fonctionnelles d'un slide
    function createSlide(jsonSlide) {
        return '<div class="step" data-x="' + jsonSlide.pos.x + '" data-y="' + jsonSlide.pos.y + '">\
' + jsonSlide.elements + '</div> ';
    }


// afficher sur la surface les slides créé par l'intermediaire de json
    function outputSlide() {
        console.log("pressjson : " + pressjson);
        var htmlSlides = "";
        $.each(pressjson.slides, function() {
            htmlSlides += createSlide(this);
        });
        console.log("htmlSlides : " + htmlSlides);
        $('#surface').append(htmlSlides);
    }

//// GESTION MUSTACH -> bouton "launch-slide" pour lancer la présentation en mode jmpress  ////////////////////////////////////////////////////////  

    $("#launch-slides").on('click', function() {
        console.log("entree launch slide");
//        var data = {"slide":[{"step-number":1,"class":"step","title":"un","pos":{"x":"1000","y":"1500"},"scale":"10","element":[{"type":"forme carre","pos":{"x":"340","y":"100"},"description":""},{"type":"texte","pos":{"x":"200","y":"200"},"description":"Bonjour Jmpress"}]},{"title":"deux","step-number":2,"class":"step","pos":{"x":3000,"y":3000},"scale":2,"element":[{}]},{"title":"trois","step-number":3,"class":"step","pos":{"x":0,"y":0},"scale":1,"element":[{}]}]};
        getJSONtest(pressjson);
        console.log("sortie launch slide");
    });


    function getJSONtest(data) {
        console.log("getjson");
//        var widthSlide = 450;       // avant : 900
//        var heightSlide = 350;      // avant : 700


        // pour Mustache il faut un jeu de data (json) ainsi qu'un template (html+mustache)
        //� partir de ces deux variables, Mustache.to_html() cr�e une variable html (en string)

        //template
    var template = $('#templateJmpress').html();
//        var template = "{{#slide}}            \n\
//                 <div class='step slide {{step-number}}' data-x = '{{pos.x}}' data-y = '{{pos.y}}'  data-scale = '{{scale}}' >   \n\
//                {{title}}  \n\
//                {{#element}}  \n\
//                <div class = '{{type}}'  style='position: relative; left: {{pos.x}}px; right: {{pos.y}}'> {{description}} </div>   \n\
//                {{/element}}  \n\
//            </div>    \n\
//            {{/slide}}"


        //generation du html
        var pstring = (JSON.stringify(data));
        console.log(pstring);
        
        var html = Mustache.to_html(template, data);
        console.log("template->"+template);
        console.log ("pressjson ->" + pressjson.slides[0].scale);
        console.log("html ->" + html);
        alert(html);        //ne pas commenter car le jmpress ne fonctionne pas sans


        //ajout du html � la div 
        $('#slideArea').append(html);

        $('#slideArea').children().draggable({
            drag: function(event) {
                var slide = $(this);
                var pos = slide.offset();
                var X = pos.left;//event.pageX-widthSlide/2;
                var Y = pos.top;//event.pageY-heightSlide/2;

                //m�j du fichier json
                //$(this).html("left : " + parseInt(pos.left) + "  top : " + parseInt(pos.top) ); 
                $('#slideArea').jmpress('deinit', $(this));
                $(this).attr("data-x", X);
                $(this).attr("data-y", Y);
                $('#slideArea').jmpress('init', $(this));   //je crois que jimpress n'init que les steps non init par d�faut

                console.log(event.pageX + "   " + event.pageY);
            }
        });
        /*
         $('#slideArea').children().mousedown( function() {
         
         
         $(document).mousemove( function(event)   {
         var slide = $(this);
         var pos = slide.offset();
         
         //m�j du fichier json
         $(this).html("left : " + parseInt(pos.left) + "  top : " + parseInt(pos.top) ); 
         $('#slideArea').jmpress('deinit', $(this) );
         $(this).attr("data-x", event.pageX);
         $(this).attr("data-y", event.pageY);
         $('#slideArea').jmpress('init', $(this));
         
         console.log(event.pageX + "   " + event.pageY);
         
         
         } );
         
         }) ;
         */



        //chargement des css propre � la pr�sentation puis lancement de la pr�sentation
        $('#scriptImpress').append('<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
        $('#slideArea').jmpress();
        console.log("go jimpress");

    }
    ;


    $(function dragPos() {

        $('.step').click(function() {
            alert("click");
            var slide = $(this);
            var pos = slide.offset();

            //m�j du fichier json
            alert("left : " + pos.left + " top : " + pos.top);



        });

    });


    $(document).keydown(function(key) {
        if (key.keyCode === 8) { //backspace 

            //$("#impress").children().empty(); //purge de id=impress
            //$("body").append('<div id="impress"> </div>');

            $("#impress-demo").remove();   //suppression du css relatif � la presentation
            $("scriptImpress").empty;

            for (var i = 0; i < cptSlide; i++) {
                var removeStep = $('.step').first();
                $('#jmpress').jmpress('deinit', removeStep);
                removeStep.remove();

            }

        }
    });




}
);
