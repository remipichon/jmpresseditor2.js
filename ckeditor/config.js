/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For the complete reference:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	// Remove some buttons, provided by the standard plugins, which we don't
	// need to have in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Se the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Make dialogs simpler.
	config.removeDialogTabs = 'image:advanced;link:advanced';
        
        //on change
        config.extraPlugins = 'onchange';
        config.minimumChangeMilliseconds = 1000; // 100 milliseconds (default value)
//        editor.on( 'change', function(e) { console.log(e) });
};


// la gestion des style est foireuse, je voulais permettre de créer des zones de textes avec directement un style mais 
//c'est un echec. Du coup pour appliquer du css il faut passer par des classes appliquées à des span contenu dans les div
//support du ckeditor. Dans le fichier layout.css il faut donc utiliser .title1 {} ou encore .bodyText{}
// ce sont ces memes classes qui sont passées via la variable "hiearchy" jusqu'au mustache qui fait son boulot. 
// Je pense que c'est une bonne idée de ne pas appliquer le css directement à la div support du ckeditor car n'importe quelles
//modif appliquées au contenu texte d'un champ régit par ckeditor serait affecté.
CKEDITOR.stylesSet.add( 'styleJmpress',
[
     
    // Inline styles
    { name : 'Title 1',  element : 'span', attributes : { 'class' : 'title1' } },
    { name : 'Body', element : 'span', attributes : { 'class' : 'bodyText' } }
]);

CKEDITOR.config.stylesSet = 'styleJmpress';
