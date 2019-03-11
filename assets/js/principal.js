var datepickerOptions = {
    uiLibrary: 'bootstrap4',
    language: 'pt-BR',
    autoclose: true,
    todayHighlight: true,
    todayBtn: true,
    clearBtn: true
};

function Toast (options) {
    $('body').append(`
        <div class="position-fixed my-toast m-3 shadow-sm alert ` + options.class + ` alert-dismissible fade show" role="alert">
            ` + options.message + `
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);

    window.setTimeout(function() {
        $('.alert').alert('close');
    }, 4000);
};

$(function () {

    var $menuToggle = $('#menu-toggle'),
        $wrapper = $('#wrapper');

    $(this)
        .on('click', function (e) {
            if (
                (e.target.id != 'sidebar-wrapper' && !$(e.target).parents('#sidebar-wrapper').length) &&
                (e.target.id != 'nav' && !$(e.target).parents('#nav').length)
            ) {
                $('#menu-toggle.is-active').click();
            }
        });
    
    $('[data-toggle="tooltip"]').tooltip();

    $menuToggle.click(function () {
        $(this).toggleClass('is-active');
        $wrapper.toggleClass('toggled');
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

    $('.select-all').click(function () {

        var $this = $(this),
            $checkThead = $this.find('[type=checkbox]')
            $table = $this.parents('.table-responsive');

        $checkThead.prop('checked', !$checkThead.prop('checked'))
        $table.find('[type=checkbox]').prop('checked', !$checkThead.prop('checked'));
    });

    $('.select-all').off('click.DT');
});