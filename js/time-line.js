/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



function createTimeLine(idSlide, index) {

  var $slideButton = $('<li class="' + idSlide + '"><span>' + idSlide + '</span>    <a class="cross" href="#">x</a></li>');
//  if ($('#sortable').has("li").length) {
//    console.log( "length" + $('#sortable li').length + " / index" + index);
//    if ($('#sortable li').length < index) {
//      $('#sortable li:nth-child(' + index + ')').before($slideButton);
//    } else {
//      $('#sortable li:last-child').after($slideButton);
//    }
//  }
//  else {
    $('#sortable').append($slideButton);
//  }

  $('#sortable').sortable({
    start: function(event, ui) {
      ui.item.startPos = ui.item.index();
    },
    stop: function(event, ui) {
      var newIndex = ui.item.index();
      var $idSlideSorted = ui.item.attr('class');
      if (ui.item.startPos > newIndex)
      {
        $('.slide').eq(newIndex).before($('#' + $idSlideSorted + ''));
      }
      else
      {
        $('.slide').eq(newIndex).after($('#' + $idSlideSorted + ''));
      }
      $(".slide").each(function(index) {
        var idSlide = $(this).attr('id');
        pressjson.slide[idSlide].index = index;     // MaJ de l'index des slide
      });
      //console.log("pressjson");
      //console.log(pressjson);
    },
    axis: "y"
  })
          .disableSelection();
  ;
}
;




$(document).ready(function() {

  var $sortableList = $("#sortable");
  var $removeLink = $('#sortable li a');

  // pour que le tri ne déclanche pas navigable sur surface travail
  $sortableList.mousedown(function(evt) {
    evt.stopPropagation();
    return false;
  });

  // événements hover button navigable
  $sortableList.on('mouseenter', 'li', function() {
    var $link = $(this).find('a');              // apparition croix
    $link.stop(true, true).fadeIn();
    var $idSlide = $(this).attr('class');       // surbrillance slide
    $('#' + $idSlide + '').addClass('hovered');
//        console.log("mouseenter sur li");
  })
          .on('mouseleave', 'li', function() {
    var $link = $(this).find('a');
    $link.stop(true, true).fadeOut();
    var $idSlide = $(this).attr('class');
    $('#' + $idSlide + '').removeClass('hovered');
//        console.log("mouseleave sur li");
  });

// remove slides
  $sortableList.on('click', 'li a', function(e) {
    var $link = $(this);
    e.preventDefault();
    //console.log("link  " + $link);
    $link.parent().fadeOut(function() {
      $link.parent().remove();
      var $idSlide = $(this).attr('class');
      $('#' + $idSlide + '').remove();
      delete pressjson.slide[$idSlide];
    });
  });
});
