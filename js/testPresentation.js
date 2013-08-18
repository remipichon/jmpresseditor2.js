
/*
 * n'a pas suivi les changements du container.slide objet à conteneur.slide array
 * 
 * 
 */



//function test(){
function testcos() {
    var i = 0;
    var X = 1000;
    var Y = 1000;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;
    var r = 5000; //rayon
    var alpha = 0; //cran de position des slides sur le cercle      //en degré
    var beta;       //orientation de la slide (en z) pour qu'elle soit tangente au cercle  // en degré

    var prevX = 0;
    var prevY = 0;

    truc = [];
    while (i < 100) {

        //calcul de la position sur la fonction

        //verification de la distance minimum
        while (Math.sqrt(Math.pow((X - prevX), 2) + Math.pow((Y - prevY), 2)) < 1000) {
            X = X + 100;
            Y = 3000 * Math.cos(X / 1000);
            console.log(X, Y, Math.sqrt(Math.pow((X - prevX), 2) + Math.pow((Y - prevY), 2)));
            //alert( X+' '+ Y+' '+Math.sqrt(  Math.pow((X-prevX),2) + Math.pow((Y-prevY),2) ) );

        }


        truc.push([X, Y]);

        var slide = new Slide({
            pos: {
                x: X,
                y: Y,
                z: Z
            },
            rotate: {
                x: RX,
                y: RY,
                z: RZ
            }
        });


        Z = Z - 1000;
        prevX = X;
        prevY = Y;
        i++;
    }

}



function testCircle() {
//function test(){
    var i = 0;
    var X = 0;
    var Y = 0;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;
    var r = 5000; //rayon
    var alpha = 0; //cran de position des slides sur le cercle      //en degré
    var beta;       //orientation de la slide (en z) pour qu'elle soit tangente au cercle  // en degré

    var smaller = true;
    truc = [];
    while (i < 100) {



        //calcul de la position autour du cercle 
        var alphaRad = alpha * Math.PI / 180;
        X = Math.sin(alphaRad) * r;
        Y = Math.cos(alphaRad) * r;

        //calcul de la rotation en Z
//        var signeX = X / Math.abs(X);
//        var a = 2*X / Math.sqrt( Math.pow(r,2) - Math.pow(X,2) ); //coef directeur de la tangent
//        
//        beta = Math.acos(   signeX / Math.sqrt(  Math.pow(a,2) + 1  )   );
////        beta = Math.atan( coef * 2*X / Math.sqrt( Math.pow(r,2) - Math.pow(X,2) ) ) * 180/ Math.PI ;
//        RZ = beta * 180/Math.PI;
//        truc.push(beta);


        var slide = new Slide({
            pos: {
                x: X,
                y: Y,
                z: Z
            },
            rotate: {
                x: RX,
                y: RY,
                z: RZ
            }
        });

        Z = Z - 1000;
        if (smaller) {
            r = r - 300;
        } else {
            r = r + 300;
        }
        var limite = 1000;
        if (r < limite) {
            smaller = false;
//            r = limite + 10;
        }
        console.log('RAYON             ', r);

        alpha += 20; //en degré
        i++;
    }


}


function test3() {
    var i = 0;
    var X = 0;
    var Y = 0;
    var Z = 0;
    var RX = 0;
    var RY = 0;
    var RZ = 0;

    while (i < 10) {

        var slide = new Slide({
            pos: {
                x: X,
                y: Y,
                z: Z
            },
            rotate: {
                x: RX,
                y: RY,
                z: RZ
            }
        });
        Y += 1000;
        RY += 45;
        i++;
    }
}








