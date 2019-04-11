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

        var $form = $(this),
            $fields = $($form).find('.form-control');

        // Desfocar os campos para validar
        // $fields.trigger('blur');

        if ($form[0].checkValidity() && !$form.find('.is-invalid').length) {

            Save();

            // Limpar formulario
            $form.trigger('reset');
            $form.removeClass('was-validated');
            
            $fields
                .removeClass('is-valid is-invalid')
                .removeAttr('data-anterior');

            $('[name=tipo_servico_produto]').trigger('change');

            // $fields.first().focus();
        } else {

            $($form).addClass('was-validated');

            // Da foco no primeiro campo com erro
            // $($form).find('.is-invalid, :invalid').first().focus();
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
            tdItem = $par.children("td:nth-child(2)").text();
            tdSubItem = $par.children("td:nth-child(3)").text()
            tdQuant = $par.children("td:nth-child(4)").text();
            tdLargura = $par.children("td:nth-child(5)").text();
            tdComprimento = $par.children("td:nth-child(6)").text();
            tdQuantUsada = $par.children("td:nth-child(7)").text();
            tdServicoProduto = $par.children("td:nth-child(8)").text();
            tdMaterialServico = $par.children("td:nth-child(9)").text();
            tdMaterialComplementar = $par.children("td:nth-child(10)").text();
            tdUnidade = $par.children("td:nth-child(11)").text();
            tdCusto = $par.children("td:nth-child(12)").text();
            tdPreco = $par.children("td:nth-child(13)").text();
            tdObservacao = $par.children("td:nth-child(14)").text(); 
            
            if(tdUnidade == 'ML' || tdUnidade == 'M²'){
                quantUsadaAux = parseFloat( floatParaPadraoInternacional( tdQuantUsada ) );
                quantAux = parseFloat( floatParaPadraoInternacional( tdQuant ) );
            
                custoUnit = parseFloat( parseFloat( floatParaPadraoInternacional( tdCusto )) / quantUsadaAux ); 
                custoUnit = floatParaPadraoBrasileiro( parseFloat( custoUnit / quantAux ).toFixed(2) ); 
                
                precoUnit = parseFloat( parseFloat( floatParaPadraoInternacional( tdPreco )) / quantUsadaAux ); 
                precoUnit = floatParaPadraoBrasileiro( parseFloat( precoUnit / quantAux ).toFixed(2) );

            }else{

                quantAux = parseFloat( floatParaPadraoInternacional( tdQuant ) );
            
                custoUnit = parseFloat( parseFloat( floatParaPadraoInternacional( tdCusto )) / tdQuant ); 
                custoUnit = floatParaPadraoBrasileiro( parseFloat( custoUnit ).toFixed(2) ); 
                
                precoUnit = parseFloat( parseFloat( floatParaPadraoInternacional( tdPreco )) / tdQuant ); 
                precoUnit = floatParaPadraoBrasileiro( parseFloat( precoUnit ).toFixed(2) );
            }
                

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        // $par.find('.btn').addClass('disabled');

        $('input[name=descricao_item]').val(tdItem).attr('data-anterior', tdItem);//.focus();
        $('input[name=descricao_subitem]').val(tdSubItem).attr('data-anterior', tdSubItem);
        $('[name=tipo_servico_produto]').val(tdServicoProduto ).attr('data-anterior', tdServicoProduto);
        $('input[name=material_servico]').val(tdMaterialServico).attr('data-anterior', tdMaterialServico);
        $('input[name=material_complementar]').val(tdMaterialComplementar).attr('data-anterior', tdMaterialComplementar);
        console.log()
        //.click();
        // var $selecionado;
        // var i = 1;
        // $('input[name=material_servico]').siblings('.relacional-dropdown').find(".relacional-dropdown-element").each(function() {
        //     if ($(this).text().toLowerCase() == tdMaterialServico.toLowerCase()){
        //         //$selecionado = i;
        //           $(this).click();
        //         // return $(this);    
        //     }
        //     i++;
            
        // });
        // $('input[name=material_servico]').click();
        // $('input[name=material_servico]').siblings('.relacional-dropdown').find(".relacional-dropdown-element:nth-child("+i+")").click()

        // $selecionado.trigger('click');

        //$('input[name=material_servico]').siblings('.relacional-dropdown').find(".relacional-dropdown-element:contains("+ tdMaterialServico + ")").trigger('click');
        // $('input[name=material_servico]').val(tdMaterialServico).attr('data-anterior', tdMaterialServico);
        // $('input[name=material_complementar]').val(tdMaterialComplementar).attr('data-anterior', tdMaterialComplementar);
        $('input[name=unidade]').val(tdUnidade).attr('data-anterior', tdUnidade);

        $('input[name=custo_tot_subitem]').val(custoUnit).attr('data-anterior', custoUnit);
        $('input[name=preco_tot_subitem]').val(precoUnit).attr('data-anterior', precoUnit);
        $('input[name=quant]').val(tdQuant).attr('data-anterior', tdQuant);
        $('input[name=largura]').val(tdLargura).attr('data-anterior', tdLargura);
        $('input[name=comprimento]').val(tdComprimento).attr('data-anterior', tdComprimento);
        $('input[name=quant_usada]').val(tdQuantUsada).attr('data-anterior', tdQuantUsada);
        $('input[name=observacao_subitem]').val(tdObservacao).attr('data-anterior', tdObservacao);

        // $('table#itensOrcamento thead tr[role=form]')
        //     .attr('data-current-id', $par.attr('data-id'))
        //     .find('.is-valid, .is-invalid')
        //     .removeClass('is-valid is-invalid');

        $('[name=tipo_servico_produto]').trigger('change');
        
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