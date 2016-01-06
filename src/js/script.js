$(document).ready(function () {

  // Mobile Navigation Toggle button
  $('.nav-toggle').on('click', function () {
    $('.main-nav').slideToggle();
    var icon = $(this).children('i');
    if (icon.hasClass('fa-bars')) {
      icon.addClass('fa-chevron-up').removeClass('fa-bars');
    } else {
      icon.addClass('fa-bars').removeClass('fa-chevron-up');
    }
  });

  $('.text-block button').on('mouseover', function () {
    $(this.closest('.overlay-block')).addClass('button-hover');
  });
  $('.text-block button').on('mouseleave', function () {
    $(this.closest('.overlay-block')).removeClass('button-hover');
  });
  // $('.image-block').on('mouseover', function () {
  //   $(this).parent().children('.overlay-block').fadeToggle().fadeTo(300, 1);
  // });
  // $('.overlay-block').on('mouseleave', function () {
  //   $(this).fadeToggle().fadeTo(300, 0);
  // });
});
