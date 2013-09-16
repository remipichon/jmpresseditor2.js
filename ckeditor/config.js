/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/*
 CKEDITOR.stylesSet.add('styleJmpress',
 [
 // Inline styles
 {name: 'Title 1', element: 'span', attributes: {'class': 'title1'}},
 {name: 'Body', element: 'span', attributes: {'class': 'bodyText'}}
 ]);
 */


CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config
    
    config.protectedSource.push( /<\?[\s\S]*?\?>/g ); 
    // pour permettre d'écrire <code> dans le mode source
    config.protectedSource.push(/<\?php[\s\S]*?\?>/g);

    config.toolbar = 'ImpressToolbar';      // toolbar personnalisée

    config.toolbar_ImpressToolbar =
            [
                {name: 'document', items: ['Source', '-']},
                {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo']},
                {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']},
                {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']},
//                {name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']},
                {name: 'links', items: ['Link', 'Unlink']},
                {name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar']},
                {name: 'colors', items: ['TextColor', 'BGColor']},
                {name: 'tools', items: ['Maximize', 'ShowBlocks', '-', 'About']}
                //{name: 'styles', items: ['Styles']}
            ];

    CKEDITOR.config.stylesSet = 'styleJmpress';


    // The toolbar groups arrangement, optimized for two toolbar rows.
//  config.toolbarGroups = [
//		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
//		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
//		{ name: 'links' },
//		{ name: 'insert' },
//		{ name: 'forms' },
//		{ name: 'tools' },
//		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
//		{ name: 'others' },
//    '/',
//    {name: 'basicstyles', groups: ['basicstyles']},
//		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
//    {name: 'styles'},
//		{ name: 'colors' },
//		{ name: 'about' }
//  ];

//  // Remove some buttons, provided by the standard plugins, which we don't
//  // need to have in the Standard(s) toolbar.
//  config.removeButtons = 'Subscript,Superscript,-';
//
//  // Se the most common block elements.
//  config.format_tags = 'p;h1';
//
//  // Make dialogs simpler.
//  config.removeDialogTabs = 'image:advanced;link:advanced';
//
//  //on change
//  config.extraPlugins = 'onchange';
//  config.minimumChangeMilliseconds = 1000; // 100 milliseconds (default value)
//        editor.on( 'change', function(e) { //console.log(e) });
};


// la gestion des style est foireuse, je voulais permettre de créer des zones de textes avec directement un style mais 
//c'est un echec. Du coup pour appliquer du css il faut passer par des classes appliquées à des span contenu dans les div
//support du ckeditor. Dans le fichier layout.css il faut donc utiliser .title1 {} ou encore .bodyText{}
// ce sont ces memes classes qui sont passées via la variable "hiearchy" jusqu'au mustache qui fait son boulot. 
// Je pense que c'est une bonne idée de ne pas appliquer le css directement à la div support du ckeditor car n'importe quelles
//modif appliquées au contenu texte d'un champ régit par ckeditor serait affecté.



