/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */





/* ======================================================================================
 * FONCTION CREATE TEXT (body or h1)
 * triggered by 2 consecutive events : 
 *   "create title/body" button clicked 
 * + layout or slide with ".creationTitle/Body" class clicked
 * ======================================================================================*/
function createText(hierarchy, event) {

    var content = "Entrer du texte";
    var dico = getTrans3D();
    var currentScale = dico.scaleZ;
    var container = $(event.target);

    //si le texte est crée depuis du code
    if (event.type === "code") {  
        container = event.container;
        var x = event.x;
        var y = event.y;
        var z = event.z;
        var content = event.content;
    } else {
        //si le texte est crée via un vrai event
        container = $(event.target);
        (container).unbind('click'); // permet de désactiver le clic sur la surface

        ///////////////////////////////conserver les trois méthode, normalement la première devrait marcher mais dépend fortemetn de la precision de getVirtualCoord

//            var $slideTemp = $("<div style='height:700' data-z='1000'></div>");
//            var posVirtuel = getVirtualCoord(event, $slideTemp);
//          
//                   
//           var eventMagouille = ({
//                pageX: window.innerWidth / 2,
//                pageY: window.innerHeight / 2
//            });
//            var off = getVirtualCoord(eventMagouille, $slideTemp);

        //position du clic dans le monde des slides
//            var x = posVirtuel[1] - off[1];
//            var y = posVirtuel[0] - off[0];
//            
//            //position du clic en relative par rapport à la slide
//            var x = x - container.attr('data-x');
//            var y = y - container.attr('data-y'); 
//            
//            console.log(x+" "+container.attr('data-x'));


        //Claire Z
//            var x = (event.pageX - (window.innerWidth / 2) - parseFloat(dico.translate3d[0])) * (currentScale);
//            var y = (event.pageY - (window.innerHeight / 2) - parseFloat(dico.translate3d[1])) * (currentScale);


        //sans passer par le monde des slides
//            var parentOffset = container.offset();
//            var x = event.pageX - parentOffset.left;
//            var y = event.pageY - parentOffset.top;


        //en fait il faut calculer les coord après la creation du html afin de pouvoir compenser les coord de la mpitié des dimensions de l'element texte
        var x = 450;
        var y = 350;
        var z = 0;

    }

    var idElement = "element-" + j++; // id unique élément -> ds json + ds html
    pressjson.increment['j'] = j;
    var idContainer = container.attr('id');
    var containerScale = pressjson.slide[idContainer].scale;
    var stringText = '{"class": "element text","type": "text", "id" : "' + idElement + '", "pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + containerScale + '", "hierarchy":"' + hierarchy + '", "content": "' + content + '"}';
    var jsonComponent = JSON.parse(stringText);
    pressjson.slide[idContainer].element[idElement] = jsonComponent;
    
    //pour savoir s'il faut vider le champ de texte lorsqu'on clic
    (content === 'Entrer du texte') ? jsonComponent.newCreated = 'true' :  jsonComponent.newCreated = 'false';
    
    
    
    jsonToHtmlinSlide(jsonComponent, container);

    //console.log(pressjson);
    $('#text-tool').parent().removeClass("buttonclicked");  // mise en forme css
}
;

/*
 * Function type jquery qui permet de rendre une balise (dotée d'un id) editable via ckeditor
 * manageCkeditor() utilise le double click pour rendre contenteditable et init le ckeditor inline
 * tout en desactivant les actions permettant de déplacer la slide et de naviguer de sorte qu'il est possible de selectionner
 * du texte intuitivement. 
 * Elle detruit l'instance ckeditor et permet les deplacements lorsqu'on quitte l'edition (un peu de bricolage ici)
 * @param {type} bool
 * 
 */
jQuery.fn.manageCkeditor = function() {
    var $this = $(this);

    $this.dblclick(function(event) {
        $this.attr('contenteditable', 'true');
        CKEDITOR.disableAutoInline = true;
        CKEDITOR.inline($this.attr('id'));
        $this.focus();
        
        console.log($this.data('newCreated'));
        
        $this.on('click', function() {
           //($this.data('newCreated')) ? CKEDITOR.instances[$this.attr('id')].setData("<span class='"+$this.data('hierarchy')+"'>  Ici  </span>") : 0 ; 
           ($this.data('newCreated')) ? console.log('instance ck éditée pour la première fois (que faire ?)') : 0 ; 
        });

        CKEDITOR.instances[$this.attr('id')].on('change', function(e) {
            console.log("le changement c'est maintenant :" + CKEDITOR.instances[$this.attr('id')].getData());
            /////METTRE A JOUR LE JSON//////
        });


        $this.on('mousemove', function() {
            if (!$this.hasClass('cke_focus')) {
                $this.unbind('mousemove');
                CKEDITOR.instances[$this.attr('id')].destroy(false); //possible de passer un 'false' a destroy pour ne pas update le dom
                $this.attr('contenteditable', 'false');
                console.log('destroy');
            }
            event.stopPropagation();
            $this.removeClass('move');
            $this.parent().removeClass('move');
            console.log('active');
        });
    });
};





