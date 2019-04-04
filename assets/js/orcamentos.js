$(function () {
    // linha de comentário teste pro push do git
    // variável global que vai ser usada para guardar o valor do total de material e valor total do subitem do orçamento
    var valorTotalSubitem, custoTotalSubitem, quantTotalMaterial;


    //coloca os inputs dentros das div certas pra acertar o layout da página
    $('#form-principal').children('.row').children('[class^="col-xl"]:nth-child(-n+17)').appendTo('#esquerda .row');
    $('#form-principal').children('.row').children('[class^="col-xl"]:nth-child(n+2):nth-child(-n+10)').appendTo('#embaixo .row');

    //inicializa os inputs da página - parte do orçamento
    $('#motivo_desistencia').parent().parent().addClass('d-none');
    $('#status').attr('disabled', 'disabled');
    $('#titulo_orcamento').attr('placeholder', 'Nome - Trabalho...');

    $('#data_emissao').val(dataAtual()).datepicker('update');

    $('#data_validade').val(proximoDiaUtil($('#data_emissao').val(), 15)).datepicker('update');
    $('#data_retorno').val(proximoDiaUtil(dataAtual(), 3)).datepicker('update');

    // inicializa os inputs da pagina - parte de itens do orçamento
    // $('#material_complementar').attr('disabled','disabled');
    $('#quant_usada').attr('disabled', 'disabled');
    $('#custo_tot_subitem').attr('disabled', 'disabled');

    $('#unidade').attr('disabled', 'disabled');
    $.ajax({
        url: baselink + '/ajax/buscaParametrosMaterial',
        type: 'POST',
        data: {
            tabela: 'parametros',
        },
        dataType: 'json',
        success: function (data) {

            var bocarolo, margem;
            if (data['tamanho_boca_rolo']) {
                bocarolo = floatParaPadraoInternacional(data['tamanho_boca_rolo']);
                $('#unidade').attr('data-bocarolo', bocarolo);
            }
            if (data['margem_erro_material']) {
                margem = floatParaPadraoInternacional(data['margem_erro_material']);
                $('#unidade').attr('data-margemerro', margem);
            }

        }
    });

    // $('#largura').attr('disabled','disabled');
    // $('#comprimento').attr('disabled','disabled');


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

                    // JSON Response - Ordem Alfabética
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
                        $largura = $('[name="largura"]'),
                        $comprimento = $('[name="comprimento"]'),
                        $quantUsada = $('[name="quant_usada"]'),
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
                        .removeAttr('data-tabela data-custo data-preco data-unidade')
                        .val('')
                        .blur();

                    $materialComplementar
                        .removeClass('is-valid is-invalid')
                        .removeAttr('data-tabela data-custo data-preco data-unidade')
                        .val('')
                        .blur();

                    if (val == 'produtos') {

                        $materialDropdown.html(htmlDropdown);
                        $materialComplementarDropdown.html(htmlDropdown);

                    } else if (val == 'servicos') {

                        $materialDropdown.html(htmlDropdown);
                        $materialComplementar.val('').attr('disabled', 'disabled');

                    } else {

                        $materialDropdown.html(htmlDropdown);

                        // $materialComplementar.attr('disabled', 'disabled');
                    }
                }
            });

        });

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

    $('#unidade').on('change blur', function(){
        
        calculaQuantidadeUsadaMaterial();
        calculaMaterialCustoPreco()
    });
    $('#quant').on('change blur', function(){
        
        calculaQuantidadeUsadaMaterial();
        calculaMaterialCustoPreco()
    });
    $('#largura').on('change blur', function(){
        
        calculaQuantidadeUsadaMaterial();
        calculaMaterialCustoPreco()
    });
    $('#comprimento').on('change blur', function(){
        
        calculaQuantidadeUsadaMaterial();
        calculaMaterialCustoPreco()
    });

    $('#material_complementar').on('change blur', function(){
        
        $material = $('#material_servico');
        $materialComplementar = $('#material_complementar');

        if( $material.val().toLowerCase() == $materialComplementar.val().toLowerCase() ){
            $materialComplementar.val('');
            $materialComplementar.removeClass('is-valid is-invalid');
            $materialComplementar.attr('data-preco','');
            $materialComplementar.attr('data-custo','');
        }
    });

    $("#custo_tot_subitem, #preco_tot_subitem").on('change blur',function(){
        
        var $custo = $("#custo_tot_subitem");
        var $preco = $("#preco_tot_subitem");
        var $material = $('#material_servico');

        if( $custo.val() != "" && $preco.val() == "" ){
            
            $preco.val(floatParaPadraoBrasileiro( $material.attr('data-preco') ) );
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            // $material.val('').change().blur();
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( parseFloat(floatParaPadraoInternacional( $custo.val())) >= parseFloat(floatParaPadraoInternacional( $preco.val())) ){
                // alert('O preço do item deve ser maior do que o seu custo.');
                $preco.val(floatParaPadraoBrasileiro( $material.attr('data-preco') ) );
            }
        }
        
        calculaMaterialCustoPreco();
    });
        
    $('#material_servico').on('change blur',function(){
        
        var $unidade = $('#unidade');
        var $custo_tot = $('[name="custo_tot_subitem"]');
        var $preco_tot = $('[name="preco_tot_subitem"]');

        if( $(this).val() == ''){
            $unidade.val('').removeClass('is-valid is-invalid').blur();
            $custo_tot.val('').removeClass('is-valid is-invalid').blur();
            $preco_tot.val('').removeClass('is-valid is-invalid').blur();  
        }

    }).change().blur();

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

                    // JSON Response - Ordem Alfabética
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
                $tipoProdServ = $('[name="tipo_servico_produto"]'),
                $material = $('[name="material_servico"]'),
                $unidade = $('[name="unidade"]'),
                $custo = $('[name="custo_tot_subitem"]'),
                $preco = $('[name="preco_tot_subitem"]'),
                $largura = $('[name="largura"]'),
                $comprimento = $('[name="comprimento"]'),
                $materialComplementar = $('[name="material_complementar"]'),
                data_tabela = $this.attr('data-tabela'),
                data_unidade = $this.attr('data-unidade'),
                data_preco = $this.attr('data-preco'),
                data_custo = $this.attr('data-custo'),
                unidade = data_tabela != 'servicos' ? data_unidade : 'M²';

            $preco.val(floatParaPadraoBrasileiro(data_preco)).blur();

            $custo.val(floatParaPadraoBrasileiro(data_custo)).blur();

            $unidade.val(unidade).blur();

            $material.attr('data-tabela', data_tabela).attr('data-unidade', unidade).attr('data-preco', data_preco).attr('data-custo', data_custo);

            if($unidade.val() == 'ML' || $unidade.val() == 'M²' ){
    
                $largura.removeAttr('disabled').removeClass('is-valid is-invalid');
                $comprimento.removeAttr('disabled').removeClass('is-valid is-invalid');
                
            }else{
    
                $largura.val('').blur().attr('disabled','disabled').removeClass('is-valid is-invalid');
                $comprimento.val('').blur().attr('disabled','disabled').removeClass('is-valid is-invalid');
            }
    
            if( $tipoProdServ.val() == 'produtos' && ( $unidade.val() == 'ML' || $unidade.val() == 'M²' ) ){
                $materialComplementar.removeAttr('disabled').removeClass('is-valid is-invalid');
            }else{
                $materialComplementar.val('').blur().attr('disabled','disabled').removeClass('is-valid is-invalid');
            } 

            calculaQuantidadeUsadaMaterial();

            if ($tipoProdServ.val().toLowerCase() == 'produtos') {
                var $elementsMaterialComp = $materialComplementar.siblings('.relacional-dropdown').find('.relacional-dropdown-element');
                $filteredsElementsMaterialComp = $elementsMaterialComp.filter(function () {
                    return $(this).attr('data-unidade').toLowerCase() == $this.attr('data-unidade').toLowerCase();
                });

                // $elementsMaterialComp.hide();
                // $filteredsElementsMaterialComp.show();
            }

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

                $('[name="nome_cliente"], [name=faturado_para], [name=telefone], [name=celular], [name=email]')
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

    $('#como_conheceu')
        .on('change', function () {

            var $this = $(this);

            $('.column-quem-indicou').remove();

            if (!$this.val() && $this.attr('data-anterior')) {
                if ($this.attr('data-anterior').startsWith('Contato - ')) {
                    $this.val('Contato');
                }
            }

            if ($this.val()) {

                var $quemIndicou = $('#quem_indicou');

                if ($this.val().toLocaleLowerCase() == 'contato' || $this.val().startsWith('Contato - ')) {

                    $this
                        .parents('[class^=col]')
                        .not('#esquerda')
                        .after(`
                            <div class="column-quem-indicou col-xl-12" style="order:12;">
                                <div class="form-group">
                                    <label class="font-weight-bold" for="quem_indicou">
                                        <i data-toggle="tooltip" data-placement="top" title="" data-original-title="Campo Obrigatório">*</i>
                                        <span>Quem Indicou</span>
                                    </label>
                                    <input type="text" class="form-control" name="quem_indicou" value="" required data-unico="" data-anterior="" id="quem_indicou" tabindex="12" data-mascara_validacao="false">
                                </div>
                            </div>
                        `);

                    $quemIndicou
                        .val($this.attr('data-anterior').replace('Contato - ', ''))
                        .blur();

                    var valueQuemIndicou = $quemIndicou.val(),
                        $comoConhec = $('#como_conheceu'),
                        textOptSelc = $comoConhec.children('option:selected').text(),
                        camposConcat = textOptSelc + ' - ' + valueQuemIndicou;
        
                    if (valueQuemIndicou) {
                        $comoConhec
                            .children('option:contains(' + textOptSelc + ')')
                            .attr('value', camposConcat);
                    }

                } else {

                    $this
                        .children('option:contains("Contato")')
                        .attr('value', 'Contato');

                }
            }
        })
        .change();

    $(document)
        .on('blur', '#quem_indicou', function () {

            var $this = $(this),
                value = $this.val(),
                $comoConhec = $('#como_conheceu'),
                textOptSelc = $comoConhec.children('option:selected').text(),
                camposConcat = textOptSelc + ' - ' + value;

            $this.removeClass('is-valid is-invalid');
            $this[0].setCustomValidity('');

            if (value) {

                $comoConhec
                    .children('option:contains(' + textOptSelc + ')')
                    .attr('value', camposConcat);

                $this.addClass('is-valid');
                $this[0].setCustomValidity('');

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

function calculaMaterialCustoPreco() {

    var $qtd = $('#quant');
    var $unidade = $('#unidade');
    var $custo = $('#custo_tot_subitem');
    var $preco = $('#preco_tot_subitem');
    var $qtdUsada = $('#quant_usada');
    var $subtotal = $('#sub_total');
    var $custototal = $('#custo_total');
    var custoaux, precoaux;

    if( $qtd.val() != '' && $unidade.val() != '' && $custo.val() != '' && $preco.val() != ''){
        if($qtdUsada.val() == ''){
            //material ou serviço que não tem unidade em m², o que interessa é o preço e a quantidade
            quantTotalMaterial = parseFloat(0);
            
            custoaux =  parseFloat( parseFloat($qtd.val()) * parseFloat( floatParaPadraoInternacional( $custo.val() ) ) );
            custoTotalSubitem = floatParaPadraoBrasileiro(custoaux);

            precoaux =  parseFloat( parseFloat($qtd.val()) * parseFloat( floatParaPadraoInternacional( $preco.val() ) ) );
            valorTotalSubitem = floatParaPadraoBrasileiro(precoaux);
            
        }else{
           //material ou serviço que a unidade é m², o que interessa é o preço e a quantidade e quantUsada
            quantTotalMaterial = parseFloat( parseFloat($qtd.val()) * parseFloat( floatParaPadraoInternacional( $qtdUsada.val() ) ).toFixed(0) );

            custoaux = parseFloat( quantTotalMaterial * parseFloat( floatParaPadraoInternacional( $custo.val() ) ) );
            custoTotalSubitem = floatParaPadraoBrasileiro(custoaux);

            precoaux = parseFloat( quantTotalMaterial * parseFloat( floatParaPadraoInternacional( $preco.val() ) ) );
            valorTotalSubitem = floatParaPadraoBrasileiro(precoaux);
        }
    }else{
        quantTotalMaterial = parseFloat(0);
        custoTotalSubitem = parseFloat(0);
        valorTotalSubitem = parseFloat(0);
    }

    $custo.attr('data-totalsubitem', custoTotalSubitem);
    $preco.attr('data-totalsubitem', valorTotalSubitem);
}

function calculaQuantidadeUsadaMaterial(){ // recebe os objetos (campos)    
    
    var $unidade = $('#unidade');
    var $largura = $('#largura');
    var $comprimento = $('#comprimento');
    var $qtdUsada = $('#quant_usada');
    var bocaRolo = parseFloat($unidade.attr('data-bocarolo'));
    var margemErro = parseFloat($unidade.attr('data-margemerro'));    
    var larg, comp, quantUs, quantUsLarg, quantUsComp;

    if($unidade.val() == 'ML'){
        // $largura.removeAttr('disabled');
        // $comprimento.removeAttr('disabled');
        
        if($largura.val() != '' && $comprimento.val() != ''){

                larg = parseFloat(parseFloat(floatParaPadraoInternacional($largura.val())) *  parseFloat( parseFloat(1) + parseFloat(margemErro/100)));
                comp = parseFloat( parseFloat(floatParaPadraoInternacional($comprimento.val())) * parseFloat( parseFloat(1) + parseFloat(margemErro/100)));
                
                if( ( larg > bocaRolo ) && ( comp > bocaRolo) ){
                    quantUsLarg = parseFloat( parseFloat( Math.ceil(parseFloat( larg / bocaRolo))) * parseFloat(Math.ceil(comp)) );
                    quantUsComp = parseFloat(parseFloat( Math.ceil( parseFloat( comp / bocaRolo))) * parseFloat(Math.ceil(larg)) );
                    quantUs = Math.min(quantUsLarg, quantUsComp);

                    quantUs = floatParaPadraoBrasileiro(quantUs);
                    $qtdUsada.val(quantUs);

                }else if( (larg < bocaRolo ) && ( comp < bocaRolo) ){
                    quantUs = floatParaPadraoBrasileiro(parseFloat(1));
                    $qtdUsada.val(quantUs);

                }else{
                    quantUs =  parseFloat( Math.ceil( parseFloat(Math.max(larg, comp))));
                    quantUs = floatParaPadraoBrasileiro(quantUs);
                    $qtdUsada.val(quantUs);
                }
        
        }else{
                $qtdUsada.val('');
                return;
        }

    }else if( $unidade.val() == 'M²' ){
        // $largura.removeAttr('disabled');
        // $comprimento.removeAttr('disabled');

        if($largura.val() != '' && $comprimento.val() != ''){
            
            larg = parseFloat(parseFloat(floatParaPadraoInternacional($largura.val())) *  parseFloat( parseFloat(1) + parseFloat(margemErro/100)));
            comp = parseFloat( parseFloat(floatParaPadraoInternacional($comprimento.val())) * parseFloat( parseFloat(1) + parseFloat(margemErro/100)));
            quantUs = parseFloat(larg * comp).toFixed(2);
            quantUs = floatParaPadraoBrasileiro(quantUs);
            $qtdUsada.val(quantUs);

        }else{

            $qtdUsada.val('');
            return;
        }
    
    }else {
        // $largura.val('').attr('disabled','disabled').removeClass('is-valid is-invalid');
        // $comprimento.val('').attr('disabled','disabled').removeClass('is-valid is-invalid');
        $largura.val('').removeClass('is-valid is-invalid');
        $comprimento.val('').removeClass('is-valid is-invalid');
        $qtdUsada.val('');
    }

        
}
