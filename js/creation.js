
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
    alert("Bonsoir !")
    alert("en double cliquant sur UN square ou UN texte  puis sur UNE slide tu peux les grouper via le bouton 'group' ");
    alert("au sein de chaque slide, le petit cadre bleu indique le positionnement de la slide dans l'espace et le grand cadre noir est pour placé les elements (tu ne peux le faire qu'avec le carré) au sein de la slide");
    alert("ensuite, clique sur 'creer diapo' pour apprecier la presentation. Backspace pour revenir à l'édition et modifier ta présentaion");
    alert("malheureusement, pour le moment tu ne peux pas cliquer de nouveau sur 'creer diapo', il faut refresh la page pour recommencer");
    
    
    
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
            var slide = $("#"+i+"").clone();
            slide.removeClass();
            slide.removeAttr('style');
            slide.addClass('step slide ' );
            slide.attr('data-x',Left );
            slide.attr('data-y', Top);
            
            $('#impress').append(slide);       
        }
        
        $(".zonePouet").remove();
        //
        //suppression des scripts relatif à la zone création et a boostrap
        //finalement je garde car c'est dans ce div que seront stocké les css des formes et tout
        //$("#scriptBootstrap").empty();
        
        //chargement des scriptis relatif à impress
        //ce css permet de faire l'echange entre les display des id=impress et id=editot
        $('#scriptImpress').append( '<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
        //$('#impress').append(' <a class="btn btn-large" id="Edit" href="#">Edit<i class="icon-edit"></i> </a> ');
        //le bouton de retour à l'édition est présent dès le début mais en display:none car dans la div impress
       
        
        impress().init();
        alert("c'est parti pour impress");
    });
    
    //*
    $(document).keydown( function(key) {
        if(key.keyCode === 8){ //backspace 
            $("#impress-demo").remove();
            //$("#impress").children().empty(); //purge de id=impress
            //$("body").append('<div id="impress"> </div>');
       
        }
    });
    
    /*
    $('#Edit').click( function() {
        //charcher les scripts pour le mode de création
        alert("mode edition");
        $("#impress-demo").remove();      
    });
    */
    
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





     



 