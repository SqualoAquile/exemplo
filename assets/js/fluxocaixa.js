$(function () {
    //só para teste de programação
    $("#data_operacao").val('17/02/2019');
    $("#valor_total").val('100');

    ///////////////////////////////////////CONDIÇÕES INICIAIS DA TELA
    $('#Receita').click();
    $('#Receita').change();
    $('#Despesa').click();

    $("#adm_cartao").parent().parent().hide();
    $labeladm = $("#adm_cartao");
    $labeladm.siblings('label')
        .addClass('font-weight-bold')
        .find('span')
        .prepend('<i> * </i>');

    $("#bandeira").parent().parent().hide();
    $labelband = $("#bandeira");
    $labelband.siblings('label')
        .addClass('font-weight-bold')
        .find('span')
        .prepend('<i> * </i>');

    $("#taxa-cartao").parent().parent().hide();
    $("#dia_venc").parent().parent().hide();
    $("#custo_financ").parent().parent().hide();

    $("#nro_parcela").parent().parent().hide();
    $("#nro_parcela").empty()
        .val('')
        .append('<option value="" selected  >Selecione</option>');
    for (i = 1; i <= 12; i++) {
        $("#nro_parcela").append('<option value="' + i + '">' + i + '</option>');
    }

    $("#cond_pgto").attr("disabled", "disabled");

    // $("#tabela_lancamento").hide();
    $("#btn_incluir").click(function(){
        confirmaPreenchimento();
    });    
    

    ////////////////////////////////// INÍCIO DAS OPERAÇÕES QUANDO TEM MUDANÇAS NOS CAMPOS
    $('input[type=radio]').change(function () {
        
        $("#forma_pgto").val("").removeClass('is-valid is-invalid');
        $("#forma_pgto").siblings('.invalid-feedback').remove();
        
        limpaCondPgto();

        if ($("#Receita").is(":checked")) {
            // troca as opções de conta analitica do select
            $('#conta_analitica').empty()
                .val('')
                .append('<option value="" selected  >Selecione</option>')
                .append('<option value="Genérica"   >Genérica</option>')
                .append('<option value="Venda"      >Venda</option>');

            //troca a base de informações do dropdown do favorecido
            $('.relacional-dropdown-input').each(function () {

                var $this = $(this),
                    $relacionalDropdown = $this.parents('.relacional-dropdown-wrapper').find('.relacional-dropdown'),
                    campo = 'nome';
                tabela = 'clientes';

                $.ajax({
                    url: baselink + '/ajax/relacionalDropdown',
                    type: 'POST',
                    data: {
                        tabela: tabela,
                        campo: campo
                    },
                    dataType: 'json',
                    success: function (data) {

                        var htmlDropdown = '';
                        data.forEach(element => {
                            htmlDropdown += `
                                <div class="list-group-item list-group-item-action relacional-dropdown-element">` + element[campo] + `</div>
                            `;
                        });

                        $relacionalDropdown.find('.dropdown-menu-wrapper').html(htmlDropdown);
                    }
                });
            });


        } else {

            // troca as opções de conta analitica do select
            $('#conta_analitica').empty()
                .val('')
                .append('<option value="" selected          >Selecione</option>')
                .append('<option value="Genérica"           >Genérica</option>')
                .append('<option value="Compra"             >Compra</option>')
                .append('<option value="Despesa Financeira" >Despesa Financeira</option>')
                .append('<option value="Custo Fixo"         >Custo Fixo</option>')
                .append('<option value="Imposto"            >Imposto</option>');

            //troca a base de informações do dropdown do favorecido
            $('.relacional-dropdown-input').each(function () {

                var $this = $(this),
                    $relacionalDropdown = $this.parents('.relacional-dropdown-wrapper').find('.relacional-dropdown'),
                    campo = 'nome_fantasia';
                tabela = 'fornecedores';

                $.ajax({
                    url: baselink + '/ajax/relacionalDropdown',
                    type: 'POST',
                    data: {
                        tabela: tabela,
                        campo: campo
                    },
                    dataType: 'json',
                    success: function (data) {

                        var htmlDropdown = '';
                        data.forEach(element => {
                            htmlDropdown += `
                                <div class="list-group-item list-group-item-action relacional-dropdown-element">` + element[campo] + `</div>
                            `;
                        });

                        $relacionalDropdown.find('.dropdown-menu-wrapper').html(htmlDropdown);
                    }
                });
            });
        }
    });

    $('#data_operacao').on('change blur', function(){
        if($("#cond_pgto").find(':selected').val() == 'À Vista' ){
            $("#cond_pgto").change();
        }
    });

    $('#valor_total').blur(function(){
        if($('#valor_total').val() != '' & $("#Receita").is(':checked')){
            if($("#forma_pgto").find(':selected').val() == 'Cartão Débito' || $("#forma_pgto").find(':selected').val() == 'Cartão Crédito'){
                if($('#bandeira').find(':selected').val() != ''){
                    calculatxcartao();
                }
            }
        }
    });

    //quando muda o select forma de pagamento - preenche adequadamente o select condição de pagamento
    $('#forma_pgto').change(function () {

        formapgto = $('#forma_pgto');
        condpgto = $('#cond_pgto');
        
        condpgto.val('').change();
        condpgto.siblings('.invalid-feedback').remove();
        condpgto.removeClass('is-valid is-invalid');

        limpaCondPgto();

        if (formapgto.find(":selected").val() != "") {
            condpgto.val("");
            condpgto.removeAttr("disabled");

            switch (formapgto.find(":selected").text()) {
                case ('Cartão Débito'):
                    condpgto.empty()
                        .append('<option value="" disabled>Selecione</option>')
                        .append('<option value="À Vista" selected>À Vista</option>')
                        .attr("disabled", "disabled")
                        .change()
                        .addClass('is-valid');
                    condpgto[0].setCustomValidity('');
                    break;
                case ('Cartão Crédito'):
                    if ($("#Despesa").is(":checked")) {
                        condpgto.empty()
                            .append('<option value="" disabled>Selecione</option>')
                            .append('<option value="Parcelado" selected>Parcelado</option>')
                            .attr("disabled", "disabled")
                            .change()
                            .addClass('is-valid');
                        condpgto[0].setCustomValidity('');
                    } else {
                        condpgto.empty()
                            .append('<option value="" disabled selected>Selecione</option>')
                            .append('<option value="Com Juros">Com Juros</option>')
                            .append('<option value="Parcelado">Parcelado</option>')
                            .append('<option value="Antecipado">Antecipado</option>')
                            .removeAttr("disabled");
                    }
                    break;
                default:
                    condpgto.empty()
                        .append('<option value="" disabled selected>Selecione</option>')
                        .append('<option value="À Vista">À Vista</option>')
                        .append('<option value="Parcelado">Parcelado</option>')
                        .removeAttr("disabled");
                    break;
            }
        } else {
            condpgto.empty()
                .append('<option value="" disabled selected>Selecione</option>')
                .attr("disabled", "disabled");
        }
    });

    function limpaCondPgto() {
        $('#cond_pgto')     .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $('#cond_pgto')     .siblings('.invalid-feedback').remove();

        $("#adm_cartao")    .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#adm_cartao")    .parent().parent().show();
        $("#adm_cartao")    .siblings('.invalid-feedback').remove();

        $("#bandeira")      .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#bandeira")      .parent().parent().show();
        $("#bandeira")      .siblings('.invalid-feedback').remove();

        $("#nro_parcela")   .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#nro_parcela")   .parent().parent().show();
        $("#nro_parcela")   .siblings('.invalid-feedback').remove();

        $("#dia_venc")      .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#dia_venc")      .parent().parent().show();
        $("#dia_venc")      .siblings('.invalid-feedback').remove();

        $("#taxa-cartao")   .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#taxa-cartao")   .parent().parent().show();
        $("#taxa-cartao")   .siblings('.invalid-feedback').remove();

        $("#custo_financ")  .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#custo_financ")  .parent().parent().show();
        $("#custo_financ")  .siblings('.invalid-feedback').remove();
        
        // $this[0].setCustomValidity('invalid'); // invalido
        // $this.setCustomValidity('');
    }

    $('#cond_pgto').change(function () {
        
        formapgto = $('#forma_pgto');
        dtop = $('#data_operacao');
        valortot = $('#valor_total');
        condpgto = $('#cond_pgto');
        admcartao = $("#adm_cartao");
        bandeira = $("#bandeira");
        nroparcela = $("#nro_parcela");
        diavenc = $("#dia_venc");
        txcobrada = $("#taxa-cartao");
        custofin = $("#custo_financ");

        if (dtop.val() == "" | valortot.val() == "") {
            formapgto.val("").blur();
            limpaCondPgto();
            alert("Preencha a data e/ou o valor do lançamento.");
            return;
        }

        if (condpgto.find(":selected").val() == "") {
            limpaCondPgto();
            return;
        }

        switch (formapgto.find(":selected").val()) {
            case ('Dinheiro'):
            case ('Cheque'):
            case ('Boleto'):
            case ('TED'):
            case ('DOC'):
            case ('Transferência'):

                admcartao.val("").attr("disabled", "disabled").parent().parent().show();
                bandeira.val("").attr("disabled", "disabled").parent().parent().show();
                txcobrada.val("0").attr("disabled", "disabled").parent().parent().show();
                
                if ($("#Despesa").is(":checked")) {
                    if ( formapgto.find(":selected").val() == "Dinheiro" | formapgto.find(":selected").val() == "Cheque" | formapgto.find(":selected").val() == "Boleto" ) {
                            custofin.val(0).attr('disabled','disabled').parent().parent().show();
                    } else {
                            custofin.val("").removeAttr("disabled").parent().parent().show();
                    }
                } else {
                    if (formapgto.find(":selected").val() == "Boleto") {
                        custofin.val("").removeAttr("disabled").parent().parent().show();
                    } else {
                        custofin.val(0).attr('disabled','disabled').parent().parent().show();
                    }
                }


                if (condpgto.find(":selected").val() == "À Vista") {
                    
                    nroparcela.val("").attr('disabled','disabled').parent().parent().show();

                    var diaaux = dtop.val();
                    diaaux = diaaux.split("/");
                    var dia = parseInt(diaaux[0]);
                    diavenc.val(dia).attr('disabled','disabled').parent().parent().show();
                    
                    
                } else {
                    nroparcela.val("").removeAttr("disabled").parent().parent().show();
                    diavenc .val("").removeAttr("disabled").parent().parent().show();
                }
                break;

            case ('Cartão Débito'):
            case ('Cartão Crédito'):
                if (condpgto.find(":selected").val() == "À Vista") {
                    nroparcela.val("").attr("disabled", "disabled").parent().parent().show();

                    var diaaux = dtop.val();
                    diaaux = diaaux.split("/");
                    var dia = parseInt(diaaux[0]);
                    diavenc.val(dia).attr('disabled','disabled').parent().parent().show();

                } else {

                    nroparcela.val("").removeAttr("disabled").parent().parent().show();
                    diavenc.val(dia).removeAttr("disabled").parent().parent().show();

                }

                txcobrada.val("0").attr("disabled", "disabled").parent().parent().show();
                custofin.val("0").attr("disabled", "disabled").parent().parent().show();

                if ($("#Despesa").is(":checked")) {
                    admcartao.val("").attr("disabled", "disabled").parent().parent().show();
                    bandeira.val("").attr("disabled", "disabled").parent().parent().show();
                } else {
                    admcartao.val("").removeAttr("disabled").parent().parent().show();
                    bandeira.val("").removeAttr("disabled").show();
                }
                break;
            default:
                    admcartao.val("").attr("disabled", "disabled").parent().parent().show();
                    bandeira.val("").attr("disabled", "disabled").parent().parent().show();
                    txcobrada.val("0").attr("disabled", "disabled").parent().parent().show();
                    custofin.val("").removeAttr("disabled").parent().parent().show();

                    if (condpgto.find(":selected").val() == "À Vista") {
                        nroparcela.val(0).attr("disabled", "disabled").parent().parent().show();
    
                        var diaaux = dtop.val();
                        diaaux = diaaux.split("/");
                        var dia = parseInt(diaaux[0]);
                        diavenc.val(dia).attr('disabled','disabled').parent().parent().show();
    
                    } else {
    
                        nroparcela.val("").removeAttr("disabled").parent().parent().show();
                        diavenc.val(dia).removeAttr("disabled").parent().parent().show();
    
                    }

                break;
        }

    });

     // quando troca a administradora de cartão
     $('#adm_cartao').change(function () {
        
        $('#taxa-cartao').val(0);
        $('#bandeira').removeClass('is-valid is-invalid');

        if ($("#Receita").is(":checked")) {
            if ($('#cond_pgto').find(":selected").val() != "À vista") {
                
                $('#bandeira').val("").attr('disabled', 'disabled').parent().parent().show();
                
            }
        }
        var id = $(this).val();
        var action = "buscaBandeiras";
        if (id != '') {
            $.ajax({
                url: baselink + "/ajax/" + action,
                type: "POST",
                data: { q: id },   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
                dataType: "json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success: function (json) {
                    //limpei o select e coloquei a primeira opção (placeholder) 
                    $('#bandeira').empty();
                    //adiciona os options respectivos
                    $('#bandeira').append('<option value="" selected disabled>Selecione</option>');
                    if (json.length > 0) {
                        //insere as contas sinteticas especificas
                        for (var i = 0; i < json.length; i++) {
                            $('#bandeira').append('<option value=' + json[i].id + ' data-info=' + json[i].informacoes + ' data-txant=' + json[i].txantecipacao + '\
                                                     data-txcred='+ json[i].txcredito + '>' + json[i].nome + '</option>');
                        }
                        $('#bandeira').removeAttr('disabled');
                    }
                    
                }
            });
        }
        calculatxcartao();
    });
    $('#adm_cartao').blur(function () {
        $('#bandeira').removeClass('is-valid is-invalid'); 
        calculatxcartao();
    });

    //quando troca o select da bandeira
    $('#bandeira').change(function () {
        if($('#bandeira').find(":selected").val() == ''){
            $('#bandeira').removeClass('is-valid is-invalid');
        }
        calculatxcartao();
    });
    $('#bandeira').blur(function () {
        if($('#bandeira').find(":selected").val() == ''){
            $('#bandeira').removeClass('is-valid is-invalid');
        }
        calculatxcartao();
    });

    //quando sai do select número de parcelas
    $('#nro_parcela').change(function () {
        if ($("#Receita").is(":checked")) {
            calculatxcartao();
        }
    });
    $('#nro_parcela').blur(function () {
        if ($('#cond_pgto').find(":selected").val() != "À Vista") {
            if ($('#nro_parcela').find(':selected').val() != '' & $('#nro_parcela').find(':selected').val() == 0) {
                $('#nro_parcela').val("");
                alert("O número de parcelas não pode ser igual a zero.");
                return;
            }
        }
        calculatxcartao();
    });

    function calculatxcartao() {

        $('#taxa-cartao').val(0);
        $("#custo_financ").val(0);

        //pegar as taxas quando o pagamento é débito - credito com jutos, parcelado e antecipado
        if ($("#forma_pgto").find(":selected").val() != "" & $("#cond_pgto").find(":selected").val() != "" & $("#adm_cartao").find(":selected").val() != "" & $("#bandeira").find(":selected").val() != "" & $("#valor_total").val() != "") {
            if ($("#Receita").is(":checked")) {
                if ($("#nro_parcela").find(":selected").val() != '' & $("#nro_parcela").find(":selected").val() != 0) {
                    $('#taxa-cartao').val(0);
                    if ($("#forma_pgto").find(":selected").val() == "Cartão Crédito") {
                        if ($("#cond_pgto").find(":selected").val() == "Com Juros") {
                            var txsa = $('#bandeira').find(":selected").attr("data-info");
                            txsa = txsa.split("-");
                            txsa = parseFloat(txsa[2]).toFixed(2);
                            $('#taxa-cartao').val(txsa + "%");
                            
                            var vltot = $("#valor_total").val();
                            vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                            vltot = vltot.replace(",", ".");
                            vltot = parseFloat(vltot);
                            vltot = vltot * parseFloat((txsa / 100));
                            vltot = parseFloat(vltot).toFixed(2);
                            vltot = vltot.replace(".", ",");
                            $("#custo_financ").val(vltot);

                        }else if ($("#cond_pgto").find(":selected").val() == "Parcelado") {
                            var txsb = $('#bandeira :selected').attr("data-txcred");
                            txsb = txsb.split("-");
                            var nropa = $("#nro_parcela").find(":selected").val();
                            txsb = parseFloat(txsb[(nropa - 1)]).toFixed(2);
                            $('#taxa-cartao').val(txsb + "%");
    
                            var vltot = $("#valor_total").val();
                            vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                            vltot = vltot.replace(",", ".");
                            vltot = parseFloat(vltot);
                            vltot = vltot * parseFloat((txsb / 100));
                            vltot = parseFloat(vltot).toFixed(2);
                            vltot = vltot.replace(".", ",");
                            $("#custo_financ").val(vltot);

                        }else if ($("#cond_pgto").find(":selected").val() == "Antecipado") {
                            var txsc = $('#bandeira').find(':selected').attr("data-txant");
                            txsc = txsc.split("-");
                            var nropb = $("#nro_parcela").find(":selected").val();
                            txsc = parseFloat(txsc[(nropb - 1)]).toFixed(2);
                            $('#taxa-cartao').val(txsc + "%");
    
                            var vltot = $("#valor_total").val();
                            vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                            vltot = vltot.replace(",", ".");
                            vltot = parseFloat(vltot);
                            vltot = vltot * parseFloat((txsc / 100));
                            vltot = parseFloat(vltot).toFixed(2);
                            vltot = vltot.replace(".", ",");
                            $("#custo_financ").val(vltot);

                        }
                    }
                }else if ($("#forma_pgto").find(":selected").val() == "Cartão Débito") {
                    var txsd = $('#bandeira').find(":selected").attr("data-info");
                    txsd = txsd.split("-");
                    txsd = parseFloat(txsd[0]).toFixed(2);
                    $('#taxa-cartao').val(txsd + "%");
                    
                    var vltot = $("#valor_total").val();

                    vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                    vltot = vltot.replace(",", ".");
                    vltot = parseFloat(vltot);
                    vltot = vltot * parseFloat((txsd / 100));
                    vltot = parseFloat(vltot).toFixed(2);
                    vltot = vltot.replace(".", ",");
                    $("#custo_financ").val(vltot);

                }
            }
        }
    }


    function confirmaPreenchimento() {
        // testa se o preenchimento dos campos necessários está ok
        if(confirmaPreenchi() == false){
            alert("Preencha todos os campos em negrito.");
            return;
        }

        //início da inserção da nova linha          
        var movimentacao, nropedido, nronf, dtemissaonf, analitica, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias;
        if ($("#Receita").is(":checked")) {
            movimentacao = "Receita";
        } else {
            movimentacao = "Despesa";
        }
    
        if ($("#nro_pedido").val() != "") {
            nropedido = parseInt($("#nro_pedido").val());
        } else {
            nropedido = "";
        }

        if ($("#nro_nf").val() != "") {
            nronf = $("#nro_nf").val();
        } else {
            nronf = "";
        }

        if ($("#data_emissao_nf").val() != "") {
            dtemissaonf = $("#data_emissao_nf").val();
        } else {
            dtemissaonf = "";
        }
        
        analitica = $("#conta_analitica").find(":selected").val();
        contacorrente = $("#conta_corrente").find(":selected").val();
        detalhe = $("#detalhe").val();
        quemlancou = $("#quem_lancou").find(":selected").val();
        favorecido = $("#favorecido").val();
        dtoperacao = $("#data_operacao").val();
        valortotal = floatParaPadraoInternacional($('#valor_total'));   
        formapgto = $("#forma_pgto").find(":selected").val();
        condpgto = $("#cond_pgto").find(":selected").val();
        nroparcela = parseInt($("#nro_parcela").find(":selected").val());
        diavenc = parseInt($("#dia_venc").find(":selected").val());
        

        if ($("#adm_cartao").find(":selected").val() == "") {
            admcartao = "";
            bandeira = "";
        } else {
            admcartao = $("#adm_cartao").find(":selected").val();
            bandeira = $("#bandeira").find(":selected").val();
        }
        
         txcartao = floatParaPadraoInternacional($("#taxa-cartao")) / 100;
         custofinanc = floatParaPadraoInternacional($("#custo_financ"));
         observacao = $("#observacao").val().trim();
    
        if ($("#Receita").is(":checked")) {
            if (formapgto == "Cartão Débito" & condpgto == "À Vista") {
                distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[1]);
    
            } else if (formapgto == "Cartão Crédito" & condpgto == "Com Juros") {
                distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[3]);
    
            } else if (formapgto == "Cartão Crédito" & condpgto == "Antecipado") {
                distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[4]);
    
            } else {
                distdias = 0;
            }
        } else {
            distdias = 0;
        }
    
        //testar se já tem na tabela os itens selecionados
        if ($("#tabela_lancamento tbody").length > 0) {
            var max = 0;
            $("#tabela_lancamento tbody tr").each(function () {
                var maxant = parseInt($(this).find('a').attr("data-ident"));
                if (maxant > max) {
                    max = maxant;
                }
            });
            max++;
        } else {
            max = 1;
        }
        
        console.log(admcartao);
        // lança o valor da receita ou despesa
        var linha = new Array();
        linha = lancaFluxo(max, movimentacao, nropedido, nronf, dtemissaonf, analitica, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias); 

        if (linha.length > 1) {
            for (var i = 0; i < linha.length; i++) {
                $('#tabela_lancamento tbody').append(linha[i]);
            }
        } else {
            $('#tabela_lancamento tbody').append(linha[0]);
        }
    
        //lança o custo financeiro caso ele exista
        var custoAux = floatParaPadraoInternacional($('#custo_financ'));
        console.log(custoAux);
        if (custoAux > 0) {
            //testar se já tem na tabela os itens selecionados
            if ($("#tabela_lancamento tbody").length > 0) {
                var max = 0;
                $("#tabela_lancamento tbody tr").each(function () {
                    var maxant = parseInt($(this).find('a').attr("data-ident"));
                    if (maxant > max) {
                        max = maxant;
                    }
                });
                max++;
            } else {
                max = 1;
            }
    
            var linhab = new Array();
            linhab = lancaFluxo(max, 'Despesa', nropedido, nronf, dtemissaonf, 'Despesa Financeira', contacorrente, 'Taxa - ' + formapgto + ' - ' + detalhe, quemlancou, favorecido, dtoperacao, custoAux, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias); 
            if (linhab.length > 1) {
                for (var i = 0; i < linhab.length; i++) {
                    $('#tabela_lancamento tbody').append(linhab[i]);
                }
            } else {
                $('#tabela_lancamento tbody').append(linhab[0]);
            }
        }
    
        // calcularesumo();
        // formataTabela();
        // limparPreenchimento();
    
    }

    function confirmaPreenchi(){
       preenche = true;

        if( $("#conta_analitica").find(':selected').val() == "" ){
            preenche = false;
        }
        if( $("#conta_corrente").find(':selected').val() == "" ){
            preenche = false;
        }
        if( $("#detalhe").val() == "" ){
            preenche = false;
        }
        if( $("#quem_lancou").find(':selected').val() == "" ){
            preenche = false;
        }
        if( $("#favorecido").val() == "" ){
            preenche = false;
        }else{
            if( $("#favorecido").siblings('.invalid-feedback').is(':visible') ){
                preenche = false;
            }
        }
        if( $("#data_operacao").val() == "" ){
            preenche = false;
        }
        if( $("#valor_total").val() == "" ){
            preenche = false;
        }
        if( $("#forma_pgto").find(':selected').val() == "" ){
            preenche = false;
        }
        if( $("#cond_pgto").find(':selected').val() == "" ){
            preenche = false;
        }

        if( $("#dia_venc").find(':selected').val() == "" ){
            preenche = false;
        }

        if( $("#taxa-cartao").val() == "" ){
            preenche = false;
        }

        if( $("#custo_financ").val() == "" ){
            preenche = false;
        }
        
        if( $("#cond_pgto").find(':selected').val() != "À Vista" ){
            if( $("#nro_parcela").find(':selected').val() == "" ){
                preenche = false;
            }
        }

        if ($("#Despesa").is(":checked")) {
            if( $("#adm_cartao").find(':selected').val() != "" || $("#bandeira").find(':selected').val() != "" ){
                preenche = false;
            }
        }else{
            if($('#forma_pgto').find(':selected').val() == 'Cartão Crédito' || $('#forma_pgto').find(':selected').val() == 'Cartão Débito' ){
                if( $("#adm_cartao").find(':selected').val() == "" || $("#bandeira").find(':selected').val() == "" ){
                    preenche = false;
                }
            }else{
                if( $("#adm_cartao").find(':selected').val() != "" || $("#bandeira").find(':selected').val() != "" ){
                    preenche = false;
                }
            }    
        }

        return preenche;
    }

});

    function dataAtual(){
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

    function proximoDiaUtilParcela(dataInicial, nroParcelas, diavenc){
        var dtaux = dataInicial.split("/");
        var dtvencaux = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

        //soma a quantidade de meses para o recebimento/pagamento
        dtvencaux.setMonth(dtvencaux.getMonth() + nroParcelas);
        
        //transforma em data para verificar o dia da semana
        var dtvenc = new Date(dtaux[2], dtvencaux.getMonth(), diavenc);
        
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
    }

    function proximoDiaUtil(dataInicio, distdias){

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
        }else{
            return dataInicio;
        }
    }

    function floatParaPadraoBrasileiro(valor){
        var valortotal = valor;
        valortotal = parseFloat(valortotal).toFixed(2);
        valortotal = valortotal.replace(",", "").replace(",", "").replace(",", "").replace(",", "");
        valortotal = valortotal.replace(".", ",");
        return valortotal;
    }

    function floatParaPadraoInternacional(valor){
        var valorFloat = valor;
        var valortotal = valorFloat.val();
        valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
        valortotal = valortotal.replace(",", ".");
        valortotal = parseFloat(valortotal).toFixed(2);
        return valortotal;
    }


    function lancaFluxo(proxid, movimentacao, nropedido, nronf, dataemissaonf, analitica, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias = 0) {
        console.log('entrei na funcao lancafluxo');
        /////////////////////////// LANÇAMENTO INTEIRO FEITO A VISTA - EXCLUINDO RECEITA DE CARTÃO DÉBITO
        if (condpgto == "À Vista" && (formapgto != "Cartão Débito" || formapgto != "Cartão Crédito")) {
            console.log('lancamento à vista que não cartao');
            var dtentrada = dataAtual();
            valortotal = floatParaPadraoBrasileiro(valortotal);
            var arraylinhas = new Array();
            var linha = "<tr>";
            linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + proxid + " '>Editar</a>" + "</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='despesa_receita[" + proxid + "]'  value='" + movimentacao + "' />" +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='conta_analitica[" + proxid + "]'  value='" + analitica + "' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='detalhe[" + proxid + "]'          value='" + detalhe + "' />"      +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_operacao[" + proxid + "]'    value='" + dtoperacao + "' />"   +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='valortotal[" + proxid + "]'       value='" + valortotal + "' />"   +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_vencimento[" + proxid + "]'  value='" + dtoperacao + "' />"   +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='formapgto[" + proxid + "]'        value='" + formapgto + "' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='condpgto[" + proxid + "]'         value='" + condpgto + "' />"     +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nroparc[" + proxid + "]'          value=     '1|1' />"             +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_quitacao[" + proxid + "]'    value='" + dtoperacao + "' />"   +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nro_pedido[" + proxid + "]'       value='" + nropedido + "' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='conta_corrente[" + proxid + "]'   value='" + contacorrente + "'/>" +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='adm_cartao[" + proxid + "]'       value='" + admcartao +"' />"     +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='bandeira[" + proxid + "]'         value='" + bandeira +"' />"      +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='favorecido[" + proxid + "]'       value='" + favorecido +"' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='status[" + proxid + "]'           value=     'Quitado' />"         +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='quem_lancou[" + proxid + "]'      value='" + quemlancou +"' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_entrada_sistema[" + proxid + "]' value='" +dtentrada+"'/>"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nro_nf[" + proxid + "]'           value='" + nronf +"'/>"          +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_emissao_nf[" + proxid + "]'  value='" + dataemissaonf +"'/>"  +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='observacao[" + proxid + "]'       value='" + observacao +"' />"    +"</td>";
            linha += "</tr>";
            console.log(condpgto);
            arraylinhas.push(linha);
            console.log(arraylinhas);
            return arraylinhas;
        
        /////////////////////////// LANÇAMENTO INTEIRO FEITO EM UMA VEZ - DISTÂNCIA DO VENCIMENTO EM DIAS
        } else if (formapgto == "Cartão Débito" | (formapgto == "Cartão Crédito" & condpgto == "Com Juros") | (formapgto == "Cartão Crédito" & condpgto == "Antecipado")) {
        
            console.log('lancamento debito, com juros e antecipado');
            var arraylinhas = new Array();
            var dtentrada = dataAtual();
            valortotal = floatParaPadraoBrasileiro(valortotal);
            var dtvenc = proximoDiaUtil(dtoperacao, distdias);

            var linha = "<tr>";
            linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + proxid + " '>Editar</a>" + "</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='despesa_receita[" + proxid + "]'  value='" + movimentacao + "' />" +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='conta_analitica[" + proxid + "]'  value='" + analitica + "' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='detalhe[" + proxid + "]'          value='" + detalhe + "' />"      +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_operacao[" + proxid + "]'    value='" + dtoperacao + "' />"   +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='valortotal[" + proxid + "]'       value='" + valortotal + "' />"   +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_vencimento[" + proxid + "]'  value='" + dtvenc + "' />"       +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='formapgto[" + proxid + "]'        value='" + formapgto + "' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='condpgto[" + proxid + "]'         value='" + condpgto + "' />"     +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nroparc[" + proxid + "]'          value=     '1|1' />"             +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_quitacao[" + proxid + "]'    value=     ''    />"             +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nro_pedido[" + proxid + "]'       value='" + nropedido + "' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='conta_corrente[" + proxid + "]'   value='" + contacorrente + "'/>" +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='adm_cartao[" + proxid + "]'       value='" + admcartao +"' />"     +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='bandeira[" + proxid + "]'         value='" + bandeira +"' />"      +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='favorecido[" + proxid + "]'       value='" + favorecido +"' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='status[" + proxid + "]'           value=     'A Quitar' />"        +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='quem_lancou[" + proxid + "]'      value='" + quemlancou +"' />"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_entrada_sistema[" + proxid + "]' value='" +dtentrada+"'/>"    +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nro_nf[" + proxid + "]'           value='" + nronf +"'/>"          +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_emissao_nf[" + proxid + "]'  value='" + dataemissaonf +"'/>"  +"</td>";
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='observacao[" + proxid + "]'       value='" + observacao +"' />"    +"</td>";
            linha += "</tr>";

            arraylinhas.push(linha);
            return arraylinhas;

        /////////////////////////// LANÇAMENTO INTEIRO FEITO PARCELADO - DISTANCIA DO VENCIMENTO EM MESES
        }else if (condpgto == "Parcelado" & nroparcela > 0) {
        
            console.log('lancamento parcelado');
            var dtentrada = dataAtual();

            var arraylinhas = new Array();
            var linha;

            var valtot = valortotal.replace(",", ".");
            valtot = parseFloat(valtot).toFixed(2) / parseInt(nroparcela);
            valtot = parseFloat(valtot).toFixed(2);
            valtot = floatParaPadraoBrasileiro(valtot);

            for (var pr = 0; pr < nroparcela; pr++) {
                dtvenc = proximoDiaUtilParcela(dtoperacao, pr, diavenc);
                console.log(dtvenc);

                var linha = "<tr>";
                linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + ( proxid + pr ) + " '>Editar</a>" + "</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='despesa_receita[" + ( proxid + pr ) + "]'  value='" + movimentacao + "' />"               +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='conta_analitica[" + ( proxid + pr ) + "]'  value='" + analitica + "' />"                  +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='detalhe[" + ( proxid + pr ) + "]'          value='" + detalhe + "' />"                    +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_operacao[" + ( proxid + pr ) + "]'    value='" + dtoperacao + "' />"                 +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='valortotal[" + ( proxid + pr ) + "]'       value='" + valtot + "' />"                     +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_vencimento[" + ( proxid + pr ) + "]'  value='" + dtvenc + "' />"                     +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='formapgto[" + ( proxid + pr ) + "]'        value='" + formapgto + "' />"                  +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='condpgto[" + ( proxid + pr ) + "]'         value='" + condpgto + "' />"                   +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nroparc[" + ( proxid + pr ) + "]'          value='" + (pr + 1) + "|" + nroparcela + "' />"   +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_quitacao[" + ( proxid + pr ) + "]'    value=     ''    />"                           +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nro_pedido[" + ( proxid + pr ) + "]'       value='" + nropedido + "' />"                  +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='conta_corrente[" + ( proxid + pr ) + "]'   value='" + contacorrente + "'/>"               +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='adm_cartao[" + ( proxid + pr ) + "]'       value='" + admcartao +"' />"                   +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='bandeira[" + ( proxid + pr ) + "]'         value='" + bandeira +"' />"                    +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='favorecido[" + ( proxid + pr ) + "]'       value='" + favorecido +"' />"                  +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='status[" + ( proxid + pr ) + "]'           value=     'A Quitar' />"                      +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='quem_lancou[" + ( proxid + pr ) + "]'      value='" + quemlancou +"' />"                  +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_entrada_sistema[" + ( proxid + pr ) + "]' value='" +dtentrada+"'/>"                +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='nro_nf[" + ( proxid + pr ) + "]'           value='" + nronf +"'/>"                        +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='data_emissao_nf[" + ( proxid + pr ) + "]'  value='" + dataemissaonf +"'/>"                +"</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly='readonly' required name='observacao[" + ( proxid + pr ) + "]'       value='" + observacao +"' />"                  +"</td>";
                linha += "</tr>";

                arraylinhas.push(linha);
            }

            return arraylinhas;

        }else{
            console.log('nao entrou em nenhuma condicao');
        }

    }