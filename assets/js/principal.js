$.fn.datepicker.defaults.uiLibrary = 'bootstrap4';
$.fn.datepicker.defaults.language = 'pt-BR';
$.fn.datepicker.defaults.autoclose = true;
$.fn.datepicker.defaults.todayHighlight = true;
$.fn.datepicker.defaults.todayBtn = true;
$.fn.datepicker.defaults.clearBtn = true;
$.fn.datepicker.defaults.showClose = true;
$.fn.datepicker.defaults.ignoreReadonly = true;
$.fn.datepicker.defaults.allowInputToggle = true;
$.fn.datepicker.defaults.orientation = 'bottom';

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
        $wrapper.toggleClass('aberto');
    });

    $('.dataTable').on('shown.bs.collapse hidden.bs.collapse', '.contatos-filtrados .collapse', function () {
        var $this = $(this),
            $contaotsFiltrados = $this.parents('.contatos-filtrados'),
            $btn = $contaotsFiltrados.find('.btn');

        if ($this.hasClass('show')) {
            $btn.find('i.fas').removeClass('fa-chevron-circle-down').addClass('fa-minus-circle');
        } else {
            $btn.find('i.fas').removeClass('fa-minus-circle').addClass('fa-chevron-circle-down');
        }
    });

    $('#sidebar-wrapper li.dropdown')
        .on('mouseover', function() {
            var $this = $(this),
                heightNav = $('nav#nav').height(),
                paddingYNavLink = $this.find('> .nav-link').css('padding-top').replace('px', ''),
                paddingYNavLink = parseInt(paddingYNavLink),
                marginYNavLink = $this.find('> .nav-link').css('padding-top').replace('px', ''),
                marginYNavLink = parseInt(marginYNavLink),
                calNavLink = marginYNavLink + paddingYNavLink,
                calcScroll = $this.position().top - $('#sidebar-wrapper').scrollTop();
            
            $this
                .find('.dropdown-menu')
                    .stop(true, true).css('top', (calcScroll + heightNav + calNavLink));
        })
        .on('touchstart click', '> a', function() {
            if (!$(this).parents('.aberto').length) {
                return false;
            }
        });

    // Desativar ordamento da coluna de ações
    $('.dataTable thead th:eq(0)')
        .off('click.DT')
        .find('.fas')
        .remove();
});