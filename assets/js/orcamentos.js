$(function() {

  //
  // Variável global que vai ser usada para guardar o valor do total de material e valor total do subitem do orçamento
  //

  let valorTotalSubitem, custoTotalSubitem, quantTotalMaterial;
  
  //
  // Inicializa os inputs da página - parte do orçamento
  //

  $('#motivo_desistencia')
    .parent()
    .parent('[class^=col-]')
      .addClass('d-none col-lg-12');

  $('#status, #custo_total, #sub_total, #valor_total, #custo_deslocamento, #desconto')
    .attr('readonly', 'readonly');

  $('#titulo_orcamento')
    .attr('placeholder', 'Nome - Trabalho...');

  $('#data_emissao')
    .val(dataAtual())
    .datepicker('update');

  $('#data_validade')
    .val(proximoDiaUtil($('#data_emissao').val(), 15))
    .datepicker('update');

  $('#data_retorno')
    .val(proximoDiaUtil(dataAtual(), 3))
    .datepicker('update');

  //
  // Tipo Material
  //

  let $tipoMaterialBody =  $('#tipo_material').parent('.form-group');

  $tipoMaterialBody.find('#tipo_material').remove();

  $tipoMaterialBody.append(`
    <div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="tipo_material" id="tipo_material1" value="principal" checked>
        <label class="form-check-label" for="tipo_material1">Principal</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="tipo_material" id="tipo_material2" value="alternativo">
        <label class="form-check-label" for="tipo_material2">Alternativo</label>
      </div>
    </div>
  `);

  toggleTipoMaterial();

  //
  // Inicializa os inputs da pagina - parte de itens do orçamento
  //

  $('#quant_usada')
    .attr('disabled', 'disabled');
  
  $('#custo_tot_subitem')
    .attr('disabled', 'disabled');

  $('#unidade')
    .attr('disabled', 'disabled');

  //
  // Ajax para pegar informacoes da tabela de parametros
  //

  $.ajax({
    url: baselink + '/ajax/buscaParametrosMaterial',
    type: 'POST',
    data: {
      tabela: 'parametros'
    },
    dataType: 'json',
    success: function(data) {
      var bocarolo, margem, segop;
      if (data['tamanho_boca_rolo']) {
        bocarolo = floatParaPadraoInternacional(data['tamanho_boca_rolo']);
        $('#unidade').attr('data-bocarolo', bocarolo);
      }
      if (data['margem_erro_material']) {
        margem = floatParaPadraoInternacional(data['margem_erro_material']);
        $('#unidade').attr('data-margemerro', margem);
      }
      if (data['taxa_seg_op']) {
        segop = floatParaPadraoInternacional(data['taxa_seg_op']);
        $('#preco_tot_subitem').attr('data-seg_op', segop);
      }
      if (data['custo_deslocamento']) {
        custodesloc = floatParaPadraoInternacional(data['custo_deslocamento']);
        $('#custo_deslocamento').attr('data-custodesloc', custodesloc);

        console.log('chamada valorTotal() 1');
        valorTotal();
      }
    }
  });

  //
  //
  // SELECT tipo_servico_produto
  //
  //
  //

  // coloca as opções de produtos/serviços
  let htmlTipoServicoProduto = `
    <option value="produtos" selected>Produtos</option>
    <option value="servicos">Serviços</option>
    <option value="servicoscomplementares">Serviços Complementares</option>
  `;

  $('#tipo_servico_produto')
    .append(htmlTipoServicoProduto)
    .on('change', function() {

      changeTipoServicoProduto();
      toggleTipoMaterial();

      $('#unidade, #custo_tot_subitem, #preco_tot_subitem')
        .removeClass('is-valid is-invalid')
        .val('');

    });

  //
  //
  // INPUT data_emissao
  //
  //
  //

  $("#data_emissao").on("change blur", function() {
    if ($("#data_emissao").val() != "") {
      $("#data_validade")
        .val(proximoDiaUtil($("#data_emissao").val(), 15))
        .datepicker("update")
        .blur();
      $("#data_retorno")
        .val(proximoDiaUtil($("#data_emissao").val(), 3))
        .datepicker("update")
        .blur();
    }
  });

  //
  //
  // INPUT data_validade
  //
  //
  //

  $("#data_validade").on("change blur", function() {
    if ($("#data_validade").val() != "") {
      if ($("#data_emissao").val() != "") {
        var dtEmis, dtValid;
        dtEmis = $("#data_emissao").val();
        dtEmis = dtEmis.split("/");
        dtEmis = parseInt(dtEmis[2] + dtEmis[1] + dtEmis[0]);

        dtValid = $("#data_validade").val();
        dtValid = dtValid.split("/");
        dtValid = parseInt(dtValid[2] + dtValid[1] + dtValid[0]);

        if (dtValid < dtEmis) {
          alert(
            "A data de validade não pode ser maior do que a data de emissão."
          );
          $("#data_validade").val("");
          $("#data_emissao").focus();
        }
      } else {
        alert("Preencha a Data de Emissão.");
        $("#data_validade").val("");
        $("#data_emissao").focus();
      }
    }
  });

  //
  //
  // INPUT data_retorno
  //
  //
  //

  $("#data_retorno").on("change blur", function() {
    if ($("#data_retorno").val() != "") {
      if ($("#data_emissao").val() != "") {
        var dtEmis, dtRetor;
        dtEmis = $("#data_emissao").val();
        dtEmis = dtEmis.split("/");
        dtEmis = parseInt(dtEmis[2] + dtEmis[1] + dtEmis[0]);

        dtRetor = $("#data_retorno").val();
        dtRetor = dtRetor.split("/");
        dtRetor = parseInt(dtRetor[2] + dtRetor[1] + dtRetor[0]);

        if (dtRetor < dtEmis) {
          alert(
            "A data de retorno não pode ser maior do que a data de emissão."
          );
          $("#data_retorno").val("");
          $("#data_emissao").focus();
        }
      }
    }
  });

  //
  //
  // INPUT unidade
  //
  //
  //

  $("#unidade").on("change blur", function() {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT quant
  //
  //
  //

  $("#quant").on("change blur", function() {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT largura
  //
  //
  //

  $("#largura").on("change blur", function() {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT comprimento
  //
  //
  //

  $("#comprimento").on("change blur", function() {
    calculaQuantidadeUsadaMaterial();
    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT preco_tot_subitem
  //
  //
  //

  $("#preco_tot_subitem").on("change", function() {
    var $custo = $("#custo_tot_subitem");
    var $preco = $("#preco_tot_subitem");
    var $material = $("#material_servico");
    var tx_segop, precoaux;

    tx_segop = parseFloat(
      parseFloat($("#preco_tot_subitem").attr("data-seg_op")) / parseFloat(100)
    );

    if ($("#preco_tot_subitem").attr("data-seg_op") != undefined) {
      if ($custo.val() != "" && $preco.val() == "") {
        precoaux = parseFloat(
          parseFloat($material.attr("data-preco")) *
            parseFloat(parseFloat(1) + tx_segop)
        );
        $preco.val(floatParaPadraoBrasileiro(precoaux));
        return;
      }

      if ($custo.val() != "" && $preco.val() != "") {
        if (
          parseFloat(floatParaPadraoInternacional($custo.val())) >=
          parseFloat(floatParaPadraoInternacional($preco.val()))
        ) {
          precoaux = parseFloat(
            parseFloat($material.attr("data-preco")) *
              parseFloat(parseFloat(1) + tx_segop)
          );
          $preco.val(floatParaPadraoBrasileiro(precoaux));
        } else {
          precoaux = parseFloat(
            parseFloat(floatParaPadraoInternacional($preco.val())) *
              parseFloat(parseFloat(1) + tx_segop)
          );
          $preco.val(floatParaPadraoBrasileiro(precoaux));
        }
      }
    }

    calculaMaterialCustoPreco();
  });

  //
  //
  // INPUT material_servico
  //
  //
  //

  $('#material_servico')
    .on('change blur', function() {

      let $this = $(this),
        $unidade = $('#unidade'),
        $custo_tot = $('[name="custo_tot_subitem"]'),
        $preco_tot = $('[name="preco_tot_subitem"]');

      if ($this.val()) {

        $unidade
          .val('')
          .removeClass('is-valid is-invalid')
          .blur();

        $custo_tot
          .val('')
          .removeClass('is-valid is-invalid')
          .blur();

        $preco_tot
          .val('')
          .removeClass('is-valid is-invalid')
          .blur();

      }

    })
    .change()
    .blur();

  ////////////////////////// COMENTADO BEM ATÉ AQUI ////////////////////////////////

  $(document)
    .ready(function() {
      let $pfPj = $('[name="pf_pj"]');
      $.ajax({
        url: baselink + "/ajax/getRelacionalDropdownOrcamentos",
        type: "POST",
        data: {
          tabela: "clientes"
        },
        dataType: "json",
        success: function(data) {

          // JSON Response - Ordem Alfabética
          data.sort(function(a, b) {
            a = a.nome.toLowerCase();
            b = b.nome.toLowerCase();
            return a < b ? -1 : a > b ? 1 : 0;
          });

          var htmlDropdown = "";

          data.forEach(element => {
            htmlDropdown += `
              <div class="list-group-item list-group-item-action relacional-dropdown-element"
                data-id="` + element["id"] + `"
                data-tipo_pessoa="` + element["tipo_pessoa"] + `"
                data-telefone="` + element["telefone"] + `"
                data-celular="` + element["celular"] + `"
                data-email="` + element["email"] + `"
                data-comoconheceu="` + element["comoconheceu"] + `"
                data-observacao="` + element["observacao"] + `"
              >` + element["nome"] + `</div>
            `;
          });

          $(
            "#esquerda .relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper"
          ).html(htmlDropdown);

          if (!$pfPj.attr('data-anterior')) {
            $pfPj.change();
          }
          $('[name="tipo_servico_produto"]').change();
        }
      });
    })
    .on("click", '[name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element', function() {

      var $this = $(this),
        $esquerda = $("#esquerda");

      $esquerda.find("[name=faturado_para]").val($this.text());

      $esquerda.find("[name=telefone]").val($this.attr("data-telefone"));

      $esquerda.find("[name=celular]").val($this.attr("data-celular"));

      $esquerda.find("[name=email]").val($this.attr("data-email"));
      
      $esquerda.find("[name=id_cliente]").val($this.attr("data-id"));

      $esquerda
        .find("[name=como_conheceu]")
        .val($this.attr("data-comoconheceu"));

      if ($this.attr("data-observacao")) {

        $("#collapseObsCliente").collapse("hide");

        $esquerda.find(".observacao_cliente_wrapper").removeClass("d-none");

        $esquerda
          .find("#observacao_cliente[name=observacao]")
          .val($this.attr("data-observacao"));

      } else {

        $esquerda.find(".observacao_cliente_wrapper").addClass("d-none");

      }
    })
    .on('click', '[name="material_servico"] ~ .relacional-dropdown .relacional-dropdown-element', function() {

        let $this = $(this),
          $material = $('[name="material_servico"]'),
          $unidade = $('[name="unidade"]'),
          $custo = $('[name="custo_tot_subitem"]'),
          $preco = $('[name="preco_tot_subitem"]'),
          $largura = $('[name="largura"]'),
          $comprimento = $('[name="comprimento"]'),
          data_tabela = $this.attr("data-tabela"),
          data_unidade = $this.attr("data-unidade"),
          data_preco = $this.attr("data-preco"),
          data_custo = $this.attr("data-custo"),
          unidade = data_tabela != "servicos" ? data_unidade : "M²";

        $this.siblings(".relacional-dropdown-element").removeClass("active");
        $this.addClass("active");

        $preco.val(floatParaPadraoBrasileiro(data_preco)).change();

        $custo.val(floatParaPadraoBrasileiro(data_custo)).change();

        $preco.val(floatParaPadraoBrasileiro(data_preco)).change();

        $unidade.val(unidade).change();

        $material
          .attr("data-tabela", data_tabela)
          .attr("data-unidade", unidade)
          .attr("data-preco", data_preco)
          .attr("data-custo", data_custo);

        toggleTipoMaterial($unidade.val());

        if ($unidade.val() == "ML" || $unidade.val() == "M²") {
          
          $largura
            .removeAttr("disabled")
            .removeClass("is-valid is-invalid");

          $comprimento
            .removeAttr("disabled")
            .removeClass("is-valid is-invalid");

        } else {
          
          $largura
            .val("")
            .blur()
            .attr("disabled", "disabled")
            .removeClass("is-valid is-invalid");

          $comprimento
            .val("")
            .blur()
            .attr("disabled", "disabled")
            .removeClass("is-valid is-invalid");

        }
    })
    .on("change", '[name="pf_pj"]', function() {

      if ($(this).is(":checked")) {

        let $radio = $(this),
          $elements = $('#esquerda [name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element'),
          $filtereds = $elements.filter(function() {
            return $(this).attr("data-tipo_pessoa") == $radio.attr("id");
          });

        $elements.hide();
        $filtereds.show();

        $('.observacao_cliente_wrapper').addClass('d-none');

        $('[name="nome_cliente"], [name=faturado_para], [name=telefone], [name=celular], [name=email], #observacao_cliente')
          .removeClass('is-valid is-invalid')
          .val('');

        if ($radio.attr("id") == "pj") {

          $("[name=telefone]")
            .attr("required", "required")
            .siblings("label")
            .addClass("font-weight-bold")
            .find("> i")
            .removeClass('d-none')
            .addClass('d-inline-block');

          $("[name=celular]")
            .removeAttr("required", "required")
            .siblings("label")
            .removeClass("font-weight-bold")
            .find("> i")
            .hide();

        } else {

          $("[name=celular]")
            .attr("required", "required")
            .siblings("label")
            .addClass("font-weight-bold")
            .find("> i")
            .show();

          $("[name=telefone]")
            .removeAttr("required", "required")
            .siblings("label")
            .removeClass("font-weight-bold")
            .find("> i")
            .addClass('d-none')
            .removeClass('d-inline-block');

        }

      }

    });

  $("#como_conheceu")
    .on("change", function() {
      var $this = $(this);

      $(".column-quem-indicou").remove();

      if (!$this.val() && $this.attr("data-anterior")) {
        if ($this.attr("data-anterior").startsWith("Contato - ")) {
          $this.val("Contato");
        }
      }

      if ($this.val()) {

        if (
          $this.val().toLocaleLowerCase() == "contato" ||
          $this.val().startsWith("Contato - ")
        ) {
          $this.parent('.form-group').parent("[class^=col]").after(`
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

          var $quemIndicou = $("#quem_indicou");

          $quemIndicou
            .val($this.attr("data-anterior").replace("Contato - ", ""))
            .blur();

          var valueQuemIndicou = $quemIndicou.val(),
            $comoConhec = $("#como_conheceu"),
            textOptSelc = $comoConhec.children("option:selected").text(),
            camposConcat = textOptSelc + " - " + valueQuemIndicou;

          if (valueQuemIndicou) {
            $comoConhec
              .children("option:contains(" + textOptSelc + ")")
              .attr("value", camposConcat);
          }
        } else {
          $this.children('option:contains("Contato")').attr("value", "Contato");
        }
      }
    })
    .change();

  $(document)
    .on("blur", "#quem_indicou", function() {
      var $this = $(this),
        value = $this.val(),
        $comoConhec = $("#como_conheceu"),
        textOptSelc = $comoConhec.children("option:selected").text(),
        camposConcat = textOptSelc + " - " + value;

      $this.removeClass("is-valid is-invalid");
      $this[0].setCustomValidity("");

      if (value) {
        $comoConhec
          .children("option:contains(" + textOptSelc + ")")
          .attr("value", camposConcat);

        $this.addClass("is-valid");
        $this[0].setCustomValidity("");
      }
    })
    .on("submit", "#form-principalModalOrcamentos", event => {
      event.preventDefault();

      let $form = $("#form-principalModalOrcamentos");

      if ($form[0].checkValidity()) {
        $.ajax({
          url: baselink + "/ajax/adicionarCliente",
          type: "POST",
          data: $form.serialize(),
          dataType: "json",
          success: data => {
            $form.removeClass("was-validated").trigger("reset");

            $form
              .find(".is-valid, .is-invalid")
              .removeClass("is-valid is-invalid");

            aprovarOrcamento();

            $("#modalCadastrarCliente").modal("hide");

            Toast({ message: data.mensagem, class: data.class });
          }
        });
      }
    });

  $("#modalCadastrarCliente").on("show.bs.modal", function(e) {

    let $formClienteModal = $("#form-principalModalOrcamentos"),
      $formClienteEsquerda = $("#esquerda");

    $formClienteModal
      .find("#" + $formClienteEsquerda.find("[name=pf_pj]:checked").attr("id"))
      .prop("checked", true)
      .change();

    // Nome
    $formClienteModal
      .find("[name=nome]")
      .val($formClienteEsquerda.find("[name=nome_cliente]").val());

    // Telefone
    $formClienteModal
      .find("[name=telefone]")
      .val($formClienteEsquerda.find("[name=telefone]").val());

    // Celular
    $formClienteModal
      .find("[name=celular]")
      .val($formClienteEsquerda.find("[name=celular]").val());

    // Email
    $formClienteModal
      .find("[name=email]")
      .val($formClienteEsquerda.find("[name=email]").val());

    // Como Conheceu
    $formClienteModal
      .find("[name=comoconheceu]")
      .val($formClienteEsquerda.find("[name=como_conheceu]").val());
  });

  $('#itensOrcamento').on('DOMNodeInserted DOMNodeRemoved', function() {
    console.log('chamada valorTotal() 2');
    valorTotal();
  });

  $('#nome_cliente').on('blur change', function() {
    
    let $this = $(this),
      $elements = $this.siblings('.relacional-dropdown').find('.relacional-dropdown-element');

    let $filtereds = $elements.filter(function() {
      if ($this.val() && $(this).text()) {
        return $this.val().toLowerCase() == $(this).text().toLowerCase();
      }
    });

    // Se não encontrar nenhum cliente com mesmo nome, tira o valor do id_cliente
    // Dizendo para o software que não tem nenhum cliente cadastrado naquele orçamento
    if (!$filtereds.length) {
      $('[name=id_cliente]').val('0');
    }

    // Toda vez que usuario sai do campo nome do cliente
    // Seta o valor desse campo no campo faturado_para
    // Mantendo sempre os dois iguais, se o usuario quiser pode alter faturada_para manualmente
    $('[name=faturado_para]').val($this.val());

  });

  $('#aprovar-orcamento').click(function() {
    if ($('[name=id_cliente]').val() != '0') {
      // Cliente já é cadastrado
      aprovarOrcamento();
    } else {
      // Necessário cadastrar o cliente antes de aprovar um orçamento
      $('#modalCadastrarCliente').modal('show');
    }
  });

  $('#embaixo input').on('change', function() {
    console.log('chamada valorTotal() 3');
    valorTotal();
  });

  // $('#checkCancelar').click(() => $('#chk_cancelamentoOrc').click());

  $('#chk_cancelamentoOrc').click(function(){

    let $motivoDesistencia = $('#motivo_desistencia');

    $motivoDesistencia.val('');

    if( $(this).is(':checked') ){

      $('#col-cancelar').removeClass('d-none');
      $('#col-aprovar').addClass('d-none');

      $motivoDesistencia.parent().parent().removeClass('d-none');
      $motivoDesistencia.focus();

    }else{

      $('#col-cancelar').addClass('d-none');
      $('#col-aprovar').removeClass('d-none');

      $motivoDesistencia.parent().parent().addClass('d-none');
    }

  });

  $('#btn_cancelamentoOrc').click(function(){

    var $motivoCancela = $('#motivo_desistencia');

    if($motivoCancela.val() == ''){
      alert('Preencha o Motivo da Desistência.');
      $motivoCancela.focus();
      return;
    }

    if (confirm('Tem Certeza que quer Cancelar esse Orçamento?') ==  true && $motivoCancela.val() != ''){

        var idOrcamento = $('#form-principal').attr('data-id-orcamento');
        var motivo = $motivoCancela.val()+'a';

        $.ajax({
            url: baselink + "/ajax/cancelarOrcamento",
            type: "POST",
            data: {
              motivo_desistencia: motivo,
              id: idOrcamento
            },
            dataType: "json",
            success: data => {
              if(data == true){
                // deu certo o cancelamento
                // vai ser redirecionado pro browser, não precisa fazer nada
                window.location.href = baselink + "/orcamentos";
              }else{
                alert('Não foi possível realizar o cancelamento.\nTente Novamente.');
                return;
              }
            }      
        });

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
  valortotal = number_format(valortotal, 2, ",", ".");
  return valortotal;
}

function floatParaPadraoInternacional(valor) {
  var valortotal = valor;
  valortotal = valortotal
    .replace(".", "")
    .replace(".", "")
    .replace(".", "")
    .replace(".", "");
  valortotal = valortotal.replace(",", ".");
  valortotal = parseFloat(valortotal).toFixed(2);
  return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
  numero = (numero + "").replace(/[^0-9+\-Ee.]/g, "");
  var n = !isFinite(+numero) ? 0 : +numero,
    prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
    sep = typeof milhar_separador === "undefined" ? "," : milhar_separador,
    dec = typeof decimal_separador === "undefined" ? "." : decimal_separador,
    s = "",
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return "" + Math.round(n * k) / k;
    };

  // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

function calculaMaterialCustoPreco() {
  var $qtd = $("#quant");
  var $unidade = $("#unidade");
  var $custo = $("#custo_tot_subitem");
  var $preco = $("#preco_tot_subitem");
  var $qtdUsada = $("#quant_usada");
  var custoaux, precoaux;

  if (
    $qtd.val() != "" &&
    $unidade.val() != "" &&
    $custo.val() != "" &&
    $preco.val() != ""
  ) {
    if ($qtdUsada.val() == "") {
      //material ou serviço que não tem unidade em m², o que interessa é o preço e a quantidade
      quantTotalMaterial = parseFloat(0);

      custoaux = parseFloat(
        parseFloat($qtd.val()) *
          parseFloat(floatParaPadraoInternacional($custo.val()))
      );
      custoTotalSubitem = floatParaPadraoBrasileiro(custoaux);

      precoaux = parseFloat(
        parseFloat($qtd.val()) *
          parseFloat(floatParaPadraoInternacional($preco.val()))
      );
      valorTotalSubitem = floatParaPadraoBrasileiro(precoaux);
    } else {
      //material ou serviço que a unidade é m², o que interessa é o preço e a quantidade e quantUsada
      quantTotalMaterial = parseFloat(
        parseFloat($qtd.val()) *
          parseFloat(floatParaPadraoInternacional($qtdUsada.val())).toFixed(0)
      );

      custoaux = parseFloat(
        quantTotalMaterial *
          parseFloat(floatParaPadraoInternacional($custo.val()))
      );
      custoTotalSubitem = floatParaPadraoBrasileiro(custoaux);

      precoaux = parseFloat(
        quantTotalMaterial *
          parseFloat(floatParaPadraoInternacional($preco.val()))
      );
      valorTotalSubitem = floatParaPadraoBrasileiro(precoaux);
    }
  } else {
    quantTotalMaterial = parseFloat(0);
    custoTotalSubitem = parseFloat(0);
    valorTotalSubitem = parseFloat(0);
  }

  $custo.attr("data-totalsubitem", custoTotalSubitem);
  $preco.attr("data-totalsubitem", valorTotalSubitem);
}

function calculaQuantidadeUsadaMaterial() {

  // recebe os objetos (campos)

  var $unidade = $("#unidade");
  var $largura = $("#largura");
  var $comprimento = $("#comprimento");
  var $qtdUsada = $("#quant_usada");
  var bocaRolo = parseFloat($unidade.attr("data-bocarolo"));
  var margemErro = parseFloat($unidade.attr("data-margemerro"));
  var larg, comp, quantUs, quantUsLarg, quantUsComp;

  if ($unidade.val() == "ML") {

    if ($largura.val() != "" && $comprimento.val() != "") {

      larg = parseFloat(
        parseFloat(floatParaPadraoInternacional($largura.val())) *
          parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      comp = parseFloat(
        parseFloat(floatParaPadraoInternacional($comprimento.val())) *
          parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      if (larg > bocaRolo && comp > bocaRolo) {

        quantUsLarg = parseFloat(
          parseFloat(Math.ceil(parseFloat(larg / bocaRolo))) *
            parseFloat(Math.ceil(comp))
        );

        quantUsComp = parseFloat(
          parseFloat(Math.ceil(parseFloat(comp / bocaRolo))) *
            parseFloat(Math.ceil(larg))
        );

        quantUs = Math.min(quantUsLarg, quantUsComp);

        quantUs = floatParaPadraoBrasileiro(quantUs);
        $qtdUsada.val(quantUs);

      } else if (larg < bocaRolo && comp < bocaRolo) {

        quantUs = floatParaPadraoBrasileiro(parseFloat(1));
        $qtdUsada.val(quantUs);

      } else {

        quantUs = parseFloat(Math.ceil(parseFloat(Math.max(larg, comp))));
        quantUs = floatParaPadraoBrasileiro(quantUs);
        $qtdUsada.val(quantUs);

      }
    } else {

      $qtdUsada.val("");

    }
  } else if ($unidade.val() == "M²") {

    if ($largura.val() != "" && $comprimento.val() != "") {

      larg = parseFloat(
        parseFloat(floatParaPadraoInternacional($largura.val())) *
          parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );
      
      comp = parseFloat(
        parseFloat(floatParaPadraoInternacional($comprimento.val())) *
          parseFloat(parseFloat(1) + parseFloat(margemErro / 100))
      );

      quantUs = parseFloat(larg * comp).toFixed(2);
      quantUs = floatParaPadraoBrasileiro(quantUs);
      $qtdUsada.val(quantUs);

    } else {

      $qtdUsada.val('');

    }
  }
}

function toggleTipoMaterial(unidade) {

  let $tipoMaterial = $('[name="tipo_material"]'),
    $tipoProdutoServico = $('[name=tipo_servico_produto]'),
    $tipoMaterialServico = $('[name=material_servico]'),
    $colTipoProdutoServico = $tipoProdutoServico.parents('.form-group').parent(),
    $colTipoMaterial = $tipoMaterial.parents('.form-group').parent(),
    $colTipoServico = $tipoMaterialServico.parents('.form-group').parent();

  $colTipoMaterial.addClass('d-none');
  $colTipoProdutoServico.removeClass('col-xl-4').addClass('col-xl-6');
  $colTipoServico.removeClass('col-xl-4').addClass('col-xl-6');

  if ($tipoProdutoServico.val() && $tipoProdutoServico.val().toLowerCase() == 'produtos') {
    
    if (unidade && unidade.toLowerCase() == 'ml') {
  
      $colTipoMaterial.removeClass('d-none');
      $colTipoProdutoServico.removeClass('col-xl-6').addClass('col-xl-4');
      $colTipoServico.removeClass('col-xl-6').addClass('col-xl-4');
      
    }

  }

}

function changeTipoServicoProduto(setValueSuccess) {

  let $this = $('#tipo_servico_produto'),
    $material = $('[name=material_servico]'),
    val = $this.val();

  $.ajax({
    url: baselink + '/ajax/getRelacionalDropdownOrcamentos',
    type: 'POST',
    data: {
      tabela: val
    },
    dataType: 'json',
    success: function(data) {

      // JSON Response - Ordem Alfabética
      data.sort(function(a, b) {
        a = a.descricao.toLowerCase();
        b = b.descricao.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      });

      let $materialDropdown = $material.siblings('.dropdown-menu').find('.dropdown-menu-wrapper'),
        htmlDropdown = '';

      data.forEach(element => {
        htmlDropdown += `
          <div 
            class="list-group-item list-group-item-action relacional-dropdown-element" 
            data-tabela="` + val + `"
            data-custo="` + element["custo"] + `"
            data-preco="` + element["preco_venda"] + `"
            data-unidade="` + element["unidade"] + `"
          >` + element["descricao"] + `</div>
        `;
      });

      $material
        .removeClass('is-valid is-invalid')
        .removeAttr('data-tabela data-custo data-preco data-unidade')
        .val(setValueSuccess ? setValueSuccess : '');

      if (val == 'produtos') {
        $materialDropdown.html(htmlDropdown);
      } else if (val == 'servicos') {
        $materialDropdown.html(htmlDropdown);
      } else {
        $materialDropdown.html(htmlDropdown);
      }

      $materialDropdown
        .find('.relacional-dropdown-element.active')
        .removeClass('active');

      if (setValueSuccess) {
        
        $materialDropdown
          .find('.relacional-dropdown-element:contains(' + setValueSuccess + ')')
          .addClass('active');

      }

    }
  });

}

function valorTotal() {

  console.log('\n\nvalorTotal() \n------\n')

  let somaTotal = 0;
  $('#itensOrcamento tbody tr').each(function() {
    
    let $this = $(this),
      tdPrecoTotal = $this.find('td:eq(12)').text(),
      tdTipoMaterial = $this.find('td:eq(9)').text(),
      precoTotalFormatado = parseFloat(floatParaPadraoInternacional(tdPrecoTotal));

    if (tdTipoMaterial != 'alternativo') {
      somaTotal += precoTotalFormatado;
    }
    
  });

  $('[name="valor_total"]').val(floatParaPadraoBrasileiro(somaTotal));

  calculaCustoDeslocamento();
  calculaDesconto();
  resumoItens();
}

function calculaCustoDeslocamento() {

  let $deslocamentoKm = $('#deslocamento_km'),
    $deslocamentoCusto = $('#custo_deslocamento'),
    $valorTotal = $('#valor_total'),
    $subTotal = $('#sub_total'),
    custoDeslocamentoParam = $deslocamentoCusto.attr('data-custodesloc'),
    custoDeslocamentoParamFormated = parseFloat(custoDeslocamentoParam),
    valorDeslocamento = $deslocamentoKm.val() || 0,
    valorDeslocamentoFormated = parseFloat(valorDeslocamento);

  let multiplicacaoCustoDesloc = valorDeslocamentoFormated * custoDeslocamentoParamFormated;

  $deslocamentoCusto.val(floatParaPadraoBrasileiro(multiplicacaoCustoDesloc));

  // Acrescentar valor de deslocamento ao valor total
  if ($subTotal.val()) {

    let valorTotal = $subTotal.val(),
      valorTotalFormated = parseFloat(floatParaPadraoInternacional(valorTotal)),
      somaValorTotalCustoDesloc = multiplicacaoCustoDesloc + valorTotalFormated;

    $valorTotal.val(floatParaPadraoBrasileiro(somaValorTotalCustoDesloc.toFixed(2)));

  }

}

function calculaDesconto() {

  let $descontoPorcent = $('#desconto_porcent'),
    $valorTotal = $('#valor_total'),
    $descontoReais = $('#desconto'),
    $custoTotal = $('#custo_total'),
    custoTotalFormated = parseFloat(floatParaPadraoInternacional($custoTotal.val()));

  if ($descontoPorcent.val()) {
    
    let descontoPorcent = parseFloat(floatParaPadraoInternacional($descontoPorcent.val())) / 100;

    if ($valorTotal.val()) {

      console.log('valor total', $valorTotal.val())
      console.log('custo total', $custoTotal.val())

      let valorTotal = parseFloat(floatParaPadraoInternacional($valorTotal.val())),
        totalDescontoReais = valorTotal * descontoPorcent,
        diferenca = valorTotal - totalDescontoReais;

      console.log('diferenca', diferenca);
      console.log('custoTotalFormated', custoTotalFormated);

      if (diferenca > custoTotalFormated) {
        
        $descontoReais.val(floatParaPadraoBrasileiro(totalDescontoReais.toFixed(2)));
  
        $valorTotal.val(floatParaPadraoBrasileiro(diferenca.toFixed(2)));

      } else if (diferenca == custoTotalFormated) {
        
        alert('O desconto dado faz o valor final ser igual custo total.');

        $descontoPorcent.val($descontoPorcent.attr('data-anterior') || '');

      } else {

        console.log('O desconto dado faz o valor final ser menor do que custo total.');
        
        $descontoPorcent.val($descontoPorcent.attr('data-anterior') || '');

      }

    }
  }
}

function resumoItens() {
  let $custo_tot = $('#custo_total'),
    $valorTotal = $('#valor_total');

  $('#resumoItensCustoTota').text($custo_tot.val());
  $('#resumoItensValorTotal').text($valorTotal.val());
}

function aprovarOrcamento() {

  let $id_cliente = $('[name=id_cliente]'),
    $id_orcamento = $('#form-principal'),
    $titulo_orcamento = $('[name=titulo_orcamento]'),
    $nome_razao_social = $('[name=nome_cliente]'),
    $vendedor = $('[name=funcionario]'),
    $custo_total = $('[name=custo_total]'),
    $valor_total = $('[name=valor_total]');

  let dadosParaEnviar = {
    id_cliente: $id_cliente.val(),
    id_orcamento: $id_orcamento.attr('data-id-orcamento'),
    data_aprovacao: dataAtual(),
    titulo_orcamento: $titulo_orcamento.val(),
    nome_razao_social: $nome_razao_social.val(),
    veiculo_usado: '',
    vendedor: $vendedor.val(),
    tec_responsavel: '',
    tec_auxiliar: '',
    data_inicio: '',
    data_fim: '',
    custo_total: $custo_total.val(),
    subtotal: $valor_total.val(),
    desconto_porcent: '0.00',
    desconto: '0.00',
    valor_final: $valor_total.val(),
    nro_nf: '',
    data_emissao_nf: '',
    data_revisao_1: '',
    data_revisao_2: '',
    data_revisao_3: '',
    status: 'Em Produção',
    observacao: '',
    motivo_cancelamento: ''
  };

  $.ajax({
    url: baselink + '/ajax/aprovarOrcamento',
    type: 'POST',
    data: dadosParaEnviar,
    dataType: 'json',
    success: function(data) {
      if (data.message[0] == '00000') {
        window.location.href = baselink + '/ordemservico/imprimir/' + data.id_ordemservico;
      }
    }
  });
}