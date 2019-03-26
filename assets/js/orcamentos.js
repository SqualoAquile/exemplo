$(function () {

    //coloca os inputs dentros das div certas pra acertar o layout da página
    $('#form-principal').children('.row').children('[class^="col-lg"]:nth-child(-n+17)').appendTo('#esquerda .row');
    $('#form-principal').children('.row').children('[class^="col-lg"]:nth-child(n+2):nth-child(-n+9)').appendTo('#embaixo .row');

    //inicializa os inputs da página
    $('#status').attr('disabled','disabled');

    $('#quant_usada').attr('disabled','disabled');
    $('#material_complementar').attr('disabled','disabled');
    $('#unidade').attr('disabled','disabled');

    // coloca as opções de produtos/serviços 
    $('#tipo_serviço_produto')
        .empty()
        .append('<option value="produtos" selected>Produtos</option>')
        .append('<option value="servicos">Serviços</option>')
        .append('<option value="servicoscomplementares">Serviços Complementares</option>')
        .on('change', function() {
            
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

                    var $materialDropdown = $material.siblings('.dropdown-menu').find('.dropdown-menu-wrapper'),
                        $materialComplementarDropdown = $materialComplementar.siblings('.dropdown-menu').find('.dropdown-menu-wrapper'),
                        $unidade = $('[name="unidade"]'),
                        $custo = $('[name="custo_tot_ subitem"]'),
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
                        .val('');

                    $materialComplementar
                        .removeClass('is-valid is-invalid')
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
                        .html(htmlDropdown.trim());

                    $('[name="pf_pj"]').change();
                    $('[name="tipo_serviço_produto"]').change();

                }
            });
        })
        .on('click', '#esquerda .relacional-dropdown-element', function() {

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
        .on('click', '[name="material_servico"] ~ .relacional-dropdown .relacional-dropdown-element', function() {
            
            var $this = $(this),
                $unidade = $('[name="unidade"]'),
                $custo = $('[name="custo_tot_ subitem"]'),
                $preco = $('[name="preco_tot_subitem"]');

            $custo.val($this.attr('data-custo'));
            $preco.val($this.attr('data-preco'));

            if ($this.attr('data-tabela') != 'servicos') {
                $unidade.val($this.attr('data-unidade'));
            } else {
                $unidade.val('M²');
            }

        })
        .on('change', '[name="pf_pj"]', function() {
            if ($(this).is(':checked')) {

                var $radio = $(this),
                    $elements = $('#esquerda .relacional-dropdown-element'),
                    $filtereds = $elements.filter(function() {
                        return $(this).attr('data-tipo_pessoa') == $radio.attr('id');
                    });

                $elements.hide();
                $filtereds.show();

                $('[name="nome_cliente"], [name=faturado_para], [name=telefone], [name=celular], [name=email], [name=como_conheceu]')
                    .removeClass('is-valid is-invalid')
                    .val('');

            }
        });

});