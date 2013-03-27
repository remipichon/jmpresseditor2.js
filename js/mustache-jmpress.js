//////////////////mustache jmpress////////////////////////////
//fonction qui recupère le fichier json et stocke les données dans data
$.getJSON('json/architecture-press.json', function(data) {
    var widthSlide = 900;
    var heightSlide = 700;
    
    
    // pour Mustache il faut un jeu de data (json) ainsi qu'un template (html+mustache)
    //à partir de ces deux variables, Mustache.to_html() crée une variable html (en string)
   
    //template
    var template = $('#templateJmpress').html();
 
    
    
    //generation du html
    var html = Mustache.to_html(template, data);
    alert(html);        //ne pas commenter car le jmpress ne fonctionne pas sans
    
    
    //ajout du html à la div 
    $('#slideArea').append(html);
    
    $('#slideArea').children().draggable(  {
        drag: function( event ) {
            var slide = $(this);
            var pos = slide.offset();
            var X =  pos.left;//event.pageX-widthSlide/2;
            var Y = pos.top;//event.pageY-heightSlide/2;
       
            //màj du fichier json
            //$(this).html("left : " + parseInt(pos.left) + "  top : " + parseInt(pos.top) ); 
            $('#slideArea').jmpress('deinit', $(this) );  
            $(this).attr("data-x",X);
            $(this).attr("data-y", Y);
            $('#slideArea').jmpress('init', $(this));   //je crois que jimpress n'init que les steps non init par défaut
             
            console.log(event.pageX + "   " + event.pageY);
        }
    });
    /*
    $('#slideArea').children().mousedown( function() {
        
        
        $(document).mousemove( function(event)   {
            var slide = $(this);
            var pos = slide.offset();
       
            //màj du fichier json
            $(this).html("left : " + parseInt(pos.left) + "  top : " + parseInt(pos.top) ); 
            $('#slideArea').jmpress('deinit', $(this) );
            $(this).attr("data-x", event.pageX);
            $(this).attr("data-y", event.pageY);
            $('#slideArea').jmpress('init', $(this));
             
            console.log(event.pageX + "   " + event.pageY);
            
             
        } );
        
    }) ;
    */

    
    
    //chargement des css propre à la présentation puis lancement de la présentation
    $('#scriptImpress').append( '<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
    $('#slideArea').jmpress();
    console.log("go jimpress");
  
});


$( function dragPos () {
   
    $('.step').click( function() {
        alert("click");
        var slide = $(this);
        var pos = slide.offset();
       
        //màj du fichier json
        alert("left : " + pos.left + " top : " + pos.top);
       
       
       
    }) ;
    
});
    
