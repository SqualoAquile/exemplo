$(function () {

    let dataTable = window.dataTable;

    function addMask (mask, $el) {

        if (mask == 'data') {

            $el
                .mask('00/00/0000')
                .datepicker({
                    dateFormat: 'dd/mm/yy',
                    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
                    dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
                    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    showButtonPanel: true,
                    changeMonth: true,
                    changeYear: true,
                    closeText: 'Pronto',
                    currentText: 'Hoje'
                });

        } else if (mask == 'monetario') {

            $el
                .mask('#.##0,00', {
                    reverse: true
                });
                
        } else if (mask == 'numero') {

            $el
                .mask('0#');

        }
    }

    function removeMask () {

        $('#card-body-filtros')
            .find('input[type=text]')
            .datepicker('destroy')
            .removeAttr('maxlength id autocomplete')
            .unmask();
    }

    $(this)
        .on('change', '.filtros-faixa .input-filtro-faixa', function () {

            removeMask();

            $('.filtros-faixa .input-group').each(function () {

                let $this = $(this),
                    $select = $this.find('select'),
                    $selected = $select.find(':selected'),
                    type = $selected.attr('data-tipo'),
                    selectVal = $select.val(),
                    $min = $this.find('.min'),
                    min = $min.val(),
                    $max = $this.find('.max'),
                    max = $max.val(),
                    mascara = $selected.attr('data-mascara');

                addMask(mascara, $min);
                addMask(mascara, $max);

                if (selectVal && (min || max)) {

                    console.log(selectVal)
                    
                    dataTable
                        .columns(selectVal)
                        .search(type + ':' + min + '<>' + max)
                        .draw();

                }
                
                if (!min && !max) {
                    console.log('no min no max')
                    dataTable
                        .columns(selectVal)
                        .search('')
                        .draw();
                }
            });

        })
        .on('change', '.filtros-texto .input-filtro-texto', function () {

            $('.filtros-texto .input-group').each(function () {

                let $this = $(this),
                    $select = $this.find('select'),
                    selectVal = $select.val(),
                    $input = $this.find('.input-filtro-texto');

                dataTable
                    .columns(selectVal)
                    .search($input.val())
                    .draw();
            });
        })
        .on('reset', '#card-body-filtros', function () {
            
            removeMask();

            dataTable
                .columns()
                .search('')
                .draw();
        })
        .on('change', '[name=movimentacao]', function () {

            let $this = $(this),
                $fieldset = $this.parents('fieldset'),
                $checkeds = $fieldset.find(':checked'),
                indexColumn = $this.attr('data-index'),
                lenght = $checkeds.length,
                search = lenght == 2 || lenght == 0 ? '' : $checkeds.val();

            dataTable
                .columns(indexColumn)
                .search(search)
                .draw();
        })
        .on('change', '#card-body-filtros select', function () {
            
            let $this = $(this),
                $pai = $this.parents('.input-group');
            
            $pai.find('input[type=text]').val('');

        });

    $('#criar-filtro').click(function () {

        let $filtros = $('.filtros');

        if ($filtros.length < 5) {
            $cloned = $filtros.last().clone();
            $cloned.find('input').val('');
            $cloned.appendTo('#card-body-filtros');
        }
        
        if ($filtros.length >= 4) {
            $(this).hide();
        }
            
    });

});