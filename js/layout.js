/* 
 * Scripts regarding only animation of layout (slidding menu, etc)
 * listeners de tous les boutons
 *  a deplacer dans GUIEditor
 */


$(document).ready(function() {


    /* ======================================================================================
     * TRIGGERS CREATE TEXT
     * ======================================================================================*/
    $('.text-tool-button').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#text-tool').parent().addClass("buttonclicked");     // mise en forme css
        event.preventDefault();
        event.stopPropagation();
        $('body').css('cursor', 'crosshair');

        $('body').removeClass().addClass('selectSlide');
        $('body').data('action', $(this).attr('target'));
    });


    //listener pour créer un élement directement sur une slide lorsque le body est en selectSlide
    $(document).on('click', '.selectSlide', function(event) {
        $('body').removeClass();
        $('li').removeClass("buttonclicked");
        $('body').css('cursor', 'default');

        var objEvt = new ObjectEvent({
            matricule: $(event.target).attr('matricule'), //le body stocke l'action du bouton qui l'avait mit en selectSlide
            action: $('body').data('action'),
            event: {}
        });
        callModelGUI(objEvt);
    });




    /* ======================================================================================
     * CREATION DES SLIDES
     * ======================================================================================*/

// Trigger sur bouton "creation slide"
    $('.slide-tool-button').on('click', function(event) {
        $('li').removeClass("buttonclicked");
        $('#slide-tool').parent().addClass("buttonclicked");    // css
        event.preventDefault();
        event.stopPropagation();
        $('body').css('cursor', 'crosshair');

        $('body').removeClass().addClass('creationSlide');
        $('body').data('action', $(this).attr('target'));
    });


    $(document).on('click', '.creationSlide', function(event) {
        $('li').removeClass("buttonclicked");
        event.stopPropagation();
        $('body').removeClass();
        $('body').css('cursor', 'default');

        var action = $('body').data('action');
        if (action === 'createSlide') {
            new Slide({});
        } else if (action === 'createSlideText') {

            var slide = new Slide({
                pos: {
                    x: 1000
                }
            });
            var matricule = slide.matricule;
            new Text(matricule, {
                properties: {
                    hierarchy: 'H1Text'
                },
                pos: {
                    x: 40,
                    y: 10
                }
            });
            new Text(matricule, {
                properties: {
                    hierarchy: 'bodyText'
                },
                pos: {
                    y: 200,
                    x: 50
                }
            });
        }

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
        var $submenu = $('#topbar-submenu');
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
        var $sidebar = $('#sidebar');
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


        var outputjson = {data: null, slide: new Array()};
        // mise en forme correct du json de sortie : 
        var arrayElement = [];
        $.each(container.slide, function(key1, slide) {
            var slide2 = container.slide[key1];
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
     * ====================================================================================== */

    $('#save').on('click', function(event) {



        var savedJson = JSON.stringify(container, null, 2);
        console.log("saved json : ");
        console.log(savedJson);
        localStorage.setItem('savedJson', savedJson);

        var savedPress = $("#slideArea>div").html();
        localStorage.setItem('savedPress', savedPress);
        //console.log('savedPress :');
        //console.log(savedPress);


//        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");
        // location

    });

    /* ======================================================================================
     * LOAD       -   load button
     * charge la présentation en local storage 
     * ====================================================================================== */

    $('#loadSlide').on('click', function(event) {
        initContainer();
        container = JSON.parse(localStorage.getItem('savedJson'));
        goTreeFromContainer();
        goSlideShow();

//        pressjson = JSON.parse(localStorage.getItem('savedJson'));

//
//        for (var matS in pressjson.slide) {
//            var slide = pressjson.slide[matS];
//            var slide = new Slide({         
//                'matricule': slide.matricule,
//                'pos': slide.pos ,               //a voir si je mets une boucle pour renseigner tous les champs existant, l'existence de l'adaptateur serait ici
//                'properties': {
//                    hierarchy: slide.properties.hierarchy
//                }
//            });
//            var matriculeSlide = slide.matricule;
//            for (var matEl in pressjson.slide[matriculeSlide].element) {
//                var element = pressjson.slide[matriculeSlide].element[matEl];
//                new Text(matriculeSlide,{
//                    'matricule': element.matricule,
//                    'pos': element.pos,
//                    'properties': {'content': element.properties.content}
//                });
//            }
//        } 
    });

    $('#loadTree').on('click', function(event) {
        initContainer();
        container = JSON.parse(localStorage.getItem('savedJson'));
        goTreeFromContainer();
    });





    /* ======================================================================================
     * CLEAR
     * pour vider les présentations sauvergarder
     * ====================================================================================== */

    $('#clear').click(function() {
        window.localStorage.clear();
        //location.reload();
        $('#slideArea').html('');
        return false;
    });


});

var sort_by = function(field, reverse, primer) {

    var key = function(x) {
        return primer ? primer(x[field]) : x[field];
    };

    return function(a, b) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
    };
};

