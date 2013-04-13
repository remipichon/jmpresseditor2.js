/********************
 * TODO LIST SUR LE POUCE (NdClaire : désolée, j'ai pris cette habitude !)
 * - gérer position création slide + élément (real -> virtual / suivant pos slide de fond pour éléments ?
 * - gérer dépôt direct d'éléments dans un slide
 * - gérer dépôt direct d'un slide sur des élément
 * - trouver combine pour que le snapshot apparaisse en surbrillance à la création avant de le valider
 * - gérer click sur div fullscreen
 **************/



$(document).ready(function() {
    /* Des le lancement, jmpress initialise la présentation meme a partir de rien. Cela lui permet de préparer les divs de gestions de la vue et des slides*/



    /* ======================================================================================
     * VARIABLES GLOBALES
     * ======================================================================================*/


    $('#slideArea').jmpress(
//            {
//                viewPort: {
//                    height: 2000
//
//                }
//            }
            );

  //  initPresent();  //decommenter/commenter cette ligne pour activer ou non l'initialisation depuis le fichier architecture-pressOLD.json (pour debug plus rapide)


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
        $('#surface').addClass('CreationTextOn');
        $('.CreationTextOn').on('click', function(event) {
            event.preventDefault();
            $(this).unbind('click');                    // permet de désactiver le clic sur la surface
//            var x = event.pageX - this.offsetLeft;
//            var y = event.pageY - this.offsetTop - 83;          // decalage du y de 83px, corrige a l'arrache
            var x = event.pageX;
            var y = event.pageY;

            var content = prompt("Entrez le texte : ");
            if (content === null)
            {
                return;
            }
            var stringText = '{"type": "text", "pos": {"x" : "' + x + '", "y": "' + y + '"}, "hierarchy":"h1", "content": "' + content + '"}';
            var jsonComponent = JSON.parse(stringText);     // transforme le string 'slide' en objet JSON
            pressjson.component.push(jsonComponent);        // ajout de l'element à pressjson
            console.log(pressjson);
            $('#output-json')
                    .empty()
                    .append(JSON.stringify(pressjson));     // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
//            createComponentonSurface(jsonComponent);        // fonction de creation temporaire, a remplaer par creation immediate via json + mustach 
            jsonToHtml(jsonComponent);
            //        outputSlide();
            $('#surface').removeClass('CreationTextOn');
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
            containment: '#slideArea',
            stop: function() {
                var finalOffset = $(this).offset();
                var parentOffset = $('#slideArea').offset();
                var x = finalOffset.left - parentOffset.left;
                var y = finalOffset.top - parentOffset.top;
                jsonComponent.pos.x = x;
                jsonComponent.pos.y = y;
                $('#output-json')
                        .empty()
                        .append(JSON.stringify(pressjson));
            }
        });
        $('#slideArea').append(componentOnSurface);
    }
    ;


    /* ======================================================================================
     * GESTION DES SLIDES
     * ======================================================================================*/

    /* CREATION D'UN ELEMENT SLIDE :
     * click sur bouton snapshot slide -> rend slideArea cliquabe pour creation de slide 
     * récupère data pour json */
    $('#make-slide').on('click', function(event) {
        event.preventDefault();
        $('#surface').addClass('CreationSlideOn');
        $('.CreationSlideOn').on('click', function(event) {
            $(this).unbind('click');        // pour obliger à reappuyer sur bouton pour rajouter une slide (solution temporaire)
            var $slideArea = $("#slideArea");
            var flag = 0 ; //car c'est une slide
            var tab = getVirtualCoord(event, $slideArea, flag);
            var y = tab[0];
            var x = tab[1];
//            var x = event.pageX - this.offsetLeft;
//            var y = event.pageY - this.offsetTop;      // decalage du y de 83px, corrige a l'arrache
            // x et y from real to virtual ??
            var stringSlide = '{"type": "slide","pos": {"x" : "' + x + '", "y": "' + y + '"},"scale" : "0,5", "elements": []}';
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON

//            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
            pressjson.slide.push(jsonSlide);        // ajout de la slide à pressjson
            //createSlideonSurface(jsonSlide);
            console.dir(pressjson);
            jsonToHtml(jsonSlide);

            // jsonSlide est la slide est format json juste créé
            $('#output-json')       //permet d'ajouter au dom la slide ?
                    .empty()
                    .append(JSON.stringify(pressjson));
            $('#surface').removeClass('CreationSlideOn');
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
/////////////      Kiki : est ce censé gérer un drag ? navigable-zoombale-draggable.js s'en charge !
//        $(slideOnSurface).draggable({
//            cursor: 'move', // sets the cursor apperance
//            containment: '#slideArea',
//            stop: function() {
//                var finalOffset = $(this).offset();
//                var parentOffset = $('#surfslideArea').offset();
//                var x = finalOffset.left - parentOffset.left;
//                var y = finalOffset.top - parentOffset.top;
//                jsonSlide.pos.x = x;
//                jsonSlide.pos.y = y;
//                $('#output-json').append(JSON.stringify(pressjson));
//            }
//        });

        $('#slideArea').append(slideOnSurface);
    }
    ;

    /* ======================================================================================
     * GESTION MUSTACHE
     * ======================================================================================*/
    /* pour le moment, utilisé uniquement pour lancer la présentation en mode jmpress en appuyant bouton "launch-slide"
     * defi : gérer l'affichage en tant reel sur la div slideArea !
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

        console.log("html : " + html);

// ici, faudrait plusieurs cas de figure : si data = élement, vérifier si elle est lachée sur une slide, alors ajout à slide

        if (data.type === "text")
        {
            $('#slideArea >').append(html);
        }
        else {
            $('#slideArea >').append(html);
        }



        //ajout du html à l'enfant de la div des slides




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

    //pour init une presentation depuis un json afin d'avoir tout de suite
    //un espace de de travail deja complet pour debug plus rapidment
    function initPresent() {

//        $.getJSON('json/architecture-pressOLD.json', function(data) {
        $.getJSON('json/architecture-press.json', function(data) {
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
                $(this).children().each(function() {
                    $(this).draggableKiki();
                });
            });


            //chargement des css propre Ã¯Â¿Â½ la prÃ¯Â¿Â½sentation puis lancement de la prÃ¯Â¿Â½sentation
            $('#scriptImpress').append('<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
            $('#slideArea').jmpress();
            console.log("go jimpress");

        });




    }
    ;



    






}
);
