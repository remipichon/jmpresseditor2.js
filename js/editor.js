/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// Fonction permettant de sélectionner un outil "faire du texte" quand on appuie sur le bouton texte
$(document).ready(function(){
    $("#fontbutton").on('click', function(event){
      $('#impress').append("<div class=\"step slide\" data-x=\"-1000\" data-y=\"-1500\">\
        <q>Aren't you just <b>bored</b> with all those slides-based presentations?</q>");
      $('#surface').css("background","#CCC;");
    });
    $("#impress").mouseover(function(){
       $(this).parent().css("background","#CCC;");
    });  
});

//>$("p").parent(".selected").css("background", "yellow")

// Pour faire en sorte que la souris, une fois sur la surface, dessine une forme
/*$('#surface')
    .mousedown(function(e){
        var offset =
    })
    .mousemove(function(e){

    })
    .mouseup(function(e){

    })
 */

$("surface").on('click', function(){
    $('#impress').append("<div class=\"step slide\" data-x=\"-1000\" data-y=\"-1500\">\
        <q>Aren't you just <b>bored</b> with all those slides-based presentations?</q>");
});