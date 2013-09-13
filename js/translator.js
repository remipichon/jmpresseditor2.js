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
function initContainer() {
    container = {metadata: {
            type: 'free' //free, tree
    }, slide: [],
        getSlide: function(matricule) {
            for (var i in container.slide) {
                if (container.slide[i].matricule === matricule)
                    return container.slide[i];
            }
            //console.log('error : getSlide : matricule \'' + matricule + '\' doesn\'t exist as a slide');
            return;

        }

    };
}

function initJmpress() {

    $('#slideArea').children().remove();
    //il semblerait que Jmpress ait besoin d'au moins une slide dans slideArea pour pouvoir looper
    $('#slideArea').append('<div id="home" class="hidden step slide overview " data-scale ="5" data-x="1000" data-z ="1000" style="display:block"></div>');
    $('#slideArea').removeClass();
    $('#slideArea').jmpress({
        //mouse: {clickSelects: false},
        keyboard: {use: false},
//                    keyboard: {
//                        112: ''  //doesn't work although doc shows me this way
//                    },
        viewPort: {
            height: 400,
            width: 1200,
            maxScale: 1
        }
    });
//                $('#slideArea').jmpress({
//                    viewPort: {
//                        height: 400,
//                        width: 3000,
//                        maxScale: 1
//                    }
//                });
    globalConfig = {
        heightSlide: parseInt($('#home').css('height')),
        widthSlide: parseInt($('#home').css('width'))
    };

    $('#slideArea').jmpress('deinit', $('#home'));
    $('#home').removeClass('slide'); //sinon la slide prend de la place dans le DOM alors que Jmpress ne la connait pas              

    transform3D = new Transform3D();

}



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
                if (typeof findObjectOfComposant(params.matricule) !== 'undefined') { //le matricule existe déjà !
                    console.log('Error : construct Slide : matricule ' + params.matricule + ' already set in container');
                    delete this;
                    return;

                }
            }   
        }

        //default value
        var matricule = 'slide' + globalCpt++;
        this.matricule = matricule;
        //check if unique matrcule already exists
        while (typeof findObjectOfComposant(this.matricule) !== 'undefined') { //le matricule existe déjà !
            var matricule = 'slide' + globalCpt++;
            this.matricule = matricule;
        }



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
            hierarchy: '0'
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
        container.slide.push(this);

        //create node via mustach
        var template = $('#templateSlide').html();
        var html = Mustache.to_html(template, this);
        $('#slideArea >').append(html);
        var $newSlide = $('#slideArea >').children().last();
        $('#slideArea').jmpress('init', $newSlide);

        handlerComposant($newSlide);

        //ajout à la timeline
        var idSlide = this.matricule;
        var $slideButton = $('<li matricule=' + idSlide + '><span>' + ((this.type === 'overview') ? 'Overview' : idSlide) + '</span>    <a class="cross" href="#">x</a></li>');
        $('#sortable').append($slideButton);


        $('#sortable').sortable({
            start: function(event, ui) {
                ui.item.startPos = ui.item.index();
            },
            stop: function(event, ui) {
                var newIndex = ui.item.index();                                    //nouvelle place
                var matriculeSorted = ui.item.attr('matricule');                    //pour la slide qui vient prendre la place de
                var slide = container.getSlide(matriculeSorted);     //+ 2 car il y a pour le moment deux slides dans le DOM dès le départ
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
                ////console.log(newIndex, slide.matricule, slideAfter);

            },
            axis: "y"
        })
                .disableSelection();

        $("#sortable").on("sortupdate", function(event, ui) {
            //////console.log(event, ui);
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
            console.log('liste des elements');
            for (var el in this.element) {
                console.log(this.element[el].show());
            }

        } else {
            return '{matricule: ' + this.matricule + ', pos:{x: ' + this.pos.x + ', y: ' + this.pos.y + ', z:' + this.pos.z + '}, rotate:{x: ' + this.rotate.x + ', y: ' + this.rotate.y + ', z: ' + this.rotate.z + '}, properties:{scale: ' + this.properties.scale + '}, nb elements :' + Object.size(this.element) + '}';
        }
    },
    destroy: function() {
        //Jmpress l'oublie
        $('#slideArea').jmpress('deinit', $('#' + this.matricule));
        //disparition du dom
        $('#' + this.matricule).remove();
        //nettoyage du container
        delete container.getSlide(this.matricule);
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
        alert('slide selectionnée' + slide);
        if (typeof callback !== 'undefined') {
            callback(slide, param1, composant);
            ////console.log('in select', slide);
            return slide;
        } else {
            ////console.log('in select', slide);
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
                if (typeof findObjectOfComposant(params.matricule) !== 'undefined') { //le matricule existe déjà !
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
        

        //definition des watch qui permettent d'agir sur le DOM lorsqu'on agit sur les objets des slides
        watch(this.pos, function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
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

       

        //gestion de l'erreur de matricule
        if (container.getSlide(slide) === undefined) {
            //console.log('Error : Le matricule de la slide cible n\'existe pas ', slide);
            return 0;
        } else if (container.getSlide(slide).type !== 'slide') {
            //console.log('Error : element constructor : insert elementin slide : Le composant cible doit être une slide ', slide);
            return 0;
        } else {
            container.getSlide(slide).element[matricule] = this;
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
        delete container.getSlide(this.matricule);
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

        //le constructeur mère a besoin du matricule pour renseigner le container.
        //ainsi, si params contient un matricule, il faut lui passer en priorité :
        if (typeof params !== 'undefined')
            if (typeof params.matricule !== 'undefined')
                var matricule = params.matricule;
            else {
                var matricule = 'texteelement' + globalCpt++;
                //check if unique matrcule already exists
                while (typeof findObjectOfComposant(this.matricule) !== 'undefined') { //le matricule existe déjà !
                    var matricule = 'texteelement' + globalCpt++;
                    this.matricule = matricule;
                }
            }

        this.matricule = matricule;


        if (!this._super(slide, params, matricule)) {
            return 0;
        }

        //pour mustache
        this.texte = 'true';


        //attribut propre aux textes
        this.properties = {
            hierarchy: 'bodyText',
            content: 'Type text here'
        };


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
        watch(this.properties, function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $element = $('#' + matricule);

            if (attr === 'content') {
                //redondant si le texte est édité via contenteditable
                $element.children().html(newVal);
            } else if (attr === 'hierarchy') {
                $element.children().removeClass().addClass(newVal);
            }
        });


        //ajout dans le DOM
        this.DOM(slide);

    },
    //ajout dans le DOM
    //cette fonction est appelé deux fois huhu
    DOM: function(slide) {
        this.show();

        var template = $('#templateElementCK').html();
        var html = Mustache.to_html(template, this);
        ////console.log('html', html);
        $('#' + slide).append(html);
        
        
        var newEl = $('#' + this.matricule);
        newEl.children('span').html(this.properties.content);
        handlerComposant(newEl);
        
        /* si pos.y = 'center', il faut centrer le texte en Y, le HTMl ne permet pas de faire cela
        Le mustache insere le html, ensuite je passe derrière pour centrer le texte en y en fn de sa taille */
        if( this.pos.y === 'center'){
            bidule = $('#'+this.matricule);
            
            var heightTxt = parseInt($('#'+this.matricule).css('height'));
            var posTxt = globalConfig.heightSlide/2 - heightTxt/2;
            $('#'+this.matricule).css('top',posTxt);
            this.pos.y = posTxt;
        }
        
        /* si pos.y = noCollision, il faut s'arranger pour mettre le texte sous son précédent (utile lors de la création automatique)*/
        if( this.pos.y === 'noCollision'){
            var posPrev = parseInt($('#'+this.matricule).prev().css('top'));
            var heightPrev = parseInt($('#'+this.matricule).prev().css('height'));
            var posTxt = posPrev+heightPrev+20;
             $('#'+this.matricule).css('top',posTxt);
            this.pos.y = posTxt;            
        }
        

    },
    show: function(i) {
        if (typeof i === 'undefined') {
            var str = '';
            str = this._super(24);
            str += ' properties: {content: ' + this.properties.content + ' ,hierarchy: ' + this.hierarchy + ' }';
            return str;
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

        //le constructeur mère a besoin du matricule pour renseigner le container.
        //ainsi, si params contient un matricule, il faut lui passer en priorité :
        if (typeof params !== 'undefined')
            if (typeof params.matricule !== 'undefined')
                var matricule = params.matricule;
            else {
                var matricule = 'imageelement' + globalCpt++;
                //check if unique matricule already exists
                while (typeof findObjectOfComposant(this.matricule) !== 'undefined') { //le matricule existe déjà !
                    var matricule = 'imageelement' + globalCpt++;
                    this.matricule = matricule;
                }

            }
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
                    truc = params[param];
                    for (var paramNested in params[param]) {
                        this[param][paramNested] = params[param][paramNested];
                    }
                } else {
                    this[param] = params[param];
                }
            }
        }

        //ajout dans le DOM
        var template = $('#templateImage').html();
        var test = {src: 'opuet'};
        var html = Mustache.to_html(template, this);
        $('#' + slide).append(html);
        handlerComposant($('#' + this.matricule));
    }
});


/* trouver le matricule de la slide contenant le composant
 * Si le composant est déjà une slide, retourne le matricule de la slide 
 * input : matricule d'un composant
 * output : matricule de la slide le contenant
 */
function getSlideMother(matricule) {

    if (typeof container.getSlide(matricule) === 'undefined') {   //si le matricule n'est pas celui d'une slide
        $.each(container.slide, function(rien, slide) {         //parcours des slides
            if (typeof slide.element[matricule] === 'undefined') {
                ////console.log('pas dans la slide ', slide);
            } else {    //si le matricule est un element de la slide, on return le matricule de sa mere
                return slide.matricule;
            }
        });
    } else {                                            //si le matricule est celui d'une slide
        return matricule;
    }

    return 'Error : matricule doesn\'t existe';

}