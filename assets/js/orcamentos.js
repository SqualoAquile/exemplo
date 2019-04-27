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

          let dataPreco = $material.attr("data-preco");

          if (!$material.attr("data-preco")) {
            dataPreco = $preco.attr("data-preco_anterior");
          }

          precoaux = parseFloat(
            parseFloat(dataPreco) *
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

  $('#recontato').on('click', function() {
    if (confirm('Tem Certeza?')) {
      $.ajax({
        url: baselink + "/ajax/changeStatusOrcamento",
        type: "POST",
        data: {
          id_orcamento: $('#form-principal').attr('data-id-orcamento'),
          status: 'Recontato'
        },
        dataType: "json",
        success: function(data) {
          if (data) {
            window.location.href = baselink + "/orcamentos";
          }
        }
      });
    }
  });

  $('#duplica_orcamento').on('click', function() {
    if (confirm('Tem Certeza?')) {
      $.ajax({
        url: baselink + "/ajax/duplicarOrcamento",
        type: "POST",
        data: {
          id_orcamento: $('#form-principal').attr('data-id-orcamento')
        },
        dataType: "json",
        success: function(data) {
          if (data) {
            window.location.href = baselink + "/orcamentos";
          }
        }
      });
    }
  });

  ////////////////////////// COMENTADO BEM ATÉ AQUI ////////////////////////////////

  $(document)
    .ready(function() {
      
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
              <div class="list-group-item list-group-item-action relacional-dropdown-element-cliente"
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

          $("#esquerda .relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper").html(htmlDropdown);

        }
      });

      acoesByStatus();
      changeRequiredsPfPj();
      checarClienteCadastrado();
      $('[name="tipo_servico_produto"]').change();

    })
    .on("click", '[name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element-cliente', function() {

      var $this = $(this),
        $esquerda = $("#esquerda");

      $this.siblings(".relacional-dropdown-element-cliente").removeClass("active");
      $this.addClass("active");

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
          .find("#observacao_cliente[name=observacao_cliente]")
          .val($this.attr("data-observacao"));

      } else {

        $esquerda.find(".observacao_cliente_wrapper").addClass("d-none");

      }
    })
    .on('click', '[name="material_servico"] ~ .relacional-dropdown .relacional-dropdown-element-orcamento', function() {

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

      $this.siblings(".relacional-dropdown-element-orcamento").removeClass("active");
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

      // Ao trocar de produto sempre voltar para o radio de material principal marcado
      $("input:radio[name=tipo_material]:first").click();

      $('.tipo-material-repetido').remove();

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
    .on("change", '#form-principal [name="pf_pj"]', function() {

      let $this = $(this),
        $elements = $('#esquerda [name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element-cliente'),
        $filtereds = $elements.filter(function() {
          return $(this).attr("data-tipo_pessoa") == $this.attr("id");
        });

      $elements
        .removeClass('filtered')
        .hide();

      $filtereds
        .addClass('filtered')
        .show();

      $('.observacao_cliente_wrapper').addClass('d-none');

      $('[name="nome_cliente"], [name=faturado_para], [name=telefone], [name=celular], [name=email], #observacao_cliente')
        .removeClass('is-valid is-invalid')
        .val('');

      changeRequiredsPfPj();

    });

  // Eventos responsáveis pelo: Select Dropdown com Pesquisa
  // do campo Material Serviço dos Itens do Orçamento
  $(document)
    .on('click', '.relacional-dropdown-element-orcamento', function () {

      var $this = $(this),
        $input = $this.parents('.relacional-dropdown-wrapper').find('.relacional-dropdown-input-orcamento');

      $input
        .val($this.text())
        .change();
    })
    .on('keyup', '.relacional-dropdown-input-orcamento', function (event) {

      var code = event.keyCode || event.which;

      if (code == 27) {
        $(this)
          .dropdown('hide')
          .blur();
        return;
      }

      if (
        code == 91 || 
        code == 93 || 
        code == 92 || 
        code == 9 || 
        code == 13 || 
        code == 16 || 
        code == 17 || 
        code == 18 || 
        code == 19 || 
        code == 20 || 
        code == 33 || 
        code == 34 || 
        code == 35 || 
        code == 36 || 
        code == 37 || 
        code == 38 || 
        code == 39 || 
        code == 40 || 
        code == 45
      ) {
        return;
      }

      var $this = $(this),
        $dropdownMenu = $this.siblings('.dropdown-menu'),
        $nenhumResult = $dropdownMenu.find('.nenhum-result'),
        $elements = $dropdownMenu.find('.relacional-dropdown-element-orcamento');

      var $filtereds = $elements.filter(function () {
        return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) != -1;
      });

      if (!$filtereds.length) {
        $nenhumResult.removeClass('d-none');
      } else {
        $nenhumResult.addClass('d-none');
      }

      $elements.not($filtereds).hide();
      $filtereds.show();

    });

  $('.relacional-dropdown-input-orcamento')
    .click(function () {
      var $this = $(this)
      if ($this.parents('.dropdown').hasClass('show')) {
        $this.dropdown('toggle');
      }
    })
    .on('blur change', function () {

      var $this = $(this),
        $dropdownMenu = $this.siblings('.dropdown-menu'),
        $active = $dropdownMenu.find('.relacional-dropdown-element-orcamento.active');

      $this.removeClass('is-valid is-invalid');

      if ($this.val()) {

        $dropdownMenu.find('.nenhum-result').addClass('d-none');

        $filtereds = $dropdownMenu.find('.relacional-dropdown-element-orcamento').filter(function () {
          return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) != -1;
        });

        if (!$filtereds.length) {

          if ($this.attr('data-pode_nao_cadastrado') == 'false') {

            $this
              .removeClass('is-valid')
              .addClass('is-invalid');

            this.setCustomValidity('invalid');
            $this.after('<div class="invalid-feedback">Selecione um item existente.</div>');

          } else {

            $this.addClass('is-valid');
            this.setCustomValidity('');

          }

        } else {

          $this.addClass('is-valid');
          this.setCustomValidity('');

        }

        if (!$active.length || $active.text().toLowerCase() != $this.val().toLowerCase()) {
          $this.val('');
        }

      } else {

        if ($active.length) {
          $this.val($active.text());
        }

      }
    })
    .attr('autocomplete', 'off');

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
                <input type="text" class="form-control" name="quem_indicou" value="" required data-unico="" data-anterior="" id="quem_indicou" data-mascara_validacao="false">
              </div>
            </div>
          `);

          var $quemIndicou = $("#quem_indicou");

          if ($this.attr("data-anterior").startsWith('Contato - ')) {
            
            $quemIndicou
              .val($this.attr("data-anterior").replace("Contato - ", ""))
              .blur();

          }

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
          success: cliente => setarClienteCadastrado(cliente)
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

  $('#itensOrcamento').on('alteracoes', function() {

    let $msgAlert = $('#invalid-feedback-zero-itens');

    $msgAlert.addClass('d-none');
    if (!$('[name=itens]').val().length) {
      $msgAlert.removeClass('d-none');
    }

    valorTotal();
  });

  $('#main-form').click(function(event) {
    
    let $msgAlert = $('#invalid-feedback-zero-itens'),
      $forms = $('#form-principal, #camposOrc');

    $msgAlert.addClass('d-none');

    if (!$('[name=itens]').val().length) {
      
      $forms
        .addClass('was-validated');

      $forms.find(':invalid').first().focus();

      $msgAlert.removeClass('d-none');
      event.preventDefault();
    }
  });

  $('#nome_cliente')
    .on('blur change', function() {
      
      let $this = $(this),
        $elements = $this.siblings('.relacional-dropdown').find('.relacional-dropdown-element-cliente');

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

      checarClienteCadastrado();

    })
    .on('focus', function() {

      let $radio = $('#form-principal [name="pf_pj"]:checked'),
        $elements = $('#esquerda [name="nome_cliente"] ~ .relacional-dropdown .relacional-dropdown-element-cliente'),
        $filtereds = $elements.filter(function() {
          return $(this).attr("data-tipo_pessoa") == $radio.attr("id");
        });

      $elements
        .removeClass('filtered')
        .hide();

      $filtereds
        .addClass('filtered')
        .show();

    });

  $('#aprovar-orcamento').click(function() {
    if ($('[name=id_cliente]').val() != '0') {
      
      // Cliente já é cadastrado
      if (confirm('Tem Certeza?')) {
        aprovarOrcamento();
      }

    } else {
      // Necessário cadastrar o cliente antes de aprovar um orçamento
      $('#modalCadastrarCliente').modal('show');
    }
  });

  $('#embaixo input').on('change', function() {
    valorTotal();
  });

  $('#chk_cancelamentoOrc').click(function(){

    let $motivoDesistencia = $('#motivo_desistencia');

    $motivoDesistencia.val('');

    if( $(this).is(':checked') ){

      $('#col-cancelar').removeClass('d-none');
      $('#col-aprovar, #col-salvar, #col-recontato, #col-historico, #col-duplicar, #col-imprimir').addClass('d-none');

      $motivoDesistencia.parent().parent().removeClass('d-none');
      $motivoDesistencia.focus();

    }else{

      $('#col-cancelar').addClass('d-none');
      $('#col-aprovar, #col-salvar, #col-recontato, #col-historico, #col-duplicar, #col-imprimir').removeClass('d-none');

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

  // Eventos responsáveis pelo: Select Dropdown com Pesquisa de Cliente
  // Cliente
  $(document)
    .on('click', '.relacional-dropdown-element-cliente', function () {

      var $this = $(this),
        $input = $this.parents('.relacional-dropdown-wrapper').find('.relacional-dropdown-input-cliente');

      $input
        .val($this.text())
        .change();
    })
    .on('keyup', '.relacional-dropdown-input-cliente', function (event) {

      var code = event.keyCode || event.which;

      if (code == 27) {
        
        $(this)
          .dropdown('hide')
          .blur();

        return;
      }

      if (
        code == 91 || 
        code == 93 || 
        code == 92 || 
        code == 9 || 
        code == 13 || 
        code == 16 || 
        code == 17 || 
        code == 18 || 
        code == 19 || 
        code == 20 || 
        code == 33 || 
        code == 34 || 
        code == 35 || 
        code == 36 || 
        code == 37 || 
        code == 38 || 
        code == 39 || 
        code == 40 || 
        code == 45
      ) {
        return;
      }

      var $this = $(this),
        $dropdownMenu = $this.siblings('.dropdown-menu'),
        $nenhumResult = $dropdownMenu.find('.nenhum-result'),
        $elements = $dropdownMenu.find('.relacional-dropdown-element-cliente.filtered');

      if ($this.attr('data-anterior').length != $this.val()) {

        var $filtereds = $elements.filter(function () {
          return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) != -1;
        });

        if (!$filtereds.length) {
          $nenhumResult.removeClass('d-none');
        } else {
          $nenhumResult.addClass('d-none');
        }

        $elements.not($filtereds).hide();
        $filtereds.show();

      } else {

        $nenhumResult.addClass('d-none');
        $elements.show();

      }

    });

  $('.relacional-dropdown-input-cliente')
    .click(function () {
      var $this = $(this)
      if ($this.parents('.dropdown').hasClass('show')) {
        $this.dropdown('toggle');
      }
    })
    .on('blur change', function () {

      var $this = $(this),
        $dropdownMenu = $this.siblings('.dropdown-menu'),
        $active = $dropdownMenu.find('.relacional-dropdown-element-cliente.active');

      $this.removeClass('is-valid is-invalid');

      if ($this.val()) {

        $dropdownMenu.find('.nenhum-result').addClass('d-none');

        $filtereds = $dropdownMenu.find('.relacional-dropdown-element-cliente.filtered').filter(function () {
          return $(this).text().toLowerCase().indexOf($this.val().toLowerCase()) != -1;
        });

        if (!$filtereds.length) {

          if ($this.attr('data-pode_nao_cadastrado') == 'false') {

            $this
              .removeClass('is-valid')
              .addClass('is-invalid');

            this.setCustomValidity('invalid');
            $this.after('<div class="invalid-feedback">Selecione um item existente.</div>');

          } else {

            $this.addClass('is-valid');
            this.setCustomValidity('');

          }

        } else {

          $this.addClass('is-valid');
          this.setCustomValidity('');

        }

      } else {

        if ($active.length) {
          $this.val($active.text());
        }

      }
    })
    .attr('autocomplete', 'off');

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
            class="list-group-item list-group-item-action relacional-dropdown-element-orcamento" 
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

      $materialDropdown.html(htmlDropdown);

      $materialDropdown
        .find('.relacional-dropdown-element-orcamento.active')
        .removeClass('active');

      if (setValueSuccess) {

        let $elFiltered = $materialDropdown.find('.relacional-dropdown-element-orcamento').filter(function() {
          if ($(this).text().toLowerCase() == setValueSuccess.toLowerCase()) {
            return this;
          }
        });
        
        $elFiltered
          .addClass('active');

      }

    }
  });

}

function valorTotal() {

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

  if ($('#form-principal').hasClass('was-validated')) {
    $('[name="valor_total"]').blur();
  }

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
    valorDeslocamento = $deslocamentoKm.val() || '0',
    valorDeslocamentoFormated = parseFloat(floatParaPadraoInternacional(valorDeslocamento));

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
    custoTotalFormated = parseFloat(floatParaPadraoInternacional($custoTotal.val())),
    valorTotal = parseFloat(floatParaPadraoInternacional($valorTotal.val()));

  if ($descontoPorcent.val()) {
    
    let descontoPorcent = parseFloat(floatParaPadraoInternacional($descontoPorcent.val())) / 100;

    if ($valorTotal.val() && valorTotal > 0) {

      let totalDescontoReais = valorTotal * descontoPorcent,
        diferenca = valorTotal - totalDescontoReais;

      if (diferenca > custoTotalFormated) {
        
        $descontoReais.val(floatParaPadraoBrasileiro(totalDescontoReais.toFixed(2)));
  
        $valorTotal.val(floatParaPadraoBrasileiro(diferenca.toFixed(2)));

      } else if (diferenca == custoTotalFormated) {
        
        alert('O desconto dado faz o valor final ser igual custo total.');

        $descontoPorcent.val($descontoPorcent.attr('data-anterior') || 0);
        $descontoReais.val($descontoReais.attr('data-anterior') || 0);
        
      } else {
        
        alert('O desconto dado faz o valor final ser menor do que custo total.');
        
        $descontoReais.val($descontoReais.attr('data-anterior') || 0);
        $descontoPorcent.val($descontoPorcent.attr('data-anterior') || 0);

      }

    }
  }
}

function resumoItens() {

  let $custo_tot = $('#custo_total'),
      $subTotal = $('#sub_total');

  if ($custo_tot.val()) {
    $('#resumoItensCustoTotal').text($custo_tot.val());
  }

  if ($subTotal.val()) {
    $('#resumoItensSubTotal').text($subTotal.val());
  }

}

function aprovarOrcamento(cliente) {

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

  if (cliente) {
    if (cliente.id) {
      editarClienteOrcamento(dadosParaEnviar.id_orcamento, cliente, function() {
        ajaxAprovarOrcamento(dadosParaEnviar, cliente.id);
      });
    }
  } else {
    ajaxAprovarOrcamento(dadosParaEnviar);
  }

}

function editarClienteOrcamento(id_orcamento, cliente, callback) {
  $.ajax({
    url: baselink + '/ajax/editarClienteOrcamento/' + id_orcamento,
    type: 'POST',
    data: cliente,
    dataType: 'json',
    success: callback
  });
}

function ajaxAprovarOrcamento(dadosParaEnviar, id_cliente) {

  if (id_cliente) {
    dadosParaEnviar.id_cliente = id_cliente;
  }

  $.ajax({
    url: baselink + '/ajax/aprovarOrcamento',
    type: 'POST',
    data: dadosParaEnviar,
    dataType: 'json',
    success: function(data) {
      if (data.message[0] == '00000') {

       $.ajax({
        url: baselink + '/ajax/getIdOrdemServico',
        type: 'POST',
        data: {
          id_orcamento: dadosParaEnviar.id_orcamento
        },
        dataType: 'json',
        success: function(data) {
          if (data.message[0] == '00000') {
            window.open(baselink + '/ordemservico/imprimir/'+data.id_ordemservico, '_blank')
            window.location.href = baselink + '/orcamentos';
          }
        }
      });

        
      }
    }
  });
}

function changeRequiredsPfPj() {

  let $radio = $('#form-principal [name="pf_pj"]:checked');

  if ($radio.attr("id") == "pj") {

    $("#form-principal [name=telefone]")
      .attr("required", "required")
      .siblings("label")
      .addClass("font-weight-bold")
      .find("> i")
      .removeClass('d-none')
      .addClass('d-inline-block');

    $("#form-principal [name=celular]")
      .removeAttr("required", "required")
      .siblings("label")
      .removeClass("font-weight-bold")
      .find("> i")
      .hide();

  } else {

    $("#form-principal [name=celular]")
      .attr("required", "required")
      .siblings("label")
      .addClass("font-weight-bold")
      .find("> i")
      .show();

    $("#form-principal [name=telefone]")
      .removeAttr("required", "required")
      .siblings("label")
      .removeClass("font-weight-bold")
      .find("> i")
      .addClass('d-none')
      .removeClass('d-inline-block');

  }
}

function acoesByStatus() {

  let $status = $('#status'),
    $tabela = $('#itensOrcamento'),
    statusLowTxt = $status.val().toLowerCase();

  if ($status.val() && (statusLowTxt == 'cancelado' || statusLowTxt == 'aprovado')) {
    $tabela.find('thead > tr > th:first-child, tbody > tr > td:first-child').hide();
    $('#btn_incluir').parent().hide();
    $('.form-control, [type="radio"]').attr('disabled', 'disabled');
  } else {
    $status.parent().hide();
  }
}

function checarClienteCadastrado() {

  let $idCliente = $('[name="id_cliente"]'),
    $btnAprovar = $('#aprovar-orcamento');

  if ($idCliente.val() == '0') {

    // Cliente não cadastrado
    $btnAprovar
      .text('Cadastrar Cliente');

  } else {

    $btnAprovar
      .text('Aprovar Orçamento');

  }

}

function setarClienteCadastrado(cliente) {

  let $form = $('#form-principal'),
    $nome = $form.find('#nome_cliente'),
    $telefone = $form.find('#telefone'),
    $celular = $form.find('#celular'),
    $email = $form.find('#email'),
    $comoConheceu = $form.find('#como_conheceu');

  if (cliente) {
    $nome.val(cliente.nome);
    $telefone.val(cliente.telefone);
    $celular.val(cliente.celular);
    $email.val(cliente.email);
    $comoConheceu.val(cliente.comoconheceu);

    $('#modalCadastrarCliente').modal('hide');

  }

}