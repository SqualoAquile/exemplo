$(function () {

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

    $("#tabela_lancamento").hide();
    $("#nro_parcela").empty()
        .val('')
        .append('<option value="" selected  >Selecione</option>');
    for (i = 1; i <= 12; i++) {
        $("#nro_parcela").append('<option value="' + i + '">' + i + '</option>');
    }


    $("#cond_pgto").attr("disabled", "disabled");

    $('input[type=radio]').change();
    $('input[type=radio]').change(function () {

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

    //quando muda o select forma de pagamento - preenche adequadamente o select condição de pagamento
    $('#forma_pgto').change(function () {

        formapgto = $('#forma_pgto');
        condpgto = $('#cond_pgto');

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
        $("#cond_pgto").val("")
            .attr("disabled", "disabled");

        $("#nro_parcela").val("");
        $("#nro_parcela").attr("disabled", "disabled");

        $("#dia_venc").val("");
        $("#dia_venc").attr("disabled", "disabled");

        $("#adm_cartao").val("");
        $("#adm_cartao").attr("disabled", "disabled");

        $("#bandeira").val("");
        $("#bandeira").attr("disabled", "disabled");

        $("#taxa-cartao").val("");
        $("#taxa-cartao").attr("disabled", "disabled");

        $("#custo_financ").val("");
        $("#custo_financ").attr("disabled", "disabled");

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
            formapgto.val("");
            limpaCondPgto();
            alert("Preencha a data e/ou o valor do lançamento.");
            return;
        }

        if (condpgto.find(":selected").val() == "") {
            admcartao.val("")
                .hide()
                .attr("disabled", "disabled");
            bandeira.val("")
                .hide()
                .attr("disabled", "disabled");
            nroparcela.val("")
                .hide()
                .attr("disabled", "disabled");
            diavenc.val("")
                .hide()
                .attr("disabled", "disabled");
            txcobrada.val("")
                .hide()
                .attr("disabled", "disabled");
            custofin.val("")
                .hide()
                .attr("disabled", "disabled");
            return;
        }


        switch (formapgto.find(":selected").val()) {
            case ('Dinheiro'):
            case ('Cheque'):
            case ('Boleto'):
            case ('TED'):
            case ('DOC'):
            case ('Transferência'):
                admcartao.val("");
                admcartao.parent().parent().show();
                admcartao.attr("disabled", "disabled");

                bandeira.val("");
                bandeira.parent().parent().show();
                bandeira.attr("disabled", "disabled");

                txcobrada.val("0");
                txcobrada.parent().parent().show();
                txcobrada.attr("disabled", "disabled");
                console.log("Aqui",txcobrada);
                if ($("#Despesa").is(":checked")) {
                    if (formapgto.find(":selected").val() == "Dinheiro" | formapgto.find(":selected").val() == "Boleto" | formapgto.find(":selected").val() == "Cheque") {
                        custofin.parent().parent().show();
                    } else {
                        custofin.hide();
                    }
                } else {
                    if (formapgto.find(":selected").val() == "Boleto") {
                        custofin.parent().parent().show();
                    } else {
                        custofin.hide();
                    }
                }
                if (condpgto.find(":selected").val() == "À Vista") {
                    nroparcela.val(0);
                    nroparcela.parent().parent().show();
                    nroparcela.attr("disabled", "disabled");

                    var valor = dtop.val();
                    valor = valor.split("-");
                    var dia = valor[2];
                    diavenc.val(dia);
                    diavenc.parent().parent().show();
                    diavenc.attr("disabled", "disabled");

                } else {
                    nroparcela.val("");
                    nroparcela.parent().parent().show();
                    nroparcela.removeAttr("disabled");

                    diavenc.val("");
                    diavenc.parent().parent().show();
                    diavenc.removeAttr("disabled");

                    $("#infoparcela").slideDown("fast");
                }
                break;

            case ('Cartão Débito'):
            case ('Cartão Crédito'):
                if (condpgto.find(":selected").val() == "À Vista") {
                    nroparcela.val(0);
                    nroparcela.parent().parent().show();
                    nroparcela.attr("disabled", "disabled");

                    var valor = dtop.val();
                    valor = valor.split("-");
                    var dia = valor[2];
                    diavenc.val(dia);
                    diavenc.parent().parent().show();
                    diavenc.attr("disabled", "disabled");

                } else {
                    nroparcela.val("");
                    nroparcela.parent().parent().show();
                    nroparcela.removeAttr("disabled");

                    diavenc.val(dia);
                    diavenc.parent().parent().show();
                    diavenc.removeAttr("disabled");

                }
                if ($("#Despesa").is(":checked")) {
                    admcartao.val("");
                    admcartao.parent().parent().show();
                    admcartao.attr("disabled", "disabled");

                    bandeira.val("");
                    bandeira.parent().parent().show();
                    bandeira.attr("disabled", "disabled");

                    txcobrada.val("0");
                    txcobrada.parent().parent().show();
                    txcobrada.attr("disabled", "disabled");

                } else {
                    admcartao.val("");
                    admcartao.parent().parent().show();
                    admcartao.removeAttr("disabled");

                    txcobrada.val("0");
                    txcobrada.parent().parent().show();
                    txcobrada.attr("disabled", "disabled");

                }
                break;
            default:
                break;
        }

    });

});


    function lancaFluxo(proxid, nropedido, mov, sintetica, analitica, descricao, cc, bandeira, favorecido, dtop, valortotal, formapgto, condpgto, nroparc, diavenc, distdias = 0) {
        /////////////////////////// LANÇAMENTO INTEIRO FEITO A VISTA - EXCLUINDO RECEITA DE CARTÃO DÉBITO
        if (condpgto = "À Vista" & (formapgto != "Cartão Débito" | formapgto != "Cartão Crédito")) {
            var arraylinhas = new Array();
            var linha = "<tr>";
            linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + proxid + " '>Editar</a>" + "</td>";                                          //ação
            linha += "<td>" + "<input type='text' name='nropedido[" + proxid + "]' class='input-table-selec'  value='" + nropedido + "' readonly='readonly' required/>" + "<td>";     //nro pedido
            linha += "<td>" + "<input type='text' name='mov[" + proxid + "]' class='input-table-selec'  value='" + mov + "' readonly='readonly' required/>" + "<td>";                 //movimentação
            linha += "<td>" + "<input type='text' name='sintetica[" + proxid + "]' class='input-table-selec'  value='" + sintetica + "' readonly='readonly' required/>" + "<td>";     //sintetica
            linha += "<td>" + "<input type='text' name='analitica[" + proxid + "]' class='input-table-selec'  value='" + analitica + "' readonly='readonly' required/>" + "<td>";     //analitica
            linha += "<td>" + "<input type='text' name='descricao[" + proxid + "]' class='input-table-selec'  value='" + descricao + "' readonly='readonly' required/>" + "<td>";     //detalhe
            linha += "<td>" + "<input type='text' name='cc[" + proxid + "]' class='input-table-selec'  value='" + cc + "' readonly='readonly' required/>" + "<td>";                   //c corrente
            linha += "<td>" + "<input type='text' name='bandeira[" + proxid + "]' class='input-table-selec'  value='" + bandeira + "' readonly='readonly' required/>" + "<td>";       //bandeira
            linha += "<td>" + "<input type='text' name='favorecido[" + proxid + "]' class='input-table-selec'  value='" + favorecido + "' readonly='readonly' required/>" + "<td>";   //favorecido
            linha += "<td>" + "<input type='text' name='dtop[" + proxid + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";               //data op
            linha += "<td>" + "<input type='text' name='valortotal[" + proxid + "]' class='input-table-selec'  value='" + valortotal + "' readonly='readonly' required/>" + "<td>";   //valor tot
            linha += "<td>" + "<input type='text' name='formapgto[" + proxid + "]' class='input-table-selec'  value='" + formapgto + "' readonly='readonly' required/>" + "<td>";     //forma pgto
            linha += "<td>" + "<input type='text' name='condpgto[" + proxid + "]' class='input-table-selec'  value='" + condpgto + "' readonly='readonly' required/>" + "<td>";       //cond pgto
            linha += "<td>" + "<input type='text' name='nroparc[" + proxid + "]' class='input-table-selec'  value='1|1' readonly='readonly' required/>" + "<td>";                 //parcelas        
            linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";             //dt venc
            linha += "<td>" + "<input type='text' name='valorpago[" + proxid + "]' class='input-table-selec'  value='" + valortotal + "' readonly='readonly' required/>" + "<td>";    //valor pago
            linha += "<td>" + "<input type='text' name='dtquit[" + proxid + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";             //dt quit
            linha += "<td>" + "<input type='text' name='status[" + proxid + "]' class='input-table-selec'  value='Quitado' readonly='readonly' required/>" + "<td>";              //status
            linha += "<td>" + "<input type='text' name='observ[" + proxid + "]' class='input-table-selec'  value='' readonly='readonly' required/>" + "<td>";                     //observ
            linha += "</tr>";

            arraylinhas.push(linha);
            return arraylinhas;
        }

        /////////////////////////// LANÇAMENTO INTEIRO FEITO EM UMA VEZ - DISTÂNCIA DO VENCIMENTO EM DIAS
        if (formapgto == "Cartão Débito" | (formapgto == "Cartão Crédito" & condpgto == "Com Juros") | (formapgto == "Cartão Crédito" & condpgto == "Antecipado")) {
            var arraylinhas = new Array();

            var linha = "<tr>";
            linha += "<td>" + "<a href='#' class='botao_peq_lc' onclick='editar(this) data-ident=" + proxid + " '>Editar</a>" + "</td>";                                          //ação
            linha += "<td>" + "<input type='text' name='nropedido[" + proxid + "]' class='input-table-selec'  value='" + nropedido + "' readonly='readonly' required/>" + "<td>";     //nro pedido
            linha += "<td>" + "<input type='text' name='mov[" + proxid + "]' class='input-table-selec'  value='" + mov + "' readonly='readonly' required/>" + "<td>";                 //movimentação
            linha += "<td>" + "<input type='text' name='sintetica[" + proxid + "]' class='input-table-selec'  value='" + sintetica + "' readonly='readonly' required/>" + "<td>";     //sintetica
            linha += "<td>" + "<input type='text' name='analitica[" + proxid + "]' class='input-table-selec'  value='" + analitica + "' readonly='readonly' required/>" + "<td>";     //analitica
            linha += "<td>" + "<input type='text' name='descricao[" + proxid + "]' class='input-table-selec'  value='" + descricao + "' readonly='readonly' required/>" + "<td>";     //detalhe
            linha += "<td>" + "<input type='text' name='cc[" + proxid + "]' class='input-table-selec'  value='" + cc + "' readonly='readonly' required/>" + "<td>";                   //c corrente
            linha += "<td>" + "<input type='text' name='bandeira[" + proxid + "]' class='input-table-selec'  value='" + bandeira + "' readonly='readonly' required/>" + "<td>";       //bandeira
            linha += "<td>" + "<input type='text' name='favorecido[" + proxid + "]' class='input-table-selec'  value='" + favorecido + "' readonly='readonly' required/>" + "<td>";   //favorecido
            linha += "<td>" + "<input type='text' name='dtop[" + proxid + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";               //data op
            linha += "<td>" + "<input type='text' name='valortotal[" + proxid + "]' class='input-table-selec'  value='" + valortotal + "' readonly='readonly' required/>" + "<td>";   //valor tot
            linha += "<td>" + "<input type='text' name='formapgto[" + proxid + "]' class='input-table-selec'  value='" + formapgto + "' readonly='readonly' required/>" + "<td>";     //forma pgto
            linha += "<td>" + "<input type='text' name='condpgto[" + proxid + "]' class='input-table-selec'  value='" + condpgto + "' readonly='readonly' required/>" + "<td>";       //cond pgto
            linha += "<td>" + "<input type='text' name='nroparc[" + proxid + "]' class='input-table-selec'  value='1|1' readonly='readonly' required/>" + "<td>";                 //parcelas   

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
                linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='input-table-selec'  value='" + dtvenc + "' readonly='readonly' required/>" + "<td>";       //dt venc
            } else {
                //caso a distancia em dias seja o padrão, igual a zero, a dt vencimento fica igual a dt operação
                linha += "<td>" + "<input type='text' name='dtvenc[" + proxid + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";         //dt venc
            }

            linha += "<td>" + "<input type='text' name='valorpago[" + proxid + "]' class='input-table-selec'  value='' readonly='readonly' required/>" + "<td>";                  //valor pago
            //teste redundante para manter a ordem das <td> e facilitar a edição
            if (distdias != 0) {
                linha += "<td>" + "<input type='text' name='dtquit[" + proxid + "]' class='input-table-selec'  value='" + dtvenc + "' readonly='readonly' required/>" + "<td>";       //dt quit
            } else {
                linha += "<td>" + "<input type='text' name='dtquit[" + proxid + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";         //dt quit
            }
            linha += "<td>" + "<input type='text' name='status[" + proxid + "]' class='input-table-selec'  value='A Quitar' readonly='readonly' required/>" + "<td>";             //status
            linha += "<td>" + "<input type='text' name='observ[" + proxid + "]' class='input-table-selec'  value='' readonly='readonly' required/>" + "<td>";                     //observ
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
                linha += "<td>" + "<input type='text' name='nropedido[" + (proxid + pr) + "]' class='input-table-selec'  value='" + nropedido + "' readonly='readonly' required/>" + "<td>";  //nro pedido
                linha += "<td>" + "<input type='text' name='mov[" + (proxid + pr) + "]' class='input-table-selec'  value='" + mov + "' readonly='readonly' required/>" + "<td>";              //movimentação
                linha += "<td>" + "<input type='text' name='sintetica[" + (proxid + pr) + "]' class='input-table-selec'  value='" + sintetica + "' readonly='readonly' required/>" + "<td>";  //sintetica
                linha += "<td>" + "<input type='text' name='analitica[" + (proxid + pr) + "]' class='input-table-selec'  value='" + analitica + "' readonly='readonly' required/>" + "<td>";  //analitica
                linha += "<td>" + "<input type='text' name='descricao[" + (proxid + pr) + "]' class='input-table-selec'  value='" + descricao + "' readonly='readonly' required/>" + "<td>";  //detalhe
                linha += "<td>" + "<input type='text' name='cc[" + (proxid + pr) + "]' class='input-table-selec'  value='" + cc + "' readonly='readonly' required/>" + "<td>";                //c corrente
                linha += "<td>" + "<input type='text' name='bandeira[" + (proxid + pr) + "]' class='input-table-selec'  value='" + bandeira + "' readonly='readonly' required/>" + "<td>";    //bandeira
                linha += "<td>" + "<input type='text' name='favorecido[" + (proxid + pr) + "]' class='input-table-selec'  value='" + favorecido + "' readonly='readonly' required/>" + "<td>";//favorecido
                linha += "<td>" + "<input type='text' name='dtop[" + (proxid + pr) + "]' class='input-table-selec'  value='" + dtop + "' readonly='readonly' required/>" + "<td>";            //data op
                linha += "<td>" + "<input type='text' name='valortotal[" + (proxid + pr) + "]' class='input-table-selec'  value='" + valtot + "' readonly='readonly' required/>" + "<td>";    //valor tot
                linha += "<td>" + "<input type='text' name='formapgto[" + (proxid + pr) + "]' class='input-table-selec'  value='" + formapgto + "' readonly='readonly' required/>" + "<td>";  //forma pgto
                linha += "<td>" + "<input type='text' name='condpgto[" + (proxid + pr) + "]' class='input-table-selec'  value='" + condpgto + "' readonly='readonly' required/>" + "<td>";    //cond pgto
                linha += "<td>" + "<input type='text' name='nroparc[" + (proxid + pr) + "]' class='input-table-selec'  value='" + (pr + 1) + "|" + nroparc + "' readonly='readonly' required/>" + "<td>";//parcelas

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

                linha += "<td>" + "<input type='text' name='dtvenc[" + (proxid + pr) + "]' class='input-table-selec'  value='" + dtvenc + "' readonly='readonly' required/>" + "<td>";          //dt venc
                linha += "<td>" + "<input type='text' name='valorpago[" + (proxid + pr) + "]' class='input-table-selec'  value='' readonly='readonly' required/>" + "<td>";               //valor pago
                linha += "<td>" + "<input type='text' name='dtquit[" + (proxid + pr) + "]' class='input-table-selec'  value='' readonly='readonly' required/>" + "<td>";                  //dt quit
                linha += "<td>" + "<input type='text' name='status[" + (proxid + pr) + "]' class='input-table-selec'  value='A Quitar' readonly='readonly' required/>" + "<td>";          //status
                linha += "<td>" + "<input type='text' name='observ[" + (proxid + pr) + "]' class='input-table-selec'  value='' readonly='readonly' required/>" + "<td>";                  //observ
                linha += "</tr>";

                arraylinhas.push(linha);

            }
            return arraylinhas;
        }

    }