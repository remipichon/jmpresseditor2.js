
function handlerTreeMaker() {

    $('#treeMaker').on('click', '.addSibling', function() {
        console.log('add sib');
        data = {
        };

        var template = $('#templateSibling').html();
        var html = Mustache.to_html(template, data);


        $(this).parent().append(html);
        $(this).parent().append($(this));   
           


    });

}  


function goSlideShow(){
    
    console.log('GO SLIDESHOW');
    
//    $('#slideArea .step').each(function(){
//        if( $(this).attr('id') === 'home' ) return; //cette foutue slide n'existe pas dans le container !
//         container.slide[$(this).attr('matricule')].destroy();
//    });
//    
   
    $('#treeMaker .addSibling').each(function(){
       $(this).remove(); 
    });
     $('#treeMaker').attr('id','tree');
    initAutomatic();
}


function goTreeMaker(){
    console.log('RETURN TREE MAKER  ');
    
   
    $('#slideArea .step').each(function(){
        if( $(this).attr('id') === 'home' ) return; //cette foutue slide n'existe pas dans le container !
//        container.slide[$($('#slideArea .step')[5]).attr('matricule')].destroy()
        console.log($(this).attr('matricule'));
        if( !findObjectOfComposant($(this).attr('matricule'))) return;
         container.slide[$(this).attr('matricule')].destroy();
    });
    
    $('#tree').attr('id','treeMaker');
    $('#treeMaker .questions').each(function(){
       $(this).remove(); 
    });
    $('#treeMaker ol').each(function(){
       $(this).append("<li class='addSibling'>Add Sibling</li>"); 
    });
    
    
}