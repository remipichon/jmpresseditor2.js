/* 
 *outils pour l'init de la présentation depuis une liste à puce ordonnée stockée dans layout.html
 *
 *                  ATTENTION   pour le moment c'est guetto de stocker la lise à puce dans le layout.html, mais ca changera bientot !
 */


deltaZ = 1000;

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

sibPerLevel = new Array();
function goDepth() {



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
 * supber fonction recursive qui permet de determiner la profondeur max d'une li !
 */
//$node  => li de la liste
// max  => 0
function maxDepth($node,max) {

//    $($('li')[95]).prev();
    // condition de sortie
//    alert($node.attr('nbchild'));
    if ($node.attr('nbchild') == 0) {
        console.log($node.attr('depth'));
//        alert();
        if( $node.attr('depth') > max )   return $node.attr('depth');
        
        return max;
    }

    //recursivité
    var $lis = $($node.children('ol')[0]).children(); 
    
    
//    var $ols = $node.children()[parseInt($node.attr('nbchild')-1)];;
    var $ols = $lis;
    for( var i=0,len=$ols.length; i<len; i++){ 
        var $li = $($ols[i]);
        max = maxDepth($li,max);
    }
    
    
    return max;

}


function goPosition() {
    var cranY = 500;
    var cranZ = -1000;
    var cranX = 1200;
    //////calcul des positions 
    $('#tree').attr('number', '');
    $('#tree').prepend("<span style='display:none'>Jmpress Editor -</span>");
    //premiers niveaux
    $('#tree li').each(function() {

        if ($(this).attr('depth') === '1') {

            var delta = 1000;
            var x = -1500 + parseInt($(this).index()) * cranX;
            var y = 0;
//            var z = 1213;//parseInt($(this).attr('data-z')) + cranZ;
//            var z = parseInt($(this).index()) * cranZ;
//            var z = parseInt($(this).prev().attr('data-z')) + (parseInt(maxDepth($(this).prev(),0))+1)*cranZ;
//            var z =  (parseInt(maxDepth($(this).prev(),0)))*cranZ;
            if( $(this).index() == 0 ){
//                alert(0);
                 var z =  (parseInt(maxDepth($(this).prev(),0))+1)*cranZ;
            } else {
//                alert(parseInt($(this).prev().attr('data-z')));
                var z = parseInt($(this).prev().attr('data-z')) + (parseInt(maxDepth($(this).prev(),0)))*cranZ;
            }
            
//            alert(maxDepth($(this).prev(),0));

            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z).attr('data-rotate-x', '-45');
            $(this).attr('type', 'title1');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', indice);
            //$(this).children('span').html('x ' + x + ' y ' + y + ' z ' + z);
        }


    });

    //les autres niveaux
    $('#tree li').each(function() {
        if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') !== '0') {
            var delta = 1000;
            var x = $(this).parent().parent().attr('data-x'); //va changer
            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).attr('depth')) * cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;
            if ($(this).index() === 0) { //si première fille
//                var y = parseFloat($(this).parent().parent().attr('data-y')) + delta; //pour atteindre la li qui la stocke                      
                var x = x;

            } else {                                                                    //compensation de deplacement en fn du nb d'enfant non mit verticalement ! il faut le prendre en compte 
                var x = parseInt($($(this).prev()).attr('data-x')) + cranX; //position de sa grande soeur
//                var y = $($(this).prev()).attr('data-y');
//                var y = parseFloat($(this).parent().parent().attr('data-y')) + delta * ($(this).index() + 1);
//                if ($($(this).prev('li').children('ol').children('li')[0]).attr('nbChild') !== '0') { //si le precedent siblings a des enfants qui ont des enfants, ces enfants (au sibling) ne sont pas du contenu, il faut donc leur laisser la place de se mettre en y 
//                    y += delta * 1.5 * $(this).prev('li').attr('nbChild');
//                }
            }
            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'title1');
            var indice = parseInt($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);


        } else if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') === '0') {       //si pas d'enfants, c'est du contenu, slides horizontales                        
            
            
            var x = parseInt($(this).parent().parent().attr('data-x')) + $(this).index()*cranX/2 ; 
            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).attr('depth')) * cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;
//            
//            var x = $(this).parent().parent().attr('data-x'); //pour atteindre la li qui la stocke
//            var y = $(this).parent().parent().attr('data-y');
//            var z = parseFloat($(this).parent().parent().attr('data-z')) - ($(this).index() + 1) * 1500;
            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'content');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);

        }

    });
}






function goJmpress() {



    j = 0;  //pas très algorythmique cela

    //////////////////////créer les overview dans le json
    var id = 0;
    var Ox = 4300;//sibPerLevel[1] * 2000 / 2;
    var Oy = 1000;//max(sibPerLevel) * 1000 / 2;
    var Oz = 2700;
    var scale = 9.5;



    //creation des slides jmpress
    $('#tree li').each(function() {

        var evCodeSlide = ({
            type: 'code',
            rotateX: $(this).attr('data-rotate-x'),
            rotateY: 0,
            rotateZ: 0,
            x: $(this).attr('data-x'),
            y: $(this).attr('data-y'),
            z: $(this).attr('data-z'),
            id: "slide-" + id++,
            typeEl: 'slide title',
            index: id,
            scale: 1
        });

//        createSlide('slide', evCodeSlide);
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