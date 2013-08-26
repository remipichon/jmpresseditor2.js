/*
 * Manage la présentation en live, lié à 'automaticEditor' 
 * 
 * Affiche/masque les slides
 * Deplace les slides de titres,
 * Gere le début et la fin
 * 
 * 
 * 
 */




/*
 * Fonction Jquery permettant d'effectuer un déplacement animé et smooth via la transform3D
 *  from http://cameronspear.com/blog/animating-translate3d-with-jquery/
 *  Great thanks to Cameronspear 2013 !
 */

(function($) {
    var delay = 0;
    $.fn.translate3d = function(translations, speed, easing, complete) {
        var opt = $.speed(speed, easing, complete);
        opt.easing = opt.easing || 'ease';
        translations = $.extend({x: 0, y: 0, z: 0}, translations);

        return this.each(function() {
            var $this = $(this);

            /* tentative avec mes outils */
            var dico = getTrans3D($this);
            if (typeof dico.translate3d === 'undefined') {
                console.log($this, 'n\'a pas de transform !');
                return;
            }
            dico.translate3d[0] = translations.x;
            dico.translate3d[1] = translations.y;
            dico.translate3d[2] = translations.z;


            $this.css({
                transitionDuration: opt.duration + 'ms',
                transitionTimingFunction: opt.easing,
                transform: "translate(" + dico.translate[0] + "%, " + dico.translate[1] + "%) scaleX(" + dico.scaleX + ") scaleY(" + dico.scaleY + ") scaleZ(" + dico.scaleZ + ") translate3d(0px,0px,0px) scaleX(1) scaleY(1) scaleZ(1) rotateZ(" + dico.rotateZ + "deg) rotateY(" + dico.rotateY + "deg) rotateX(" + dico.rotateX + "deg) translate3d(" + dico.translate3d[0] + "px," + dico.translate3d[1] + "px, " + dico.translate3d[2] + "px)"

            });

            setTimeout(function() {
                $this.css({
                    transitionDuration: '0s',
                    transitionTimingFunction: 'ease'
                });

                opt.complete();
            }, opt.duration + (delay || 0));
        });
    };
})(jQuery);



/*
 * A partir de la présentation init par Jmpress, réarrange la position des slides afin d'obtenir un état initial
 * 
 */
function initDynamic() {
    //on masque les li content du tree
//    $('#tree li').each(function(){
//       if( $(this).attr('type') === 'content') $(this).css('display','none'); 
//    });
    
    //on affiche le tree 
    $('#tree').fadeIn(1000);

    //au départ, on cache toutes les slides sauf les premiers titres

    //les premiers titres
    var firstTitle = [];
    $('#tree').children('ol').children().each(function() {
        firstTitle.push($(this).attr('matricule'));
    });

    $('.slide').each(function() {
        if (firstTitle.indexOf($(this).attr('matricule')) !== -1)
            $(this).fadeIn(1000);
        else
            $(this).fadeOut(2000);
    });
    

//    //on deplace les slides à leur véritable positions (utile lorsqu'on loop)
    $('.slide').each(function() {
        if ($(this).attr('matricule') === 'questions')
            return; //deplacement étrange de la slide de questions
        $(this).translate3d({
            x: parseInt($(this).attr('data-x')),
            y: parseInt($(this).attr('data-y')),
            z: parseInt($(this).attr('data-z'))
        }, 1000);
    });

    //au depart tout le plan est en 'futur'
    $('#tree li').each(function() {
        $(this).addClass('li-slide');
        $(this).addClass('future-slide');
    });

    
    
    //au depart tous les plus grands titres sont au niveau de leur grande soeur
    $('#tree li').each(function() {
        if ($(this).attr('type') === 'title') {
            if ($('#' + $(this).attr('matricule')).attr('matricule') === 'questions' || $('#' + $(this).attr('matricule')).attr('matricule') === 'end')
                return;  //on va chercher l'info dans les slides car la li n'a pas trace de ces slides là (qui ne font pas parties du plan)

            var $slideRef = $('#' + $(this).attr('matricule'));

            var dicoRef = getTrans3D($slideRef);


            $(this).siblings().each(function() {
                if (typeof $(this).attr('matricule') === 'undefined')
                    return;
                var $slide = $('#' + $(this).attr('matricule'));
                var dico = getTrans3D($slide);
                dico.translate3d[2] = dicoRef.translate3d[2];
                setTrans3D(dico, $slide);   //pas besoin de deplacement smooth ici alors on change directement le transform3D des slides
            });
        }
    });
}

/*
 * A partir de la présentation init par Jmpress, réarrange la position des slides afin d'obtenir un état final
 */
