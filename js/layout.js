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
        if (action.search('default') !== -1)
            action = 'BodyText';    //texte par défaut
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

    $('#tree-tool').on('click',  goTreeFromContainer);
   
    $('#goSlideShow').on('click', function(){
        extendSideBar($('#sidebarTree'));
        goSlideShow();
    });   
    
    
    $('#treeMaker').on('click', '.addSibling', addSibling);

    $('#treeMaker').on('click', '.removeSibling', removeSibling);

    $('#treeMaker').on('click', '.switchContent', switchContent);

    $('#treeMaker').one('click', '.textarea', lauchCK);

    $('#treeMaker').on('mouseleave', '.cke', removeCK);






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
    //pour cacher l'un ou l'autre par défaut
//    extendSideBar($('#sidebar'));
    extendSideBar($('#sidebarTree'));

    $('#arrow-nav').on('click', function() {
        extendSideBar($('#sidebar'));
        if (!$('#sidebarTree').hasClass('hidden-bar')) extendSideBar($('#sidebarTree'));
        

    });

    $('#tree-tool').on('click', function() {
        if (!$('#sidebar').hasClass('hidden-bar')) extendSideBar($('#sidebar'));
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
        action: 'create' + $('body').data('action'),
        event: {}
    });
    callModelGUI(objEvt);
}


