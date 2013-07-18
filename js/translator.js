/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
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
//hum
globalCpt = 0;
container = {metadata: {}, slide: {}};
//definition des classes slide
Slide = Class.extend({
    init: function(params) {
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

        if (typeof params !== 'undefined') {
            for (var param in params) {
                if (typeof params[param] === 'object') {
                    for (var paramNested in param) {
                        this[param][paramNested] = param[paramNested];
                    }
                }
                this[param] = params[param];
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

        watch(this.properties,'scale', function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $slide = $('#' + matricule);
            $('#slideArea').jmpress('deinit', $slide);
            var attribut = 'data-scale';
            $slide.attr(attribut, newVal);
            $('#slideArea').jmpress('init', $slide);

        });
        
        watch(this.properties,'hierarchy', function(attr, action, newVal, oldVal) {
            //mise à jour du DOM
            var $slide = $('#' + matricule);
//            $('#slideArea').jmpress('deinit', $slide);
            var attribut = 'data-scale';
            $slide.attr(attribut, newVal);
//            $('#slideArea').jmpress('init', $slide);

        });




        //ajout de la slide à l'espace de stockage
        container.slide[this.matricule] = this;

        //create node via mustach
        console.log("go jmpress");
        var template = $('#templateSlide').html();
        var html = Mustache.to_html(template, this);
        $('#slideArea >').append(html);
        var $newSlide = $('#slideArea >').children().last();
        $('#slideArea').jmpress('init', $newSlide);

    },
    show: function() {
        console.log('{ matricule:', this.matricule, ', pos:{x:', this.pos.x, ', y:', this.pos.y, 'z:', this.pos.z, '}, rotate:{x:', this.rotate.x, ',y:', this.rotate.y, 'z:', this.rotate.z, '}, scale:{scale:', this.scale.scale, '}, nb elements :', Object.size(this.element), '}');
    },
    destroy: function() {
        $('#' + this.matricule).remove();
        delete container.slide[this.matricule];
    }



});

//en fait une slide avec du texte c'est une slide jmpress puis du texte dedans (c'est du simple css)
Element = Class.extend({
    init: function(params, slide) {

        //default values
        this.type = 'text';
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
            hierarchy: 'bodyText',
            content: 'Type text here'
        };


        //user values
        if (typeof params !== 'undefined') {
            for (var param in params) {
                if (typeof params[param] === 'object') {
                    for (var paramNested in param) {
                        this[param][paramNested] = param[paramNested];
                    }
                }
                this[param] = params[param];
            }
        }
        //ajout à la slide            
        container.slide[slide].element['texte' + globalCpt] = this;
        //ajout dans le DOM
        var template = $('#templateElement').html();
        var html = Mustache.to_html(template, this);
        $('#' + slide).append(html);
        console.log('adtexte', slide);


    }
});






