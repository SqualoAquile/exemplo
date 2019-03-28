$(function () {

    //coloca os inputs dentros das div certas pra acertar o layout da página
    $('#form-principal').children('.row').children('[class^="col-xl"]:nth-child(-n+17)').appendTo('#esquerda .row');
    $('#form-principal').children('.row').children('[class^="col-xl"]:nth-child(n+2):nth-child(-n+10)').appendTo('#embaixo .row');

    //inicializa os inputs da página - parte do orçamento
    $('#motivo_desistencia').parent().parent().addClass('d-none');
    $('#status').attr('disabled', 'disabled');
    $('#titulo_orcamento').attr('placeholder', 'Nome - Trabalho...');

    $('#data_emissao').val(dataAtual());
    $('#data_validade').val(proximoDiaUtil($('#data_emissao').val(), 15));
    $('#data_retorno').val(proximoDiaUtil(dataAtual(), 3));

    // inicializa os inputs da pagina - parte de itens do orçamento
    $('#quant_usada').attr('disabled', 'disabled');
    $('#custo_tot_subitem').attr('disabled', 'disabled');

    $('#unidade').attr('disabled', 'disabled');
    $.ajax({
        url: baselink + '/ajax/buscaParametroTamanhoBocaRolo',
        type: 'POST',
        data: {
            tabela: 'parametros',
            parametro: 'tamanho_boca_rolo'
        },
        dataType: 'json',
        success: function (data) {
            data = floatParaPadraoInternacional(data);
            $('#unidade').attr('data-bocarolo', data);
        }
    });

    $('#largura').attr('disabled', 'disabled');
    $('#comprimento').attr('disabled', 'disabled');


    // coloca as opções de produtos/serviços 
    $('#tipo_servico_produto')
        .empty()
        .append('<option value="produtos" selected>Produtos</option>')
        .append('<option value="servicos">Serviços</option>')
        .append('<option value="servicoscomplementares">Serviços Complementares</option>')
        .on('change', function () {

            var $this = $(this),
                $material = $('[name=material_servico]'),
                $materialComplementar = $('[name=material_complementar]'),
                val = $this.val();

            $.ajax({
                url: baselink + '/ajax/getRelacionalDropdownOrcamentos',
                type: 'POST',
                data: {
                    tabela: val
                },
                dataType: 'json',
                success: function (data) {

                    data.sort(function (a, b) {
                        a = a.descricao.toLowerCase();
                        b = b.descricao.toLowerCase();
                        return a < b ? -1 : a > b ? 1 : 0;
                    });

                    var $materialDropdown = $material.siblings('.dropdown-menu').find('.dropdown-menu-wrapper'),
                        $materialComplementarDropdown = $materialComplementar.siblings('.dropdown-menu').find('.dropdown-menu-wrapper'),
                        $unidade = $('[name="unidade"]'),
                        $custo = $('[name="custo_tot_subitem"]'),
                        $preco = $('[name="preco_tot_subitem"]'),
                        htmlDropdown = '';

                    data.forEach(element => {
                        htmlDropdown += `
                            <div 
                                class="list-group-item list-group-item-action relacional-dropdown-element" 
                                data-tabela="` + val + `"
                                data-custo="` + element['custo'] + `"
                                data-preco="` + element['preco_venda'] + `"
                                data-unidade="` + element['unidade'] + `"
                            >` + element['descricao'] + `</div>
                        `;
                    });

                    $material
                        .removeClass('is-valid is-invalid')
                        .removeAttr('data-tabela')
                        .removeAttr('data-custo')
                        .removeAttr('data-preco')
                        .removeAttr('data-unidade')
                        .val('');

                    $materialComplementar
                        .removeClass('is-valid is-invalid')
                        .removeAttr('data-tabela')
                        .removeAttr('data-custo')
                        .removeAttr('data-preco')
                        .removeAttr('data-unidade')
                        .val('');

                    $unidade
                        .removeClass('is-valid is-invalid')
                        .val('');

                    $preco
                        .removeClass('is-valid is-invalid')
                        .val('');

                    $custo
                        .removeClass('is-valid is-invalid')
                        .val('');

                    if (val == 'produtos') {

                        $material.removeAttr('disabled');
                        $materialDropdown.html(htmlDropdown);

                        $materialComplementar.removeAttr('disabled');
                        $materialComplementarDropdown.html(htmlDropdown);

                    } else if (val == 'servicos') {

                        $material.removeAttr('disabled');
                        $materialDropdown.html(htmlDropdown);

                        $materialComplementar.attr('disabled', 'disabled');

                    } else {

                        $material.removeAttr('disabled');
                        $materialDropdown.html(htmlDropdown);

                        $materialComplementar.attr('disabled', 'disabled');
                    }
                }
            });

        });

    $('#data_emissao').on('change blur', function () {
        if ($('#data_emissao').val() != '') {
            $('#data_validade').val(proximoDiaUtil($('#data_emissao').val(), 15)).blur();
            $('#data_retorno').val(proximoDiaUtil($('#data_emissao').val(), 3)).blur();
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
            } else {
                alert('Preencha a Data de Emissão.');
                $('#data_retorno').val('');
                $('#data_emissao').focus();
            }
        }
    });

    $('#material_servico').on('change blur', function () {
        var $unidade = $(this);
        var $largura = $('#largura');
        var $comprimento = $('#comprimento');

        if ($unidade.val() == 'M²') {
            $largura.removeAttr('disabled');
            $comprimento.removeAttr('disabled')
        } else {
            $largura.attr('disabled', 'disabled');
            $comprimento.attr('disabled', 'disabled');
        }

    });

    $('#unidade').on('change', function () {
        calculaQuantidadeUsadaMaterial($('#unidade'), $('#largura'), $('#comprimento'), $('#quant_usada'));
    });


    $(document)
        .ready(function () {
            $.ajax({
                url: baselink + '/ajax/getRelacionalDropdownOrcamentos',
                type: 'POST',
                data: {
                    tabela: 'clientes'
                },
                dataType: 'json',
                success: function (data) {

                    data.sort(function (a, b) {
                        a = a.nome.toLowerCase();
                        b = b.nome.toLowerCase();
                        return a < b ? -1 : a > b ? 1 : 0;
                    });

                    var htmlDropdown = '';

                    data.forEach(element => {
                        htmlDropdown += `
                            <div 
                                class="list-group-item list-group-item-action relacional-dropdown-element"
                                data-tipo_pessoa="` + element['tipo_pessoa'] + `"
                                data-telefone="` + element['telefone'] + `"
                                data-celular="` + element['celular'] + `"
                                data-email="` + element['email'] + `"
                                data-comoconheceu="` + element['comoconheceu'] + `"
                            >` + element['nome'] + `</div>
                        `;
                    });

                    $('#esquerda .relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper')
                        .html(htmlDropdown);

                    $('[name="pf_pj"]').change();
                    $('[name="tipo_servico_produto"]').change();

                }
            });
        })
        .on('click', '#esquerda .relacional-dropdown-element', function () {

            var $this = $(this),
                $esquerda = $('#esquerda');

            $esquerda
                .find('[name=faturado_para]')
                .val($this.text());

            $esquerda
                .find('[name=telefone]')
                .val($this.attr('data-telefone'));

            $esquerda
                .find('[name=celular]')
                .val($this.attr('data-celular'));

            $esquerda
                .find('[name=email]')
                .val($this.attr('data-email'));

            $esquerda
                .find('[name=como_conheceu]')
                .val($this.attr('data-comoconheceu'));
        })
        .on('click', '[name="material_complementar"] ~ .relacional-dropdown .relacional-dropdown-element', function () {

            var $this = $(this),
                $materialComplementar = $('[name="material_complementar"]'),
                data_tabela = $this.attr('data-tabela'),
                data_unidade = $this.attr('data-unidade'),
                data_preco = $this.attr('data-preco'),
                data_custo = $this.attr('data-custo');

            $materialComplementar
                .attr('data-tabela', data_tabela)
                .attr('data-unidade', data_unidade)
                .attr('data-preco', data_preco)
                .attr('data-custo', data_custo);

        })
        .on('click', '[name="material_servico"] ~ .relacional-dropdown .relacional-dropdown-element', function () {

            var $this = $(this),
                $material = $('[name="material_servico"]'),
                $unidade = $('[name="unidade"]'),
                $custo = $('[name="custo_tot_subitem"]'),
                $preco = $('[name="preco_tot_subitem"]'),
                data_tabela = $this.attr('data-tabela'),
                data_unidade = $this.attr('data-unidade'),
                data_preco = $this.attr('data-preco'),
                data_custo = $this.attr('data-custo'),
                unidade = data_tabela != 'servicos' ? data_unidade : 'M²';

            $custo
                .val(data_custo)
                .blur();

            $preco
                .val(data_preco)
                .blur();

            $unidade
                .val(unidade)
                .blur();

            $material
                .attr('data-tabela', data_tabela)
                .attr('data-unidade', unidade)
                .attr('data-preco', data_preco)
                .attr('data-custo', data_custo);

        })
        .on('change', '[name="pf_pj"]', function () {
            if ($(this).is(':checked')) {

                var $radio = $(this),
                    $elements = $('#esquerda [name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element'),
                    $filtereds = $elements.filter(function () {
                        return $(this).attr('data-tipo_pessoa') == $radio.attr('id');
                    });

                $elements.hide();
                $filtereds.show();

                $('[name="nome_cliente"], [name=faturado_para], [name=telefone], [name=celular], [name=email], [name=como_conheceu]')
                    .removeClass('is-valid is-invalid')
                    .val('');

                if ($radio.attr('id') == 'pj') {

                    $('[name=telefone]')
                        .attr('required', 'required')
                        .siblings('label')
                        .addClass('font-weight-bold')
                        .find('> i')
                        .removeClass('d-none');

                    $('[name=celular]')
                        .removeAttr('required', 'required')
                        .siblings('label')
                        .removeClass('font-weight-bold')
                        .find('> i')
                        .addClass('d-none');

                } else {

                    $('[name=celular]')
                        .attr('required', 'required')
                        .siblings('label')
                        .addClass('font-weight-bold')
                        .find('> i')
                        .removeClass('d-none');

                    $('[name=telefone]')
                        .removeAttr('required', 'required')
                        .siblings('label')
                        .removeClass('font-weight-bold')
                        .find('> i')
                        .addClass('d-none');

                }

            }
        });

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

function calculaCustoPreco(qtd, unid, custo, preco) {
    var qtd = $('#quantidade');
    var qtd = $('#unidade');
    var qtd = $('#preco');
    var qtd = $('#quantidade');

}

function calculaQuantidadeUsadaMaterial(unid, larg, comp, qtdUsada) { // recebe os objetos (campos)
    var $unidade = unid;
    var $largura = larg;
    var $comprimento = comp;
    var $qtdUsada = qtdUsada;
    var bocaRolo = $unidade.attr('data-bocarolo');

    console.log($unidade);
    if ($unidade.val() != 'M²') {
        $largura.val('').attr('disabled', 'disabled');
        $comprimento.val('').attr('disabled', 'disabled');
        $qtdUsada.val('');

    } else {
        $largura.removeAttr('disabled');
        $comprimento.removeAttr('disabled')

        if ($largura.val() != '' && $comprimento.val() != '') {

            var tamMaior, larg, comp;
            larg = floatParaPadraoInternacional($largura.val());
            comp = floatParaPadraoInternacional($comprimento.val());
            tamMaior = Math.max(larg, comp);
            console.log(tamMaior);

        } else {
            $qtdUsada.val('');
            return;
        }

    }
}