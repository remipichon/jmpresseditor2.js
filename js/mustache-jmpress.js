//////////////////mustache jmpress////////////////////////////
//fonction qui recupère le fichier json et stocke les données dans data
$.getJSON('json/architecture-press.json', function(data) {
    // pour Mustache il faut un jeu de data (json) ainsi qu'un template (html+mustache)
    //à partir de ces deux variables, Mustache.to_html() crée une variable html (en string)
   
    //template
    //var template = $('#templateJmpress').html();
    var template = "{{#slide}} <div class='step slide {{step-number}}' data-x = '{{pos.x}}' data-y = '{{pos.y}}' "+
    "data-scale = '{{scale}}' > " +
    "{{title}}{{#element}} "+
    "  <div class = '{{type}}'  style='position: relative; left: {{pos.x}}px; right: {{pos.y}}'> {{description}} </div>  "+
    "{{/element}} </div>   {{/slide}}" ;
    

    
    
    //generation du html
    var html = Mustache.to_html(template, data);
    alert(html);
    
    //ajout du html à la div 
    $('#slideArea').append(html);
   
    
    //chargement des css propre à la présentation puis lancement de la présentation
    $('#scriptImpress').append( '<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
    $('#slideArea').jmpress();
 
 
   
});
    
