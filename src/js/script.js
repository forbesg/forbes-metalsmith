$(document).ready(function () {

  // Mobile Navigation Toggle button
  $('.nav-toggle').on('click', function () {
    $('.main-nav').slideToggle();
  });

  $('.image-block').on('mouseover', function (e) {
    e.preventDefault();
    $(this).parent().children('.overlay-block').fadeToggle().fadeTo(300, 1);
  });
  $('.overlay-block').on('mouseleave', function (e) {
    e.preventDefault();
    $(this).fadeToggle().fadeTo(300, 0);
  });
});
