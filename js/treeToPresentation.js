/* 
 *outils pour l'init de la présentation depuis une liste à puce ordonnée stockée dans layout.html
 *
 *                  ATTENTION   pour le moment c'est guetto de stocker la lise à puce dans le layout.html, mais ca changera bientot !
 */




function goCK() {
//    $('#slideArea').html('');
//    var editor_data = CKEDITOR.instances.editor1.getData();
//    $('#tree').html(editor_data);

    $('#tree li').each(function() {
        //var span = "<span class='li' contenteditable='true'> texte </span>";
        var span = "<span class='li' contenteditable='true'> " + $(this).html().match(/.*/)[0] + " </span>";
//        var span = "<span class='li' contenteditable='true'> " + '$(this).html()' + " </span>";
        //$(this).html('');
        $(this).prepend(span);

    });


}


function max(array) {
    var m = 0;
    for (var val in array) {
        if (array[val] >= m) {
            m = array[val];
        }
        ;

    }
    return m;
}

//function maxDepth



function goDepth() {
    
    var sibPerLevel = new Array();



    //stocke le nombre de siblings par niveau de profondeur (independament des parents)
    //ex : si on a sibPerLevel[2] = 4 cela signifie qu'en tout il y a 4 sous titre de niveau 2 (mais il est possible que que chacun de ces sous titres soient dans une partie mère différente



    //determintation des niveaux de profondeur et nombre de siblings de chaque partie/sous partie
    $('#tree li').each(function() {
        //compteur de niveau
        var depth = $($(this), "#tree").parents('ol').length;

        //compteur d'element par niveau
        var siblings = $(this).parent().children('li').length;

        //compteur d'enfant li
        var nbChild = $(this).children('ol').children('li').length;

        if (sibPerLevel[depth] === undefined) {
            sibPerLevel.push(0);
        } else {
            sibPerLevel[depth] = sibPerLevel[depth] + siblings;
        }

        //$(this).children('span').html('nb enfant ' + nbChild);
        $(this).attr('depth', depth).attr('siblings', siblings).attr('nbChild', nbChild);
    });
}

/*
 * 
 * @param {type} $node
 * listChild : array vide : []
 * moins habile fonction qui permet de récupérer les filles d'un noeud
 */
function getChildren($node, listChild) {

    //condition de sortie
    if ($node.attr('nbchild') == 0) {
        return listChild;
    }

    //recursivité
    var $lis = $($node.children('ol')[0]).children();
    for (var i = 0, len = $lis.length; i < len; i++) {
        var $li = $($lis[i]);   
        listChild.push($li.attr('matricule'));
        listChild = getChildren($li, listChild);
    }
    return listChild;
}



/*
 * supber fonction recursive qui permet de determiner la profondeur max d'une li !
 */
//$node  => li de la liste
// max  => 0
function maxDepth($node, max) {

    //condition de sortie
    if ($node.attr('nbchild') == 0) {
//        console.log($node.attr('depth'));
        if ($node.attr('depth') > max)
            return $node.attr('depth');
        return max;
    }

    //recursivité
    var $lis = $($node.children('ol')[0]).children();
    for (var i = 0, len = $lis.length; i < len; i++) {
        var $li = $($lis[i]);
//        console.log($li.html());
        max = maxDepth($li, max);
    }


    return max;

}


function goPosition() {
    var cranY = 1000;
    var cranZ = -1000;
    var cranX = 1200;
    //////calcul des positions 
    $('#tree').attr('number', '');
    $('#tree').prepend("<span style='display:none'>Jmpress Editor -</span>");
    //premiers niveaux
    $('#tree li').each(function() {

        if ($(this).attr('depth') === '1') {
            var x = -1500 + parseInt($(this).index()) * cranX;
            var y = 0;
            if ($(this).index() === 0) { //initialisation de la positio de la toute première slide
                var z = (parseInt(maxDepth($(this).prev(), 0))) * cranZ;
            } else {
                var z = parseInt($(this).prev().attr('data-z')) + (parseInt(maxDepth($(this).prev(), 0))) * cranZ;
            }

            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z).attr('data-rotate-x', '-45');
            $(this).attr('type', 'title');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', indice);
        }


    });

    //les autres niveaux
    $('#tree li').each(function() {
        if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') !== '0') {
            
            var x = $(this).parent().parent().attr('data-x'); //va changer
//            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).attr('depth')) * cranY; //pour atteindre la li qui la stocke
            var y = parseInt($(this).parent().parent().attr('data-y')) +  cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;
            if ($(this).index() === 0) { //si première fille
                var x = x;
            } else {
                var x = parseInt($($(this).prev()).attr('data-x')) + cranX; //position de sa grande soeur
            }
            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'title');
            var indice = parseInt($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);


        } else if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') === '0') {       //si pas d'enfants, c'est du contenu, slides horizontales                        


            var x = parseInt($(this).parent().parent().attr('data-x')) + $(this).index() * cranX / 2;
