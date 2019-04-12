$(function () {
    
    //inicializa os inputs da página - parte do orçamento

    $('#data_aprovacao').attr('disabled', 'disabled');
    $('#titulo_orcamento').attr('disabled', 'disabled');
    $('#nome_razao_social').attr('disabled', 'disabled');
    $('#custo_total').attr('disabled', 'disabled');
    $('#subtotal').attr('disabled', 'disabled');
    $('#desconto').attr('disabled', 'disabled');
    $('#valor_final').attr('disabled', 'disabled');
    $('#status').attr('disabled', 'disabled');
    $('#id').attr('disabled', 'disabled').parent().parent().hide();
    $('#id_orcamento').attr('disabled', 'disabled').parent().parent().hide();

    if( $('#data_aprovacao').val() == '00/00/0000' || $('#data_aprovacao').val() == '' ){
        $('#data_inicio').val('');
    }else{
        $('#data_inicio').val($('#data_aprovacao').val()).datepicker('update');
    }

    if( $('#data_fim').val() == '00/00/0000'){
        $('#data_fim').val('').datepicker('update');
    }

    if( $('#data_emissao_nf').val() == '00/00/0000'){
        $('#data_emissao_nf').val('').datepicker('update');
    }

    // inicialização dos campos status EM PRODUÇÃO
    if($('#status').val() == 'Em Produção'){ 

        $('#data_revisao_1').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_2').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();

        $('label.btn.btn-primary').parent().show();
        $('button.btn.btn-dark').parent().show();
        $('button#btn_lancamentoVenda').parent().show();

    // inicialização dos campos status FINALIZADA    
    }else if($('#status').val() == 'Finalizada'){

        $('input, select,  textarea').attr('disabled','disabled');

        if( $('#data_revisao_1').val() == '00/00/0000'){
            $('#data_revisao_1').val(dataAtual()).datepicker('update').removeAttr('disabled').parent().parent().show();
            $('#data_revisao_2').val('').attr('disabled', 'disabled').parent().parent().hide();
            $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();

            $('label.btn.btn-primary').parent().show();

        }else if ( $('#data_revisao_1').val() != '00/00/0000' && $('#data_revisao_2').val() == '00/00/0000' ){
            $('#data_revisao_1').attr('disabled', 'disabled').parent().parent().hide();
            $('#data_revisao_2').val(dataAtual()).datepicker('update').removeAttr('disabled').parent().parent().show();
            $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();

            $('label.btn.btn-primary').parent().show();

        }else if ( $('#data_revisao_1').val() != '00/00/0000' && $('#data_revisao_2').val() != '00/00/0000' && $('#data_revisao_3').val() == '00/00/0000' ){
            $('#data_revisao_1').attr('disabled', 'disabled').parent().parent().hide();
            $('#data_revisao_2').attr('disabled', 'disabled').parent().parent().hide();
            $('#data_revisao_3').val(dataAtual()).datepicker('update').removeAttr('disabled').parent().parent().show();

            $('label.btn.btn-primary').parent().show();
        }else{

            $('#data_revisao_1').attr('disabled', 'disabled').parent().parent().show();
            $('#data_revisao_2').attr('disabled', 'disabled').parent().parent().show();
            $('#data_revisao_3').attr('disabled', 'disabled').parent().parent().show();

            $('label.btn.btn-primary').parent().hide();
        }
        

        
        $('button.btn.btn-dark').parent().show();
        $('button#btn_lancamentoVenda').parent().hide();
    
    // inicialização dos campos status CANCELADO        
    }else{

        $('input, select,  textarea').attr('disabled','disabled');

        $('#data_revisao_1').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_2').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();

        $('label.btn.btn-primary').parent().hide();
        $('button.btn.btn-dark').parent().hide();
        $('button#btn_lancamentoVenda').parent().hide();
    }

    $.ajax({
        url: baselink + "/ajax/buscaParametrosMaterial",
        type: "POST",
        data: {
          tabela: "parametros"
        },
        dataType: "json",
        success: function(data) {
          var desconto_maximo;
          if (data["desconto_max"]) {
            desconto_maximo = floatParaPadraoInternacional(data["desconto_max"]);
            $("#desconto_porcent").attr("data-desconto_maximo", desconto_maximo);
          }
        }
      });
      
    $('#data_inicio').on('change blur', function () {
        if ($('#data_inicio').val() != '') {
            var dtAprov, dtInicio, dtFim;
           
            dtInicio = $('#data_inicio').val();
            dtInicio = dtInicio.split('/');
            dtInicio = parseInt(dtInicio[2] + dtInicio[1] + dtInicio[0]);
            
            if ($('#data_aprovacao').val() != '') {
              
                dtAprov = $('#data_aprovacao').val();
                dtAprov = dtAprov.split('/');
                dtAprov = parseInt(dtAprov[2] + dtAprov[1] + dtAprov[0]);

                if (dtInicio < dtAprov) {
                    alert('A data de aprovação não pode ser maior do que a data de início.');
                    $('#data_inicio').val('').focus();
                }
            } else {
                alert('Preencha a Data de Aprovação.');
                $('#data_inicio').val('').focus();
            }

            if ($('#data_fim').val() != '') {

                dtFim = $('#data_fim').val();
                dtFim = dtFim.split('/');
                dtFim = parseInt(dtFim[2] + dtFim[1] + dtFim[0]);

                if (dtInicio < dtFim) {
                    alert('A data de início não pode ser maior do que a data de finalização.');
                    $('#data_inicio').val( $('#data_aprovacao').val() ).datepicker('update');
                    $('#data_fim').val('').focus();
                }
            } 
        }else{
            $('#data_inicio').val( $('#data_aprovacao').val() ).datepicker('update');
        }
    });

    $('#data_fim').on('change blur', function () {
        if ($('#data_fim').val() != '') {
            if ($('#data_inicio').val() != '') {
                console.log('dt inicio:   ', $('#data_inicio').val());
                var dtInicio, dtFim;
                dtInicio = $('#data_inicio').val();
                dtInicio = dtInicio.split('/');
                dtInicio = parseInt(dtInicio[2] + dtInicio[1] + dtInicio[0]);

                dtFim = $('#data_fim').val();
                dtFim = dtFim.split('/');
                dtFim = parseInt(dtFim[2] + dtFim[1] + dtFim[0]);

                if (dtFim < dtInicio) {
                    alert('A data de início não pode ser maior do que a data de finalização.');
                    $('#data_inicio').val( $('#data_aprovacao').val() ).datepicker('update');
                    $('#data_fim').val('').focus();
                }
            }
        }
    });


    $("#desconto_porcent").on('change blur',function(){
        var $custo = $("#custo_total");
        var $subtotal = $("#subtotal");
        var $desconPorcentagem = $("#desconto_porcent");
        var $desconto = $("#desconto");
        var $valorFinal = $("#valor_final");

        var desc_max, precoaux, custoaux, descaux;
      
        desc_max = parseFloat( $desconPorcentagem.attr('data-desconto_maximo'));

        if( desc_max != undefined && desc_max != '' ){
            
            if( $desconPorcentagem.val() != undefined && $desconPorcentagem.val() != ''){
                if( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) > desc_max ){
                    alert('O valor máximo de desconto é ' + floatParaPadraoBrasileiro(desc_max) + '%');
                    $desconPorcentagem.val('0,00%').blur();
                    return;
                }
            }
            
            if( $custo.val() != '' && $custo.val() != undefined && $subtotal.val() != '' && $subtotal.val() != undefined && $desconPorcentagem.val() != undefined && $desconPorcentagem.val() != '' ){

                precoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) * parseFloat( parseFloat(1) - parseFloat( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) / parseFloat( 100 ) ) ) ).toFixed(2);

                custoaux = parseFloat( floatParaPadraoInternacional( $custo.val() ) ).toFixed(2);

                if( precoaux < custoaux ){
                    alert( 'O desconto dado faz o valor final ser menor do que custo total.' );
                    $desconPorcentagem.val('0,00%').blur();
                    return;

                }else if( precoaux == custoaux ){
                    alert( 'O desconto dado faz o valor final ser igual custo total.' );
                    $desconPorcentagem.val('0,00%').blur();
                    return;
                    
                }else{

                    descaux =  parseFloat( parseFloat( parseFloat( floatParaPadraoInternacional( $desconPorcentagem.val() ) ) / parseFloat(100) ) * parseFloat( floatParaPadraoInternacional( $subtotal.val() ) ) ).toFixed(2);

                    $desconto.val( floatParaPadraoBrasileiro( descaux ) );
                     
                    $valorFinal.val( floatParaPadraoBrasileiro( precoaux ) );
                }
            }
        }
    });

    if( $('#custo_total').attr('data-anterior') != ''){ //significa que o formulário está sendo editado
        
        var $idOS = $("#id");
        var $custo = $("#custo_total");
        var $desconPorcentagem = $("#desconto_porcent");
        
         // preenche os valores dos campos que são necessários
         var idProcurado;
         idProcurado = $idOS.val();

         $.ajax({
             url: baselink + '/ajax/buscaDespesasId',
             type: 'POST',
             data: {
                 idProcurado: idProcurado
             },
             dataType: 'json',
             success: function (dado) {
                
                 if(dado != ''){               
                    var custosExtras, custoaux;                            
                    custosExtras = parseFloat(dado['DespesaId']).toFixed(2);

                    if( custosExtras > 0 ){  

                        custoaux = parseFloat( floatParaPadraoInternacional( $custo.val() ) );
                        custoaux = parseFloat(custosExtras) + parseFloat( custoaux );
                        $custo.val( floatParaPadraoBrasileiro( custoaux ) );
                        
                        $desconPorcentagem.blur();

                        alert('Existe alteração no valor do Custo Total. \nAperte no botão [Salvar] para registrá-las');
                        
                    }
                 }
                 
             }
         });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////                                                            /////////////////////
    ////////////// INÍCIO DO MODAL DE LANÇAMENTO NO FLUXO DE CAIXA DA VENDA   /////////////////////
    //////////////                                                            /////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    $('#modalLancamentoVenda').on('show.bs.modal', function (e) {
        console.log('disparou show modal');

        let $formLancaFluxoModal = $('#modalLancamentoVenda'),
            $formOS = $('#form-principal');
        
        $formLancaFluxoModal.find('h1').text('Fechamento da Venda');
        $formLancaFluxoModal.find('div#btn_limparCampos').hide();
        $formLancaFluxoModal.find('button.btn.btn-dark').parent().parent().hide();
        //Checkbox de Receita
        $formLancaFluxoModal
            .find('#Receita')
            .prop('checked', true)
            .attr('disabled','disabled')
            .change();
        
        //Checkbox de Receita
        $formLancaFluxoModal
            .find('#Despesa')
            .prop('checked', false)
            .attr('disabled','disabled');

        // Nro Pedido
        $formLancaFluxoModal
            .find('[name=nro_pedido]')
            .val($formOS.find('[name=id]').val())
            .attr('disabled','disabled');
            
        // Nro NF
        if($formLancaFluxoModal.find('[name=nro_nf]').val() != '' ){
            $formLancaFluxoModal
            .find('[name=nro_nf]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=nro_nf]').val());
        }else{
            $formLancaFluxoModal
            .find('[name=nro_nf]')
            .removeAttr('disabled')
            .val('');
        }
       
        // Data Emissao NF
        if($formLancaFluxoModal.find('[name=data_emissao_nf]').val() != '' ){
            $formLancaFluxoModal
            .find('[name=data_emissao_nf]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=data_emissao_nf]').val())
            .datepicker('update');
        }else{
            $formLancaFluxoModal
            .find('[name=data_emissao_nf]')
            .removeAttr('disabled')
            .val('');
        }

        // Conta Analítica
        $formLancaFluxoModal
            .find('[name=conta_analitica]')
            .attr('disabled','disabled')
            .val('Venda');

        // Detalhe
        $formLancaFluxoModal
            .find('[name=detalhe]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=titulo_orcamento]').val());

        // Vendedor
        $formLancaFluxoModal
            .find('[name=quem_lancou]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=vendedor]').val());

        // Favorecido
        $formLancaFluxoModal
            .find('[name=favorecido]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=nome_razao_social]').val());

        // Data Operacao
        $formLancaFluxoModal
            .find('[name=data_operacao]')
            .val($formOS.find('[name=data_fim]').val())
            .datepicker('update');
        
        // Valor Total
        $formLancaFluxoModal
            .find('[name=valor_total]')
            .attr('disabled','disabled')
            .val($formOS.find('[name=valor_final]').val());

    });

});

    $(document)
        .on('submit', '#form-principalModalFluxoCaixa', (event) => {

            event.preventDefault();

            let $form = $('#form-principalModalFluxoCaixa');

            if ($form[0].checkValidity()) {
                
                $.ajax({
                    url: baselink + '/ajax/adicionarCliente',
                    type: 'POST',
                    data: $form.serialize(),
                    dataType: 'json',
                    success: (data) => {

                        $form
                            .removeClass('was-validated')
                            .trigger('reset');

                        $form
                            .find('.is-valid, .is-invalid')
                            .removeClass('is-valid is-invalid');

                        $('#modalLancamentoVenda').modal('hide');

                        Toast({message: data.mensagem, class: data.class});

                    }
                });

            }

        });
    
     
    