//function automaticDynamic(){
function test() {
    var cranY = 1000;
    var cranZ = -1000;
    var cranX = 1200;


    new Slide({pos: {x: 0, y: 0, z: 0}, type: 'overview', scale: 2});
//1    
    var slide1 = new Slide({pos: {x: -1500, y: 0, z: 0}});
    new Text(slide1.matricule, {properties: {hierachy: 'H1Text', content: '1'}});

    var nbSoeur = 3;
    new Slide({pos: {x: slide1.pos.x + (nbSoeur - 1) * cranX / 2, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide11 = new Slide({pos: {x: slide1.pos.x, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}});
    new Text(slide11.matricule, {properties: {hierachy: 'H1Text', content: '1.1'}});
    var slide11content = new Slide({pos: {x: slide11.pos.x, y: slide11.pos.y, z: slide11.pos.z + cranZ * 2}});
    new Text(slide11content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    new Slide({pos: {x: slide11.pos.x + cranX + (nbSoeur - 2) * cranX / 2, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide12 = new Slide({pos: {x: slide11.pos.x + cranX, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}});
    new Text(slide12.matricule, {properties: {hierachy: 'H1Text', content: '1.2'}});
    var slide12content = new Slide({pos: {x: slide12.pos.x, y: slide12.pos.y, z: slide12.pos.z + cranZ * 2}});
    new Text(slide12content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide13 = new Slide({pos: {x: slide12.pos.x + cranX, y: slide1.pos.y + cranY, z: slide1.pos.z + cranZ}});
    new Text(slide13.matricule, {properties: {hierachy: 'H1Text', content: '1.3'}});
    var slide13content = new Slide({pos: {x: slide13.pos.x, y: slide13.pos.y, z: slide13.pos.z + cranZ * 2}});
    new Text(slide13content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});


    new Slide({pos: {x: 750, y: 0, z: 0}, type: 'overview', scale: 2});

//2   
    var slide2 = new Slide({pos: {x: 0, y: 0, z: 0}});
    new Text(slide2.matricule, {properties: {hierachy: 'H1Text', content: '2'}});

    var nbSoeur = 2;
    new Slide({pos: {x: slide2.pos.x + (nbSoeur - 1) * cranX / 2, y: slide2.pos.y + cranY, z: slide2.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide21 = new Slide({pos: {x: slide2.pos.x, y: slide2.pos.y + cranY, z: slide2.pos.z + cranZ}});
    new Text(slide21.matricule, {properties: {hierachy: 'H1Text', content: '2.1'}});
    var slide21content = new Slide({pos: {x: slide21.pos.x, y: slide21.pos.y, z: slide21.pos.z + cranZ * 2}});
    new Text(slide21content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide22 = new Slide({pos: {x: slide21.pos.x + cranX, y: slide2.pos.y + cranY, z: slide2.pos.z + cranZ}});
    new Text(slide22.matricule, {properties: {hierachy: 'H1Text', content: '2.2'}});

    var nbSoeur = 2;
    new Slide({pos: {x: slide22.pos.x + (nbSoeur - 1) * cranX / 2, y: slide22.pos.y + cranY, z: slide22.pos.z + cranZ}, type: 'overview', scale: 2});

    var slide221 = new Slide({pos: {x: slide22.pos.x, y: slide22.pos.y + cranY, z: slide22.pos.z + cranZ}});
    new Text(slide221.matricule, {properties: {hierachy: 'H1Text', content: '2.2.1'}});
    var slide221content = new Slide({pos: {x: slide221.pos.x, y: slide221.pos.y, z: slide221.pos.z + cranZ * 2}});
    new Text(slide221content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide222 = new Slide({pos: {x: slide221.pos.x + cranX, y: slide22.pos.y + cranY, z: slide22.pos.z + cranZ}});
    new Text(slide222.matricule, {properties: {hierachy: 'H1Text', content: '2.2.2'}});
    var slide222content = new Slide({pos: {x: slide222.pos.x, y: slide222.pos.y, z: slide222.pos.z + cranZ * 2}});
    new Text(slide222content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});


//3    
    var slide3 = new Slide({pos: {x: 1500, y: 0, z: 0}});
    new Text(slide3.matricule, {properties: {hierachy: 'H1Text', content: '3'}});
    var slide3content = new Slide({pos: {x: slide3.pos.x, y: slide3.pos.y, z: slide3.pos.z + cranZ * 2}});
    new Text(slide3content.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});






}







function automaticEditor() {
//function test() {



    var slide = new Slide({pos: {
            x: 1500,
            y: 0,
            z: 0
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 0,
            y: 0,
            z: 0
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '1'}});

    var slide = new Slide({pos: {
            x: 0,
            y: 1000,
            z: 0
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: -600,
            y: 1000,
            z: 0
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '1.1'}});
    var slide = new Slide({pos: {
            x: -600,
            y: 2000,
            z: 0
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 600,
            y: 1000,
            z: -2000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '1.2'}});
    var slide = new Slide({pos: {
            x: 600,
            y: 2000,
            z: -2000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 2200,
            y: 0,
            z: -4000
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 1500,
            y: 0,
            z: -4000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2'}});

    var slide = new Slide({pos: {
            x: 1100,
            y: 1000,
            z: -4000
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 600,
            y: 1000,
            z: -4000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.1'}});
    var slide = new Slide({pos: {
            x: 600,
            y: 2000,
            z: -4000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 1800,
            y: 1000,
            z: -6000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.2'}});

    var slide = new Slide({pos: {
            x: 1800,
            y: 2000,
            z: -6000
        }, scale: 2, type: 'overview'});

    var slide = new Slide({pos: {
            x: 1200,
            y: 2000,
            z: -6000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.2.1'}});
    var slide = new Slide({pos: {
            x: 1200,
            y: 3000,
            z: -6000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});

    var slide = new Slide({pos: {
            x: 2400,
            y: 2000,
            z: -8000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '2.2.2'}});
    var slide = new Slide({pos: {
            x: 2400,
            y: 3000,
            z: -8000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});


    var slide = new Slide({pos: {
            x: 3000,
            y: 0,
            z: -10000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: '3'}});
    var slide = new Slide({pos: {
            x: 3000,
            y: 1000,
            z: -10000
        }});
    new Text(slide.matricule, {properties: {hierachy: 'H1Text', content: 'content'}});
















}

//function test() {
function test2() {
    //differents moyen de créer une slide
    //juste avec les coord
    //$('#slideArea>').html('');
    var X = 0;
    var Y = 0;
    var I = 0;
    var slide = new Slide({pos: {x: X, y: Y, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I}});
    var slide = new Slide({pos: {x: X, y: Y + 1000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 2}});
    var slide = new Slide({pos: {x: X + 1000, y: Y, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 4}});
    var slide = new Slide({pos: {x: X + 1000, y: Y + 1000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 6}});
    var slide = new Slide({pos: {x: X + 1000, y: Y + 2000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 8}});
    var slide = new Slide({pos: {x: X + 1000, y: Y + 3000, z: 0}});
    new Text(slide.matricule, {properties: {content: 'slide : ' + I + 10}});


//    new Image({pos: {y: 500}}, 'slide0');


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

}
;