/* 
 * Scripts regarding only animation of layout (slidding menu, etc)
 * listeners de tous les boutons
 * 
 */


$(document).ready(function() {


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
    });

    $(document).on('click', '.creationTitle', function(event) {
        $('.creationTitle').removeClass('creationTitle');
        $('body').css('cursor', 'default');
        if ($(event.target).hasClass("slide")) {
            createText('title1', event);
        } else {              // texte créé sur slideArea
            alert("le texte doit être créé sur une diapositive");  // moche mais manque de temps
        }
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
        if ($(event.target).hasClass("slide")) {
            createText('bodyText', event);
        } else {              // texte créé sur slideArea
            alert("le texte doit être créé sur une diapositive");  // moche mais manque de temps
        }
        $('body').css('cursor', 'default');
    });



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
     * top-bar drop down menu        -   parameters button
     * ====================================================================================== */
    $('#parameters').on('click', function() {
        $submenu = $('#topbar-submenu');
        $submenu.toggleClass('hidden-sub');
        if ($submenu.hasClass('hidden-sub')) {
//            $($submenu).animate({marginTop: "-100"}, 300);
            $($submenu).show();
        }
        else {
            $($submenu).animate({marginTop: "0"}, 300);
            $($submenu).hide();
        }
    });


    $('#info').on('click', function() {
        window.open('https://github.com/clairezed/ImpressEdit');
    });




    /* ======================================================================================
     * rightbar sliding        -   arrow-nav button
     * ====================================================================================== */

    $('#arrow-nav').on('click', function() {
        $sidebar = $('#sidebar');
        $sidebar.toggleClass('hidden-bar');
        if ($sidebar.hasClass('hidden-bar')) {
            $('#sidebar').animate({marginLeft: "-200"}, 300);
            $('#arrow-nav').css('background-position', '-50px 0');
        }
        else {
            $('#sidebar').animate({marginLeft: "0"}, 300);
            $('#arrow-nav').css('background-position', '0 0');
        }
    });

    /* ======================================================================================
     * DISPLAY MODE        -   present button
     * ouvre dans une nouvelle fenetre la pres' en mode presentation (avec script jmpress originel)
     * utilise les données du json (reformatées) stockées en local storage + export mustache
     * ====================================================================================== */

    $('#present').on('click', function(event) {
        
        // sauvegarde des bons contenus texte en attendant que ckeditor "change" fonctionne
        $.each($('.element'), function(){
            var $this = $(this);
            var idElement = $this.attr('id');
            var idSlide = $this.parent().attr('id');
//            console.log("idElement : " + idElement + " / idSlide"+ idSlide);
console.log(idElement + " " + idSlide+" ");
             pressjson.slide[idSlide].element[idElement].content = $this.text();
//             console.log(pressjson);
        });
        
        
        
        var outputjson = {data: null, slide: new Array()};
        // mise en forme correct du json de sortie : 
        var arrayElement = [];
        $.each(pressjson.slide, function(key1, slide) {
            var slide2 = pressjson.slide[key1];
            $.each(slide, function(key2, element) {
                if (key2 === 'element') {
                    var arrayElement = [];
                    $.each(element, function(key3, elemind) {
                        arrayElement.push(elemind);
                        slide2.element = [];
                        $.each(arrayElement, function(key, value) {
                            slide2.element.push(value);
                        });
                    });
                }
            });
            outputjson.slide.push(slide2);
        });
        //console.log("output json : ");
        //console.log(outputjson);
        outputjson.slide.sort(sort_by('index', true, parseInt));
        //console.log("output json sorted : ");
        //console.log(outputjson);
        var stringjson = JSON.stringify(outputjson, null, 2);
        localStorage.setItem('outputjson', stringjson);
        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");
        // location


    });

    /* ======================================================================================
     * SAVE       -   save button
     * enregistre la présentation en local storage (tjs présente si F5)
     * + raccourci clavier ? 
     * + modal d'explication ?
     * ====================================================================================== */

    $('#save').on('click', function(event) {
        
          $.each($('.element'), function(){
            var $this = $(this);
            var idElement = $this.attr('id');
            var idSlide = $this.parent().attr('id');
             pressjson.slide[idSlide].element[idElement].content = $this.text();
        })
        
        
        var savedJson = JSON.stringify(pressjson, null, 2);
//        console.log("saved json : ");
//        console.log(savedjson);
        localStorage.setItem('savedJson', savedJson);

        var savedPress = $("#slideArea>div").html();
        localStorage.setItem('savedPress', savedPress);
        //console.log('savedPress :');
        //console.log(savedPress);


//        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");
        // location

    });


    /* ======================================================================================
     * CLEAR
     * pour vider les présentations sauvergarder
     * ====================================================================================== */

    $('#clear').click(function() {
        window.localStorage.clear();
        location.reload();
        return false;
    });


});

var sort_by = function(field, reverse, primer) {

    var key = function(x) {
        return primer ? primer(x[field]) : x[field]
    };

    return function(a, b) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
    }
}

