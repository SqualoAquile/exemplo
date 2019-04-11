$(function () {
    
    //inicializa os inputs da página - parte do orçamento
    $('#data_aprovacao').attr('disabled', 'disabled');
    $('#titulo_orcamento').attr('disabled', 'disabled');
    $('#nome_razao_social').attr('disabled', 'disabled');
    $('#subtotal').attr('disabled', 'disabled');
    $('#valor_final').attr('disabled', 'disabled');
    $('#status').attr('disabled', 'disabled');
    $('#id').attr('disabled', 'disabled').parent().parent().hide();
    $('#id_orcamento').attr('disabled', 'disabled').parent().parent().hide();

    // inicialização dos campos status EM PRODUÇÃO
    if($('#status').val() == 'Em Produção'){ 

        $('#data_revisao_1').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_2').val('').attr('disabled', 'disabled').parent().parent().hide();
        $('#data_revisao_3').val('').attr('disabled', 'disabled').parent().parent().hide();

        $('label.btn.btn-primary').parent().hide();
        $('button.btn.btn-dark').parent().hide();
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

    $('#data_emissao').val(dataAtual()).datepicker('update');

    $('#data_validade').val(proximoDiaUtil($('#data_emissao').val(), 15)).datepicker('update');
    $('#data_retorno').val(proximoDiaUtil(dataAtual(), 3)).datepicker('update');

    // inicializa os inputs da pagina - parte de itens do orçamento
    $('#quant_usada').attr('disabled', 'disabled');
    $('#custo_tot_subitem').attr('disabled', 'disabled');


    $('#data_emissao').on('change blur', function () {
        if ($('#data_emissao').val() != '') {
            $('#data_validade').val(proximoDiaUtil($('#data_emissao').val(), 15)).datepicker('update').blur();
            $('#data_retorno').val(proximoDiaUtil($('#data_emissao').val(), 3)).datepicker('update').blur();
        }
    });

    $('#data_validade').on('change blur', function () {
        if ($('#data_validade').val() != '') {
            if ($('#data_emissao').val() != '') {
                var dtEmis, dtValid;
                dtEmis = $('#data_emissao').val();
                dtEmis = dtEmis.split('/');
                dtEmis = parseInt(dtEmis[2] + dtEmis[1] + dtEmis[0]);

                dtValid = $('#data_validade').val();
                dtValid = dtValid.split('/');
                dtValid = parseInt(dtValid[2] + dtValid[1] + dtValid[0]);

                if (dtValid < dtEmis) {
                    alert('A data de validade não pode ser maior do que a data de emissão.');
                    $('#data_validade').val('');
                    $('#data_emissao').focus();
                }
            } else {
                alert('Preencha a Data de Emissão.');
                $('#data_validade').val('');
                $('#data_emissao').focus();
            }
        }
    });

    $('#data_retorno').on('change blur', function () {
        if ($('#data_retorno').val() != '') {
            if ($('#data_emissao').val() != '') {
                var dtEmis, dtRetor;
                dtEmis = $('#data_emissao').val();
                dtEmis = dtEmis.split('/');
                dtEmis = parseInt(dtEmis[2] + dtEmis[1] + dtEmis[0]);

                dtRetor = $('#data_retorno').val();
                dtRetor = dtRetor.split('/');
                dtRetor = parseInt(dtRetor[2] + dtRetor[1] + dtRetor[0]);

                if (dtRetor < dtEmis) {
                    alert('A data de retorno não pode ser maior do que a data de emissão.');
                    $('#data_retorno').val('');
                    $('#data_emissao').focus();
                }
            }
        }
    });


    $("#preco_tot_subitem").on('blur',function(){
        var $custo = $("#custo_tot_subitem");
        var $preco = $("#preco_tot_subitem");
        var $material = $('#material_servico');
        var tx_segop, precoaux;
      
        tx_segop = parseFloat( parseFloat( $("#preco_tot_subitem").attr('data-seg_op')) / parseFloat(100) );

        if($("#preco_tot_subitem").attr('data-seg_op') != undefined){

            if( $custo.val() != "" && $preco.val() == "" ){
                
                precoaux = parseFloat( parseFloat( $material.attr('data-preco') )  * parseFloat( parseFloat(1) + tx_segop ) );
                $preco.val( floatParaPadraoBrasileiro( precoaux ) );
                return;
            }

            if( $custo.val() != "" && $preco.val() != "" ){
                
                if( parseFloat(floatParaPadraoInternacional( $custo.val())) >= parseFloat(floatParaPadraoInternacional( $preco.val())) ){
                    precoaux = parseFloat( parseFloat( $material.attr('data-preco') )  * parseFloat( parseFloat(1) + tx_segop ) );
                    $preco.val(floatParaPadraoBrasileiro( precoaux ) );
                }else{
                    precoaux = parseFloat( parseFloat( floatParaPadraoInternacional( $preco.val() ) )  * parseFloat( parseFloat(1) + tx_segop ) );
                    $preco.val(floatParaPadraoBrasileiro( precoaux ) );
                }
            }

        }else{
            $custo.val('');
            $preco.val('');

        }
        
        calculaMaterialCustoPreco();
    });
        
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
