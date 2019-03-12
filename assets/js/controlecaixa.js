$(function () {

    var $collapse = $('#collapseFluxocaixaResumo'),
        $cardBodyFiltros = $('#card-body-filtros'),
        dataTable = window.dataTable,
        indexColumnStatus = 17,
        $checados,
        $aQuiatares;

    function aQuitar () {

        var rowData = dataTable.rows({selected: true}).data(),
            $quitar = $('.col-data-quitacao, .col-btn-quitar');

        $aQuiatares = $checados.filter(function (index) {
            return rowData[index][indexColumnStatus].toLowerCase() == 'a quitar';
        });

        if ($aQuiatares.length) {
            
            $quitar.show();
            $quitar.find('span').text($aQuiatares.length);

        } else {
            $quitar.hide();
        }
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
        .on('blur', '[name=data_quitacao]', function () {
            
            var $this = $(this),
                value = $this.val();

            $this
                .removeClass('is-invalid is-valid')
                .siblings('.invalid-feedback').remove();

            if (value) {

                if (validaDat(value)) {
                    
                    $this
                        .addClass('is-valid')
                        .removeClass('is-invalid');

                    $this[0].setCustomValidity('');
                    

                } else {

                    $this
                        .addClass('is-invalid')
                        .removeClass('is-valid');

                    $this[0].setCustomValidity('invalid');

                    $this.after('<div class="invalid-feedback">Data inválida!</div>');

                }
            } else {

                $this.addClass('is-invalid');
                $this[0].setCustomValidity('invalid');

            }

        })
        .on('click', '#quitar', function () {

            // Enviar ajax com a quitares para quita-los

            var arrayQuitares = [],
                $dataQuitacao = $('[name=data_quitacao]'),
                data_quitacao = $dataQuitacao.val();

            $aQuiatares.each(function () {
                arrayQuitares.push($(this).val());
            });

            if ($dataQuitacao[0].checkValidity()) {

                if (arrayQuitares.length) {

                    if (confirm('Tem Certeza?')) {
                        
                        $.ajax({
                            url: baselink + '/fluxocaixa/quitar',
                            type: 'POST',
                            data: {
                                data_quitacao: data_quitacao,
                                aquitares: arrayQuitares
                            },
                            dataType: 'json',
                            success: function (data) {
        
                                if (data[0] == '00000') {
                                    
                                    Toast({
                                        message: 'Lançamentos quitados com sucesso!',
                                        class: 'alert-success'
                                    });
        
                                    $cardBodyFiltros.trigger('reset');
                                    $('.fluxocaixa .collapse').collapse('hide');
                                }
                            }
                        });

                    }
                }
            } else {
                $dataQuitacao
                    .blur()
                    .focus();
            }
        })
        .on('click', '#excluir', function () {

            var arrayChecados = [];

            $checados.each(function () {
                arrayChecados.push($(this).val());
            });

            if (arrayChecados.length) {

                if (confirm('Tem Certeza?')) {

                    $.ajax({
                        url: baselink + '/fluxocaixa/excluirChecados',
                        type: 'POST',
                        data: {
                            checados: arrayChecados
                        },
                        dataType: 'json',
                        success: function (data) {
    
                            if (data[0] == '00000') {
                                
                                Toast({
                                    message: 'Lançamentos excluidos com sucesso!',
                                    class: 'alert-success'
                                });
    
                                $cardBodyFiltros.trigger('reset');
                                $('.fluxocaixa .collapse').collapse('hide');
                            }
                        }
                    });

                }
            }
        })
        .on('click', '#editar', function () {
            
            var $this = $(this),
                $tr = $this.parents('tr'),
                $valorTotal = $tr.find('td:eq(6)'),
                valorTotalText = $valorTotal.text().replace('R$  ', ''),
                $dataVencimento = $tr.find('td:eq(7)'),
                $observacao = $tr.find('td:eq(22)');

            $valorTotal
                .html('<input type="text" data-anterior="' + valorTotalText + '" value="' + valorTotalText + '" class="form-control" data-mascara_validacao="monetario">')
            
            $('[data-mascara_validacao="monetario"]')
                .mask('#.##0,00', {
                    reverse: true
                });

            $dataVencimento
                .html('<input type="text" data-anterior="' + $dataVencimento.text() + '" data-mascara_validacao="data" value="' + $dataVencimento.text() + '" class="form-control">')

            $('[data-mascara_validacao="data"]')
                .mask('00/00/0000')
                .datepicker();

            $observacao
                .html('<textarea data-anterior="' + $observacao.text() + '" class="form-control">' + $observacao.text() + '</textarea>')

            $this
                .removeClass('btn-primary')
                .addClass('btn-success')
                .attr('id', 'salvar')
                .find('.fas')
                .removeClass('fa-edit')
                .addClass('fa-save');

            // console.log()
            // $tr.find('td:eq(6),td:eq(7),td:eq(22)').each(function () {
            //     var text = $(this).text();
            //     $(this).html();
            // });
        })
        .on('click', '#salvar', function () {

            var $this = $(this),
                $tr = $this.parents('tr'),
                $valorTotal = $tr.find('td:eq(6)'),
                $dataVencimento = $tr.find('td:eq(7)'),
                $observacao = $tr.find('td:eq(22)');

            $.ajax({
                url: baselink + '/fluxocaixa/inlineEdit',
                type: 'POST',
                data: {
                    id: $this.attr('data-id'),
                    valor_total: $valorTotal.find('input').val(),
                    data_vencimento: $dataVencimento.find('input').val(),
                    observacao: $observacao.find('textarea').val()
                },
                dataType: 'json',
                success: function (data) {

                    if (data[0] == '00000') {
                        
                        Toast({
                            message: 'Lançamento editado com sucesso!',
                            class: 'alert-success'
                        });

                        // $valorTotal
                        //     .text($valorTotal.find('input').val());
                
                        // $this
                        //     .removeClass('btn-success')
                        //     .addClass('btn-primary')
                        //     .attr('id', 'editar')
                        //     .find('.fas')
                        //     .removeClass('fa-save')
                        //     .addClass('fa-edit');
                    }

                    $cardBodyFiltros.trigger('reset');
                }
            });
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
            var $thAcoes = $('.dataTable thead th:eq(1)');
            
            $thAcoes
                .addClass('text-center')
                .find('.fas')
                .remove();
        });

    $collapse.on('shown.bs.collapse', function () {
        $(this)
            .find('[data-provide="datepicker"]')
            .mask('00/00/0000');
    });

    dataTable
        .on('draw', function () {
            $('.fluxocaixa .table-responsive table [type="checkbox"]')
                .prop('checked', false);
        });

    $(this)
        .on('blur', '[data-mascara_validacao="monetario"], textarea', function () {

            var $this = $(this);

            if (!$this.val()) {
                if (!$this[0].checkValidity()) {
                    $this.val($this.attr('data-anterior'));
                }
            }
        })
        .on('blur change', '[data-mascara_validacao="data"]', function () {

            var $this = $(this),
                valor = $this.val()
                anterior = $this.attr('data-anterior');
            
            if (valor != '') {
            
                dtop = $this.closest('tr').children('td:eq(5)').text();
                dtop = dtop.split('/')[2] + dtop.split('/')[1] + dtop.split('/')[0];
                dtop = parseInt(dtop);

                dtatual = valor;
                dtatual = dtatual.split('/')[2] + dtatual.split('/')[1] + dtatual.split('/')[0];
                dtatual = parseInt(dtatual);

                valor = valor.split('/');
                var data = valor[0] + '/' + valor[1] + '/' + valor[2];

                console.log('dtop', dtop);
                console.log('dtatual', dtatual);
            
                if ($this.attr('data-anterior') != valor) {

                    if (
                        (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                        (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                        (validaDat(data) == false)
                    ) {
                        // Inválido
                        $this.val(anterior);
                            
                    } else {
                        // Valido
                        if(dtatual <= dtop){
                            $this.val(anterior);  
                        }else{
                            $this.val(data);  
                        }                            
                    }
                }
            }else{
                // Inválido
                $this.val(anterior);
            }

            $this.datepicker('update');

        });
});