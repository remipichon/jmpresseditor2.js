/********************
 * TODO LIST SUR LE POUCE (NdClaire : désolée, j'ai pris cette habitude !)
 * - gérer PROPREMENT pb data-y faux dans l'insertion des slides (et vérifier gestion dans déplacement draggable)
 * - gérer événement "annuler" dans prompt
 * - gérer la réaffectation de composants en cas de déplacement du composant hors de la slide d'affectation ? 
 * - réécrire + proprement la génération des slides et components json ?
 * - trouver combine pour que le snapshot apparaisse en surbrillance avant de le valider, pour faciliter le snapshot
 * - fouiller impress/jmpress
 * - régler pb échelle entre element sur surface et dans jmpress
 * - proposition / laïus graphisme  -> 2 ou 3 configurations de fonctionnalités (use case écrit ?)
 **************/

$(document).ready(function() {


    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================/
     
     /* presentation au format json (initialisation) -> cf architecture-press.json
     * data = infos sur la présentation
     * slide = tableau de toutes les slides de la présentation (y compris leurs éléments, ajoutés dynamiquement)
     * component = tableau de tous les éléments créés (besoin d'un tableau dédié tant qu'ils sont pas ajoutes aux slides
     */
    var pressjson = {data: null, slide: new Array(), component: new Array()};



    /* ======================================================================================
     * GESTION DES ELEMENTS
     * ======================================================================================*/

    /* CREATION D'UN ELEMENT TEXTE :
     * click sur bouton txt -> rend surface cliquabe pour creation de texte 
     * récupère pos.x, pos.y et contenu texte*/
    $("#insert-text").on('click', function(event) {
        event.preventDefault();
        $('#surface').addClass('surfaceCreationText');
        $('.surfaceCreationText').on('click', function(event) {
            event.preventDefault();
            $(this).unbind('click');                    // permet de désactiver le clic sur la surface
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop - 83;          // decalage du y de 83px, corrige a l'arrache
            var content = prompt("Entrez le texte : ");
            var stringText = '{"pos": {"x" : "' + x + '", "y": "' + y + '"},"text" : "true", "content": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText);     // transforme le string 'slide' en objet JSON
            pressjson.component.push(jsonComponent);        // ajout de l'element à pressjson
            console.log(pressjson);
            $('#output-json')
                    .empty()
                    .append(JSON.stringify(pressjson));     // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
            createComponentonSurface(jsonComponent);        // fonction de creation temporaire, a remplaer par creation immediate via json + mustach 
            //        outputSlide();
            $('#surface').removeClass('surfaceCreationText');
        });
    });


    /* CREATION DE L'ELEMENT TEXTE SUR la SURFACE:
     * fonction appelee par CREATION D'UN ELEMENT TEXTE 
     * Vouee a disparaitre (geree par sortie mustache)
     * -> pour inspiration pour la mise a jour du json avec elements draggable */
    function createComponentonSurface(jsonComponent) {
        var componentOnSurface = $("<div>" + jsonComponent.content + " </div>");
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
                $('#output-json')
                        .empty()
                        .append(JSON.stringify(pressjson));
            }
        });
        $('#surface').append(componentOnSurface);
    }
    ;


    /* ======================================================================================
     * GESTION DES SLIDES
     * ======================================================================================*/

    /* CREATION D'UN ELEMENT SLIDE :
     * click sur bouton snapshot slide -> rend surface cliquabe pour creation de slide 
     * récupère data pour json */
    $('#make-slide').on('click', function(event) {
        event.preventDefault();
        $('#surface').addClass('surfaceCreationSlide');
        $('.surfaceCreationSlide').on('click', function(event) {
            $(this).unbind('click');        // pour obliger à reappuyer sur bouton pour rajouter une slide (solution temporaire)
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop - 83;      // decalage du y de 83px, corrige a l'arrache
            var stringSlide = '{"pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "1", "element": []}';
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
            console.log(jsonSlide);
            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
            pressjson.slide.push(jsonSlide);        // ajout de la slide à pressjson
            createSlideonSurface(jsonSlide);
            $('#output-json')
                    .empty()
                    .append(JSON.stringify(pressjson));
            $('#surface').removeClass('surfaceCreationSlide');
        });

    });


    /* REGROUPEMENT DES ELEMENTS DANS LA SLIDE:
     * fonction appelee par CREATION D'UN ELEMENT SLIDE
     * regrouper, dans les slides jsn les éléments dt les coord sont sous le snapshot de la slide au moment de la prise du snapshot 
     * Vouee a disparaitre (geree par sortie mustache)
     * -> pour inspiration pour l'ajout d'un element a une slide */
    function gatherComponentsinSlide(jsonSlide) {

        var leftMin = Number(jsonSlide.pos.x);
        var topMin = Number(jsonSlide.pos.y);
        var leftMax = leftMin + 390;  // 390 = slide.width -> a automatiser
        var topMax = topMin + 310;   // 310 = slide.height -> a automatiser -> valeurs fausses, a revoir
        $.each(pressjson.component, function(key, val) {    // key = n° du component ; val = component
            if (val.pos.x > leftMin && val.pos.x < leftMax && val.pos.y > topMin && val.pos.y < topMax)
            {
                console.log("leftMin = " + leftMin + ", leftMax = " + leftMax + ", val datax = " + val.pos.x);
                console.log("topMax = " + topMax + ", topMin = " + topMin + ", val datay = " + val.pos.y);
                jsonSlide.element.push(val);
            }
        });
        console.log(pressjson);
    }


    /* CREATION DE L'ELEMENT SLIDE SUR la SURFACE:
         * fonction appelee par CREATION D'UN SLIDE  
         * Vouee a disparaitre (geree par sortie mustache)
         * -> pour inspiration pour la mise a jour du json avec slides draggable */
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
    
 /* ======================================================================================
  * GESTION MUSTACHE
  * ======================================================================================*/   
/* pour le moment, utilisé uniquement pour lancer la présentation en mode jmpress en appuyant bouton "launch-slide"
 * defi : gérer l'affichage en tant reel sur la div surface !
 * PS : Remi, j'ai rien touché en dessous de "$('#slideArea').append(html);", je te laisse faire le tri !
 * ATTENTION : launch slide ne marche plus, surement du fait de la modif de l'archi json -> mustach n'est plus a jour.
 * pb du fait qu'il n'y a plus d'id aux slides ??? voir comment utiliser l'incrementation auto de jmpress dans mustache ?
 */  

    $("#launch-slides").on('click', function() {
        console.log("entree launch slide");
//        var data = {"slide":[{"step-number":1,"class":"step","title":"un","pos":{"x":"1000","y":"1500"},"scale":"10","element":[{"type":"forme carre","pos":{"x":"340","y":"100"},"description":""},{"type":"texte","pos":{"x":"200","y":"200"},"description":"Bonjour Jmpress"}]},{"title":"deux","step-number":2,"class":"step","pos":{"x":3000,"y":3000},"scale":2,"element":[{}]},{"title":"trois","step-number":3,"class":"step","pos":{"x":0,"y":0},"scale":1,"element":[{}]}]};
        getJSONtest(pressjson);
        console.log("sortie launch slide");
    });


    function getJSONtest(data) {
        console.log("getjson");
//        var widthSlide = 900;       // jai mis en commentaire, je voyais pas a quoi ca sert (Claire)
//        var heightSlide = 700;      


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
        console.log("template->" + template);
        console.log("pressjson ->" + pressjson.slide[0].scale);
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
