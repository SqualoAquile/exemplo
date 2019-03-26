$(function () {

    var $formContatos = $('#itensOrcamento thead tr[role=form]'),
        lastInsertId = 0,
        botoes = `
            <td class="col-lg-2">
                <a href="javascript:void(0)" class="editar-contato btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i>
                </a>
                <a href="javascript:void(0)" class="excluir-contato btn btn-sm btn-danger">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </td>
        `;

    // [Editar] Esse trecho de código abaixo serve para quando a pagina for carregada
    // Ler o campo hidden e montar a tabela com os contatos daquele registro
    Contatos().forEach(function (contato) {
        Popula(contato);
    });

    $('#camposOrc').submit(function (event) {

        event.preventDefault();

        var $form = $(this)[0],
            $fields = $($form).find('.form-control');

        // Desfocar os campos para validar
        $fields.trigger('blur');

        if ($form.checkValidity() && !$($form).find('.is-invalid').length) {

            Save();

            // Limpar formulario
            $form.reset();
            $($form).removeClass('was-validated');
            
            $fields
                .removeClass('is-valid is-invalid')
                .removeAttr('data-anterior');

            $fields.first().focus();
        } else {
            $($form).addClass('was-validated');

            // Da foco no primeiro campo com erro
            $($form).find('.is-invalid, :invalid').first().focus();
        }
    });

    // Retorna um array de contatos puxados do campo hidden com o atributo nome igual a contatos
    function Contatos() {
        var returnContatos = [];
        if ($('[name=itens]') && $('[name=itens]').val().length) {
            var contatos = $('[name=itens]').val().split('[');
            for (var i = 0; i < contatos.length; i++) {
                var contato = contatos[i];
                if (contato.length) {
                    contato = contato.replace(']', '');
                    var dadosContato = contato.split(' * ');
                    returnContatos.push(dadosContato);
                }
            }
        };
        return returnContatos;
    };

    // Escreve o html na tabela
    function Popula(values) {
        console.log(values);
        if (!values) return;

        var currentId = $formContatos.attr('data-current-id'),
            tds = '';

        // Coloca a tag html TD em volta de cada valor vindo do form de contatos
        values.forEach(value => tds += `<td class="col-lg-2 text-truncate">` + value + `</td>`);

        if (!currentId) {
            // Se for undefined então o contato está sendo criado

            // Auto incrementa os ID's dos contatos
            lastInsertId += 1;

            $('#itensOrcamento tbody')
                .prepend('<tr class="d-flex flex-column flex-lg-row" data-id="' + lastInsertId + '">' + tds + botoes + '</tr>');

        } else {
            // Caso tenha algum valor é por que o contato está sendo editado

            $('#itensOrcamento tbody tr[data-id="' + currentId + '"]')
                .html(tds + botoes);

            // Seta o data id como undefined para novos contatos poderem ser cadastrados
            $formContatos.removeAttr('data-current-id');
        }

        $('.editar-contato').bind('click', Edit);
        $('.excluir-contato').bind('click', Delete);
    };

    // Pega as linhas da tabela auxiliar e manipula o hidden de contatos
    function SetInput() {
        var content = '';
        $('#itensOrcamento tbody tr').each(function () {
            var par = $(this).closest('tr');
            var tdItem = par.children("td:nth-child(1)");
            var tdSubItem = par.children("td:nth-child(2)");
            var tdQuant = par.children("td:nth-child(3)");
            var tdLargura = par.children("td:nth-child(4)");
            var tdComprimento = par.children("td:nth-child(5)");
            var tdQuantUsada = par.children("td:nth-child(6)");
            var tdServicoProduto = par.children("td:nth-child(7)");
            var tdMaterialServico = par.children("td:nth-child(8)");
            var tdMaterialComplementar = par.children("td:nth-child(9)");
            var tdUnidade = par.children("td:nth-child(10)");
            var tdCusto = par.children("td:nth-child(11)");
            var tdPreco = par.children("td:nth-child(12)");
            var tdObservacao = par.children("td:nth-child(13)");

            content += '[' + tdItem.text() + ' * ' + tdSubItem.text() + ' * ' + tdQuant.text() + ' * ' + tdLargura.text() + ' * ' + 
                             tdComprimento.text() + ' * ' + tdQuantUsada.text() + ' * ' + tdServicoProduto.text() + ' * ' + tdMaterialServico.text() + ' * ' + 
                             tdMaterialComplementar.text() + ' * ' + tdUnidade.text() + ' * ' + tdCusto.text() + ' * ' + tdPreco.text() + ' * ' + tdObservacao.text() + ']';
        });

        $('[name=itens]')
            .val(content)
            .attr('data-anterior-aux', content)
            .change();
    };

    // Delete contato da tabela e do hidden
    function Delete() {
        var par = $(this).closest('tr');
        par.remove();
        SetInput();
    };

    // Seta no form o contato clicado para editar, desabilita os botoes de acões deste contato e seta o id desse contato
    // no form dos contatos
    function Edit() {

        // Volta para válido todos os botoões de editar e excluir
        $('table#itensOrcamento tbody tr .btn')
            .removeClass('disabled');

            var $par = $(this).closest('tr');
                tdItem = $par.children("td:nth-child(1)");
                tdSubItem = $par.children("td:nth-child(2)");
                tdQuant = $par.children("td:nth-child(3)");
                tdLargura = $par.children("td:nth-child(4)");
                tdComprimento = $par.children("td:nth-child(5)");
                tdQuantUsada = $par.children("td:nth-child(6)");
                tdServicoProduto = $par.children("td:nth-child(7)");
                tdMaterialServico = $par.children("td:nth-child(8)");
                tdMaterialComplementar = $par.children("td:nth-child(9)");
                tdUnidade = $par.children("td:nth-child(10)");
                tdCusto = $par.children("td:nth-child(11)");
                tdPreco = $par.children("td:nth-child(12)");
                tdObservacao = $par.children("td:nth-child(13)");

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        $par
            .find('.btn')
            .addClass('disabled');

        $('input[name=descricao_item]').val(tdItem.text()).attr('data-anterior', tdItem.text()).focus();
        $('input[name=descricao_subitem]').val(tdSubItem.text()).attr('data-anterior', tdSubItem.text());
        $('input[name=quant]').val(tdQuant.text()).attr('data-anterior', tdQuant.text());
        $('input[name=largura]').val(tdLargura.text()).attr('data-anterior', tdLargura.text());
        $('input[name=comprimento]').val(tdComprimento.text()).attr('data-anterior', tdComprimento.text());
        $('input[name=quant_usada]').val(tdQuantUsada.text()).attr('data-anterior', tdQuantUsada.text());
        $('input[name=tipo_servico_produto]').val(tdServicoProduto.text()).attr('data-anterior', tdServicoProduto.text());
        $('input[name=material_produto]').val(tdMaterialServico.text()).attr('data-anterior', tdMaterialServico.text());
        $('input[name=material_complementar]').val(tdMaterialComplementar.text()).attr('data-anterior', tdMaterialComplementar.text());
        $('input[name=unidade]').val(tdUnidade.text()).attr('data-anterior', tdUnidade.text());
        $('input[name=custo_tot_subitem]').val(tdCusto.text()).attr('data-anterior', tdCusto.text());
        $('input[name=preco_tot_subitem]').val(tdPreco.text()).attr('data-anterior', tdPreco.text());
        $('input[name=observacao_subitem]').val(tdPreco.text()).attr('data-anterior', tdSetor.text());

        $('table#itensOrcamento thead tr[role=form]')
            .attr('data-current-id', $par.attr('data-id'))
            .find('.is-valid, .is-invalid')
            .removeClass('is-valid is-invalid');
    };

    // Ao dar submit neste form, chama essa funcão que pega os dados do formula e Popula a tabela
    function Save() {
        var botoes = `
                <td class="col-lg-2">
                    <a href="javascript:void(0)" class="editar-contato btn btn-sm btn-primary">
                        <i class="fas fa-edit"></i>
                    </a>
                    <a href="javascript:void(0)" class="excluir-contato btn btn-sm btn-danger">
                        <i class="fas fa-trash-alt"></i>
                    </a>
                </td>
            `;

        Popula([
            $('input[name=descricao_item]').val(),
            $('input[name=descricao_subitem]').val(),
            $('input[name=quant]').val(),
            $('input[name=largura]').val(),
            $('input[name=comprimento]').val(),
            $('input[name=quant_usada]').val(),
            $('input[name=tipo_servico_produto]').val(),
            $('input[name=material_produto]').val(),
            $('input[name=material_complementar]').val(),
            $('input[name=unidade]').val(),
            $('input[name=custo_tot_subitem]').val(),
            $('input[name=preco_tot_subitem]').val(),
            $('input[name=observacao_subitem]').val(),
        ]);

        SetInput();
    };

    // Validacão se o nome já existe entre os contatos daquela tabela auxiliar
    // $('[name=contato_nome]').blur(function () {

    //     var $this = $(this),
    //         contatos = Contatos(),
    //         nomes = [];

    //     $this.removeClass('is-valid is-invalid');
    //     $this.siblings('.invalid-feedback').remove();

    //     if (contatos) {

    //         // Posicão 0 é o nome do contato
    //         contatos.forEach(contato => nomes.push(contato[0].toLowerCase()));

    //         if ($this.val()) {

    //             var value = $this.val().toLowerCase(),
    //                 dtAnteriorLower = $this.attr('data-anterior') ? $this.attr('data-anterior') : '';

    //             if (dtAnteriorLower.toLowerCase() != value) {

    //                 $this.removeClass('is-invalid is-valid');
    //                 $this[0].setCustomValidity('');
                    
    //                 if (nomes.indexOf(value) == -1) {
    //                     // Não existe, pode seguir

    //                     $this.addClass('is-valid');

    //                     $this[0].setCustomValidity('');
    //                 } else {
    //                     // Já existe, erro

    //                     $this.addClass('is-invalid');

    //                     $this[0].setCustomValidity('invalid');

    //                     $this.after('<div class="invalid-feedback">Já existe um contato com este nome</div>');
    //                 }
    //             }
    //         }

    //     }
    // });
});