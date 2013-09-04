/* 
 * Scripts regarding only animation of layout (slidding menu, etc)
 * listeners de tous les boutons
 *  a deplacer dans GUIEditor
 */

// $(document).keypress( function(event) {
//     //console.log(event.which);
//     if (event.which == 36) {
//         //console.log('escape')
//         $('body').children().each(function() {
//             if ($(this).attr('id') === 'slideArea')
//                 return;
//             $(this).fadeIn(1000);
//         });

//     }
// });

$(document).ready(function() {
    //calcul de la taille necessaire pour la div contenant un asceneurs

    $(window).on('resize', function() {
        //scroll pour la timeline 
        var height = window.innerHeight - $('#sidebar #sortable').offset().top;
        $('#sidebar #sortable').css('height', height);

        //scrool pour le tree
        var height = window.innerHeight - $('#treeMaker').offset().top;
        $('#treeMaker').css('height', height);

    });

    $(window).trigger('resize');



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
        //console.log('creation geek html enclenchee');
//        createHtml();
    });


    /* ======================================================================================
     * TREE PANNEL - gestion de la présentation hierarchisée grace au tree
     * ======================================================================================*/

    $('#gotTree').on('click', function(event) {
        event.preventDefault();
        $('#gotTree').fadeOut(1, function() {
            $('#goSlideShow').fadeIn(1);
        });
        goTreeFromContainer();
    });

    handlerTreeMaker();

    $('#goSlideShow').on('click', function(event) {
        event.preventDefault();
        $('#goSlideShow').fadeOut(1, function() {
            $('#gotTree').fadeIn(1);
        });
        goSlideShow();
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
//        if ( ! $('#arrow-nav-tree').hasClass('hidden-bar')) $('#arrow-nav').trigger('click');

        var $sidebar = $('#sidebar');
        $sidebar.toggleClass('hidden-bar');
        if ($sidebar.hasClass('hidden-bar')) {
            $('#sidebar').animate({marginLeft: "-200"}, 300);
            $('#arrow-nav').css('background-position', '-50px 0');
            $('#sidebarTree').fadeIn(1000);
        }
        else {
            $('#sidebar').animate({marginLeft: "0"}, 300);
            $('#arrow-nav').css('background-position', '0 0');
            $('#sidebarTree').fadeOut(1000);
        }
    });

    $('#arrow-nav-tree').on('clickKIKI', function() {
        if (!$('#sidebar').hasClass('hidden-bar'))
            $('#arrow-nav').trigger('click');
        var $sidebar = $('#sidebarTree');
        $sidebar.toggleClass('hidden-bar');
        var width = $sidebar.css('width');
        if ($sidebar.hasClass('hidden-bar')) {
            $sidebar.animate({marginLeft: "-400"}, width);
            $(this).css('background-position', '-50px 0');
            //$sidebar.fadeOut(1000);
        }
        else {
            $sidebar.animate({marginLeft: "0"}, width);
            $(this).css('background-position', '0 0');
            //$sidebar.fadeIn(1000);
        }
    });

    /* ======================================================================================
     * DISPLAY MODE        -   present button
     * ouvre dans une nouvelle fenetre la pres' en mode presentation (avec script jmpress originel)
     * utilise les données du json (reformatées) stockées en local storage + export mustache
     * ====================================================================================== */

    $('#present').on('click', function(event) {

        $('body').children().each(function() {
            if ($(this).attr('id') === 'slideArea')
                return;
            $(this).fadeOut(1000);
        })



//
//        var outputjson = {data: null, slide: new Array()};
//        // mise en forme correct du json de sortie : 
//        var arrayElement = [];
//        $.each(container.slide, function(key1, slide) {
//            var slide2 = container.slide[key1];
//            $.each(slide, function(key2, element) {
//                if (key2 === 'element') {
//                    var arrayElement = [];
//                    $.each(element, function(key3, elemind) {
//                        arrayElement.push(elemind);
//                        slide2.element = [];
//                        $.each(arrayElement, function(key, value) {
//                            slide2.element.push(value);
//                        });
//                    });
//                }
//            });
//            outputjson.slide.push(slide2);
//        });
//        ////console.log("output json : ");
//        ////console.log(outputjson);
//        outputjson.slide.sort(sort_by('index', true, parseInt));
//        ////console.log("output json sorted : ");
        ////console.log(outputjson);
//        var stringjson = JSON.stringify(container, null, 2);
//        localStorage.setItem('outputjson', stringjson);
//        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");
        // location


    });

    /* ======================================================================================
     * SAVE       -   save button
     * enregistre la présentation en local storage (tjs présente si F5)
     * ====================================================================================== */
    function saveJson(localName) {
        var savedJson = JSON.stringify(container, null, 2);
        localStorage.setItem(localName, savedJson);

        //console.log("saved json : ");
        //console.log(savedJson);

    }

    /* function de l'init de la modal de slection d'un element du local storage
     * commun à load/save/clear
     */
    function modalSelectStorage(callback) {
        /* KIKI ce n'est pas algorythmiquement au top mais ca ira pour le moment 27 08 2013*/
        var option = {
            closeOnEscape: true,
            title: 'select a slideshow',
            buttons: [
                {text: "New slideshow",
                    click: function() {
                        var name = prompt('Type a name that does\'t already exists (no check, be careful)');
                        callback(name);
                        $(this).dialog("close");
                    }
                }
//                ,{text: "All existing slideshow",
//                    click: function() {
//                        callback('all');
//                        $(this).dialog("close");
//                    }
//                }
            ]
        };

        for (var key in localStorage) {
            var item = {text: key,
                click: function(event, ui) {
                    callback($(event.target).html());
                    $(this).dialog("close");
                }
            };
            option.buttons.push(item);
        }

        $('#dialog-select-storage').dialog(option);

    }

    $('#save').on('click', function(event) {
        modalSelectStorage(saveJson);

    });
    $('#quickSave').on('click', function(event) {
        if ($('#treeMaker').length !== 0) {
            goSlideShow();
            saveJson($('#slideshowName').html());
            goTreeFromContainer();
        } else {
            ////console.log('quicksave on @' + $('#slideshowName').html() + '@')
            saveJson($('#slideshowName').html());
        }

    });
    
    $('#extract').on('click',function(){
        window.prompt ("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(container));
//        $('#dialog-extract').html("<p>"+JSON.stringify(container)+"</p>");
//         var option = {
//            closeOnEscape: true,
//            title: 'copy paste somewhere',
//            buttons: [
//                {text: "Close",
//                    click: function() {
//                        
//                        $(this).dialog("close");
//                    }
//                }
//
//            ]
//        };
//        
//        $('#dialog-extract').dialog(option);
    });

    /* ======================================================================================
     * LOAD       -   load button
     * charge la présentation en local storage 
     * ====================================================================================== */
    function loadJsonForTree(localName) {
        $('#slideshowName').html(localName);
        initContainer();
        container = JSON.parse(localStorage.getItem(localName));
        goTreeFromContainer();
        $('#gotTree').fadeOut(1);
        $('#goSlideShow').fadeIn(1);
    }

    function loadJsonForSlideShow(localName) {
        container = JSON.parse(localStorage.getItem(localName));
        //console.log('infos : loadSlide : pas de politique définie pour ce bouton, container contient la slideShow');
    }

    $('#loadSlide').on('click', function(event) {
        modalSelectStorage(loadJsonForSlideShow);
    });

    $('#loadTree').on('click', function(event) {
        modalSelectStorage(loadJsonForTree);

    });





    /* ======================================================================================
     * CLEAR
     * pour vider les présentations sauvergarder
     * ====================================================================================== */

    function clearOne(localName) {
        localStorage.removeItem(localName);

    }

    $('#clearAll').click(function() {
        window.localStorage.clear();
        location.reload();
    });
    $('#clearOne').click(function() {
        modalSelectStorage(clearOne);

    });
    $('#clearDom').click(function() {
        location.reload();
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

