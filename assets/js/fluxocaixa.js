$(function () {
    //só para teste de programação
    $("#data_operacao").val('17/02/2019');
    $("#valor_total").val('100');

    ///////////////////////////////////////CONDIÇÕES INICIAIS DA TELA
    $('#Receita').click();
    $('#Receita').change();
    $('#Despesa').click();

    $("#nro_parcela").parent().parent().hide();

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

    // $("#tabela_lancamento").hide();

    $("#nro_parcela").empty()
        .val('')
        .append('<option value="" selected  >Selecione</option>');
    for (i = 1; i <= 12; i++) {
        $("#nro_parcela").append('<option value="' + i + '">' + i + '</option>');
    }

    $("#cond_pgto").attr("disabled", "disabled");

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

    function floatParaPadraoInternacional(valor){
        var valorFloat = valor;
        var valortotal = valorFloat.val();
        valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
        valortotal = valortotal.replace(",", ".");
        valortotal = parseFloat(valortotal).toFixed(2);
        return valortotal;
    }


    function confirmaPreenchimento() {
        // testa se o preenchimento dos campos necessários está ok
        if(confirmaPreenchi() == false){
            alert("Preencha todos os campos em negrito.");
            return;
        }
        //início da inserção da nova linha  
        if ($("#Receita").is(":checked")) {
            var movimentacao = "Receita";
        } else {
            var movimentacao = "Despesa";
        }
    
        if ($("#nro_pedido").val() != "") {
            var nropedido = parseInt($("#nro_pedido").val());
        } else {
            var nropedido = "";
        }

        if ($("#nro_nf").val() != "") {
            var nronf = $("#nro_pedido").val();
        } else {
            var nronf = "";
        }

        if ($("#data_emissao_nf").val() != "") {
            var dtemissaonf = $("#data_emissao_nf").val();
        } else {
            var dtemissaonf = "";
        }
        
        var analitica = $("#conta_analitica").find(":selected").val();
        var contacorrente = $("#conta_corrente").find(":selected").val();
        var detalhe = $("#detalhe").val();
        var quemlancou = $("#quem_lancou").find(":selected").val();
        var favorecido = $("#favorecido").val();
        var dtoperacao = $("#data_operacao").val();
        var valortotal = floatParaPadraoInternacional($('#valor_total'));   
        var formapgto = $("#forma_pgto").find(":selected").val();
        var condpgto = $("#cond_pgto").find(":selected").val();
        var nroparcela = parseInt($("#nro_parcela").find(":selected").val());
        var diavenc = parseInt($("#dia_venc").find(":selected").val());
        var admcartao, bandeira;

        if ($("#adm_cartao").find(":selected").val() == "") {
            admcartao = "";
            bandeira = "";
        } else {
            admcartao = $("#adm_cartao").find(":selected").val();
            bandeira = $("#bandeira").find(":selected").val();
        }
        
        var txcartao = floatParaPadraoInternacional($("#taxa-cartao")) / 100;
        var custofinanc = floatParaPadraoInternacional($("#custo_financ"));
        var observ = $("#observacao").val();
    
        if ($("#Receita").is(":checked")) {
            if (formapgto == "Cartão Débito" & condpgto == "À Vista") {
                var distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[1]);
    
            } else if (formapgto == "Cartão Crédito" & condpgto == "Com Juros") {
                var distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[3]);
    
            } else if (formapgto == "Cartão Crédito" & condpgto == "Antecipado") {
                var distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[4]);
    
            } else {
                var distdias = 0;
            }
        } else {
            var distdias = 0;
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
    
        // lança o valor da receita ou despesa
        var linha = new Array();
        linha = lancaFluxo(max, nropedido, conta, sintetica, analitica, descricao, cc, bandeira, favorecido, dtop, valortotal, formapgto, condpgto, nroparc, diavenc, observ, distdias);
        if (linha.length > 1) {
            for (var i = 0; i < linha.length; i++) {
                $('#tabelaenvio').append(linha[i]);
            }
        } else {
            $('#tabelaenvio').append(linha[0]);
        }
    
        //lança o custo financeiro caso ele exista
        console.log(parseFloat(custofin.replace(",", ".")).toFixed(2));
        if (parseFloat(custofin.replace(",", ".")) > 0) {
            //testar se já tem na tabela os itens selecionados
            if ($("#tabelaenvio tbody").length > 0) {
                var max = 0;
                $("#tabelaenvio tbody tr").each(function () {
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
            linhab = lancaFluxo(max, nropedido, 'Despesa', 'Despesa Financeira', 'Taxa - ' + formapgto, descricao + ' - Custo Finan.', cc, bandeira, favorecido, dtop, custofin, formapgto, condpgto, nroparc, diavenc, observ, distdias);
            if (linhab.length > 1) {
                for (var i = 0; i < linhab.length; i++) {
                    $('#tabelaenvio').append(linhab[i]);
                }
            } else {
                $('#tabelaenvio').append(linhab[0]);
            }
        }
    
        calcularesumo();
        formataTabela();
        limparPreenchimento();
    
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







    function lancaFluxo(proxid, mov, nropedido, nronf, dataemissaonf, analitica, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias = 0) {

        /////////////////////////// LANÇAMENTO INTEIRO FEITO A VISTA - EXCLUINDO RECEITA DE CARTÃO DÉBITO
        if (condpgto = "À Vista" & (formapgto != "Cartão Débito" & formapgto != "Cartão Crédito")) {
            var arraylinhas = new Array();
            var linha = "<tr>";
            linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + proxid + " '>Editar</a>" + "</td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='despesa_receita[" + proxid + "]'  value='" + movimentacao + "' />" +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='conta_analitica[" + proxid + "]'  value='" + analitica + "' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='detalhe[" + proxid + "]'          value='" + detalhe + "' />"      +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='data_operacao[" + proxid + "]'    value='" + dtoperacao + "' />"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='valor_total[" + proxid + "]'      value='" + valortotal + "' />"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='data_vencimento[" + proxid + "]'  value='" + dtoperacao + "' />"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='forma_pgto[" + proxid + "]'       value='" + formapgto + "' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='cond_pgto[" + proxid + "]'        value='" + condpgto + "' />"     +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='nro_parcela[" + proxid + "]'      value='" + dtoperacao + "' />"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='valortotal[" + proxid + "]'       value='" + valortotal + "' />"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='formapgto[" + proxid + "]'        value='" + formapgto + "' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='condpgto[" + proxid + "]'         value='" + condpgto + "' />"     +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='nroparc[" + proxid + "]'          value=     '1|1' />"             +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='data_quitacao[" + proxid + "]'    value='" + dtoperacao + "' />"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='nro_pedido[" + proxid + "]'       value='" + nropedido + "' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='conta_corrente[" + proxid + "]'   value='" + contacorrente + "'/>" +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='adm_cartao[" + proxid + "]'       value='" + adm_cartao +"' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='bandeira[" + proxid + "]'         value='" + bandeira +"' />"      +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='favorecido[" + proxid + "]'       value='" + favorecido +"' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='status[" + proxid + "]'           value=     'Quitado' />"         +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='quem_lancou[" + proxid + "]'      value='" + quemlancou +"' />"    +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='data_entrada_sistema[" + proxid + "]' value='" + DATAHOJE +"'/>"   +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='nro_nf[" + proxid + "]'           value='" + nronf +"'/>"          +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='data_emissao_nf[" + proxid + "]'  value='" + dataemissaonf +"'/>"  +"<td>";
            linha += "<td>" + "<input type='text' class='form-control' readonly='readonly' required name='observacao[" + proxid + "]'       value='" + observacao +"' />"    +"<td>";
            linha += "</tr>";

            arraylinhas.push(linha);
            return arraylinhas;
        }

        /////////////////////////// LANÇAMENTO INTEIRO FEITO EM UMA VEZ - DISTÂNCIA DO VENCIMENTO EM DIAS
        if (formapgto == "Cartão Débito" | (formapgto == "Cartão Crédito" & condpgto == "Com Juros") | (formapgto == "Cartão Crédito" & condpgto == "Antecipado")) {
            var arraylinhas = new Array();

            var linha = "<tr>";
            linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + proxid + " '>Editar</a>" + "</td>";                                          //ação
            linha += "<td>" + "<input type='text' name='nropedido[" + proxid + "]' class='form-control'  value='" + nropedido + "' readonly='readonly' required/>" + "<td>";     //nro pedido
            linha += "<td>" + "<input type='text' name='mov[" + proxid + "]' class='form-control'  value='" + mov + "' readonly='readonly' required/>" + "<td>";                 //movimentação
            linha += "<td>" + "<input type='text' name='sintetica[" + proxid + "]' class='form-control'  value='" + sintetica + "' readonly='readonly' required/>" + "<td>";     //sintetica
            linha += "<td>" + "<input type='text' name='analitica[" + proxid + "]' class='form-control'  value='" + analitica + "' readonly='readonly' required/>" + "<td>";     //analitica
            linha += "<td>" + "<input type='text' name='descricao[" + proxid + "]' class='form-control'  value='" + descricao + "' readonly='readonly' required/>" + "<td>";     //detalhe
            linha += "<td>" + "<input type='text' name='cc[" + proxid + "]' class='form-control'  value='" + cc + "' readonly='readonly' required/>" + "<td>";                   //c corrente
            linha += "<td>" + "<input type='text' name='bandeira[" + proxid + "]' class='form-control'  value='" + bandeira + "' readonly='readonly' required/>" + "<td>";       //bandeira
            linha += "<td>" + "<input type='text' name='favorecido[" + proxid + "]' class='form-control'  value='" + favorecido + "' readonly='readonly' required/>" + "<td>";   //favorecido
            linha += "<td>" + "<input type='text' name='dtop[" + proxid + "]' class='form-control'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";               //data op
            linha += "<td>" + "<input type='text' name='valortotal[" + proxid + "]' class='form-control'  value='" + valortotal + "' readonly='readonly' required/>" + "<td>";   //valor tot
            linha += "<td>" + "<input type='text' name='formapgto[" + proxid + "]' class='form-control'  value='" + formapgto + "' readonly='readonly' required/>" + "<td>";     //forma pgto
            linha += "<td>" + "<input type='text' name='condpgto[" + proxid + "]' class='form-control'  value='" + condpgto + "' readonly='readonly' required/>" + "<td>";       //cond pgto
            linha += "<td>" + "<input type='text' name='nroparc[" + proxid + "]' class='form-control'  value='1|1' readonly='readonly' required/>" + "<td>";                 //parcelas   

            if (distdias != 0) {
                var dtaux = dtop.split("/");
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
                linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='form-control'  value='" + dtvenc + "' readonly='readonly' required/>" + "<td>";       //dt venc
            } else {
                //caso a distancia em dias seja o padrão, igual a zero, a dt vencimento fica igual a dt operação
                linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='form-control'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";         //dt venc
            }

            linha += "<td>" + "<input type='text' name='valorpago[" + proxid + "]' class='form-control'  value='' readonly='readonly' required/>" + "<td>";                  //valor pago
            //teste redundante para manter a ordem das <td> e facilitar a edição
            if (distdias != 0) {
                linha += "<td>" + "<input type='text' name='dtquit[" + proxid + "]' class='form-control'  value='" + dtvenc + "' readonly='readonly' required/>" + "<td>";       //dt quit
            } else {
                linha += "<td>" + "<input type='text' name='dtquit[" + proxid + "]' class='form-control'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";         //dt quit
            }
            linha += "<td>" + "<input type='text' name='status[" + proxid + "]' class='form-control'  value='A Quitar' readonly='readonly' required/>" + "<td>";             //status
            linha += "<td>" + "<input type='text' name='observ[" + proxid + "]' class='form-control'  value='' readonly='readonly' required/>" + "<td>";                     //observ
            linha += "</tr>";

            arraylinhas.push(linha);
            return arraylinhas;
        }

        /////////////////////////// LANÇAMENTO INTEIRO FEITO PARCELADO - DISTANCIA DO VENCIMENTO EM MESES
        if (condpgto = "Parcelado" & nroparc > 0) {
            var arraylinhas = new Array();
            var linha;

            var valtot = valortotal.replace(",", ".");
            valtot = parseFloat(valtot).toFixed(2) / parseInt(nroparc);
            valtot = parseFloat(valtot).toFixed(2);

            for (var pr = 0; pr < nroparc; pr++) {
                linha = "";
                linha = "<tr>";
                linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + (proxid + pr) + " '>Editar</a>" + "</td>";                                       //ação
                linha += "<td>" + "<input type='text' name='nropedido[" + (proxid + pr) + "]' class='form-control'  value='" + nropedido + "' readonly='readonly' required/>" + "<td>";  //nro pedido
                linha += "<td>" + "<input type='text' name='mov[" + (proxid + pr) + "]' class='form-control'  value='" + mov + "' readonly='readonly' required/>" + "<td>";              //movimentação
                linha += "<td>" + "<input type='text' name='sintetica[" + (proxid + pr) + "]' class='form-control'  value='" + sintetica + "' readonly='readonly' required/>" + "<td>";  //sintetica
                linha += "<td>" + "<input type='text' name='analitica[" + (proxid + pr) + "]' class='form-control'  value='" + analitica + "' readonly='readonly' required/>" + "<td>";  //analitica
                linha += "<td>" + "<input type='text' name='descricao[" + (proxid + pr) + "]' class='form-control'  value='" + descricao + "' readonly='readonly' required/>" + "<td>";  //detalhe
                linha += "<td>" + "<input type='text' name='cc[" + (proxid + pr) + "]' class='form-control'  value='" + cc + "' readonly='readonly' required/>" + "<td>";                //c corrente
                linha += "<td>" + "<input type='text' name='bandeira[" + (proxid + pr) + "]' class='form-control'  value='" + bandeira + "' readonly='readonly' required/>" + "<td>";    //bandeira
                linha += "<td>" + "<input type='text' name='favorecido[" + (proxid + pr) + "]' class='form-control'  value='" + favorecido + "' readonly='readonly' required/>" + "<td>";//favorecido
                linha += "<td>" + "<input type='text' name='dtop[" + (proxid + pr) + "]' class='form-control'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";            //data op
                linha += "<td>" + "<input type='text' name='valortotal[" + (proxid + pr) + "]' class='form-control'  value='" + valtot + "' readonly='readonly' required/>" + "<td>";    //valor tot
                linha += "<td>" + "<input type='text' name='formapgto[" + (proxid + pr) + "]' class='form-control'  value='" + formapgto + "' readonly='readonly' required/>" + "<td>";  //forma pgto
                linha += "<td>" + "<input type='text' name='condpgto[" + (proxid + pr) + "]' class='form-control'  value='" + condpgto + "' readonly='readonly' required/>" + "<td>";    //cond pgto
                linha += "<td>" + "<input type='text' name='nroparc[" + (proxid + pr) + "]' class='form-control'  value='" + (pr + 1) + "|" + nroparc + "' readonly='readonly' required/>" + "<td>";//parcelas

                var dtaux = dtop.split("/");
                var dtvencaux = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);
                //soma a quantidade de meses para o recebimento/pagamento
                dtvencaux.setDate(dtvenc.getMOnth() + (pr + 1));
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

                linha += "<td>" + "<input type='text' name='dtvenc[" + (proxid + pr) + "]' class='form-control'  value='" + dtvenc + "' readonly='readonly' required/>" + "<td>";          //dt venc
                linha += "<td>" + "<input type='text' name='valorpago[" + (proxid + pr) + "]' class='form-control'  value='' readonly='readonly' required/>" + "<td>";               //valor pago
                linha += "<td>" + "<input type='text' name='dtquit[" + (proxid + pr) + "]' class='form-control'  value='' readonly='readonly' required/>" + "<td>";                  //dt quit
                linha += "<td>" + "<input type='text' name='status[" + (proxid + pr) + "]' class='form-control'  value='A Quitar' readonly='readonly' required/>" + "<td>";          //status
                linha += "<td>" + "<input type='text' name='observ[" + (proxid + pr) + "]' class='form-control'  value='' readonly='readonly' required/>" + "<td>";                  //observ
                linha += "</tr>";

                arraylinhas.push(linha);

            }
            return arraylinhas;
        }

    }