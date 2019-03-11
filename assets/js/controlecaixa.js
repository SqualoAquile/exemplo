$(function () {

    var $collapse = $('#collapseFluxocaixaResumo'),
        dataTable = window.dataTable,
        indexColumnStatus = 17,
        rowData,
        $checados,
        $aQuiatares;

    function aQuitar () {
        $aQuiatares = $checados.filter(function (index) {
            return rowData[index][indexColumnStatus].toLowerCase() == 'a quitar';
        });

        $('#quitar > span').text($aQuiatares.length);
    }

    $('.select-all').click(function () {

        var $this = $(this),
            $checkThead = $this.find('[type=checkbox]')
            $table = $this.parents('.table-responsive');

        $checkThead.prop('checked', !$checkThead.prop('checked'))
        $table.find('[type=checkbox]').prop('checked', !$checkThead.prop('checked'));
    });

    $('.dataTable thead th:eq(0), .dataTable thead th:eq(1)').off('click.DT');

    $(this)
        .on('click', '#quitar', function () {
            // Enviar ajax com a quitares para quita-los
            console.log('vai ajax', $aQuiatares);
        });

    $('.table-responsive')
        .on('change', '[type=checkbox]', function () {

            var $this = $(this),
                $pai = $this.parents('.table-responsive'),
                $allChecados = $pai.find('[type=checkbox]:checked'),
                $tbodyChecados = $allChecados.parents('tbody'),
                $trChecados = $tbodyChecados.find('tr');

            $checados = $trChecados.find('[type=checkbox]:checked');

            if ($allChecados.length) {
                aQuitar();
                $collapse.collapse('show');
                $trChecados.addClass('selected');
            } else {
                $collapse.collapse('hide');
                $trChecados.removeClass('selected');
            }
        })
        .on('init.dt', '.dataTable', function () {
            // Tira o icone de ordenação da coluna de ações no cabeçalho
            $('.dataTable thead th:eq(1) .fas').remove();
            rowData = dataTable.rows({selected: true}).data();
        });

        $collapse.on('shown.bs.collapse', function () {
            $(this)
                .find('[data-provide="datepicker"]')
                .mask('00/00/0000');
        });

        $('[data-provide="datepicker"]').change(function() {
            $(this).val('01/03/2019');
            $(this).datepicker('update');
        })
});