//            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).attr('depth')) * cranY; //pour atteindre la li qui la stocke
//            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).index()) * cranY; //pour atteindre la li qui la stocke
            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).index()+1) * cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;
            
            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'content');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);

        }

    });
}






function goJmpress() {

    //creation des slides jmpress
    $('#tree li').each(function() {
        
        //si besoin ajout de l'overview
        //titre
        if( $(this).attr('type') === 'title' ){
            //s'il y au moins une petite soeur
            //console.log($(this).index() , parseInt($(this).attr('siblings')) -1);
            if($(this).index() < parseInt($(this).attr('siblings')) -1 ){
                
                var over = new Slide({
                    type: 'overview',
                    pos: {
                        x: (parseInt($(this).attr('data-x')) + parseInt($($(this).siblings()[$(this).siblings.length-1]).attr('data-x') ))/2,
                        y: $(this).attr('data-y'),
                        z: $(this).attr('data-z')                     
                    },
                    scale: $(this).attr('siblings')
                });
                
//                console.log(parseInt($(this).attr('data-x')), parseInt($($(this).siblings()[$(this).siblings.length-1]).attr('data-x') ));
//                console.log('new overview ',over.pos.x,over.pos.y,over.pos.z);
                
            }
        }
       
     
        
        //ajout de la slide
        var slide = new Slide({
            pos: {
                x: $(this).attr('data-x'),
                y: $(this).attr('data-y'),
                z: $(this).attr('data-z')
            }
        });

        new Text(slide.matricule, {
            properties: {
                hierachy: 'H1Text',
                content: $(this).children('span').html()
            }
        });

        //ecriture du matricule de la slide dans la liste
        $(this).attr('matricule', slide.matricule);
        $(this).attr('id', 'li_' + slide.matricule);

    });


} //fin goJmpress


function goAutoAlign() {

    //$('#slideArea .slide').each(function() {
    $('#slideArea .slide').each(function() {
        var sizeMax = parseInt($(this).height());

        var totHeight = 0;
        $(this).children('.element').each(function() {
            totHeight += parseInt($(this).height());

            if ($(this).children()[0].className === 'bodyText') {
                totHeight = -10000;
            }

        });

        //compensation pour les trop gros
        if (totHeight > sizeMax) {     //si depassement de la slide
            $($(this).children()[0]).children().css('padding-bottom', 60).css('font-size', '3em');     //reduction de l'espace titreslide/contenu
            $($(this).children()[1]).children().css('font-size', '5em');
            totHeight = 0;
            $(this).children('.element').each(function() {
                totHeight += parseInt($(this).height());

            });
            //console.log(totHeight);

            if (totHeight > sizeMax) {     //si encore depassement de la slide
                $($(this).children()[0]).children().css('padding-bottom', 10).css('font-size', '2em');     //reduction de l'espace titreslide/contenu
                $($(this).children()[1]).children().css('font-size', '4em');


                var totHeight = 0;
                $(this).children('.element').each(function() {
                    totHeight += parseInt($(this).height());

                });

            }
        }

        //positionnement à proprement dit
        $($(this).children('.element')).each(function() {

            //console.log("totpourtous " + totHeight);


            if (totHeight > 0) {        //permet d'exclure les slides de content
                var height = parseInt($(this).height());
                var midAllText = sizeMax / 2 - totHeight / 2;
                var top = midAllText + height / 2;
                var top = (sizeMax - totHeight) / 2;
                //console.log(totHeight + " " + height + " " + midAllText + " " + top);

                $(this).css('top', top);

            }
        });
    });

    $('#slideArea').jmpress('deinit');
    $('#slideArea').jmpress();

}


function initPress() {
    goCK();
    goDepth();
    goJmpress();
}