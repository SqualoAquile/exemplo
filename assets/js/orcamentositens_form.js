$(function () {

    var $formContatos = $('#itensOrcamento thead tr[role=form]'),
        lastInsertId = 0,
        botoes = `
            <td class="text-truncate">
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
            // $form.reset();
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

        if (!values) return;

        var currentId = $formContatos.attr('data-current-id'),
            tds = '';

        // Coloca a tag html TD em volta de cada valor vindo do form de contatos
        values.forEach(value => tds += `<td class="text-truncate">` + value + `</td>`);

        if (!currentId) {
            // Se for undefined então o contato está sendo criado

            // Auto incrementa os ID's dos contatos
            lastInsertId += 1;

            $('#itensOrcamento tbody')
                .prepend('<tr data-id="' + lastInsertId + '">' + botoes + tds + '</tr>');

        } else {
            // Caso tenha algum valor é por que o contato está sendo editado

            $('#itensOrcamento tbody tr[data-id="' + currentId + '"]')
                .html(botoes + tds);

            // Seta o data id como undefined para novos contatos poderem ser cadastrados
            $formContatos.removeAttr('data-current-id');
        }

        $('.editar-contato').bind('click', Edit);
        $('.excluir-contato').bind('click', Delete);
        calculaSubtotalCustotal();
    };

    // Pega as linhas da tabela auxiliar e manipula o hidden de contatos
    function SetInput() {
        var content = '';
        $('#itensOrcamento tbody tr').each(function () {
            var par = $(this).closest('tr');
            var tdItem = par.children("td:nth-child(1)");
            var tdSubItem = par.children("td:nth-child(2)");
            var tdServicoProduto = par.children("td:nth-child(3)");
            var tdMaterialServico = par.children("td:nth-child(4)");
            var tdMaterialComplementar = par.children("td:nth-child(5)");
            var tdUnidade = par.children("td:nth-child(6)");
            var tdCusto = par.children("td:nth-child(7)");
            var tdPreco = par.children("td:nth-child(8)");
            var tdQuant = par.children("td:nth-child(9)");
            var tdLargura = par.children("td:nth-child(10)");
            var tdComprimento = par.children("td:nth-child(11)");
            var tdQuantUsada = par.children("td:nth-child(12)");
            var tdObservacao = par.children("td:nth-child(13)");

            content += '[' + tdItem.text() + ' * ' + tdSubItem.text() + ' * ' + tdServicoProduto.text() + ' * ' + tdMaterialServico.text() + ' * ' + 
                             tdMaterialComplementar.text() + ' * ' + tdUnidade.text() + ' * ' + tdCusto.text() + ' * ' + tdPreco.text() + ' * ' + 
                             tdQuant.text() + ' * ' + tdLargura.text() + ' * ' + tdComprimento.text() + ' * ' + tdQuantUsada.text() + ' * ' + tdObservacao.text() + ']';
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
        calculaSubtotalCustotal();
    };

    // Seta no form o contato clicado para editar, desabilita os botoes de acões deste contato e seta o id desse contato
    // no form dos contatos
    function Edit() {

        // Volta para válido todos os botoões de editar e excluir
        $('table#itensOrcamento tbody tr .btn').removeClass('disabled');
        var custoUnit,  precoUnit, quantAux, quantUsadaAux;
        var $par = $(this).closest('tr');
            tdItem = $par.children("td:nth-child(2)");
            tdSubItem = $par.children("td:nth-child(3)");
            tdQuant = $par.children("td:nth-child(4)");
            tdLargura = $par.children("td:nth-child(5)");
            tdComprimento = $par.children("td:nth-child(6)");
            tdQuantUsada = $par.children("td:nth-child(7)");
            tdServicoProduto = $par.children("td:nth-child(8)");
            tdMaterialServico = $par.children("td:nth-child(9)");
            tdMaterialComplementar = $par.children("td:nth-child(10)");
            tdUnidade = $par.children("td:nth-child(11)");
            tdCusto = $par.children("td:nth-child(12)");
            tdPreco = $par.children("td:nth-child(13)");
            tdObservacao = $par.children("td:nth-child(14)"); 

            quantUsadaAux = parseFloat( floatParaPadraoInternacional( tdQuantUsada.text() ) );
            quantAux = parseFloat( floatParaPadraoInternacional( tdQuant.text() ) );
           
            custoUnit = parseFloat( parseFloat( floatParaPadraoInternacional( tdCusto.text() )) / quantUsadaAux ); 
            custoUnit = floatParaPadraoBrasileiro( parseFloat( custoUnit / quantAux ).toFixed(2) ); 
            precoUnit = parseFloat( parseFloat( floatParaPadraoInternacional( tdPreco.text() )) / quantUsadaAux ); 
            precoUnit = floatParaPadraoBrasileiro( parseFloat( precoUnit / quantAux ).toFixed(2) );    

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        $par.find('.btn').addClass('disabled');

        $('input[name=descricao_item]').val(tdItem.text()).attr('data-anterior', tdItem.text()).blur().focus();
        $('input[name=descricao_subitem]').val(tdSubItem.text()).attr('data-anterior', tdSubItem.text()).blur();
        $('input[name=tipo_servico_produto]').val(tdServicoProduto.text()).attr('data-anterior', tdServicoProduto.text()).blur();
        $('input[name=material_servico]').val(tdMaterialServico.text()).attr('data-anterior', tdMaterialServico.text()).blur();
        $('input[name=material_complementar]').val(tdMaterialComplementar.text()).attr('data-anterior', tdMaterialComplementar.text()).blur();
        $('input[name=unidade]').val(tdUnidade.text()).attr('data-anterior', tdUnidade.text()).blur();

        $('input[name=custo_tot_subitem]').val(custoUnit).attr('data-anterior', custoUnit).blur();
        $('input[name=preco_tot_subitem]').val(precoUnit).attr('data-anterior', precoUnit).blur();
        $('input[name=quant]').val(tdQuant.text()).attr('data-anterior', tdQuant.text()).blur();
        $('input[name=largura]').val(tdLargura.text()).attr('data-anterior', tdLargura.text()).blur();
        $('input[name=comprimento]').val(tdComprimento.text()).attr('data-anterior', tdComprimento.text()).blur();
        $('input[name=quant_usada]').val(tdQuantUsada.text()).attr('data-anterior', tdQuantUsada.text());
        $('input[name=observacao_subitem]').val(tdObservacao.text()).attr('data-anterior', tdObservacao.text());

        $('table#itensOrcamento thead tr[role=form]')
            .attr('data-current-id', $par.attr('data-id'))
            .find('.is-valid, .is-invalid')
            .removeClass('is-valid is-invalid');
        
        calculaSubtotalCustotal();    
    };

    // Ao dar submit neste form, chama essa funcão que pega os dados do formula e Popula a tabela
    function Save() {

        Popula([
            $('[name=descricao_item]').val(),
            $('[name=descricao_subitem]').val(),
            $('[name=quant]').val(),
            $('[name=largura]').val(),
            $('[name=comprimento]').val(),
            $('[name=quant_usada]').val(),
            $('[name=tipo_servico_produto]').val(),
            $('[name=material_servico]').val(),
            $('[name=material_complementar]').val(),
            $('[name=unidade]').val(),
            $('[name=custo_tot_subitem]').attr('data-totalsubitem'),
            $('[name=preco_tot_subitem]').attr('data-totalsubitem'),
            $('[name=observacao_subitem]').val(),
        ]);

        SetInput();
        calculaSubtotalCustotal();
    };

    // Toda movimentação que acontece na tabela ( adição, edição, exclusão ) dispara o cálculo do subtotal e custo total
    function calculaSubtotalCustotal() {
        var custoaux, precoaux;
        var custototal = 0;
        var precototal = 0;
        var $subtot = $('#sub_total');
        var $custotot = $('#custo_total');

        if ( $("#itensOrcamento tbody").length > 0 ) {
    
            $("#itensOrcamento tbody tr").each(function () {
                custoaux = 0;
                precoaux = 0;

                custoaux = $(this).closest('tr').children('td:eq(11)').text();
                custoaux = floatParaPadraoInternacional(custoaux);
                custoaux = parseFloat(custoaux);
                custototal = custototal + custoaux;

                precoaux = $(this).closest('tr').children('td:eq(12)').text();
                precoaux = floatParaPadraoInternacional(precoaux);
                precoaux = parseFloat(precoaux);
                precototal = precototal + precoaux;
               
            });

            precototal = parseFloat(precototal);
            precototal = floatParaPadraoBrasileiro(precototal);
            
            custototal = parseFloat(custototal);
            custototal = floatParaPadraoBrasileiro(custototal);

            $custotot.val(custototal);
            $subtot.val(precototal); 
    
        }else{
            
            $custotot.val('0,00');
            $subtot.val('0,00');    
        }
    };
});    