/* 
 * Classes :
 *          Slide
 *          Element
 *              Text
 *              Image
 * Méthode :
 *      Object.size
 *      selectSlide(callback, param1, composant)     return slide's matricule
 *      getSlideMother(matricule)       return slide's matricule
 * Global:
 *       container
 *       
 */
//pour connaitre la taille d'un objet
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};

/******************************************************/
/*******         definition des clases         ********/

globalCpt = 0;
container = {metadata: {}, slide: {}};

/* classe slide
 * matricule
 * type
 * pos
 * rotate
 * properties
 *      scale
 *      hierarchy
 * watches
 * show
 *      affiche coord et nb element
 *show('element')
 *       affiche la liste des composants avec leur détals (héritage du swow pour ajouter des infos propres à la fille
 *      
 * destroy
 */
Slide = Class.extend({
    init: function(params) {
        if (typeof params !== 'undefined') {
            //if matricule is set, check if unique
            if (typeof params.matricule !== 'undefined') {
                if (findObjectOfComposant(params.matricule) !== false) { //le matricule existe déjà !
                    console.log('Error : construct Slide : matricule ' + params.matricule + ' already set in container');
                    delete this;
                    return;

                }
            }
        }

        //default value
        var matricule = 'slide' + globalCpt++;
        this.matricule = matricule;


        this.type = 'slide';

        this.pos = {
            x: 0,
            y: 0,
            z: 0
        };

        this.rotate = {
            x: 0,
            y: 0,
            z: 0
        };

        //je ne peux mettre des wacth que sur des objets, ce que sont les slides sur le papier.
        //en pratique, simpleJsInheritance transforme l'objet en une fonction dotée de prototype. 
        //seul les objet au sein de la slide peuvent avoir des watch.
        this.properties = {
            scale: 1,
            hierarchy: 0
        };

        this.element = {};

        //prise en compte des parametres utilisteurs
        if (typeof params !== 'undefined') {
            for (var param in params) {
                if (typeof params[param] === 'object') {
                    for (var paramNested in params[param]) {
                        this[param][paramNested] = params[param][paramNested];
                    }
                } else {
                    this[param] = params[param];
                }
            }
        }





        //definition des watch qui permettent d'agir sur le DOM lorsqu'on agit sur les objets des slides
        watch(this.pos, function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $slide = $('#' + matricule);
            $('#slideArea').jmpress('deinit', $slide);
            var attribut = 'data-' + attr;
            $slide.attr(attribut, newVal);
            $('#slideArea').jmpress('init', $slide);


        });

        watch(this.rotate, function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $slide = $('#' + matricule);
            $('#slideArea').jmpress('deinit', $slide);
            var attribut = 'data-rotate-' + attr;
            $slide.attr(attribut, newVal);
            $('#slideArea').jmpress('init', $slide);

        });

        watch(this.properties, 'scale', function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $slide = $('#' + matricule);
            $('#slideArea').jmpress('deinit', $slide);
            var attribut = 'data-scale';
            $slide.attr(attribut, newVal);
            $('#slideArea').jmpress('init', $slide);

        });

        watch(this.properties, 'hierarchy', function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $slide = $('#' + matricule);
//            $('#slideArea').jmpress('deinit', $slide);
            var attribut = 'hierarchy';
            $slide.attr(attribut, newVal);
//            $('#slideArea').jmpress('init', $slide);

        });




        //ajout de la slide à l'espace de stockage
        container.slide[this.matricule] = this;

        //create node via mustach
