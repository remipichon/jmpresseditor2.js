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



    //calcul des positions                
    $('#tree li').each(function() {

        if ($(this).attr('depth') === '1') {

            var delta = 1000;
            var x = 2000 * $(this).index();
            var y = 500 * $(this).index();
            var z = 5000;


            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
             $(this).attr('type', 'title');
            //$(this).children('span').html('x ' + x + ' y ' + y + ' z ' + z);
        }


    });


    $('#tree li').each(function() {
        if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') !== '0') {
            var delta = 1000;
            var x = $(this).parent().parent().attr('data-x'); //pour atteindre la li qui la stocke
            var z = $(this).parent().parent().attr('data-z') - deltaZ;
            if ($(this).index() === 0) {
                var y = parseFloat($(this).parent().parent().attr('data-y')) + delta; //pour atteindre la li qui la stocke                      

            } else {                                                                    //compensation de deplacement en fn du nb d'enfant non mit verticalement ! il faut le prendre en compte 

                var y = parseFloat($(this).parent().parent().attr('data-y')) + delta * ($(this).index() + 1);
                if ($($(this).prev('li').children('ol').children('li')[0]).attr('nbChild') !== '0') { //si le precedent siblings a des enfants qui ont des enfants, ces enfants (au sibling) ne sont pas du contenu, il faut donc leur laisser la place de se mettre en y 
                    y += delta * 1.5 * $(this).prev('li').attr('nbChild');
                }
            }
            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'title');


        } else if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') === '0') {       //si pas d'enfants, c'est du contenu, slides verticales                        

            var x = $(this).parent().parent().attr('data-x'); //pour atteindre la li qui la stocke
            var y = $(this).parent().parent().attr('data-y');
            var z = parseFloat($(this).parent().parent().attr('data-z')) - ($(this).index() + 1) * 1000;
            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'content');

        }

    });


}

function goJmpress() {
    var id = 0;
    var Ox = 0;//sibPerLevel[1] * 2000 / 2;
    var Oy = 2000;//max(sibPerLevel) * 1000 / 2;
    var Oz = 0;
    var overview = "<div class='step overview' data-x = '" + Ox + "' data-y =' " + Oy + " ' data-z =' " + Oz + " ' data-scale='10'></div>";
    $('#slideArea').children().append(overview);
    Ox = 0;//-sibPerLevel[1] / 2 * 2000 + 2000;
    Oy = 2000;//max(sibPerLevel) * 1000 / 2;
    Oz = -3 * deltaZ / 2; //recupérer ici la profondeur max
    var overview2 = "<div class='step overview' data-x = '" + Ox + "' data-y =' " + Oy + " ' data-z =' " + Oz + " '  data-rotate-z='0' data-rotate-y='-45' data-scale='15'></div>";
    $('#slideArea').children().append(overview2);

    //creation jmpress
    $('#tree li').each(function() {

        var evCodeSlide = ({
            type: 'code',
            rotateX: 0,
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

        createSlide('slide', evCodeSlide);

        var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)
        

        var evCodeText = ({
            type: 'code',
            container: $newSlide,
            x: '40',
            y: '200',
            z: '0',
            content: $(this).children('span').html()
        });
        
        j = 0;  //pas très algorythmique cela

        if ($(this).attr('type') === 'title') {
            createText('title1', evCodeText);
        } else if ($(this).attr('type') === 'content') {
            createText('bodyText', evCodeText);
        }

        //var titre = "<div  class='element' style='position: relative; left: 40px; top: 300px' > <span class=title1> " + $(this).children('span').html() + " </span> </div> ";


        //ici il faut agrementer un fichier json et appeller la fonction qui crée la présentation à partir d'un fichier json (factoriser ce traitement)
        //var slide = "<div  class='step slide' data-x = ' " + $(this).attr('data-x') + " ' data-y = '  " + $(this).attr('data-y') + " ' data-z = '  " + $(this).attr('data-z') + " ' data-rotate-x='0' data-rotate-y='0' data-rotate-z='0' data-scale = '1' > " + titre + " </div> ";
        //$('#slideArea').append(slide);

    });

//    $('#tree').remove();
//    CKEDITOR.instances.editor1.destroy();
//    $('#editor1').remove();
//    $('#slideArea').jmpress();
//    console.log('go jmpress');


}

//
//            $(document).ready(function() {
//                goDepth();
//                goJmpress();
//            });



