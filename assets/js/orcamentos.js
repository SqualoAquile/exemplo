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
    $('#tipo_serviço_produto').empty()
    .append('<option value="produtos" selected      >Produtos</option>')
    .append('<option value="servicos"               >Serviços</option>')
    .append('<option value="servicoscomplementares" >Serviços Complementares</option>')
    


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