function dataAtual() {
    var dt, dia, mes, ano, dtretorno;
    dt = new Date();
    dia = dt.getDate();
    mes = dt.getMonth() + 1;
    ano = dt.getFullYear();

    if (dia.toString().length == 1) {
        dia = "0" + dt.getDate();
    }
    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }

    dtretorno = dia + "/" + mes + "/" + ano;

    return dtretorno;
}

function proximoDiaUtil(dataInicio, distdias) {

    if (dataInicio) {
        if (distdias != 0) {
            var dtaux = dataInicio.split("/");
            var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

            //soma a quantidade de dias para o recebimento/pagamento
            dtvenc.setDate(dtvenc.getDate() + distdias);

            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }

            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;
            return dtvenc;
        } else {
            return dataInicio;
        }
    } else {
        return false;
    }
}

function floatParaPadraoBrasileiro(valor) {
    var valortotal = valor;
    valortotal = number_format(valortotal, 2, ',', '.');
    return valortotal;
}

function floatParaPadraoInternacional(valor) {

    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
    numero = (numero + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+numero) ? 0 : +numero,
        prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
        sep = (typeof milhar_separador === 'undefined') ? ',' : milhar_separador,
        dec = (typeof decimal_separador === 'undefined') ? '.' : decimal_separador,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };

    // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
