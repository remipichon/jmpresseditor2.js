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
    /* Des le lancement, jmpress initialise la présentation meme a partir de rien. Cela lui permet de préparer les divs de gestions de la vue et des slides*/
    $('#slideArea').jmpress();

//    initPresent();  //decommenter/commenter cette ligne pour activer ou non l'initialisation depuis le fichier architecture-pressOLD.json (pour debug plus rapide)


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
            var stringText = '{"type": "text", "pos": {"x" : "' + x + '", "y": "' + y + '"},"text" : "true", "content": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText);     // transforme le string 'slide' en objet JSON
            pressjson.component.push(jsonComponent);        // ajout de l'element à pressjson
            console.log(pressjson);
            $('#output-json')
                    .empty()
                    .append(JSON.stringify(pressjson));     // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
//            createComponentonSurface(jsonComponent);        // fonction de creation temporaire, a remplaer par creation immediate via json + mustach 
            jsonToHtml(jsonComponent);
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
            var stringSlide = '{"type": "slide", "pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "1", "element": []}';
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON

            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
            pressjson.slide.push(jsonSlide);        // ajout de la slide à pressjson
            //createSlideonSurface(jsonSlide);
            jsonToHtml(pressjson);
            // jsonSlide est la slide est format json juste créé
            $('#output-json')       //permet d'ajouter au dom la slide ?
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
        console.log("après groupage ou non " + pressjson);
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

    //  plus de besoin du launch slide car la presentation est constament lancée
    $("#launch-slides").on('click', function() {
        console.log("entree launch slide");
        //        var data = {"slide":[{"step-number":1,"class":"step","title":"un","pos":{"x":"1000","y":"1500"},"scale":"10","element":[{"type":"forme carre","pos":{"x":"340","y":"100"},"description":""},{"type":"texte","pos":{"x":"200","y":"200"},"description":"Bonjour Jmpress"}]},{"title":"deux","step-number":2,"class":"step","pos":{"x":3000,"y":3000},"scale":2,"element":[{}]},{"title":"trois","step-number":3,"class":"step","pos":{"x":0,"y":0},"scale":1,"element":[{}]}]};
        //getJSONtest(pressjson);
        $("#editor").css("display", "none");
        $(".step").unbind();    //supprime les 
        console.log("sortie launch slide");
    });



    $(document).keydown(function(key) {
        if (key.keyCode === 8) {
            $("#editor").css("display", "block");
            //permettre de nouveau de deplacer les slides
            $(".step").each(function() {
                $(this).draggableKiki();
            });

        }
    });



    // transforme un objet json en html
    //appelé à chaque création d'instance
    function jsonToHtml(data) {  // ne fonctionne que pour une seule slide
        console.log("getjson");
        // pour Mustache il faut un jeu de data (json) ainsi qu'un template (html+mustache)
        
         console.log("data type : " +data.type);  
        if(data.type == "text") 
            {
            console.log("Data = texte");    
            var template = $('#templateElement').html();
            }
            else {
                console.log("Data = Slide");   
                var template = $('#templateSlide').html();
            }
        
        var html = Mustache.to_html(template, data);

        //ajout du html à l'enfant de la div des slides
        $('#slideArea >').append(html);


        /////////////////////KIKI modifier ce for each car il met draggable toute les step a chaque fois
        //mise a draggable des slides
        //si les elements ont une classe qui les identifie, il sera possible de faire une autre fonction de draggable
        //afin de diffÃ©rencier les deux cas. Par exemple les slides pourraient avoir une restrictions empechant le drop par dessus une autre slide
        $(".step").each(function() {
            $(this).draggableKiki();        //peut-etre remplacable par delegate
            $('#slideArea').jmpress('init', $(this));

        });


    }
    ;

    //pour init une presentation depuis un json afin d'avoir tout de suite
    //un espace de de travail deja complet pour debug plus rapidment
    function initPresent() {

        $.getJSON('json/architecture-pressOLD.json', function(data) {
            var template = $('#templateJmpressINIT').html();
            //generation du html
            var html = Mustache.to_html(template, data);
            alert(html);        //ne pas commenter car le jmpress ne fonctionne pas sans



            //ajout du html Ã¯Â¿Â½ la div 
            $('#slideArea').append(html);

            //mise a draggable des slides
            //si les elements ont une classe qui les identifie, il sera possible de faire une autre fonction de draggable
            //afin de diffÃ©rencier les deux cas. Par exemple les slides pourraient avoir une restrictions empechant le drop par dessus une autre slide


            $(".step").each(function() {
                $(this).draggableKiki();
            });


            //chargement des css propre Ã¯Â¿Â½ la prÃ¯Â¿Â½sentation puis lancement de la prÃ¯Â¿Â½sentation
            $('#scriptImpress').append('<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
            $('#slideArea').jmpress();
            console.log("go jimpress");

        });




    }
    ;



    /* ======================================================================================
     * position de l'event (souris) dans le monde des slides  (real to virtual)
     * argument(s) : *event (souris)
     *               *div qui contient les slides (en object Jquery)
     * return : Array[ virtualTop, virtualLeft]
     * callBy : draggableKiki
     * ====================================================================================== */
    function getVirtualCoord(event, $slideArea) {   //fonctionne semble t'il trÃ¨s bien
        var heightSlide = 700;          //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
        var MRH = window.innerHeight; //MaxRealHeight
        var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight  //prise en compte deu zoom
        var RTop = event.pageY;      //RealTop (de la souris)

        //VirtualTop (position dans le monde des slides)
        var VTop = MVH * RTop / MRH; //prise en compte de la proportion
        VTop = Math.round(VTop);


        var MRL = window.innerWidth; //MaxRealWidth
        var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
        var MVL = ratio * MVH;      //MaxVirtualWidth
        var RLeft = event.pageX;      //RealTop (de la souris)

        //VirtualTop (position dans le monde des slides)
        var VLeft = MVL * RLeft / MRL; //prise en compte de la proportion
        VLeft = Math.round(VLeft);

        //console.log("MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop);
        //console.log("MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

        var tab = new Array(VTop, VLeft);
        return tab;
    }


    /* ======================================================================================
     * position de l'element dans le monde reel (de l'Ã©cran du navigateur (virtualto real)
     * argument(s) : *element
     *               *div qui contient les slides (en object Jquery)
     * return : Array[ virtualTop, virtualLeft]
     * callBy : draggableKiki
     * ====================================================================================== */
    function getRealCoord(element, $slideArea) {        //semble bien fonctionner
        //console.log("element select :" + element.html());

        var heightSlide = 700;      //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
        var MRH = window.innerHeight; //MaxRealHeight
        var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight
        var VTop = element.offset().top * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //VirtualTop (de l'element)

        var RTop = MRH * VTop / MVH; //prise en compte de la proportion
        RTop = Math.round(RTop);    //prise en compte du zoom



        var MRL = window.innerWidth; //MaxRealWidth
        var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
        var MVL = ratio * MVH;    //MaxVirtualWidth
        var VLeft = element.offset().left * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //RealTop (de la souris)

        //VirtualTop (position dans le monde des slides)
        var RLeft = MRL * VLeft / MVL; //prise en compte de la proportion
        RLeft = Math.round(RLeft);  //prise en compte du zoom


        //console.log("position de element calculÃ© ds l'Ã©cran MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop + "     fameux coef : " + parseInt(parseFloat($slideArea.css('perspective')) / 1000));
        //console.log("position de element calculÃ© ds l'Ã©cran MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

        var tab = new Array(RTop, RLeft);
        return tab;
    }

    /* ======================================================================================
     * deplacement de chaque element ayant la classe .draggable
     * ====================================================================================== */
    $(document).on('mousemove', function(event) {
        //zone ou sont stocker les slides 
        var $slideArea = $("#slideArea");

        //dragg des elements
        $(".dragged").each(function() {
            var offX = $(this).attr("offX");
            var offY = $(this).attr("offY");

            var tab = getVirtualCoord(event, $slideArea);      //recupÃ©ration des coord virtuelle de la souris
            var VTop = tab[0];
            var VLeft = tab[1];

            //compension du lieu de click
            VTop = VTop - offY;
            VLeft = VLeft - offX;

            //desinitiatlisation de la slide concernÃ©e, maj des coord, reinit
            $('#slideArea').jmpress('deinit', $(this));
            $(this).attr("data-x", VLeft);
            $(this).attr("data-y", VTop);
            $('#slideArea').jmpress('init', $(this));

        });
        /*
         //deplacement au sein de la présentation
         if ($slideArea.hasClasse("navigable")) {
         
         }
         */
    });



    /* ======================================================================================
     * permet de rendre draggable un element
     * 
     * $(element).draggableKiki();
     * 
     * ====================================================================================== */
    jQuery.fn.draggableKiki = function() {
        var $slideArea = $("#slideArea");
        $(this).mousedown(function(event) {

            //position virtuelle dans le monde des slides de la souris
            var tab = getVirtualCoord(event, $slideArea);
            var VTopMouse = tab[0];
            var VLeftMouse = tab[1];

/////////////////////////////////////////////////////////////////////
////    DANGER LORS DU PASSAGE a la 3D  data-x va posser de GROS probleme lorsqu'on sera en 3D (il faudra faire des projetÃ©
///la solution pourrait être de ne pas permettre de selectionner un element n'importe ou mais par endroit (pt d'ancrage) particulier
///en effet, ici il y a un soucis au niveau du projeté de la slide si elle est de travers
///que choisit on ? 
            var offTop = $(this).attr("data-y");//$(this).offset().top;          
            var offLeft = $(this).attr("data-x");//$(this).offset().left;
            var offElmt = [offTop, offLeft];  //getRealCoord($(this), $slideArea);
            console.log(offElmt[1] + "  " + offElmt[0]);
////////////////////////////////////:


            $(this).addClass("dragged");

            $(this).attr("offX", "" + VLeftMouse - offElmt[1] + "");     //ce n'est pas inversÃ©, pos recoit top puis left (pas logique...)
            $(this).attr("offY", "" + VTopMouse - offElmt[0] + "");

        });

        //ici, dÃ¨s qu'on mouseup les objets sont relachÃ©s, il peut y avoir une condition Ã  la place, du genre dÃ¨s qu'on sort de slideArea ou de l'Ã©cran...
        $(document).mouseup(function() {
            $(".dragged").each(function() {
                $(this).removeClass("dragged");
            });
        });

    };







}
);
