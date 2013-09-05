/* 
 *  Outils communs pour le parse d'une liste à puce destiné à préparer le positionnement des slides 
 *  et la gestion de la présentation en dynamique
 *
 */



/*
 * Wrap les content dans une span pour facilement le traitement
 */ 
function goCK(config) {
    $('#tree li').each(function() {
       
        var span = "<span style='display:'none' class='li' contenteditable='true'> " + $(this).html().match(/.*/)[0] + " </span>";

        $(this).prepend(span);
        
        if( $(this).attr('nbChild') === '0'  ) //pas de fils, donc c'est du content
            $(this).attr('type','content');
        

    });


}

/*
 * Determine le maximun dans un tableau
 * @param {type} array
 * @returns {Number}
 */
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


/*
 * Parse la liste ol pour determiner la profondeur, le nombre d'enfant et le nombre de jumeaux (soeurs) de chaque li
 */
function goDepth(config) {

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
 * Retourne une liste des matricules des enfants d'un noeud (via la liste)
 * input : 
    * @param {type} $node
    * listChild : array vide : []
 * output : 
 *      liste des enfants d'un noeud
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

function getChildrenTitre($node){
    var list = getChildren($node,[]);
    for( var i in list){
        
        if( $('#li_'+list[i]).attr('type') === 'content' ){
            list.splice(i,1);
        }
    }
    return list;
}

/*
 * 
 * obtenir le dernier element (le plus 'bas vertivalement') d'un noeud d'une liste
 */
function getLastChild($node){
    //condition de sortie
    if( $node.attr('nbchild') == 0 ){
        return $node.parent().parent(); //pour ne pas prendre en compte les slides de content
    }    
    
    //recursivité
    var $last = $($node.children()[$node.children().length-1]);
    return getLastChild($last);
    
    
}   


/*
 * supber fonction recursive qui permet de determiner la profondeur max d'une li !
 */
//$node  => li de la liste
// max  => 0
function maxDepth($node, max) {

    //condition de sortie
    if ($node.attr('nbchild') == 0) {
//        //console.log($node.attr('depth'));
        if ($node.attr('depth') > max)
            return $node.attr('depth');
        return max;
    }

    //recursivité
    var $lis = $($node.children('ol')[0]).children();
    for (var i = 0, len = $lis.length; i < len; i++) {
        var $li = $($lis[i]);
//        //console.log($li.html());
        max = maxDepth($li, max);
    }

    return max;

}




/*
 * Une fois la présentation prête, cette fonction s'assure que chaquement contenu texte ne dépasse pas de la slide
 * Si c'est le cas, procède à une série de redimensionnement pour tout faire rentrer dans chaque slide
 */
function goAutoAlign(config) {

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
            ////console.log(totHeight);

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

            ////console.log("totpourtous " + totHeight);


            if (totHeight > 0) {        //permet d'exclure les slides de content
                var height = parseInt($(this).height());
                var midAllText = sizeMax / 2 - totHeight / 2;
                var top = midAllText + height / 2;
                var top = (sizeMax - totHeight) / 2;
                ////console.log(totHeight + " " + height + " " + midAllText + " " + top);

                $(this).css('top', top);

            }
        });
    });

    $('#slideArea').jmpress('deinit');
    $('#slideArea').jmpress();

}

