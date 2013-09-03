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
    initContainer();
//     var config = {
//         cranX: 1800,
//         cranY: 1000,
//         cranZ: -1000,
//         liveX0: 10000,
//         liveY0: 10000,
//         liveZ0: 10000,
//         endX0: -10000,
//         endY0: -10000,
//         endZ0: -10000
//     };
    var config = {
        cranX: globalConfig.widthSlide*1.5,
        cranY: globalConfig.heightSlide*1.5,
        cranZ: -1000,
        liveX0: -1500,
        liveY0: 0,
        liveZ0: 0,
        endX0: 0,
        endY0: -1500,
        endZ0: 0
    };
//    goCK(config);
    goNormalize();
//    console.log('de');
    goDepth(config);
//    console.log('pos');
    goPosition(config);
//    console.log('posEnd');
    goPositionEnd(config);
//    console.log('jmpre');
    goJmpress(config);
//    console.log('dyna');
    dynamic(config);
}

function goNormalize() {
    $('#tree ol').each(function() {
        if ($(this).children().length === 0) { //si l'ol a été ajouté pour 'rien'
            $(this).remove();
        }
    });

    $('#tree .textarea').each(function() {
//        var content = $(this).val();
        var content = $(this).html();
        content = '<span class=\'textarea\'>' + content + '</span>';
        $(this).parent().attr('type', 'body');
        $(this).parent().append(content);
        $(this).remove();
    });

    $('#tree li').each(function() {
        if (typeof $(this).attr('type') === 'undefined')
            $(this).attr('type', '');
    });
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
        if ($(this).attr('depth') !== '1' && $(this).attr('type') !== 'body'){//&& $(this).attr('nbChild') !== '0') {

            if ($(this).index() === 0) { //si première fille
                var x = $(this).parent().parent().attr('data-x');
            } else {
                var x = parseInt($($(this).prev()).attr('data-x')) + cranX; //position de sa grande soeur
            }
            var y = parseInt($(this).parent().parent().attr('data-y')) + cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z')) + parseInt($(this).index()) * cranZ;

            $(this).attr('type', 'title');

//        } else if ($(this).attr('depth') !== '1' && $(this).attr('nbChild') === '0') {       //si pas d'enfants, c'est du contenu, slides horizontales 
        } else if ($(this).attr('depth') !== '1' && $(this).attr('type') === 'body') { //slide horizontales 

            var x = parseInt($(this).parent().parent().attr('data-x'));//+ $(this).index() * cranX / 2;
            var y = parseInt($(this).parent().parent().attr('data-y')) + parseInt($(this).index() + 1) * cranY; //pour atteindre la li qui la stocke
            var z = parseInt($(this).parent().parent().attr('data-z'));//+ parseInt($(this).index()) * cranZ;

            $(this).attr('type', 'body');

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
        console.log('tree li', $(this));

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
    initJmpress();


    //creation des slides jmpress
    $('#tree li').each(function() {

        if (typeof $(this).attr('uppery') !== 'undefined') {
            var upperY = parseInt($(this).attr('uppery'));
            var lowerY = parseInt($(this).attr('lowery'));
            new Slide({
                properties: {
                    
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
                matricule: 'questions',
                properties: {
                    //hierarchy: '' + $(this).attr('number'),
                    scale: 20
                },
                pos: {
                    x: config.endX0 + 15000,
                    y: Math.abs(upperY - lowerY) / 2 + upperY,
                    z: config.endZ0
                }
            }
            );
            new Text('questions', {
                //matricule: 'questionstexte',
                properties: {
                    content: '<em>Merci de votre attention</em> <br/> Avez vous des questions ?',
                    hierarchy: 'H1Text'
                },
                pos: {
                    x: 0,
                    y: 'center'//globalConfig.heightSlide/2
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
        var numberArray = $(this).attr('number').split('.');
        number = numberArray.join('-');
        console.log(number);
        var slide = new Slide({
            matricule: number,
            style: $(this).attr('type'),
            pos: {
                x: $(this).attr('data-x'),
                y: $(this).attr('data-y'),
                z: $(this).attr('data-z')
            },
            properties: {
                hierarchy: '' + $(this).attr('number'),
                scale: 1
            }
        });

        if ($(this).children('.textarea').length !== 0) {
            //rappel de la partie
            
            var upHierarchy = $(this).parent('ol').siblings('span');
           // console.log('debug : goJmpress',upHierarchy);
            new Text(slide.matricule,{
                auto: true,  //il ne faut que le treeMakerFromContainer en tienne compte
                properties: {
                    content: upHierarchy.html(),
                    hierarchy: 'H3Text'
                },
                pos: {
                    x: 0,
                    y: globalConfig.heightSlide*0.05
                }
            });
            
            
            //contenu
            new Text(slide.matricule, {
                properties: {
                    hierarchy: 'bodyText',
                    content: $(this).children('.textarea').html()
                },
                pos: {
                    x: 0,
                    y: 'noCollision'//globalConfig.heightSlide/2
                }
            });
            
        } else if ($(this).children('.liTitle').length !== 0) {
            
            new Text(slide.matricule, {
                properties: {
                    hierarchy: 'H1Text',
                    content: numberArray.join('.')+' | '+$(this).children('.liTitle').html()
                },
                pos: {
                    x: 0,
                    y: 'center'
                }
            });
            

        }

       

        //ecriture du matricule de la slide dans la liste
        $(this).attr('matricule', slide.matricule);
        $(this).attr('id', 'li_' + slide.matricule);

    });


} //fin goJmpress

