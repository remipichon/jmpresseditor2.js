/* ======================================================================================
 * Json to Html + init Jmpress via Mustache
 * Initialise une prÃ©sentation Ã  partir d'un fichier Json
 * argument(s) : *fichier Json
 * ====================================================================================== */
function initPresent() {
    $.getJSON('json/architecture-press.json', function(data) {

        //template
        var template = $('#templateJmpress').html();

        //generation du html
        var html = Mustache.to_html(template, data);
        console.log("html généré");
        alert(html);        //ne pas commenter car le jmpress ne fonctionne pas sans


        //ajout du html Ã¯Â¿Â½ la div 
        $('#slideArea').append(html);

        $(".step").each(function() {
            $(this).draggableKiki();
            $(this).children().each(function() {
                $(this).draggableKiki();
            });
        });


        $('#slideArea').jmpress();
        console.log("go jimpress");

    });


}
;




//initPresent();

$(document).on('ready', function() {
    $('#slideArea').jmpress(
            {
                viewPort: {
                    height: 1700


                }
            }
    );

    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");
    var pressjson = {data: null, slide: new Array(), component: new Array()};



    $(document).keydown(function(key) {
        //console.log(key.keyCode);
        if (key.keyCode === 83) {
            //simulation bouton ajout de slide
            createSlide(0, 0, 1, null);
        }
    });



    $(document).on("dblclick", function(event) {
        
        if (event.which === 1) {
        var tab = getVirtualCoord(event, $slideGrandMother, 1);
        var top = tab[0];
        var left = tab[1];
        console.log("pageX : " + event.pageX + " left : " + left);
        createSlide(left, top, 1, event);
        }
    });
















    /* ======================================================================================
     * GESTION DES SLIDES
     * ======================================================================================*/

    /* CREATION D'UN ELEMENT SLIDE :
     * click sur bouton snapshot slide -> rend slideArea cliquabe pour creation de slide 
     * récupère data pour json */
    function createSlide(x, y, scale, event) {
        var z = 0;
        var rotX = 0;
        var rotY = 0;
        var rotZ = 0;
        var stringSlide = '{"type": "slide","pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"}, \n\
                                    "rotate" : {"x":"'+rotX+'", "y":"'+rotY+'", "z":"'+rotZ+'"}, \n\
                                        "scale" :' + scale + ', "elements": []}';
        var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON

        pressjson.slide.push(jsonSlide);        // ajout de la slide à pressjson

        jsonToHtml(jsonSlide, event);


    }
    ;


//transforme un objet json en html
//appelé à chaque création d'instance
    function jsonToHtml(data, event) {  // ne fonctionne que pour une seule slide
        console.log("getjson");
        if (data.type === "text")
        {
            //console.log("Data = texte");
            var template = $('#templateElement').html();
        }
        else {
            //console.log("Data = Slide");
            var template = $('#templateSlide').html();
        }

        var html = Mustache.to_html(template, data);



        $slideMother.append(html);
        var $slide = $slideMother.children().last();

        $slideGrandMother.jmpress('init', $slide);
        $slide.draggableKiki();
        //$slide.MODKiki();
        //$slide.addClass("dragged");

        ///////////////bricolage
        var offTop = $slide.attr("data-y");
        var offLeft = $slide.attr("data-x");


        var tab = getVirtualCoord(event, $slideGrandMother, 0);
        var VTopMouse = tab[0];
        var VLeftMouse = tab[1];


        $slide.attr("offX", "" + VLeftMouse - offLeft + "");
        $slide.attr("offY", "" + VTopMouse - offTop + "");
        //////////////fin bricolage

    }
    ;

});





