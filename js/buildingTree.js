
function handlerTreeMaker() {

    $('#treeMaker').on('click', '.addSibling', function() {
        console.log('add sib');
        var data = {
            'content': 'Type title here',
            'title': true,
            matricule: 'textarea' + globalCpt++
        };

        var template = $('#templateSibling').html();
        var html = Mustache.to_html(template, data);


        $(this).parent().append(html);
        $(this).parent().append($(this)); //deplacement du bouton

    });


    $('#treeMaker').on('click', '.removeSibling', function() {
        console.log('remove', $(this));
        $(this).parent().next('ol').remove();
        $(this).parent().remove();
    });

    $('#treeMaker').on('click', '.switchContent', function() {
        console.log('switch to content', $(this));
        data = {
                        matricule: 'textarea' + globalCpt++

        };
        if ($(this).parent().children('.liTitle').length !== 0) {
            $(this).parent().children('.liTitle').remove();
            var template = $('#templateContent').html();
//            console.log('if');
            data.content = 'Type content here';
        } else if ($(this).parent().children('.textarea').length !== 0) {
            $(this).parent().children('.textarea').remove();
            var template = $('#templateTitle').html();
            data.content = 'Type title here';
        }


        
        var html = Mustache.to_html(template, data);
        $(this).parent().prepend(html);
    });


    $('#treeMaker').one('click', '.textarea', lauchCK);

    $('#treeMaker').on('mouseleave', '.cke', function() {
        //return;
       
        
        var txt = CKEDITOR.instances[$(this).prev().attr('id')].getData();
         console.log('leave cke',txt);
        $(this).parent().on('click',lauchCK);
        var $parent =  $(this).parent();
//        CKEDITOR.instances[$(this).prev().attr('id')].destroy();
        
//       $parent.html(txt);

//        $(this).parent().children().remove();
        $(this).parent().html(txt);
        
        
        
    });
}


function lauchCK() {
        //empecher le double lauch
        if( $(this).children('textarea').length !== 0 )
            return;
    
    
//        $(this).css('display','none');
        var txt = $(this).html();
        console.log('laych ck',txt);
        $(this).html('');
        $(this).append("<textarea style='display:none;'id='textarea" + globalCpt++ + "'>"+txt+"</textarea>");
        console.log('go ck');
        CKEDITOR.replace($($(this).children('textarea')).attr('id'));

    }


function goSlideShow() {

    console.log('GO SLIDESHOW');

//    $('#slideArea .step').each(function(){
//        if( $(this).attr('id') === 'home' ) return; //cette foutue slide n'existe pas dans le container !
//         container.slide[$(this).attr('matricule')].destroy();
//    });
//    

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
 * obsolete
 * 
 */
function goTreeMaker() {
    console.log('RETURN TREE MAKER  ');


    $('#slideArea .step').each(function() {
        if ($(this).attr('id') === 'home')
            return; //cette foutue slide n'existe pas dans le container !
//        container.slide[$($('#slideArea .step')[5]).attr('matricule')].destroy()
        console.log($(this).attr('matricule'));
        if (!findObjectOfComposant($(this).attr('matricule')))
            return;
        container.getSlide($(this).attr('matricule')).destroy();
    });

    $('#tree').attr('id', 'treeMaker');
    $('#treeMaker .questions').each(function() {
        $(this).remove();
    });
    $('#treeMaker ol').each(function() {
        $(this).append("<li class='addSibling'>Add Sibling</li>");
    });

}


/*
 * creation du #treeMaker depuis le container
 * en admettant que les slides sont dans l'odre de la hierarchy
 * (s'il existe, l'adaptateur devra s'arrange pour ce que ce soit le cas)
 */
function goTreeFromContainer() {
    $('#slideArea').jmpress('deinit');
    //desinit de la présentation
//    $('#slideArea .step').each(function() {
//        if ($(this).attr('id') === 'home')
//            return; //cette foutue slide n'existe pas dans le container !
////        container.slide[$($('#slideArea .step')[5]).attr('matricule')].destroy()
////        console.log($(this).attr('matricule'));
//        if (!findObjectOfComposant($(this).attr('matricule')))
//            return;
//        container.getSlide($(this).attr('matricule')).destroy();
//    });

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

    console.log('goTreefromcontainer', $tree, container.slide);
    $tree.children('ol').html('');





    var prevH = [0];
    var $target = $tree.children('ol');
    var $prevTarget = $tree.children('ol');
    var prevNiv;
    var niv;
//    for (var matricule in container.slide) {
    var cpt = 0;
    $.each(container.slide, function(matricule, slide) {
        //alert();
        cpt++;
        var matricule = slide.matricule;
//        var slide = container.slide[matricule];
        if (slide.type === 'overwiew') {


            console.log('debug : goTreeFromContainer : overview create return');
            return;
        }
        var hierarchy = slide.properties.hierarchy.split('.');
        console.log('hierarchy', hierarchy);
        if (hierarchy[0] === 'undefined') {
            console.log('debug : goTreeFromContainer  : undefined hierarchy eturn');
            return;
        }
        if (hierarchy[0] === '0') {
            console.log('debug : goTreeFromContainer : debug :hierarchy == 0 return');
            return;
        }
        for (var i in hierarchy) {
            hierarchy[i] = parseInt(hierarchy[i]);
        }

        var data = {
            'indice': slide.properties.hierarchy,
        };
        var content = '';
        for (var matEle in slide.element) {
//            data['content'] = slide.element[matEle].properties.content;
            var content = content + slide.element[matEle].properties.content;
        }
        data[slide.style] = 'true';



//        var template = $('#templateSibling').html();
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
//            console.log(niv, prevNiv, i, $target);


            //$target = $prevTarget.parent().parent();  //prevTarget -> parent li -> parent ol
        } else if (niv === prevNiv) {   //mm niveau
            $target = $prevTarget;
        } else if (niv > prevNiv) { //niveau plus bas
            //pour ne pas prendre les boutons, impossible d'ajoute des titres à des buttons !
            $target = $($prevTarget.children('li:not(.addSibling)')[$prevTarget.children('li:not(.addSibling)').length - 1]).children('ol');
        }

        console.log('tree building', $target, hierarchy);

//        alert();
        var $button = $target.children('.addSibling');
        $target.append(html);
        //ajout du texte ne se fait pas via mustache car il n'interprete pas le html (c'est l'un ou l'autre (ou exclusif))
        $($target.children()[$target.children().length-1]).children('.liTitle').html(content);
        $($target.children()[$target.children().length-1]).children('.textarea').html(content);
        
        //handler CK
         $($target.children()[$target.children().length-1]).children('.textarea').on('click',lauchCK);
        
        
        $target.append($button);


        $prevTarget = $target;

        prevH = hierarchy;

    });

    $('#treeMaker').children('ol').append("<li class='addSibling'>Add Sibling</li>");

    console.log('debug treefromcontainer : nb de passafge dans .each(slide', cpt);
//    initContainer();

}