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
        }
    }

    $(this)
        .on('change', '.filtros-faixa .input-filtro-faixa', function () {

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
                    
                    dataTable
                        .column(selectVal)
                        .search(type + ':' + min + '<>' + max)
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
        });

    $('#criar-filtro').click(function () {

        let $cloned = $('.filtros').last();
            $cloned = $cloned.clone();
        
        $cloned.find('input').val('');
        $cloned.appendTo('#card-body-filtros');
    });

});