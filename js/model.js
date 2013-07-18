/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function callModel(objetEvent) {
   //analyse du type
   if( objetEvent.matricule === 'createSlide'){
       if( objetEvent.action === 'keyboard'){
           var slide = new Slide();
       }
       
   }
   
   if( objetEvent.matricule === 'createTexte'){
       if( objetEvent.action === 'keyboard'){
           var txt = new Element({content:'bonjou'},'slide'+parseInt(globalCpt-1));
       }
       
   }


}


function test() {
    //differents moyen de créer une slide
    //juste avec les coord
    new Slide({rotate: {x: 10, y: 5, z: 0}});
//    //avec coord et rotate
//    var s2 = new Slide({pos: {x: 900, y: 5, z: 0}});
////    s2.watch('pos', function(attribut, newVal, oldVal){
////       console.log(this, attribut, newVal, oldVal); 
////    });
//    //avec coord et texte (several)
//
//    var e1 = new Element({content: 'bonjour'}, 'slide0');


    //s1.show();
    //s1.pos.x = 100;

//    container.slide['slide0'].show();
////    //watch des modifications
////    watch(container.slide['slide0'].pos, 'x', function(attr, action, newVal, oldVal) {
////        console.log('màj', this.matricule, ' propriété ', attr, ' avec ', newVal);
////    });
//     
//    
//    container.slide['slide1'].show();

};