//        console.log("go jmpress");
        var template = $('#templateSlide').html();
        var html = Mustache.to_html(template, this);
        $('#slideArea >').append(html);
        var $newSlide = $('#slideArea >').children().last();
        $('#slideArea').jmpress('init', $newSlide);

        handlerComposant($newSlide);

        //console.log('Nouvelle slide: ', this.show(24));

        //ajout à la timeline

        var idSlide = matricule;
        var $slideButton = $('<li matricule=' + idSlide + '><span>' + idSlide + '</span>    <a class="cross" href="#">x</a></li>');
        $('#sortable').append($slideButton);


        $('#sortable').sortable({
            start: function(event, ui) {
                ui.item.startPos = ui.item.index();
            },
            stop: function(event, ui) {
                var newIndex = ui.item.index();                                    //nouvelle place
                var matriculeSorted = ui.item.attr('matricule');                    //pour la slide qui vient prendre la place de
                var slide = container.slide[matriculeSorted];     //+ 2 car il y a pour le moment deux slides dans le DOM dès le départ
                var slideAfter = $($('#slideArea>').children()[newIndex + 0 + 1]).attr('matricule');  //cette slide

                if (newIndex > ui.item.startPos) { //maintenant
                    slide.reOrder(slideAfter, false);
                }
                else {
                    slide.reOrder(slideAfter, true);
                }

//                if (ui.item.startPos > newIndex)
//                {
//                    $('.slide').eq(newIndex).before($('#' + $idSlideSorted + ''));
//                }
//                else
//                {
//                    $('.slide').eq(newIndex).after($('#' + $idSlideSorted + ''));
//                }
//                $(".slide").each(function(index) {
//                    var idSlide = $(this).attr('id');
//                    //pressjson.slide[idSlide].index = index;     // MaJ de l'index des slide
//                });
                //console.log(newIndex, slide.matricule, slideAfter);

            },
            axis: "y"
        })
                .disableSelection();

        $("#sortable").on("sortupdate", function(event, ui) {
            ////console.log(event, ui);
        });
    },
    reOrder: function(slideAfter, isBefore) {
        //deplace la slide avant slideAfter
        if (isBefore == false) {
            $('#' + this.matricule).insertAfter($('#' + slideAfter));
        }
        else {
            $('#' + this.matricule).insertBefore($('#' + slideAfter));
        }

        //deplace le slide dans le container en s'appuyant sur le DOM
        var newContainer = {
            metadata: container.metadata,
            slide: {}
        };
        $('#slideArea>').children().each(function() {
            if ($(this).attr('id') !== 'profondeur') {
                newContainer.slide[$(this).attr('matricule')] = container.slide[$(this).attr('matricule')];
            }
        });
        container = newContainer;



    },
    show: function(i) {
        if (typeof i === 'undefined') {
            console.log('{ matricule:', this.matricule, ', pos:{x:', this.pos.x, ', y:', this.pos.y, 'z:', this.pos.z, '}, rotate:{x:', this.rotate.x, ',y:', this.rotate.y, 'z:', this.rotate.z, '}, scale:{scale:', this.properties.scale, '}, nb elements :', Object.size(this.element), '}');
        }
        else if (i === 'element') {
            //console.log('liste des elements');
            for (var el in this.element) {
                console.log(this.element[el].show());
            }

        } else {
            return '{matricule: ' + this.matricule + ', pos:{x: ' + this.pos.x + ', y: ' + this.pos.y + ', z:' + this.pos.z + '}, rotate:{x: ' + this.rotate.x + ', y: ' + this.rotate.y + ', z: ' + this.rotate.z + '}, properties:{scale: ' + this.properties.scale + '}, nb elements :' + Object.size(this.element) + '}';
        }
    },
    destroy: function() {
        $('#' + this.matricule).remove();
        delete container.slide[this.matricule];
        $('li').each(function() {
            if ($(this).attr('matricule') === this.matricule) {
//                 $(this).remove();
                truc = $(this);
            }
//               

        });
    }



});

/* selection d'une slide par click, 
 *  
 * @returns {string}
 */
function selectSlide(callback, param1, composant) {
    $('#sidebar').parent().addClass("buttonclicked");   //pour empecher le joystick d'apparaitre
    alert('Il faut selectionner une slide');
    $('.slide').one('click', function(event) {
        $('.buttonclicked').removeClass("buttonclicked");       //pour redonner le droit au joystick d'apparaitre
        var slide = $(this).attr('matricule');
        //console.log('select ', slide);
        alert('slide selectionnée' + slide);
        if (typeof callback !== 'undefined') {
            callback(slide, param1, composant);
            //console.log('in select', slide);
            return slide;
        } else {
            //console.log('in select', slide);
            return slide;
        }
    });
}



/*  Ebauche de tentative de gestion par la Class Element d'un mauvais matricule
 * entrainant le demande de selection d'une slide de la part d'user.
 * 
 * @param {type} slide (matricule)
 * @param {type} matricule (du composant)
 * @param {type} composant (instance of Element)
 * @returns {undefined}
 */ /*
  function addComposantToSlide(slide, matricule, composant) {
  container.slide[slide].element[matricule] = composant;
  composant.DOM(slide);
  }*/


/* Interface Element : doit être instancié
 * matricule
 * pos
 * rotate
 * watches
 * show
 * destroy
 * 
 * minimum  pour fonctionner :
 * slide : matricule d'une slide de destination (erreur gérée)
 * 
 */
