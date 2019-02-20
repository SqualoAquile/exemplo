$(function () {
    
    $('[data-toggle="tooltip"]').tooltip();

    $('#menu-toggle').click(function () {
        $('#wrapper').toggleClass('toggled');
    });

    $('.dataTable').on('shown.bs.collapse hidden.bs.collapse', '.contatos-filtrados .collapse', function () {
        var $this = $(this),
            $contaotsFiltrados = $this.parents('.contatos-filtrados'),
            $btn = $contaotsFiltrados.find('.btn');

        if ($this.hasClass('show')) {
            $btn.find('i.fas').removeClass('fa-plus-circle').addClass('fa-minus-circle');
        } else {
            $btn.find('i.fas').removeClass('fa-minus-circle').addClass('fa-plus-circle');
        }
    });
});