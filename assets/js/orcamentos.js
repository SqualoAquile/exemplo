$(function () {

    //coloca os inputs dentros das div certas pra acertar o layout da página
    $('#form-principal').children('.row').children('[class^="col-xl"]:nth-child(-n+17)').appendTo('#esquerda .row');
    $('#form-principal').children('.row').children('[class^="col-xl"]:nth-child(n+2):nth-child(-n+9)').appendTo('#embaixo .row');

    //inicializa os inputs da página
    $('#status').attr('disabled','disabled');

    $('#quant_usada').attr('disabled','disabled');
    $('#material_complementar').attr('disabled','disabled');
    $('#unidade').attr('disabled','disabled');
    $('#custo_tot_subitem').attr('disabled','disabled');

    $('#titulo_orcamento').attr('placeholder','Nome - Trabalho...');

    $('#data_emissao').val(dataAtual());
    $('#data_validade').val(proximoDiaUtil(dataAtual(), 15));
    $('#data_retorno').val(proximoDiaUtil(dataAtual(), 3));

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