Element = Class.extend({
    init: function(slide, params, matricule) {
        if (typeof params !== 'undefined') {
            //if matricule is set, check if unique
            if (typeof params.matricule !== 'undefined') {
                if (findObjectOfComposant(params.matricule) !== false) { //le matricule existe déjà !
                    console.log('Error : construct Element : matricule ' + params.matricule + ' already set in container');
                    delete this;
                    return;

                }
            }
        }
        //ce sont les filles qui se chargent de params !

        //default values
        this.pos = {
            x: 300, //connecter à la moitié de la largeur de la slide type
            y: 300, //idem pour la hauteur
            z: 0
        };

        this.rotate = {
            x: 0,
            y: 0,
            z: 0
        };

        this.properties = {
        };

//        //prise en compte des parametres utilisteurs
//        if (typeof params !== 'undefined') {
//            for (var param in params) {
//                if (typeof params[param] === 'object') {
//                    //console.log(params[param]);
//                    truc = params[param];
//                    for (var paramNested in params[param]) {
//                        this[param][paramNested] = params[param][paramNested];
//                    }
//                } else {
//                    this[param] = params[param];
//                }
//            }
//        }


        //definition des watch qui permettent d'agir sur le DOM lorsqu'on agit sur les objets des slides
        watch(this.pos, function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            //console.log('hu', matricule);
            var $element = $('#' + matricule);

            var attribut;
            switch (attr) {
                case 'x':
                    attribut = 'left';
                    break;
                case 'y' :
                    attribut = 'top';
                    break;
                default :
                    return;
            }
            $element.css(attribut, newVal);
        });

        watch(this.rotate, function(attr, action, newVal, oldVal) {
            return;
        });

        /* ce bout de code est une tentative pour que la classe Element prenne en charge
         * la selection par l'user d'une slide s'il y a une erreur sur le matricule.
         * Cela posait des problemes d'insertion dans le DOM car les //constructeurs se terminent sans 
         * que le listener (click sur .slide) ne se soit déclenché.
         * Le bricollage que je pouvais mettre en oeuvre dénaturait l'usage des classes et des
         * //construceurs.
         * A voir si plus tard je trouve une belle solution;
         */
//
//        //s'il y a une erreur de slide destination (inexistante ou bien la cible est un composant
//        //on demande à l'user de sélectionner une slide
//        if (container.slide[slide] === undefined) {
//            //console.log('Error : Le matricule de la slide cible n\'existe pas ', slide);
//            selectSlide(matricule, this, addComposantToSlide);
//        } else if (container.slide[slide].type !== 'slide') {
//            //console.log('Error : Le composant cible doit être une slide ', slide);
//            selectSlide(matricule, this, addComposantToSlide);
//        } else {
//            //ajout à la slide 
//            addComposantToSlide(slide, matricule, this);
////            container.slide[slide].element[matricule] = this;
//        }
//
//        //return 1;


        //gestion de l'erreur de matricule
        if (container.slide[slide] === undefined) {
            //console.log('Error : Le matricule de la slide cible n\'existe pas ', slide);
            return 0;
        } else if (container.slide[slide].type !== 'slide') {
            //console.log('Error : Le composant cible doit être une slide ', slide);
            return 0;
        } else {
            container.slide[slide].element[matricule] = this;
            return 1;
        }

    },
    show: function(i) {
        if (typeof i === 'undefined') {
            console.log('{ matricule:', this.matricule, ', pos:{x:', this.pos.x, ', y:', this.pos.y, 'z:', this.pos.z, '}, rotate:{x:', this.rotate.x, ',y:', this.rotate.y, 'z:', this.rotate.z, '} }');
        }
        else {
            return '{ matricule: ' + this.matricule + ', pos:{x: ' + this.pos.x + ', y: ' + this.pos.y + ' z: ' + this.pos.z + '}, rotate:{x:' + this.rotate.x + ',y:' + this.rotate.y + 'z:' + this.rotate.z + '} }';
        }
    },
    destroy: function() {
        $('#' + this.matricule).remove();
        delete container.slide[this.matricule];
    }

    /* Important
     * Ne pas oublier d'appeler une fonction 'initHtml' à la fin du //constructeur 'init'
     * 'initHtml se charge d'écrire l'objet dans le DOM à partir d'un template Mustache propre à la fille
     */
});


