/* 
 * Scripts regarding only animation of layout (slidding menu, etc)
 * 
 */


$(document).ready(function() {


    /* ======================================================================================
     * top-bar drop down menu        -   parameters button
     * ====================================================================================== */
    $('#parameters').on('click', function() {
        $submenu = $('#topbar-submenu');
        $submenu.toggleClass('hidden-sub');
        if ($submenu.hasClass('hidden-sub')) {
//            $($submenu).animate({marginTop: "-100"}, 300);
            $($submenu).show();
        }
        else {
            $($submenu).animate({marginTop: "0"}, 300);
            $($submenu).hide();
        }
    });


    $('#info').on('click', function() {
        window.open('https://github.com/clairezed/ImpressEdit');
    });




    /* ======================================================================================
     * rightbar sliding        -   arrow-nav button
     * ====================================================================================== */

    $('#arrow-nav').on('click', function() {
        $sidebar = $('#sidebar');
        $sidebar.toggleClass('hidden-bar');
        if ($sidebar.hasClass('hidden-bar')) {
            $('#sidebar').animate({marginLeft: "-200"}, 300);
            $('#arrow-nav').css('background-position', '-50px 0');
        }
        else {
            $('#sidebar').animate({marginLeft: "0"}, 300);
            $('#arrow-nav').css('background-position', '0 0');
        }
    });

    /* ======================================================================================
     * DISPLAY MODE        -   present button
     * ouvre dans une nouvelle fenetre la pres' en mode presentation (avec script jmpress originel)
     * utilise les données du json (reformatées) stockées en local storage + export mustache
     * ====================================================================================== */

    $('#present').on('click', function(event) {
        var outputjson = {data: null, slide: new Array()};
        // mise en forme correct du json de sortie : 
        var arrayElement = [];
        $.each(pressjson.slide, function(key1, slide) {
            var slide2 = pressjson.slide[key1];
            $.each(slide, function(key2, element) {
                if (key2 === 'element') {
                    var arrayElement = [];
                    $.each(element, function(key3, elemind) {
                        arrayElement.push(elemind);
                        slide2.element = [];
                        $.each(arrayElement, function(key, value) {
                            slide2.element.push(value);
                        });
                    });
                }
            });
            outputjson.slide.push(slide2);
        });
        console.log("output json : ");
        console.log(outputjson);
        outputjson.slide.sort(sort_by('index', true, parseInt));
        console.log("output json sorted : ");
        console.log(outputjson);
        var stringjson = JSON.stringify(outputjson, null, 2);
        localStorage.setItem('outputjson', stringjson);
        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");
        // location
        

    });

    /* ======================================================================================
     * SAVE       -   save button
     * enregistre la présentation en local storage (tjs présente si F5)
     * + raccourci clavier ? 
     * + modal d'explication ?
     * ====================================================================================== */

    $('#save').on('click', function(event) {
        var savedJson = JSON.stringify(pressjson, null, 2);
//        console.log("saved json : ");
//        console.log(savedjson);
        localStorage.setItem('savedJson', savedJson);

        var savedPress = $("#slideArea>div").html();
        localStorage.setItem('savedPress', savedPress);
        console.log('savedPress :');
        console.log(savedPress);


//        window.open("displaymode.html", "display", "toolbar=no, directories=no, menubar=no, resizable=yes, scrollbars=no, width=1200, height=900, top=10, left=20");
        // location

    });

    $('#clear').click(function() {
        window.localStorage.clear();
        location.reload();
        return false;
    });


});

var sort_by = function(field, reverse, primer){

   var key = function (x) {return primer ? primer(x[field]) : x[field]};

   return function (a,b) {
       var A = key(a), B = key(b);
       return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
   }
}


/* ======================================================================================
 * PREVIOUS SLIDE- NEXT SLIDE BUTTONS        -   side bar, timelin
 * permet de se déplacer dans sa présentation en mode éditeur
 * hem, je pensais que ce serait + simple que ça ne me semble
 * ====================================================================================== */
