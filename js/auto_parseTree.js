/* 
 *  Outils communs pour le parse d'une liste à puce destiné à préparer le positionnement des slides 
 *  et la gestion de la présentation en dynamique
 *
 */



/*
 * Wrap les content dans une span pour facilement le traitement
 */ 
function goCK() {
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


