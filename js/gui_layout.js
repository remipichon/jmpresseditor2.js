/* 
 * Listener de toute l'interface graphique
 * 
 * Fonction de gestion de toutes les interactions possibles via l'interface
 */

/*
 * Zoom en Z
 */
$(document).mousewheel(function(event, delta, deltaX, deltaY) {
    var transform = getTrans3D();
    transform.translate3d[2] = transform.translate3d[2] + deltaY * 10;
    setTrans3D(transform);
});


function handlerLayout() {

    //calcul de la taille necessaire pour la div contenant un asceneurs
    $(window).on('resize', resizeScrool);
    $(window).trigger('resize');  //pour lancer le resize au chargement de la page



    /* ======================================================================================
     * TRIGGERS CREATE TEXT
     * ======================================================================================*/
    $('.text-tool-button').on('click', function(event) {
        alertify.success('click on a slide to add text');
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
        alertify.success('click anywhere to add slide');
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
        alertify.error('coming soon');
    });


    /* ======================================================================================
     * TREE PANNEL - gestion de la présentation hierarchisée grace au tree
     * ======================================================================================*/

    $('#tree-tool').on('click', goTreeFromContainer);

    $('#goSlideShow').on('click', function() {
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
    extendSideBar($('#sidebarTree'), 'hide');
    hideModalSelectStorage($('#dialog-select-storage'));

    $('#arrow-nav').on('click', function() {
        extendSideBar($('#sidebar'));
        extendSideBar($('#sidebarTree'), 'hide');
    });

    $('#arrow-nav-tree').on('click', function() {
        extendSideBar($('#sidebar'), 'hide');
        extendSideBar($('#sidebarTree'));
    });

    $('#tree-tool').on('click', function() {
        // if (!$('#sidebar').hasClass('hidden-bar'))
        extendSideBar($('#sidebar'));
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

    $('#save').on('click', function(event) {
        event.stopPropagation();
        saveAs();
    });
    $('#quickSave').on('click', saveJson);

    $('#slideshowNameFree').on('click', function(event) {
        renameSlideshow(); //ne pas utiliser le callback !
    });



    /* ======================================================================================
     * LOAD       -   load button
     * charge la présentation en local storage 
     * ====================================================================================== */
    $('#loadSlideShow').on('click', function(event) {
        event.stopPropagation();
        modalSelectStorage(loadSlideShowByTypes, 'load');
    });


    /* ======================================================================================
     * CLEAR
     * pour vider les présentations sauvergarder
     * ====================================================================================== */
    $('#clearAll').on('click', function() {
        // confirm dialog
        alertify.confirm("This will delete <strong>all</strong> slideShow saved in local storage and refresh the editor. \n\
</br></br> Are you sure you want to do it ?\n\
</br></br></br>", function(e) {
            if (e) {
                // user clicked "ok"
                window.localStorage.clear();
                location.reload();
            }
        });

    });
    $('#clearOne').on('click', function(event) {
        event.stopPropagation();
        modalSelectStorage(clearOne, 'Clear');
    });
    $('#clearDom').on('click', function() {
        location.reload();
    });


}
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


function extendSideBar($sidebar, option) {
    if (typeof option === 'undefined')
        option = '';
    // marginLeft = 0 => sidebar visible, si cachée, maginleft  < 0
    if (parseInt($sidebar.css('margin-left')) === 0 && option !== 'show' || option === 'hide') {
        //hide
        var width = parseInt($sidebar.css('width'));
        $sidebar.animate({marginLeft: -width}, 500);
        $('#' + $sidebar.attr('id') + ' .arrow-nav').css('background-position', '-50px 0');
    }
    else if (option !== 'hide') {
        //show
        $sidebar.animate({marginLeft: "0"}, 500);
        $('#' + $sidebar.attr('id') + ' .arrow-nav').css('background-position', '0 0');
    }
}

//function quickSave() { //il n'y a qu'elle même qui s'appelle en passant un parametre
//
//    var localName = container.metadata.name;
//    saveJson(localName);
//}


function renameSlideshow(rep) {
    var title;
    var repName;
    if (typeof rep !== 'undefined') { //if not call by an handler
        if (typeof rep !== 'string') { //if call with a callback
            title = "Save slideShow as ...<br/><br/>";
            repName = container.metadata.name;
        } else {
            title = "A slideshow named " + rep + " alreday exists. \n\
<br/> Please type a new name";
            repName = rep;
        }
    } else {
        title = "Rename slideshow <br/><br/>";
        repName = container.metadata.name;
    }


    alertify.prompt(title, function(e, str) {
        // str is the input text      

        if (e) {

            //verification de nom
            for (var key in localStorage) {
                if (key === str) {
                    console.log('name alerady set in local');
                    $('#alertify-cancel').trigger('click'); //pour fermer l'alertify
                    setTimeout(function() {
                        // rest of code here
                        renameSlideshow(saveJson);
                    }, 1000);

                    return;
                }
            }
            alertify.success('SlideShow ' + container.metadata.name + ' rename as ' + str);
            container.metadata.name = str;
            if (typeof rep !== 'string') { //if call with a callback
                rep();
            }
        }
    }, repName);
}

function _return(param) {
    return param;
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

    //$tree.fadeIn(200);

    alertify.success('edit ' + container.metadata.name + ' in tree mode');


}


function launchPresentMode() {

    $('body').children().each(function() {
        if ($(this).attr('id') === 'slideArea')
            return;
        $(this).fadeOut(1000);
    });
    alertify.success('present mode launch, ESC to edit again');
//        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");



}



function goSlideShowFromContainer() {
    var toCopy = container.slide;
    initContainer();
    $(toCopy).each(function(indice, slide) {
        if (!slide.auto && container.metadata.type === 'tree') {//si la slide a été créée par l'user
            console.log('infos : goSlideShowFromContainer : une slide non auto n\'a pas été prise en compte');
            return;
        }
        var matriculeSlide = slide.matricule;
        //possible que le procotype mit par watch.js pose pb
        var element = slide.element;
        delete slide.element;
        new Slide(slide);
        for (var matricule in element) {
            var el = element[matricule];
            new Text(matriculeSlide, el);
        }



    });

    alertify.success('edit ' + container.metadata.name + ' in free mode');

}

/*
 * save as... avec controle de already set in localstorage
 */

function saveAs() {
//    var name = container.metadata.name;
//    if (name === 'Unnamed')
//        ;
    renameSlideshow(saveJson);
//    for (var key in localStorage) {
//        if (key === name) {
//            renameSlideshow();
//            return;
//        }
//    }
    //saveJson(name);

}

function saveJson() {
    var savedJson;
    var localName = container.metadata.name;

    if (localName === 'Unnamed') {
        renameSlideshow(saveJson);
        return;
    }

    if (container.metadata.type === 'free') {
        savedJson = JSON.stringify(container, null, 2);
    }
    else if (container.metadata.type === 'tree') { //si mode tree en cours d'édition
        if ($('#treeMaker').length !== 0) {
            goSlideShow();
            savedJson = JSON.stringify(container, null, 2);
            goTreeFromContainer();
        } else {
            savedJson = JSON.stringify(container, null, 2);
        }
    } else {
        alert('Le type de la présentation n\'est pas connu : ' + container.metadata.type);
        return;
    }


    localStorage.setItem(localName, savedJson);
    alertify.success(localName + ' saved ');

    console.log('smth saved', localStorage);

}

/* function de l'init de la modal de slection d'un element du local storage
 * commun à load/save/clear
 */
function modalSelectStorage(callback, title) {
    var $modal = $('#dialog-select-storage');
    $modal.children('h3').html('Select a slideshow from local storage to ' + title);
//       $modal.children('ul').children('li:not(#new-local)').off();
    $modal.children('ul').children('li:not(#new-local)').remove();
    $modal.children('ul').children('#new-local').off();


    $modal.animate({marginTop: 0}, 500);

    //handler pour fermer la modale
    /* lorsque modalSelectStorage est call, body capte en même temps le click.
     je mets donc un one pour attacher le one qui fermera la modal par un click au dehors
     habile :)    */
//    $('body').children(':not(#dialog-select-storage)').one('click', function() {
    $(document).children(':not(#dialog-select-storage)').one('click', function() {
        hideModalSelectStorage($modal);
    });
//    });

    //handler pour la saisie d'un nom
    $('#' + $modal.attr('id') + ' #new-local').one('click', function(event) {
        var localName = prompt('Type a new name to save a new Slideshow');
        console.log(localName);
        callback(localName);
        hideModalSelectStorage($modal, title);
    });

    for (var key in localStorage) {
        var item = "<li>" + key + "</li> ";
        $modal.children('ul').append(item);
         $modal.last().one('click', function(event) {
             //$('#' + $modal.attr('id') + ' #new-local').off(); //supprimer le handler sur le createNew
             $modal.children('ul').children('li').each(function(){
                 $(this).off();
             });

             callback($(event.target).html());
             hideModalSelectStorage($modal, title);

         });
    }
}

function hideModalSelectStorage($modal) {
//    $modal.children('ul').children('li:not(#new-local)').remove();
    var height = parseInt($modal.css('height'));
    $modal.animate({marginTop: -height}, 500);
}

function loadSlideShowByTypes(localName) {
    initContainer();
    container = JSON.parse(localStorage.getItem(localName));

    if (container.metadata.type === 'free') {
        //slideShow free
        loadJsonForSlideShow(localName);
        extendSideBar($('#sidebarTree'), 'hide');
        extendSideBar($('#sidebar'), 'show');

    } else if (container.metadata.type === 'tree') {
        //slideShow tree
        loadJsonForTree(localName);
        extendSideBar($('#sidebarTree'), 'show');
        extendSideBar($('#sidebar'), 'hide');
    } else {
        alert('La présentation chargée depuis le local storage ne correspond à aucuns types connus (free ou tree) :' + container.metadata.type);
        alertify.error(localName + ' saved ');
        ('La présentation chargée depuis le local storage ne correspond à aucuns types connus (free ou tree) :' + container.metadata.type);
    }

}

function loadJsonForTree(localName) {
    $('#slideshowNameTree').html(localName);
    goTreeFromContainer();
}

function loadJsonForSlideShow(localName) {
    $('#slideshowNameFree').html(localName);
    goSlideShowFromContainer();
}

function clearOne(localName) {
    localStorage.removeItem(localName);
    alertify.success('' + localName + ' deleted');
}



