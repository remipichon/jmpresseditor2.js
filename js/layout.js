/* 
 * Scripts regarding only animation of layout (slidding menu, etc)
 * listeners de tous les boutons
 *  a deplacer dans GUIEditor
 */




$(document).ready(function() {
    
    //calcul de la taille necessaire pour la div contenant un asceneurs
    $(window).on('resize', resizeScrool);
    $(window).trigger('resize');  //pour lancer le resize au chargement de la page



    /* ======================================================================================
     * TRIGGERS CREATE TEXT
     * ======================================================================================*/
    $('.text-tool-button').on('click', function(event) {
        event.stopPropagation();
        $('li').removeClass("buttonclicked");
        $('#text-tool').addClass("buttonclicked");     // mise en forme css
        $('body').css('cursor', 'crosshair');
        var action = $(this).attr('id').replace('-tool', '');
        if( action.search('default') !== -1) action = 'BodyText';    //texte par défaut
        $('body').data('action', action);
        $('.slide').one('click', createTextOnSlide);
    });




    /* ======================================================================================
     * CREATION DES SLIDES
     * ======================================================================================*/
    $('.slide-tool-button').on('click', function(event) {
        event.stopPropagation();//KIKI
        $('li').removeClass("buttonclicked");
        $('#slide-tool').addClass("buttonclicked");     // mise en forme css
        $('body').css('cursor', 'crosshair');       
        if ($(this).attr('id').search('text') !== -1) {
            $('body').one('click', createSlideText);
        } else {
            $('body').one('click', createSlide);
        }
    });

    /* ======================================================================================
     * GEEK MODE - création d'element libre en html
     * ======================================================================================*/

    $('#geek-tool').on('click', function(event) {
        alert('coming soon');
    });


    /* ======================================================================================
     * TREE PANNEL - gestion de la présentation hierarchisée grace au tree
     * ======================================================================================*/

    $('#goTree').on('click', goTreeFromContainer);

    handlerTreeMaker();

    $('#goSlideShow').on('click', goSlideShow);






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
        extendSideBar($('#sidebar'));
    });

    $('#arrow-nav-tree').on('click', function() {
        extendSideBar($('#sidebarTree'));
    });

    /* ======================================================================================
     * DISPLAY MODE        -   present button
     * ouvre dans une nouvelle fenetre la pres' en mode presentation (avec script jmpress originel)
     * utilise les données du json (reformatées) stockées en local storage + export mustache
     * ====================================================================================== */

    $('#present').on('click', launchPresentMode);

    /* ======================================================================================
     * SAVE       -   save button
     * enregistre la présentation en local storage (tjs présente si F5)
     * ====================================================================================== */

    $('#save').on('click', function() {
        modalSelectStorage(saveJson);
    });
    $('#quickSave').on('click', quickSave);



    /* ======================================================================================
     * LOAD       -   load button
     * charge la présentation en local storage 
     * ====================================================================================== */
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
/************* definition des fonctions nécéssaires à la gestion de l'interface ****/
function createSlide() {
    $('li').removeClass("buttonclicked");
    $('body').css('cursor', 'default');
    new Slide({});
}

function createSlideText() {
    $('li').removeClass("buttonclicked");
    $('body').css('cursor', 'default');

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


function createTextOnSlide() {
    $('li').removeClass("buttonclicked");
    $('body').css('cursor', 'default');
  
    var objEvt = new ObjectEvent({
        matricule: $(this).attr('matricule'), //le body stocke l'action du bouton qui l'avait mit en selectSlide
        action: 'create'+$('body').data('action'),
        event: {}
    });
    callModelGUI(objEvt);
}


function extendSideBar($sidebar) {
//        if ( ! $('#arrow-nav-tree').hasClass('hidden-bar')) $('#arrow-nav').trigger('click');


    $sidebar.toggleClass('hidden-bar');
    if ($sidebar.hasClass('hidden-bar')) {
        $sidebar.animate({marginLeft: "-200"}, 300);
        $('#' + $sidebar.attr('id') + ' .arrow-nav').css('background-position', '-50px 0');
    }
    else {
        $sidebar.animate({marginLeft: "0"}, 300);
        $('#' + $sidebar.attr('id') + ' .arrow-nav').css('background-position', '0 0');
    }
}

function quickSave() {
    if ($('#treeMaker').length !== 0) {
        goSlideShow();
        saveJson($('#slideshowName').html());
        goTreeFromContainer();
    } else {
        saveJson($('#slideshowName').html());
    }

}

function resizeScrool() {
    //scroll pour la timeline 
    var height = window.innerHeight - $('#sidebar #sortable').offset().top;
    $('#sidebar #sortable').css('height', height);

    //scrool pour le tree
    var height = window.innerHeight - $('#treeMaker').offset().top;
    $('#treeMaker').css('height', height);
}



function launchPresentMode() {

    $('body').children().each(function() {
        if ($(this).attr('id') === 'slideArea')
            return;
        $(this).fadeOut(1000);
    });
//        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");



}






function saveJson(localName) {
    var savedJson = JSON.stringify(container, null, 2);
    localStorage.setItem(localName, savedJson);
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


function loadJsonForTree(localName) {
    $('#slideshowName').html(localName);
    initContainer();
    container = JSON.parse(localStorage.getItem(localName));
    goTreeFromContainer();
    $('#goTree').fadeOut(1);
    $('#goSlideShow').fadeIn(1);
}

function loadJsonForSlideShow(localName) {
    container = JSON.parse(localStorage.getItem(localName));
}

function clearOne(localName) {
    localStorage.removeItem(localName);
}



