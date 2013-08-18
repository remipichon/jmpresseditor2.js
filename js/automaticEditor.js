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

function initAutomatic() {
    var config = {
        cranX: 1800,
        cranY: 1000,
        cranZ: -1000,
        liveX0: 10000,
        liveY0: 10000,
        liveZ0: 10000,
        endX0: -10000,
        endY0: -10000,
        endZ0: -10000
    };
    var config = {
        cranX: 1800,
        cranY: 1000,
        cranZ: -1000,
        liveX0: -1500,
        liveY0: 0,
        liveZ0: 0,
        endX0: 0,
        endY0: -1500,
        endZ0: 0
    };
//    goCK(config);
    goDepth(config);
    goPosition(config);
    goPositionEnd(config);
    goJmpress(config);
    dynamic(config);
}


/*
 * Determination des positions des slides pendant la présentation, les coordonnées sont stockées dans la liste
 * Chaque li représente une slide
 * 
 */
function goPosition(config) {
    var cranX = config.cranX;
    var cranY = config.cranY;
    var cranZ = config.cranZ;

    //////calcul des positions 
    $('#tree').attr('number', '');
    $('#tree').prepend("<span style='display:none'>Jmpress Editor -</span>");
    //premiers niveaux
    $('#tree li').each(function() {

        if ($(this).attr('depth') === '1') {
            var x = config.liveX0 + parseInt($(this).index()) * cranX;
            var y = config.liveY0;
            if ($(this).index() === 0) { //initialisation de la positio de la toute première slide
                var z = config.liveZ0;
            } else {
                var z = parseInt($(this).prev().attr('data-z')) + (parseInt(maxDepth($(this).prev(), 0))) * cranZ;
            }

            $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z).attr('data-rotate-x', '-45');
            $(this).attr('type', 'title');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', indice);
        }


    });

    //les autres niveaux  (ne pas factoriser avec le traitement des premiers niveaux car les autres niveaux ont besoin des premiers niveaux pour s'appuyer
    $('#tree li').each(function() {
        if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') !== '0') {

            if ($(this).index() === 0) { //si première fille
                var x = $(this).parent().parent().attr('data-x');
            } else {
                var x = parseInt($($(this).prev()).attr('data-x')) + cranX; //position de sa grande soeur
            }
            var y = parseInt($(this).parent().parent().attr('data-y')) + cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;

            $(this).attr('type', 'title');

        } else if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') === '0') {       //si pas d'enfants, c'est du contenu, slides horizontales 

            var x = parseInt($(this).parent().parent().attr('data-x')) + $(this).index() * cranX / 2;
            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).index() + 1) * cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;

            $(this).attr('type', 'content');

        }

        $(this).attr('data-x', x).attr('data-y', y).attr('data-z', z);
        var indice = parseFloat($(this).index()) + 1;
        var parentNumber = $(this).parent().parent().attr('number');
        $(this).attr('number', (parentNumber === '') ? indice : parentNumber + "." + indice);
    });
}


/*
 * Calcul des positions des slides pour l'état final
 * Les coordonnées sont stockées dans la liste ol, chaque li correspond à une slide
 */
