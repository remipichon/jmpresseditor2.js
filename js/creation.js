
/*
tout ce qui est dans la fonction $( function() {
concerne les elements crée en statique
pour que des fonctions soient prises en charge par des elements
crée dynamiquement, il faut les lui donner lors de sa création, 
ex : le draggable et le doubleclick

il faut delemiter une zone de canvas en mode creation en limityant le draggable
ensuite calculer en proportion les coords à foutre pour le impress

trouver un moyen astucieux pour gerer les elements au sein de la slide
 */

$( function () {
    
    var cptSlide = 0;
    var cptElement = 0;
   
    
    
    //ajout carre draggable avec son indice et double click pour le groupage
    $('#adS').click( function() {
        var newF =  $("<div class='forme square'   idElement='"+ cptElement++  +"'> </div>") ;
        newF.text('indice : ' + newF.attr("idElement") );
        $(newF).draggable();
        
        
        newF.attr('style', 'position : absolute') ;
        
        $(newF).dblclick( function () {
            $(this).addClass("groupage");
            $(this).toggleClass('alt');
        });
        
        $('#zoneCreation').append(newF);
       
    });
    
    //ajout zone de texte draggable avec son indice et double click pour le groupage
    $('#zoneTexte').click( function() {

        var saisie = prompt("Texte a ajouter : ");
        var newT =  $("<div class='zoneTexte'   idElement='"+ cptElement++  +"'> </div>") ;
        
            $(newT).draggable();
        
        newT.attr('style', 'position : absolute') ;
        
        $(newT).dblclick( function () {
            alert("dblck texte");
            $(this).addClass("groupage");      
            $(this).toggleClass('alt');
        });
        
        $('#zoneCreation').append(newT);
        newT.append("<q>"+saisie+"</q>" );
    });
    
   
        
            
    //ajout groupe draggable avec son indice et double click pour le groupage
    $('#newGroupe').click( function() {
            
        var newG =  $("<div class='slidegroupe'  id='"+ cptSlide++  +"' >  <div class='zonePouet'> </div>  </div>") ;
        ////////////////newG.append( "<n>"+newG.attr("idSlide")+"" );
       
        $(newG).draggable();  
        
        
        newG.attr('style', 'position : absolute') ;
        
        
        $(newG).dblclick( function () {
            $(this).addClass("groupageG");
            $(this).toggleClass('alt');
        });  
        
        $('#zoneCreation').append(newG);
       
   
    });
    
    
    
    
    $('#init').click( function() {
        alert('init pour : '+cptSlide+' slides');
        
        //zjout des slides (vides)
        for( var i=0 ; i<cptSlide ;i++) {
            //ajout de la slide et de ses enfants
            
            var grp = $("#"+i+"").offset();
            var Left = grp.left*10;
            var Top = grp.top*10;
           
            //modification de la slide pour qu'elle soit géré par impress
            var slide = $("#"+i+"");
            slide.removeClass();
            slide.removeAttr('style');
            slide.addClass('step slide ' );
            slide.attr('data-x',Left );
            slide.attr('data-y', Top);
            
            
            $('#impress').append(slide);       
        }
        //
        //suppression des scripts relatif à la zone création et a boostrap
        $("#scriptCreation").empty();
        $("#scriptBootstrap").empty();
        
        //chargement des scriptis relatif à impress
        $('#scriptImpress').append( '<link href="css/impress-demo.css" rel="stylesheet" />');
        
        impress().init();
        alert("c'est parti pour impress");
    });
    
   
    
    $('#grouper').click( function() {        
        //le calcul des coordonnées ne gère pas le fait de grouper plusieurs elements d'un coup
        var grp = $('.groupageG');
        var elmt = $('.groupage');
        
        
        
        
        
        grp.removeClass('groupageG');
        grp.toggleClass('alt');
        elmt.removeClass('groupage')
        elmt.toggleClass('alt');
       
        
        if (!(elmt.hasClass("zoneTexte")) ){
            
        
            
        
            var posGr = grp.offset();
            var posEl = elmt.offset();
            alert( 'Left =' + posEl.left+ '-' +posGr.left + 'Top =' +posEl.top+' -'+ posGr.top );
        
            var Left = posEl.left - posGr.left;
            var Top = posEl.top - posGr.top;
            elmt.attr('style', 'position : relative; left:'+Left+'px ; top:'+Top+'px;') ;
        }
        else {
            elmt.attr("style","position: relative; left: 0px; top: 0px;");
        }
        
      
        grp.append(elmt);  
        alert('terminer');
  
    });
    
    $('#remove').click( function() {
        alert('remove');
        $("#zoneCreation").empty();
    });
    

});





     



 