function extendSideBar($sidebar) {
//        if ( ! $('#arrow-nav-tree').hasClass('hidden-bar')) $('#arrow-nav').trigger('click');


    $sidebar.toggleClass('hidden-bar');
    if ($sidebar.hasClass('hidden-bar')) {
        var width = parseInt($sidebar.css('width'));
        $sidebar.animate({marginLeft: -width}, 500);
        $('#' + $sidebar.attr('id') + ' .arrow-nav').css('background-position', '-50px 0');
    }
    else {
        $sidebar.animate({marginLeft: "0"}, 500);
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


function addSibling() {
        //console.log('add sib');
        var data = {
            'content': 'Type title here',
            'title': true,
            matricule: 'textarea' + globalCpt++
        };

        var template = $('#templateSibling').html();
        var html = Mustache.to_html(template, data);


        $(this).parent().append(html);
        $(this).parent().append($(this)); //deplacement du bouton

    }
    
    
    function removeSibling() {
        if (!confirm('Attention, tu vas supprimer : ' + $(this).parent().children('.li,.textarea').html()))
            return;
        //console.log('remove', $(this));
        $(this).parent().next('ol').remove();
        $(this).parent().remove();
    }
    
    
    function switchContent() {
        if (!confirm('Attention, tu vas switcher de content : ' + $(this).parent().children('.li,.textarea').html()))
            return;
        //console.log('switch to content', $(this));
        data = {
            matricule: 'textarea' + globalCpt++
        };
        var content = false;
        ($(this).parent().children('.liTitle').length !== 0) ? content = true : null;
        if (content) {
            $(this).parent().children('.liTitle').remove();
            var template = $('#templateContent').html();
//            //console.log('if');
            data.content = 'Type content here';
        } else if ($(this).parent().children('.textarea').length !== 0) {
            $(this).parent().children('.textarea').remove();
            var template = $('#templateTitle').html();
            data.content = 'Type title here';
        }



        var html = Mustache.to_html(template, data);
        $(this).parent().prepend(html);
        if (content) {//si ajout de content il faut le handler CK
            $(this).parent().children('.textarea').one('click', lauchCK);
        }

    }
    
    
    
    function removeCK() {
        var txt = CKEDITOR.instances[$(this).prev().attr('id')].getData();
        //console.log('leave cke', txt);
        $(this).parent().on('click', lauchCK);
        var $parent = $(this).parent();
//        CKEDITOR.instances[$(this).prev().attr('id')].destroy();

//       $parent.html(txt);

//        $(this).parent().children().remove();
        $(this).parent().html(txt);
//        hljs.initHighlighting($(this).prev().attr('id'));

    }
    
    
    

function lauchCK() {
    //empecher le double lauch
    if ($(this).children('textarea').length !== 0)
        return;

    var txt = $(this).html();
    $(this).html('');
    $(this).append("<textarea style='display:none;'id='textarea" + globalCpt++ + "'>" + txt + "</textarea>");
    CKEDITOR.replace($($(this).children('textarea')).attr('id'));

}


function goSlideShow() {
    $('#treeMaker .addSibling').each(function() {
        $(this).remove();
    });
    $('#treeMaker .removeSibling').each(function() {
        $(this).remove();
    });
    $('#treeMaker .createContent').each(function() {
        $(this).remove();
    });
    $('#treeMaker .switchContent').each(function() {
        $(this).remove();
    });
    $('#treeMaker').attr('id', 'tree');
    initAutomatic();
}




/*
 * creation du #treeMaker depuis le container
 * en admettant que les slides sont dans l'odre de la hierarchy
 * (s'il existe, l'adaptateur devra s'arrange pour ce que ce soit le cas)
 */
function goTreeFromContainer() {
    
    $('#slideArea').jmpress('deinit');
    $('#slideArea').children().remove();

    initJmpress();


    $('#tree').attr('id', 'treeMaker');
    $('#treeMaker .questions').each(function() {
        $(this).remove();
    });

    if ($('#tree').length === 0)
        var $tree = $('#treeMaker');
    else
        var $tree = $('#tree');

    $tree.children('ol').html('');


    var prevH = [0];
    var $target = $tree.children('ol');
    var $prevTarget = $tree.children('ol');
    var prevNiv;
    var niv;

    $.each(container.slide, function(id, slide) {
        var matricule = slide.matricule;
        //ignore slide automatically created
        if (slide.type === 'overwiew') {
            return;
        }
        var hierarchy = slide.properties.hierarchy.split('.');
        if (hierarchy[0] === 'undefined') {
            return;
        }
        if (hierarchy[0] === '0') {
            return;
        }

        //string to int
        for (var i in hierarchy) {
            hierarchy[i] = parseInt(hierarchy[i]);
        }

        var data = {
            'indice': slide.properties.hierarchy,
        };
        var content = '';
        for (var matEle in slide.element) {
            if (typeof slide.element[matEle].auto !== 'undefined')
                continue; //si texte auto, le treeMaker ne doit pas le récupérer car il sera réajouté après
            if (slide.element[matEle].properties.hierarchy !== 'bodyText') {
                var content = content + slide.element[matEle].properties.content.split('|')[1];
            } else {
                var content = content + slide.element[matEle].properties.content;
            }
        }
        data[slide.style] = 'true';

        var template = $('#templateSibling').html();
        var html = Mustache.to_html(template, data);

        /* deux cas, ajout
         *          - meme niveau de hierarchy, ajout en tant que sibling de previous
         *          - niveau plus bas de hierarchy, ajout en tant que fils de previous
         *          - niveau plus haut de hierarchy, ajout en tant que sibling du parent de previous
         *                      complication : il faut remonter de autant de parent que la différence de niveau entre prev et current
         */

        niv = hierarchy.length;
        prevNiv = prevH.length;

        if (niv < prevNiv) { //niveau plus haut

            var diff = prevNiv - niv; //difference de niveau qui indique combien de fois il faut remonter
            $target = $prevTarget.parent().parent();
            for (var i = 1; i < diff; i++) {
                $target = $target.parent().parent();
            }

        } else if (niv === prevNiv) {   //mm niveau
            $target = $prevTarget;
        } else if (niv > prevNiv) { //niveau plus bas
            //pour ne pas prendre les boutons, impossible d'ajoute des titres à des buttons !
            $target = $($prevTarget.children('li:not(.addSibling)')[$prevTarget.children('li:not(.addSibling)').length - 1]).children('ol');
        }

        var $button = $target.children('.addSibling');
        $target.append(html);
        //ajout du texte ne se fait pas via mustache car il n'interprete pas le html (c'est l'un ou l'autre (ou exclusif))

        /******************************** traitement spécifique à iframe ****/
        if (slide.type === 'iframe')
            content = 'iframe';
        /******************************** traitement spécifique à iframe CODE****/
        if (slide.type.search('iframecode') !== -1)
            content = slide.type;

        $($target.children()[$target.children().length - 1]).children('.liTitle').html(content);
        $($target.children()[$target.children().length - 1]).children('.textarea').html(content);

        //handler CK
        $($target.children()[$target.children().length - 1]).children('.textarea').on('click', lauchCK);


        $target.append($button);


        $prevTarget = $target;

        prevH = hierarchy;

    });

    $('#treeMaker').children('ol').append("<li class='addSibling'>Add Sibling</li>");

    $tree.fadeIn(200);


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