/* Class Texte
 * properties :
 *      hierarchy
 *      content
 * changement matricule
 */
Text = Element.extend({
    init: function(slide, params) {
        // Appelle du //constructeur de la mere
        // Il écrit la totalité des objets de params dans les attributs de la mere
        // Il prend en compte les attributs qui ne sont pas dans la mère, il faut alors
        // définir des watches au besoin.
        if (typeof params === 'undefined') {
            params = {};
        }
        if (typeof slide === 'undefined') {
            slide = 'null';
        }


        var matricule = 'texteelement' + globalCpt++;
        this.matricule = matricule;


        if (!this._super(slide, params, matricule)) {
            return 0;
        }

        //pour mustache
        this.texte = 'true';


        //attribut propre aux textes
        this.properties = {
            hierarchy: 'H1Text', //'bodyText',
            content: 'Type text here'
        };


//        //console.log('params', params);

//        truc = params;


        //prise en compte des parametres utilisteurs
        if (typeof params !== 'undefined') {
            for (var param in params) {
                if (typeof params[param] === 'object') {
                    //console.log(params[param]);
                    truc = params[param];
                    for (var paramNested in params[param]) {
                        this[param][paramNested] = params[param][paramNested];
                    }
                } else {
                    this[param] = params[param];
                }
            }
        }


        //definition des watch qui permettent d'agir sur le DOM lorsqu'on agit sur les objets des slides
        watch(this.properties, function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
//            //console.log('hu', matricule);
            var $element = $('#' + matricule);

            //redondant si le texte est édité via contenteditable
            $element.html(newVal);
        });

        //console.log('avant ajout dans le DOM');


        //ajout dans le DOM
        this.DOM(slide);

    },
    //ajout dans le DOM
    //cette fonction est appelé deux fois huhu
    DOM: function(slide) {
        //console.log('ajout de DOM');
        this.show();
        //ajout dans le DOM
        var template = $('#templateElement').html();
        var html = Mustache.to_html(template, this);
        //console.log('html', html);
        $('#' + slide).append(html);
        //console.log('adtexte', slide);
        handlerComposant($('#' + this.matricule));

    },
    show: function(i) {
        if (typeof i === 'undefined') {
            var str = '';
            str = this._super(24);
            str += ' properties: {content: ' + this.properties.content + ' ,hierarchy: ' + this.hierarchy + ' }';
            //console.log(str);
        }
        else {

        }

    }

});

//les images sont en pixel
Image = Element.extend({
    init: function(slide, params) {
        if (typeof params === 'undefined') {
            params = {};
        }
        if (typeof slide === 'undefined') {
            slide = 'null';
        }

        var matricule = 'imageelement' + globalCpt++;
        this.matricule = matricule;

        this._super(slide, params, matricule);

        //pour mustache
        this.image = true;

        //attributs
        this.properties = {
        };

        this.size = {
            height: 100,
            width: 100
        };

        this.source = 'images/bleu_twitter.png';


        //prise en compte des parametres utilisteurs
        if (typeof params !== 'undefined') {
            for (var param in params) {
                if (typeof params[param] === 'object') {
                    //console.log(params[param]);
                    truc = params[param];
                    for (var paramNested in params[param]) {
                        this[param][paramNested] = params[param][paramNested];
                    }
                } else {
                    this[param] = params[param];
                }
            }
        }


//        truc = this;
        //ajout dans le DOM
        var template = $('#templateImage').html();
        var test = {src: 'opuet'};
        var html = Mustache.to_html(template, this);
//        html = Mustache.to_html(template,this);
        $('#' + slide).append(html);
        handlerComposant($('#' + this.matricule));
        //console.log('adimg', slide);

    }
});


/* trouver le matricule de la slide contenant le composant
 * Si le composant est déjà une slide, retourne le matricule de la slide 
 * input : matricule d'un composant
 * output : matricule de la slide le contenant
 */
function getSlideMother(matricule) {

    if (typeof container.slide[matricule] === 'undefined') {   //si le matricule n'est pas celui d'une slide
        for (var slide in container.slide) {                //parcours des slides
            if (typeof container.slide[slide].element[matricule] === 'undefined') {
                //console.log('pas dans la slide ', slide);
            } else {    //si le matricule est un element de la slide, on return le matricule de sa mere
                return container.slide[slide].matricule;
            }
        }
    } else {                                            //si le matricule est celui d'une slide
        return matricule;
    }

    return 'Error : matricule doesn\'t existe';

}