function goPositionEnd(config) {
    var cranX = config.cranX;
    var cranY = config.cranY;
    var cranZ = config.cranZ;


    //archivage de la coord Y de la plus haute et de la plus basse slide pour l'overview final
    var upperY = config.endY0;
    var lowerY;

    //premiers niveaux
    $('#tree li').each(function() {

        if ($(this).attr('depth') === '1') {
            var x = config.endX0;
            var z = config.endZ0;
            if ($(this).index() === 0) { //initialisation de la positio de la toute première slide
                var y = upperY;
            } else {
                var y = parseInt($(this).prev().attr('data-end-y')) + (parseInt(maxDepth($(this).prev(), 0))) * cranY * 1.2;
                var y = parseInt(getLastChild($(this).prev()).attr('data-end-y')) + cranY;
            }

            $(this).attr('data-end-x', x).attr('data-end-y', y).attr('data-end-z', z);
            $(this).attr('type', 'title');
            var indice = parseFloat($(this).index()) + 1;
            $(this).attr('number', indice);
            lowerY = y;

        }


//    });

        //les autres niveaux
//    $('#tree li').each(function() {
        if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') !== '0') {

            var x = config.endX0 + (parseInt($(this).attr('depth')) - 1) * cranX;
            var z = config.endZ0;

            if ($(this).index() === 0) { //si première fille
                var y = parseInt($(this).parent().parent().attr('data-end-y')) + ($(this).index() + 1) * cranY * 0.5;
            } else {
//                var y = parseInt($($(this).prev()).attr('data-end-y')) + (maxDepth($(this).prev(), 0) - parseInt($(this).attr('depth'))) * cranY ;//* 1.2; //position de sa grande soeur//depth-1 pour virer le content
                var y = parseInt(getLastChild($(this).prev()).attr('data-end-y')) + cranY;
            }
            $(this).attr('data-end-x', x).attr('data-end-y', y).attr('data-end-z', z);
            $(this).attr('type', 'title');
            var indice = parseInt($(this).index()) + 1;
            $(this).attr('number', $(this).parent().parent().attr('number') + "." + indice);



        } // sinon c'est du contenu, on ne s'en occupe pas

    });

    //ajout de la slide de questions
    var li = "<li class='questions' uppery = '" + upperY + "' lowery = '" + lowerY + "' >Any questions ?</li>";
    $('#tree').children('ol').append(li);

    //lowerY a été instancié pour la dernière fois par l'element le plus 'bas' dans la lsite ul li
}



/*
 * A partir de la liste qui a été parsée pour ajouter les coordonnées, créer les slides et leurs contenus
 * Ajoute également les slides qui ne font pas partie de la présentation, à savoir les overviews, les slides d'accueils et de concluion (any questions ?)
 */
function goJmpress(config) {

    //creation des slides jmpress
    $('#tree li').each(function() {

        if (typeof $(this).attr('uppery') !== 'undefined') {
            var upperY = parseInt($(this).attr('uppery'));
            var lowerY = parseInt($(this).attr('lowery'));
            new Slide({
                properties: {
                    hierarchy: ''+$(this).attr('number'),
                    scale: Math.abs((upperY - lowerY)) * 4 / 3 / 1000
                },
                matricule: 'end',
                pos: {
                    x: config.endX0 + 10000,
                    y: (upperY + lowerY) / 2,
                    z: config.endZ0
                },
                type: 'overview'
            }
            );
            var slide = new Slide({
                properties: {
                    matricule: 'questions',
                    scale: 10
                },
                pos: {
                    x: config.endX0 + 12500,
                    y: Math.abs(upperY - lowerY) / 2 + upperY,
                    z: config.endZ0
                }
            }
            );
            new Text(slide.matricule, {
                matricule: 'questionstexte',
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
        if ($(this).attr('type') === 'title') {
            //s'il y au moins une petite soeur
            //console.log($(this).index() , parseInt($(this).attr('siblings')) -1);
            if ($(this).index() < parseInt($(this).attr('siblings')) - 1) {
//                console.log($($(this).siblings()[parseInt($(this).attr('siblings')) - 2]),$(this).siblings());
                new Slide({
                    type: 'overview',
                    pos: {
                        //long bug à trouver ! Il faut -2 dans les siblings car le siblings ne compatabilise pas lui meme, logique !
                        x: (parseInt($(this).attr('data-x')) + parseInt($($(this).siblings()[parseInt($(this).attr('siblings')) - 2]).attr('data-x'))) / 2,
                        y: $(this).attr('data-y'),
                        z: $(this).attr('data-z')
                    },
                    properties: {
                        scale: $(this).attr('siblings')
                    }
                });
            }
        }

        //ajout de la slideet de son texte
        var number = $(this).attr('number');
        number = number.split('.').join('-');
        console.log(number);
        var slide = new Slide({
            matricule: number,
            
            pos: {
                x: $(this).attr('data-x'),
                y: $(this).attr('data-y'),
                z: $(this).attr('data-z')
            },
            properties: {
                hierarchy: ''+$(this).attr('number'),
                scale: 1
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

