$(function () {

    var dataTable = window.dataTable;

    function addMask (mask, $els) {

        $els.forEach(function (el) {

            if (mask == 'data') {
    
                $(el)
                    .mask('00/00/0000')
                    .datepicker();

            } else if (mask == 'monetario') {
    
                $(el)
                    .mask('#.##0,00', {
                        reverse: true
                    });
                    
            } else if (mask == 'numero') {
    
                $(el)
                    .mask('0#');
            }
        });
    }

    function removeMask ($removeMask) {

        $elements = $removeMask ? $removeMask : $('#card-body-filtros input[type=text]');
        
        $elements.each(function () {

            $(this)
                .datepicker('destroy')
                .removeAttr('maxlength')
                .unmask();
        });
    }

    $(this)
        .on('change', '#card-body-filtros select', function () {

            // Change dos Selects
            
            var $this = $(this),
                $pai = $this.parents('.input-group'),
                $inputs = $pai.find('input[type=text]');
            
            $inputs
                .val('');

            removeMask($inputs);

        })
        .on('change', '.filtros-faixa .input-filtro-faixa', function () {

            // Filtros Faixa

            $('.filtros-faixa .input-group').each(function () {

                var $this = $(this),
                    $select = $this.find('select'),
                    $selected = $select.find(':selected'),
                    type = $selected.attr('data-tipo'),
                    selectVal = $select.val(),
                    $min = $this.find('.min'),
                    min = $min.val(),
                    $max = $this.find('.max'),
                    max = $max.val(),
                    mascara = $selected.attr('data-mascara'),
                    stringSearch = '',
                    indexAnterior = $select.attr('data-index-anterior');

                addMask(mascara, [$min, $max]);

                if (indexAnterior) {
                    dataTable
                        .columns(indexAnterior)
                        .search('')
                        .draw();
                }

                if (selectVal) {

                    if (min || max) {
                        stringSearch = type + ':' + min + '<>' + max;
                    }

                    dataTable
                        .columns(selectVal)
                        .search(stringSearch)
                        .draw();

                    $select.attr('data-index-anterior', selectVal);
                }
            });
        })
        .on('change', '.filtros-texto .input-filtro-texto', function () {

            // Filtros Texto

            $('.filtros-texto .input-group').each(function () {

                var $this = $(this),
                    $select = $this.find('select'),
                    $input = $this.find('.texto'),
                    inputVal = $input.val(),
                    selectVal = $select.val(),
                    value = inputVal ? inputVal : '',
                    indexAnterior = $select.attr('data-index-anterior');

                if (indexAnterior) {
                    dataTable
                        .columns(indexAnterior)
                        .search('')
                        .draw();
                    
                }

                if (selectVal) {
                    
                    dataTable
                        .columns(selectVal)
                        .search(value)
                        .draw();

                    $select.attr('data-index-anterior', selectVal);
                }
            });
        })
        .on('reset', '#card-body-filtros', function () {

            // Limpar Filtros
            
            removeMask();

            dataTable
                .columns()
                .search('')
                .draw();
        })
        .on('change', '[name=movimentacao]', function () {

            // Checkbox

            var $this = $(this),
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

        var $filtros = $('.filtros');

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