function createSlide(typeCreation, event) {
    if (event.type === 'code') {
        var dico = {
            rotateX: event.rotateX,
            rotateY: event.rotateY,
            rotateZ: event.rotateZ
        };
        var currentScale = event.scale;
        var x = event.x;
        var y = event.y;
        var z = event.z;
        var idSlide = event.id;
        var index = event.index;
        i++;
    } else {
        $(this).unbind('click'); // pour obliger Ã  reappuyer sur bouton pour rajouter une slide
        var dico = getTrans3D();
        var currentScale = 1;

        var $slideTemp = $("<div style='height:700' data-z='1000'></div>");
        var posVirtuel = getVirtualCoord(event, $slideTemp);

        var eventMagouille = ({
            pageX: window.innerWidth / 2,
            pageY: window.innerHeight / 2
        });
        var off = getVirtualCoord(eventMagouille, $slideTemp);

        var x = posVirtuel[1] - off[1];
        var y = posVirtuel[0] - off[0];
        var z = 1000; //dico.translate3d[2];
        var idSlide = "slide-" + i++;
        //console.log(x + " " + y);
        var index = i - 2;
    }
    var type = "slide";


    var stringSlide = '{"type": "' + type + '", "id" : "' + idSlide + '", "index" : "' + index + '","pos": {"x" : "' + x + '", "y": "' + y + '", "z": "' + z + '"},"rotate" : {"x" : "' + dico.rotateX + '", "y": "' + dico.rotateY + '", "z": "' + dico.rotateZ + '"}, "scale" : "' + currentScale + '", "element": {}}';
    var jsonSlide = JSON.parse(stringSlide); // transforme le string 'slide' en objet JSON
    if (typeCreation === 'slideText') {
        jsonSlide.type = "slideText";
    }
    pressjson.slide[idSlide] = jsonSlide;
    //console.dir(pressjson);
    jsonToHtml(jsonSlide);
    createTimeLine(idSlide);
    $('#slide-tool').parent().removeClass("buttonclicked");
}






/* ======================================================================================
 * UTILITAIRES COMMUNS ELEMENTS et SLIDE
 * ======================================================================================*/


// transforme un objet (une slide ou un element) json en html
//appelé à chaque création d'instance
function jsonToHtml(data) {
    if (data.class === "element")
    {
        var template = $('#templateStepElement').html();
    }
    if (data.type === "slide" || data.type === "slideText") {
        var template = $('#templateSlide').html();
    }
    var html = Mustache.to_html(template, data);
    $('#slideArea >').append(html);
    var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)

    //ajout des elements textes
    if (data.type === "slideText") {
        //creation du titre1
        var evCode = ({
            type: 'code',
            content: 'Entrer du texte',
            container: $newSlide,
            x: 10,
            y: 90,
            z: 0
        });
        createText('title1', evCode);

        //creation du bodyText
        evCode.x = 40;
        evCode.y = 160;
        createText('bodyText', evCode);
    }

    $('#slideArea').jmpress('init', $newSlide); // initilisation step


    $newSlide.draggableKiki();
    $newSlide.children().each(function() {
        $(this).draggableKiki();
    });

    return($newSlide);
}
;

function jsonToHtmlinSlide(data, container) {

    var template = $('#templateElement').html();
    var html = Mustache.to_html(template, data);
    container.append(html);

    //gestion de ckeditor
    if (data.type === 'text') {
        var $newTxt = container.children().last();
            $newTxt.manageCkeditor();
            console.log(data.newCreated);
            (data.newCreated === 'true') ?  $newTxt.data('newCreated','true') :  $newTxt.data('newCreated','false') ;  //pour savoir si on vide le champ texte 
            $newTxt.data('hierarchy',data.hierarchy);
    }
    
    var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)                
    $('#slideArea').jmpress('init', container); // initilisation step

    container.draggableKiki();
    container.children().each(function() {
        $(this).draggableKiki();
    });
    return($newSlide);
}
;



function restorePressJson(restoreJson) {
    for (var slide in restoreJson.slide) {
        //parser le json, pour chaque slide
        var evCodeSlide = ({
            type: 'code',
            rotateX: restoreJson.slide[slide].rotate.x,
            rotateY: restoreJson.slide[slide].rotate.y,
            rotateZ: restoreJson.slide[slide].rotate.z,
            scale: restoreJson.slide[slide].scale,
            x: restoreJson.slide[slide].pos.x,
            y: restoreJson.slide[slide].pos.y,
            z: restoreJson.slide[slide].pos.z,
            id: restoreJson.slide[slide].id,
            typeEl: restoreJson.slide[slide].type,
            index: restoreJson.slide[slide].index
        });

        createSlide('inutile', evCodeSlide);

        for (var elmt in restoreJson.slide[slide].element) {
            var $newSlide = $('#slideArea>').children().last(); // contenu (enfant div step element)

            var evCodeText = ({
                type: 'code',
                container: $newSlide,
                x: restoreJson.slide[slide].element[elmt].pos.x,
                y: restoreJson.slide[slide].element[elmt].pos.y,
                z: restoreJson.slide[slide].element[elmt].pos.z,
                content: restoreJson.slide[slide].element[elmt].content
            });

            createText(restoreJson.slide[slide].element[elmt].hierarchy, evCodeText);
        }
    }
    /////////////////////////////il n'y a que les increment à recuperer 

}

