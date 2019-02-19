$(function () {
    
    $('[data-toggle="tooltip"]').tooltip();

    $('#menu-toggle').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
});