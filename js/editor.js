/********************
 * - gérer changement d'état de surface (deinitialiser class 'surfaceCreation')
 * - gérer pb data-y faux dans l'insertion des slides
 * - gérer événement "annuler" dans prompt
 * - initialisation slide : prévoir d'emblee tableau component vide ?
 * - affichage json : vider l'affichage avant de réafficher
 **************/

$(document).ready(function() {

    var pressjson = {data: null, slides: new Array(), components: new Array()}; // presentation au format json -> initialisation
    var idSlide = 0;
    var idComponent = 0;


//// EVENEMENTS CONTENU TEXTE    
// En attendant d etre associe a un slide, les composants sont stockés dans le tableau 'component' dans pressjson
    $("#insert-text").on('click', function(event) {
        event.preventDefault();
        $('#surface').addClass('surfaceCreationText');
        $('.surfaceCreationText').on('click', function(event) {
            $(this).unbind('click');
            console.log("click creation TEXTE");
            event.preventDefault();
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop - 83;          // decalage du y de 83px, corrige a l'arrache
            console.log("x : " + x + " y : "+ y);
            var content = prompt("Entrez le texte : ");
            idComponent++;
            var stringText = '{"id": "idComponent' + idComponent + '","class": "component","datax": "' + x + '", "datay": "' + y + '","content": "' + content + '"}';
            console.log(stringText);
            var jsonComponent = JSON.parse(stringText); // transforme le string 'slide' en objet JSON
            console.log(jsonComponent);
            createComponentonSurface(jsonComponent);
            pressjson.components.push(jsonComponent); // ajout de la slide à pressjson
            $('#output-json').append(JSON.stringify(pressjson)); // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
//        outputSlide();
            $('#surface').removeClass('surfaceCreationText');

        });

    });



    function createComponentonSurface(jsonComponent) {
        var componentOnSurface = $("<div>" + jsonComponent.content + " </div>");
        componentOnSurface.attr({
            class: jsonComponent.class,
            style: 'position : absolute; left : ' + jsonComponent.datax + 'px; top : ' + jsonComponent.datay + 'px'
        });
        $(componentOnSurface).draggable({
            cursor: 'move', // sets the cursor apperance
            containment: '#surface',
            stop: function() {
                var finalOffset = $(this).offset();
                var parentOffset = $('#surface').offset();
                var x = finalOffset.left - parentOffset.left;
                var y = finalOffset.top - parentOffset.top;
                console.log('left = ' + x);
                console.log('top = ' + y);
                jsonComponent.datax = x;
                jsonComponent.datay = y;
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
        // cliquer sur la surface pour ajouter un élément au coord de la souris
        // les infos sont collectées en meme temps pour en faire des JSON
        // PROBLEME : j'arrive pas à desactiver mode creation**************************************************
        $('.surfaceCreationSlide').on('click', function(event) {
            $(this).unbind('click');        // pour obliger à reappuyer sur bouton pour rajouter une slide (solution temporaire)
            console.log("click creation SLIDE");
            //event.preventDefault();
            var x = event.pageX - this.offsetLeft;
            var y = event.pageY - this.offsetTop - 83;      // decalage du y de 83px, corrige a l'arrache
            idSlide++;
            var stringSlide = '{"id": "idSlide' + idSlide + '","class": "step","datax": "' + x + '", "datay": "' + y + '","elements": []}';
            console.log(stringSlide);
            var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
            gatherComponentsinSlide(jsonSlide);     // ajoute les éléments dont les coordonnées sont "sous" la slide à la slide
            console.log(jsonSlide);
            createSlideonSurface(jsonSlide);
            pressjson.slides.push(jsonSlide); // ajout de la slide à pressjson
            $('#output-json').append(JSON.stringify(pressjson)); // transforme l'objet json 'jsonslide' en string et l'écrit dans <div output
//        outputSlide();
            $('#surface').removeClass('surfaceCreationSlide');
        });

    });

    function gatherComponentsinSlide(jsonSlide)
    {
        console.log("entree gatherComponentinSlide");
        var leftMin = Number(jsonSlide.datax);
        var topMax = Number(jsonSlide.datay);
        var leftMax = leftMin + 390;  // 390 = slide.width
        var topMin = topMax - 310;   // 310 = slide.height
        console.log("leftMin = "+leftMin + ", leftMax = " + leftMax);
        console.log("topMax = "+topMax + ", topMin = " + topMin);
        $.each(pressjson.components, function(key, val) {
//            //htmlSlides += createSlide(this);
//            // console.log("key  "+key+ " ,val : "+val);
//            //console.log("val = "+  JSON.stringify(val));
//            console.log("slide = "+  JSON.stringify(jsonSlide));
//            console.log(" pressjson component = "+pressjson.components);
            if (val.datax > leftMin && val.datax < leftMax && val.datay > topMin && val.datay < topMax)
                {
                    console.log("leftMin = "+leftMin + ", leftMax = " + leftMax +", val datax = " + val.datax);
                    console.log("topMax = "+topMax + ", topMin = " + topMin +", val datay = " + val.datay);
                    jsonSlide.elements.push(val);
                //jsonSlide[elements] = val; // MARCHE PAAAAAAAAAS
                }
            
//            $.each(val, function(key2, val2) {
//                console.log("key2  " + key2 + " ,val2 : " + val2);
//            });
        });
        console.log("sortie gatherComponentinSlide");
    }



// a partir d'un objet json 'jsonSlide', créé un string avec toutes les balises fonctionnelles d'un slide
    function createSlide(jsonSlide) {
        return '<div class="step" data-x="' + jsonSlide.datax + '" data-y="' + jsonSlide.datay + '">\
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


// FONCTION REMI FAITE EN MUSTACH A RAJOUTER ICI A LA PLACE DE MON BRICOLAGE
// faire apparaitre l'element cree sur la surface
// Fonction largement inspirée de 'NewGroupe', dans creation.js
// !!! PROBLEME : forme apparait pas exactement là où elle est supposée apparaitre
    function createSlideonSurface(jsonSlide) {
        var slideOnSurface = $("<div class='slidegroupe' >  </div>");

        slideOnSurface.attr('style', 'position : absolute; left : ' + jsonSlide.datax + 'px; top : ' + jsonSlide.datay + 'px  ');
//    slideOnSurface.css({'top': jsonSlide.datax, 'left': jsonSlide.datay});

//        $(newG).dblclick( function () {
//            $(this).addClass("groupageG");
//            $(this).toggleClass('alt');
//        });  
        $(slideOnSurface).draggable({
            cursor: 'move', // sets the cursor apperance
            containment: '#surface',
            stop: function() {
                var finalOffset = $(this).offset();
                var parentOffset = $('#surface').offset();
                var x = finalOffset.left - parentOffset.left;
                var y = finalOffset.top - parentOffset.top;
                console.log('left = ' + x);
                console.log('top = ' + y);
                jsonSlide.datax = x;
                jsonSlide.datay = y;
                $('#output-json').append(JSON.stringify(pressjson));
            }
        });

//    $(slideOnSurface).droppable({
//        drop: function(event, ui) {
//            var $newPosX = ui.offset.left - $(this).offset().left;
//            var $newPosY = ui.offset.top - $(this).offset().top;
//            console.log('top = ' + $newPosY);
//        }
//    });
        $('#surface').append(slideOnSurface);
    }
    ;


    // essai lancement jmpress peu concluant
//    $('#launch-slides').click(function() {
//        $('#surface').jmpress();
//    });



}
);
