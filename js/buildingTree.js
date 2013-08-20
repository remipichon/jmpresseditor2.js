
function handlerTreeMaker() {

    $('#treeMaker').on('click', '.addSibling', function() {
        console.log('add sib');
        var data = {
            'content': 'Type title here',
            'title': true
        };

        var template = $('#templateSibling').html();
        var html = Mustache.to_html(template, data);


        $(this).parent().append(html);
        $(this).parent().append($(this)); //deplacement du bouton



    });

    
    $('#treeMaker').on('click','.removeSibling',function(){
        console.log('remove',$(this));
        $(this).parent().next('ol').remove();
       $(this).parent().remove(); 
    });
    
    $('#treeMaker').on('click','.switchContent',function(){
        console.log('switch to content',$(this));
        $(this).parent().children('liTitle').remove();
        
        var template = $('#templateContent').html();
        data = {
            
        };
        var html = Mustache.to_html(template,data); 
        $(this).parent().prepend(html);
        $(this).siblings('.liTitle').remove();
    });
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
    
    //desinit de la présentation
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
        if (slide.type === 'overwiew')
            return;
        var hierarchy = slide.properties.hierarchy.split('.');
        console.log('hierarchy',hierarchy);
        if (hierarchy[0] === 'undefined')
            return;
        if (hierarchy[0] === '0')
            return;
        for (var i in hierarchy) {
            hierarchy[i] = parseInt(hierarchy[i]);
        }
        
        var data = {
            'indice': slide.properties.hierarchy,
            
        };
        
        for( var matEle in slide.element){           
            data['content'] = slide.element[matEle].properties.content;
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
//            console.log(niv, prevNiv, i, $target);


            //$target = $prevTarget.parent().parent();  //prevTarget -> parent li -> parent ol
        } else if (niv === prevNiv) {   //mm niveau
            $target = $prevTarget;
        } else if (niv > prevNiv) { //niveau plus bas
            $target = $($prevTarget.children('li')[$prevTarget.children('li').length - 1]).children('ol');
        }

        console.log($target, hierarchy);

//        alert();
        var $button = $target.children('.addSibling');
        $target.append(html);
        $target.append($button);


        $prevTarget = $target;
           
        prevH = hierarchy;

    });
    
    $('#treeMaker').children('ol').append("<li class='addSibling'>Add Sibling</li>");
    
    console.log('debug treefromcontainer : nb de passafge dans .each(slide',cpt);
//    initContainer();

}