//
//(function( $, document, window, undefined ) {
//
//	'use strict';
//	var $jmpress = $.jmpress,
//		jmpressNext = "next",
//		jmpressPrev = "prev";
//
//	/* FUNCTIONS */
//	function randomString() {
//		return "" + Math.round(Math.random() * 100000, 0);
//	}
//	function stopEvent(event) {
//		event.preventDefault();
//		event.stopPropagation();
//	}
//
////	/* DEFAULTS */
////	$jmpress('defaults').keyboard = {
////		use: true
////		,keys: {
////			33: jmpressPrev // pg up
////			,37: jmpressPrev // left
////			,38: jmpressPrev // up
////
////			,9: jmpressNext+":"+jmpressPrev // tab
////			,32: jmpressNext // space
////			,34: jmpressNext // pg down
////			,39: jmpressNext // right
////			,40: jmpressNext // down
////
////			,36: "home" // home
////
////			,35: "end" // end
////		}
////		,ignore: {
////			"INPUT": [
////				32 // space
////				,37 // left
////				,38 // up
////				,39 // right
////				,40 // down
////			]
////			,"TEXTAREA": [
////				32 // space
////				,37 // left
////				,38 // up
////				,39 // right
////				,40 // down
////			]
////			,"SELECT": [
////				38 // up
////				,40 // down
////			]
////		}
////		,tabSelector: "a[href]:visible, :input:visible"
////	};
//
//	/* HOOKS */
//	$jmpress('afterInit', function( nil, eventData ) {
//		var settings = eventData.settings,
////			keyboardSettings = settings.keyboard,
////			ignoreKeyboardSettings = keyboardSettings.ignore,
//			current = eventData.current,
//			jmpress = $(this);
//
//		// tabindex make it focusable so that it can recieve key events
//		if(!settings.fullscreen) {
//			jmpress.attr("tabindex", 0);
//		}
//
////		current.keyboardNamespace = ".jmpress-"+randomString();
//
//		// KEYPRESS EVENT: this fixes a Opera bug
////		$(settings.fullscreen ? document : jmpress)
////			.bind("keypress"+current.keyboardNamespace, function( event ) {
////
////			for( var nodeName in ignoreKeyboardSettings ) {
////				if ( event.target.nodeName === nodeName && ignoreKeyboardSettings[nodeName].indexOf(event.which) !== -1 ) {
////					return;
////				}
////			}
////			if(event.which >= 37 && event.which <= 40 || event.which === 32) {
////				stopEvent(event);
////			}
////		});
//		// KEYDOWN EVENT
//		$(settings.fullscreen ? document : jmpress)
//			.bind("keydown"+current.keyboardNamespace, function( event ) {
//			var eventTarget = $(event.target);
//
//			if ( !settings.fullscreen && !eventTarget.closest(jmpress).length || !keyboardSettings.use ) {
//				return;
//			}
//
//			for( var nodeName in ignoreKeyboardSettings ) {
//				if ( eventTarget[0].nodeName === nodeName && ignoreKeyboardSettings[nodeName].indexOf(event.which) !== -1 ) {
//					return;
//				}
//			}
//
//			var reverseSelect = false;
//			var nextFocus;
////			if (event.which === 9) {
////				// tab
////				if ( !eventTarget.closest( jmpress.jmpress('active') ).length ) {
////					if ( !event.shiftKey ) {
////						nextFocus = jmpress.jmpress('active').find("a[href], :input").filter(":visible").first();
////					} else {
////						reverseSelect = true;
////					}
////				} else {
////					nextFocus = eventTarget.near( keyboardSettings.tabSelector, event.shiftKey );
////					if( !$(nextFocus)
////						.closest( settings.stepSelector )
////						.is(jmpress.jmpress('active') ) ) {
////						nextFocus = undefined;
////					}
////				}
////				if( nextFocus && nextFocus.length > 0 ) {
////					nextFocus.focus();
////					jmpress.jmpress("scrollFix");
////					stopEvent(event);
////					return;
////				} else {
////					if(event.shiftKey) {
////						reverseSelect = true;
////					}
////				}
////			}
//
//			var action = keyboardSettings.keys[ event.which ];
//			if ( typeof action === "string" ) {
//				if (action.indexOf(":") !== -1) {
//					action = action.split(":");
//					action = event.shiftKey ? action[1] : action[0];
//				}
//				jmpress.jmpress( action );
//				stopEvent(event);
//			} else if ( $.isFunction(action) ) {
//				action.call(jmpress, event);
//			} else if ( action ) {
//				jmpress.jmpress.apply( jmpress, action );
//				stopEvent(event);
//			}
//
//			if (reverseSelect) {
//				// tab
//				nextFocus = jmpress.jmpress('active').find("a[href], :input").filter(":visible").last();
//				nextFocus.focus();
//				jmpress.jmpress("scrollFix");
//			}
//		});
//	});
//	$jmpress('afterDeinit', function( nil, eventData ) {
//		$(document).unbind(eventData.current.keyboardNamespace);
//	});
//
//
//}(jQuery, document, window));