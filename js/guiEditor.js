/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


    $(document).keypress(function(event) {
        if( event.which === 115) {
            var objetEvent = {
                matricule : 'createSlide',
                action : 'keyboard',            
                event : {
                    type : 's'                
                }           

            };

            callModel(objetEvent);

        }
        
        if (event.which === 116) {
            var objetEvent = {
                matricule : 'createTexte',
                action : 'keyboard',            
                event : {
                    type : 's'                
                }           

            };

            callModel(objetEvent);
            
        }


    });