function endDynamic() {
    //on cache le tree
    $('#tree').fadeOut(1000);

    //on montre la dernière slide (qui ne fait pas parti de la présentation donc est exclu du circuit normal
    $('#questions').fadeIn(1000);

    /* parcours de la liste pour deplacer les slides jusqu'à la position de fin */
    $('#tree li').each(function() {
        if (typeof $(this).attr('data-end-x') !== 'undefined') { //si la slide doit être déplacée            

            var $slide = $('#' + $(this).attr('matricule'));
            $slide.fadeIn(10);

            $slide.translate3d({
                x: parseInt($(this).attr('data-end-x')), //-700,
                y: parseInt($(this).attr('data-end-y')), //-600 ,
                z: parseInt($(this).attr('data-end-z'))
            }, 5000);


        } else {                                 //si la slide ne doit pas etre déplacée, on la cache            
            $('#' + $(this).attr('matricule')).fadeOut(1000);
        }
    });

}




/*
 * Ajoute un listener sur la touche 'space' pour gérer la présentation en dynamique
 * Affichage/cache, deplace, smooth !, loop
 * 
 */
function dynamic() {
    initDynamic();

    $(document).on('keypress', function(event) {

        if (event.which == 32) { //je n'ai pu récupérer que l'espace

            /*
             * each time space bar is pressed on cherche la slide qui a la classe 'active'
             */
            var currentMatricule = $('#slideArea').attr('class').split(' ')[0].replace('step-', '');
            var currentSlide = $('#' + currentMatricule);
            var liCurrent = $('#tree #li_' + currentMatricule);

            /*
             *  Réinit de la présentation lorsqu'on arrive à la premiere slide
             */
            if (currentMatricule === 'home') {
                initDynamic();
            }
            /*
             *  Mise en place finale lorsqu'on arrive à la fin
             */
            if (currentMatricule === 'end') {
                endDynamic();
            }
            /*
             * remerciement final
             */
            if (currentMatricule === 'questions') {
                var slide = container.getSlide(currentMatricule);
                var texte = slide.element['questionstexte'];
                texte.properties.content = "Thanks for watching";
            }

            //petit effet sur le tree 
            $('.present-slide').removeClass('present-slide').addClass('past-slide');
            liCurrent.removeClass('future-slide').addClass('present-slide');

            //on cache les filles et leurs filles (et ainsi de suite) de ses soeurs
            //pour effectuer le fadeout plus tôt, sur l'arrivée à un overview s'il y en a un
            if (currentSlide.hasClass('overview'))
                var aliCurrent = $('#tree #li_' + currentSlide.next().attr('matricule')); //on recupère le matricule de la slide suivant le matricule et on recupere la li correspondante
            else
                var aliCurrent = liCurrent;

            aliCurrent.siblings().each(function() {      //toutes les soeurs
                var allChildren = getChildren($(this), []);  // on recupere un tableau des matricules de toutes les filles
                for (var child in allChildren) {
                    var matriculeChild = allChildren[child];
                    $('#' + matriculeChild).fadeOut(1600);
                }
            });




            /*   affiche certaines slides */
            //ses soeurs
            liCurrent.siblings().each(function() {
                var matricule = $(this).attr('matricule'); //on recuperer le matricule stocké dans la li
                $('#' + matricule).fadeIn(1600);           //on agit sur la slide qui a ce matricule
            });

            //ses filles directes
            $(liCurrent.children('ol')[0]).children().each(function() {
                var matricule = $(this).attr('matricule');
                $('#' + matricule).fadeIn(1600);
            });

            //elle meme
            $('#' + currentMatricule).fadeIn(1600);


            /* mise à niveau des petites soeurs sur la petite soeur de la current*/
            var littleHilly = $('#' + liCurrent.next().attr('matricule'));
            console.log('dynamicSlideShow : call getTrans3D for dicoRef');
            var dicoRef = getTrans3D(littleHilly);
            $('#tree #li_' + currentMatricule + ' ~').each(function() { //pour obtenir les next siblings de la current li
                var $slide = $('#' + $(this).attr('matricule'));
                 console.log('dynamicSlideShow : call getTrans3D for dico');
                var dico = getTrans3D($slide);
//               console.log(littleHilly,dicoRef.translate3d,$slide,dico.translate3d);
//                dico.translate3d[2] = littleHilly.attr('data-z');
                $slide.translate3d({
                    x: parseInt($slide.attr('data-x')), //-700,
                    y: parseInt($slide.attr('data-y')), //-600 ,
                    z: littleHilly.attr('data-z')
                }, 1000);
//                setTrans3D(dico,$slide);
            });
        }
    });



}
