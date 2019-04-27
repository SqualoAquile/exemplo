$(function() {
  
  var $tableItensOrcamento = $('#itensOrcamento'),
    lastInsertId = 0,
    botoes = `
      <td class="text-truncate">
        <a href="javascript:void(0)" class="editar-item btn btn-sm btn-primary">
          <i class="fas fa-edit"></i>
        </a>
        <a href="javascript:void(0)" class="excluir-item btn btn-sm btn-danger">
          <i class="fas fa-trash-alt"></i>
        </a>
      </td>
    `;

  // [Editar] Esse trecho de código abaixo serve para quando a pagina for carregada
  // Ler o campo hidden e montar a tabela com os itens daquele registro
  Itens().forEach(item => Popula(item));

  $('#camposOrc').submit(function (event) {

    event.preventDefault();

    var $form = $(this),
      $fields = $($form).find('.form-control'),
      $table = $('#itensOrcamento'),
      $trsTbodyTable = $table.find('tbody tr'),
      $cancelEdicao = $('#col-cancelar_edicao');

    if ($form[0].checkValidity() && !$form.find('.is-invalid').length) {

      let $descricaoItemForm = $form.find('#descricao_item'),
        $descricaoSubItemForm = $form.find('#descricao_subitem'),
        $materialServicoForm = $form.find('#material_servico'),
        $tipoMaterial = $('[name=tipo_material]:checked');

      let $elsFiltereds = $trsTbodyTable.filter(function() {
        
        let itemFilter = $(this).find('td:eq(1)'),
          subItemFilter = $(this).find('td:eq(2)'),
          materialServicoFilter = $(this).find('td:eq(8)');

        if (itemFilter && itemFilter.text() && $descricaoItemForm && $descricaoItemForm.val()) {
          if (itemFilter.text().toLowerCase() == $descricaoItemForm.val().toLowerCase()) {
            if (subItemFilter && subItemFilter.text() && $descricaoSubItemForm && $descricaoSubItemForm.val()) {
              if (subItemFilter.text().toLowerCase() == $descricaoSubItemForm.val().toLowerCase()) {
                if (materialServicoFilter && materialServicoFilter.text() && $materialServicoForm && $materialServicoForm.val()) {
                  if (materialServicoFilter.text().toLowerCase() == $materialServicoForm.val().toLowerCase()) {
                    return this;
                  }
                }
              }
            }
          }
        }
      });

      let $elsFilteredsByTipoProduto = $trsTbodyTable.filter(function() {
        
        let $itemFilterByTipo = $(this).find('td:eq(1)'),
          $subItemFilterByTipo = $(this).find('td:eq(2)'),
          $tipoMaterialFilterByTipo = $(this).find('td:eq(9)');

        if ($itemFilterByTipo.text() == $descricaoItemForm.val()) {
          if ($subItemFilterByTipo.text() == $descricaoSubItemForm.val()) {
            if ($tipoMaterial.is(':visible')) {
              if ($tipoMaterial.val() == $tipoMaterialFilterByTipo.text()) {
                return this;
              }
            }
          }
        }

      });

      $('.alert-danger').hide();

      if (!$elsFiltereds.length || ($table.attr('data-current-id') && $materialServicoForm.val() == $('#itensOrcamento tbody tr.disabled td:eq(8)').text())) {

        if (!$elsFilteredsByTipoProduto.length || ($table.attr('data-current-id') && $tipoMaterial.val() == $('#itensOrcamento tbody tr.disabled td:eq(9)').text())) {
        
          Save();

          // Limpar formulario
          $form.removeClass('was-validated');

          $fields
            .removeClass('is-valid is-invalid')
            .removeAttr('data-anterior');

          $form.find('#observacao_subitem').val('');

        } else {

          $cancelEdicao
            .after(alertDismissible('Só pode ter um item com material alternativo ou principal.'));

        }

      } else {

        $cancelEdicao
          .after(alertDismissible('Este item já foi adicionado para este grupo.'));

      }
        
    } else {
      $($form).addClass('was-validated');
    }

  });

  $('#direita .form-control, #direita [type="radio"]').change(function() {
    $('#direita .alert-danger').alert('close');
  });

  $(document)
    .on('click', '.editar-item', function() {
      Edit(this);
    })
    .on('click', '.excluir-item', function() {
      Delete(this);
    })
    .on('reset', '#camposOrc', function() {
      cancelarEdicao();
    });

  // Retorna um array de itens puxados do campo hidden com o atributo nome igual a itens
  function Itens() {
    let returnItens = [];
    if ($("[name=itens]") && $("[name=itens]").val().length) {
      let itens = $("[name=itens]")
        .val()
        .split("[");

      for (let i = 0; i < itens.length; i++) {
        let item = itens[i];
        if (item.length) {
          item = item.replace("]", "");
          let dadosItem = item.split(" * ");

          // Trecho de código para transformar para padrão Brasileiro novamente
          // Essa função é chamada só quando um orçamento estiver sendo editado
          let transformDadosItem = dadosItem.map(dadoItem => {
            let dadoItemAux = dadoItem;
            if (!isNaN(dadoItemAux) && dadoItemAux.toString().indexOf('.') != -1) {
              dadoItemAux = floatParaPadraoBrasileiro(dadoItemAux);
            }
            return dadoItemAux;
          });

          returnItens.push(transformDadosItem);
        }
      }
    }
    return returnItens;
  }

  // Escreve o html na tabela
  function Popula(values) {
    if (!values) return;

    var currentId = $tableItensOrcamento.attr("data-current-id"),
      tds = "";

    // Coloca a tag html TD em volta de cada valor vindo do form de itens
    values.forEach(
      value => (tds += `<td class="text-truncate">` + value + `</td>`)
    );

    if (!currentId) {
      // Se for undefined então o item está sendo criado

      // Auto incrementa os ID's dos itens
      lastInsertId += 1;

      $("#itensOrcamento tbody").prepend(
        '<tr data-id="' + lastInsertId + '">' + botoes + tds + "</tr>"
      );
    } else {
      // Caso tenha algum valor é por que o item está sendo editado

      $('#itensOrcamento tbody tr[data-id="' + currentId + '"]').html(
        botoes + tds
      );

      // Seta o data id como undefined para novos itens poderem ser cadastrados
      $tableItensOrcamento.removeAttr("data-current-id");

      $('#col-cancelar_edicao').addClass('d-none');

    }

    calculaSubtotalCustotal();
    agruparTabela();

  }

  function cancelarEdicao() {

    $tableItensOrcamento.removeAttr("data-current-id");
    $('#col-cancelar_edicao').addClass('d-none');
    $('#btn_incluir').text('Incluir');
    $('#camposOrc').removeClass('was-validated');

    let $trs = $tableItensOrcamento.find('tr.disabled');

    $trs.removeClass('disabled');
    $trs.find('.btn.disabled').removeClass('disabled');
    $('#direita .alert-danger').alert('close');

    $('[name="tipo_material"]').parents('.form-check').parent('.form-group').parent().addClass('d-none');
    toggleTipoMaterial()
    
  }

  // Pega as linhas da tabela auxiliar e manipula o hidden de itens
  function SetInput() {

    let content = "";

    $("#itensOrcamento tbody tr").each(function() {

        let par = $(this).closest("tr"),
          tdItem = par.children("td:nth-child(2)"),
          tdSubItem = par.children("td:nth-child(3)"),
          tdQuant = par.children("td:nth-child(4)"),
          tdLargura = par.children("td:nth-child(5)"),
          tdComprimento = par.children("td:nth-child(6)"),
          tdQuantUsada = par.children("td:nth-child(7)"),
          tdServicoProduto = par.children("td:nth-child(8)"),
          tdMaterialServico = par.children("td:nth-child(9)"),
          tdTipoMaterial = par.children("td:nth-child(10)"),
          tdUnidade = par.children("td:nth-child(11)"),
          tdCusto = par.children("td:nth-child(12)"),
          tdPreco = par.children("td:nth-child(13)"),
          tdObservacao = par.children("td:nth-child(14)"),
          quantidade = floatParaPadraoInternacional(tdQuant.text()),
          comprimento = floatParaPadraoInternacional(tdComprimento.text()),
          largura = floatParaPadraoInternacional(tdLargura.text()),
          custo = floatParaPadraoInternacional(tdCusto.text()),
          preco = floatParaPadraoInternacional(tdPreco.text()),
          quantidadeUsada = floatParaPadraoInternacional(tdQuantUsada.text());

        content += "[" + 
          tdItem.text() + " * " + 
          tdSubItem.text() + " * " + 
          quantidade + " * " + 
          largura + " * " + 
          comprimento + " * " + 
          quantidadeUsada + " * " + 
          tdServicoProduto.text() + " * " + 
          tdMaterialServico.text() + " * " + 
          tdTipoMaterial.text() + " * " + 
          tdUnidade.text() + " * " + 
          custo + " * " + 
          preco + " * " + 
          tdObservacao.text() + "]";

    });

    $("[name=itens]")
        .val(content)
        .attr("data-anterior-aux", content)
        .change();

  }

  // Delete item da tabela e do hidden
  function Delete(element) {
    
    let $tr = $(element).closest('tr');
    
    $tr.remove();

    transformarAlternativo($tr);
    SetInput();
    calculaSubtotalCustotal();
  }

  // Seta no form o item clicado para editar, desabilita os botoes de acões deste item e seta o id desse item
  // no form dos itens
  function Edit(el) {

    let $tipoServicoProduto = $("[name=tipo_servico_produto]"),
      $par = $(el).closest("tr"),
      $tbody = $par.parent('tbody'),
      tdItem = $par.children("td:nth-child(2)").text(),
      tdSubItem = $par.children("td:nth-child(3)").text(),
      tdQuant = $par.children("td:nth-child(4)").text(),
      tdLargura = $par.children("td:nth-child(5)").text(),
      tdComprimento = $par.children("td:nth-child(6)").text(),
      tdQuantUsada = $par.children("td:nth-child(7)").text(),
      tdServicoProduto = $par.children("td:nth-child(8)").text(),
      tdMaterialServico = $par.children("td:nth-child(9)").text(),
      tdTipoMaterial = $par.children("td:nth-child(10)").text(),
      tdUnidade = $par.children("td:nth-child(11)").text(),
      tdCusto = $par.children("td:nth-child(12)").text(),
      tdPreco = $par.children("td:nth-child(13)").text(),
      tdObservacao = $par.children("td:nth-child(14)").text(),
      custoUnit = 0,
      precoUnit = 0,
      quantAux = 0,
      quantUsadaAux = 0;

    if (tdUnidade == "ML" || tdUnidade == "M²") {
        
      quantUsadaAux = parseFloat(floatParaPadraoInternacional(tdQuantUsada));
      quantAux = parseFloat(floatParaPadraoInternacional(tdQuant));

      custoUnit = parseFloat(
        parseFloat(floatParaPadraoInternacional(tdCusto)) / quantUsadaAux
      );

      custoUnit = floatParaPadraoBrasileiro(
        parseFloat(custoUnit / quantAux).toFixed(2)
      );

      precoUnit = parseFloat(
        parseFloat(floatParaPadraoInternacional(tdPreco)) / quantUsadaAux
      );

      precoUnit = floatParaPadraoBrasileiro(
        parseFloat(precoUnit / quantAux).toFixed(2)
      );

    } else {

        quantAux = parseFloat(floatParaPadraoInternacional(tdQuant));

        custoUnit = parseFloat(
          parseFloat(floatParaPadraoInternacional(tdCusto)) / tdQuant
        );

        custoUnit = floatParaPadraoBrasileiro(parseFloat(custoUnit).toFixed(2));

        precoUnit = parseFloat(
          parseFloat(floatParaPadraoInternacional(tdPreco)) / tdQuant
        );
        precoUnit = floatParaPadraoBrasileiro(parseFloat(precoUnit).toFixed(2));

    }

    // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
    $tbody
      .find('tr.disabled,.btn.disabled')
        .removeClass('disabled');

    $par
      .addClass("disabled")
      .find(".btn")
        .addClass("disabled");

    $("input[name=descricao_item]")
      .val(tdItem)
      .attr("data-anterior", tdItem);

    $("input[name=descricao_subitem]")
      .val(tdSubItem)
      .attr("data-anterior", tdSubItem);

    $tipoServicoProduto
      .val(tdServicoProduto)
      .attr("data-anterior", tdServicoProduto);

    $("input[name=material_servico]")
      .val(tdMaterialServico)
      .attr("data-anterior", tdMaterialServico);

    if (tdTipoMaterial) {
      
      $("input[name=tipo_material][value=" + tdTipoMaterial + "]")
        .prop('checked', true)
        .attr("data-anterior", tdTipoMaterial);

    }

    $("input[name=unidade]")
      .val(tdUnidade)
      .attr("data-anterior", tdUnidade);

    $("input[name=custo_tot_subitem]")
      .val(custoUnit)
      .attr("data-anterior", custoUnit);

    precoUnit = parseFloat(floatParaPadraoInternacional(precoUnit)) / parseFloat(1.1);

    $("input[name=preco_tot_subitem]")
      .val(floatParaPadraoBrasileiro(precoUnit))
      .attr("data-preco_anterior", floatParaPadraoInternacional(floatParaPadraoBrasileiro(precoUnit)))
      .attr("data-anterior", floatParaPadraoBrasileiro(precoUnit));

    $("input[name=quant]")
      .val(tdQuant)
      .attr("data-anterior", tdQuant);

    $("input[name=largura]")
      .val(tdLargura)
      .attr("data-anterior", tdLargura);

    $("input[name=comprimento]")
      .val(tdComprimento)
      .attr("data-anterior", tdComprimento);

    $("input[name=quant_usada]")
      .val(tdQuantUsada)
      .attr("data-anterior", tdQuantUsada);

    $("input[name=observacao_subitem]")
      .val(tdObservacao)
      .attr("data-anterior", tdObservacao);

    $("#itensOrcamento")
      .attr("data-current-id", $par.attr("data-id"));

    $('#btn_incluir')
      .text('Salvar');

    $('#col-cancelar_edicao').removeClass('d-none');

    calculaSubtotalCustotal();
    changeTipoServicoProduto(tdMaterialServico);
    toggleTipoMaterial(tdUnidade);

    $("input[name=preco_tot_subitem]").change();
    
  }

  // Ao dar submit neste form, chama essa funcão que pega os dados do formula e Popula a tabela
  function Save() {

    let tipo_material_servico = $("[name=tipo_servico_produto]").val(),
      unidade = $("[name=unidade]").val(),
      tipo_material = $("[name=tipo_material]:checked").val();

    if ((tipo_material_servico && tipo_material_servico.toLowerCase() != 'produtos') || (unidade && unidade.toLowerCase() != 'ml')) {
      tipo_material = '';
    }

    Popula([
      $("[name=descricao_item]").val(),
      $("[name=descricao_subitem]").val(),
      $("[name=quant]").val(),
      $("[name=largura]").val(),
      $("[name=comprimento]").val(),
      $("[name=quant_usada]").val(),
      tipo_material_servico,
      $("[name=material_servico]").val(),
      tipo_material,
      unidade,
      $("[name=custo_tot_subitem]").attr("data-totalsubitem"),
      $("[name=preco_tot_subitem]").attr("data-totalsubitem"),
      $("[name=observacao_subitem]").val()
    ]);

    SetInput();
    calculaSubtotalCustotal();

    $('#btn_incluir')
      .text('Incluir');

  }

  // Toda movimentação que acontece na tabela ( adição, edição, exclusão ) dispara o cálculo do subtotal e custo total
  function calculaSubtotalCustotal() {

    var custoaux, precoaux;
    var custototal = 0;
    var precototal = 0;
    var $subtot = $("#sub_total");
    var $custotot = $("#custo_total");

    if ($("#itensOrcamento tbody tr").length > 0) {
      $("#itensOrcamento tbody tr").each(function() {

        let tdTipoMaterial = $(this).find('td:eq(9)').text();

        custoaux = 0;
        precoaux = 0;

        custoaux = $(this)
          .closest("tr")
          .children("td:eq(11)")
          .text();

        custoaux = floatParaPadraoInternacional(custoaux);
        custoaux = parseFloat(custoaux);

        precoaux = $(this)
          .closest("tr")
          .children("td:eq(12)")
          .text();

        precoaux = floatParaPadraoInternacional(precoaux);
        precoaux = parseFloat(precoaux);
        
        if (tdTipoMaterial != 'alternativo') {
          custototal = custototal + custoaux;
          precototal = precototal + precoaux;
        }

      });

      precototal = parseFloat(precototal);
      precototal = floatParaPadraoBrasileiro(precototal);

      custototal = parseFloat(custototal);
      custototal = floatParaPadraoBrasileiro(custototal);

      $custotot.val(custototal);
      $subtot.val(precototal);
    } else {
      $custotot.val("0,00");
      $subtot.val("0,00");

      $('#desconto_porcent, #desconto').val("0,00");

    }

    $('#itensOrcamento').trigger('alteracoes');

  }

  function agruparTabela() {
    
    let $trs = $('#itensOrcamento').find('tbody tr');

    $trs.each(function() {

      let $firstTr = $(this),
        $indexFirstTr = $firstTr.index(),
        $item = $firstTr.find('td:eq(1)'),
        $subitem = $firstTr.find('td:eq(2)');

      $trs.each(function() {
        
        let $otherTr = $(this),
          $indexOtherTr = $otherTr.index(),
          $itemComparar = $otherTr.find('td:eq(1)'),
          $subitemComparar = $otherTr.find('td:eq(2)');

        if ($indexFirstTr != $indexOtherTr) {
          
          if ($item.text() == $itemComparar.text()) {

            if ($subitem.text() == $subitemComparar.text()) {

              $otherTr.after($firstTr);

            }

          }
          
        }

      });

    });
  }

  function alertDismissible(texto, classes = 'tipo-material-repetido mt-3') {
    return `
      <div class="col-lg-12" style="order:100">
        <div class="alert alert-danger alert-dismissible fade show ` + classes + `" role="alert">
          ` + texto + `
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    `;
  }

  function transformarAlternativo($tr) {

    let $item = $tr.find('td:eq(1)'),
      $subitem = $tr.find('td:eq(2)'),
      $tipoMaterial = $tr.find('td:eq(9)');

    $('#itensOrcamento tbody tr').each(function() {

      let $itemFilterByTipo = $(this).find('td:eq(1)'),
        $subItemFilterByTipo = $(this).find('td:eq(2)'),
        $tipoMaterialFilterByTipo = $(this).find('td:eq(9)');

      if ($itemFilterByTipo.text() == $item.text()) {
        if ($subItemFilterByTipo.text() == $subitem.text()) {
          if ($tipoMaterial.text().toLowerCase() == 'principal' && $tipoMaterialFilterByTipo.text().toLowerCase() == 'alternativo') {
            $tipoMaterialFilterByTipo.text('principal');
          }
        }
      }

    });

  }
  
});
