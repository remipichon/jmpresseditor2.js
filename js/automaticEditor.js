/*
 * 
 * Calcul des positions d'une présentation à partir d'une liste comprenant le plan et les contenus
 * 
 *  Mode présentation à plat avec changement de niveau à chaque changement de partie
 *  Les contents sont au meme niveau que leur partie, vers le bas 
 * 
 * 
 * 
 */


/*
 * Determination des positions des slides pendant la présentation, les coordonnées sont stockées dans la liste
 * Chaque li représente une slide
 * 
 */
function goPosition() {
    var cranY = 1000;
    var cranZ = -1000;
    var cranX = 1800;
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
            var y = parseInt($(this).parent().parent().attr('data-y')) + cranY; //pour atteindre la li qui la stocke
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
            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).index() + 1) * cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;

            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
            $(this).attr('type', 'content');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);

        }

    });
}


/*
 * Calcul des positions des slides pour l'état final
 * Les coordonnées sont stockées dans la liste ol, chaque li correspond à une slide
 */
function goPositionEnd() {
    var cranY = 1000;
    var cranZ = -1000;
    var cranX = 1800;
   

    //archivage de la coord Y de la plus haute et de la plus basse slide pour l'overview final
    var upperY = -5000;
    var lowerY;

    //premiers niveaux
    $('#tree li').each(function() {

        if ($(this).attr('depth') === '1') {
            var x = 0;
            var z = 0;
            if ($(this).index() === 0) { //initialisation de la positio de la toute première slide
                var y = upperY;
            } else {
                var y = parseInt($(this).prev().attr('data-end-y')) + (parseInt(maxDepth($(this).prev(), 0))) * cranY * 1.2;
            }

            $(this).attr('data-end-x', x).attr('data-end-y', y).attr('data-end-z', z);
            $(this).attr('type', 'title');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', indice);
            lowerY = y;

        }


    });

    //les autres niveaux
    $('#tree li').each(function() {
        if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') !== '0') {

            var x = (parseInt($(this).attr('depth')) - 1) * cranX;
            var z = 0;
            
            if ($(this).index() === 0) { //si première fille
                var y = parseInt($(this).parent().parent().attr('data-end-y')) + ($(this).index() + 1) * cranY * 0.5;
            } else {
                var y = parseInt($($(this).prev()).attr('data-end-y')) + (maxDepth($(this).prev(), 0) - $(this).attr('depth')) * cranY * 1.2; //position de sa grande soeur//depth-1 pour virer le content
            }
            $(this).attr('data-end-x', x).attr('data-end-y', y).attr('data-end-z', z);
            $(this).attr('type', 'title');
            var indice = parseInt($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);



        } // sinon c'est du contenu, on ne s'en occupe pas

    });
    
    //ajout de la slide de questions
    var li = "<li uppery = '"+upperY+"' lowery = '"+lowerY+"' >Any questions ?</li>";
    $('#tree').children('ol').append(li);

    //lowerY a été instancié pour la dernière fois par l'element le plus 'bas' dans la lsite ul li
}



/*
 * A partir de la liste qui a été parsée pour ajouter les coordonnées, créer les slides et leurs contenus
 * Ajoute également les slides qui ne font pas partie de la présentation, à savoir les overviews, les slides d'accueils et de concluion (any questions ?)
 */
function goJmpress() {

    //creation des slides jmpress
    $('#tree li').each(function() {

        if (typeof $(this).attr('uppery') !== 'undefined') {
            var upperY = parseInt($(this).attr('uppery'));
            var lowerY = parseInt($(this).attr('lowery'));
            new Slide({
                matricule: 'end',
                pos: {
                    x: 10000,
                    y: (upperY + lowerY) / 2,
                    z: 0
                },
                scale: 15,
                type: 'overview'
            }
            );
            var slide = new Slide({
                matricule: 'questions',
                pos: {
                    x: 1500,
                    y: 0,//(upperY + lowerY) / 2,
                    z: 0
                },
                scale: 10

            }
            );
            new Text(slide.matricule, {
                properties: {
                    content: 'Any questions ?',
                    hierarchy: 'H1Text'
                },
                pos: {
                    x: 0,
                    y: 0
                }

            });
            return;
        }

        //si besoin ajout de l'overview
        //titre
        if ($(this).attr('type') === 'title') {
            //s'il y au moins une petite soeur
            //console.log($(this).index() , parseInt($(this).attr('siblings')) -1);
            if ($(this).index() < parseInt($(this).attr('siblings')) - 1) {

                var over = new Slide({
                    type: 'overview',
                    pos: {
                        x: (parseInt($(this).attr('data-x')) + parseInt($($(this).siblings()[$(this).siblings().length - 1]).attr('data-x'))) / 2,
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

