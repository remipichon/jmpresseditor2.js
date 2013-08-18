
function handlerTreeMaker() {

    $('#treeMaker').on('click', '.addSibling', function() {
        console.log('add sib');
        var data = {
        };

        var template = $('#templateSibling').html();
        var html = Mustache.to_html(template, data);


        $(this).parent().append(html);
        $(this).parent().append($(this)); //deplacement du bouton



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
    $('#treeMaker').attr('id', 'tree');
    initAutomatic();
}


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
    console.log('goTree');
    var $tree = $('#treeTest');
    var prevH = [0];
    var $target = $tree.children('ol');
    var $prevTarget = $tree.children('ol');
    var prevNiv;
    var niv;
//    for (var matricule in container.slide) {
    $.each(container.slide, function(matricule, slide){
        var matricule = slide.matricule;
//        var slide = container.slide[matricule];
        if( slide.type === 'overwiew') return;
        var hierarchy = slide.properties.hierarchy.split('.');
        if(  hierarchy[0] === 'undefined' ) return;
        if( hierarchy[0] === '0') return;
        for (var i in hierarchy) {
            hierarchy[i] = parseInt(hierarchy[i]);
        }

        var data = {
        };

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
            for( var i = 1; i < diff;i++){
                $target = $target.parent().parent();
            }
            
            
            $target = $prevTarget.parent().parent();  //prevTarget -> parent li -> parent ol
        } else if (niv === prevNiv) {   //mm niveau
            $target = $prevTarget;
        } else if (niv > prevNiv) { //niveau plus bas
            $target = $($prevTarget.children('li')[$prevTarget.children('li').length-1]).children('ol');
        }

        console.log($target,hierarchy);

//        alert();
        $target.append(html);


        $prevTarget = $target;
        prevH = hierarchy;




    });

}