$(function () {

    //
    // Campos Únicos
    //
    $.fn.unico = function (callback) {

        var $input = $(this),
            campo = $input.attr('name');

        $.ajax({
            url: baselink + '/ajax/buscaUnico',
            type: 'POST',
            data: {
                module: currentModule,
                campo: campo,
                valor: $input.val()
            },
            dataType: 'json',
            success: callback
        });
    };

    //
    // Validação de Datas
    //
    function validaDat(valor) {
        var date = valor;
        var ardt = new Array;
        var ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
        ardt = date.split('/');
        erro = false;
        if (date.search(ExpReg) == -1) {
            erro = true;
        }
        else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30))
            erro = true;
        else if (ardt[1] == 2) {
            if ((ardt[0] > 28) && ((ardt[2] % 4) != 0))
                erro = true;
            if ((ardt[0] > 29) && ((ardt[2] % 4) == 0))
                erro = true;
        }
        if (erro) {
            return false;
        }
        return true;
    }

    //
    // Validação Padrão de Email
    //
    $.fn.validaEmail = function () {

        var email = $(this).val();

        // Retirar espacos em branco do inicio e do final
        email = email.trim();

        if (email.indexOf('@') == -1 || (email.indexOf('@') >= email.lastIndexOf('.')) || (email.lastIndexOf('.') + 1 >= email.length)) {
            // Inválido
            return false;
        } else {
            // Válido
            return true;
        }
    };

    //
    // Validação com limite minimo de caracteres
    //
    $.fn.validationLength = function (length) {
        return $(this).val().length == length;
    };

    function habilitaBotao($campos) {

        var temAlteracao = false;

        $campos.each(function (i, el) {

            var $this = $(el);

            if ($this.attr('type') == 'radio') {
                $this = $this.parent().siblings().find(':checked');
            }

            var valorAtual = $this.val(),
                dataAnterior = $this.attr('data-anterior');

            valorAtual = String(valorAtual).trim().toUpperCase();
            dataAnterior = String(dataAnterior).trim().toUpperCase();

            if (dataAnterior != valorAtual) {
                temAlteracao = true;
            }
        });

        if (temAlteracao) {
            $('#main-form').removeAttr('disabled');
            $('label[for=main-form]').removeClass('disabled');
        } else {
            $('#main-form').attr('disabled', 'disabled');
            $('label[for=main-form]').addClass('disabled');
        }
    };


    // 
    // CONFIGURAÇÕES DO DATATABLE
    //
    var dataTable = $('.dataTable').DataTable(
        {
            scrollX: true,
            responsive: true,
            processing: true,
            serverSide: true,
            scrollCollapse: true,
            conditionalPaging: true,
            autoWidth: false,
            order: [0, 'desc'],
            ajax: {
                url: baselink + '/ajax/dataTableAjax',
                type: 'POST',
                data: {
                    module: currentModule
                }
            },
            language: {
                'decimal': ',',
                'thousands': '.',
                'sEmptyTable': 'Nenhum registro encontrado',
                'sInfo': 'Mostrando de _START_ até _END_ do total de _TOTAL_ registros',
                'sInfoEmpty': 'Mostrando 0 até 0 do total de 0 registros',
                'sInfoFiltered': '(Filtrados de _MAX_ registros)',
                'sInfoPostFix': '',
                'sInfoThousands': '.',
                'sLengthMenu': '_MENU_ Resultados por página',
                'sLoadingRecords': 'Carregando...',
                'sProcessing': 'Processando...',
                'sZeroRecords': 'Nenhum registro encontrado',
                'oPaginate': {
                    'sNext': 'Próximo',
                    'sPrevious': 'Anterior',
                    'sFirst': 'Primeiro',
                    'sLast': 'Último'
                }
            },
            dom: '<t><p><r><i>'
        }
    );

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///                                                                     
    ///     MÁSCARAS E VALIDAÇÕES DOS CAMPOS DO FORMULÁRIO
    ///
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //
    // // campo NOME
    //
    
    
    //var $nome = $('[name=nome], [name=contato_nome]');
    var $nome = $('[data-mascara_validacao="nome"]');
    $nome
        .blur(function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.attr('data-unico')) {
                        $this.unico(function (json) {
                            if (!json.length) {
                                // Não existe, pode seguir

                                $this
                                    .removeClass('is-invalid')
                                    .addClass('is-valid');

                                $this[0].setCustomValidity('');

                            } else {
                                // Já existe, erro

                                var text_label = $this.siblings('label').find('span').text();

                                $this
                                    .removeClass('is-valid')
                                    .addClass('is-invalid');

                                $this[0].setCustomValidity('invalid');

                                $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                            }
                        });
                    } else {
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    }
                }
            }
        });


    //
    // // campo RG
    //
    // var $rg = $('[name=rg]');
    var $rg = $('[data-mascara_validacao="rg"]');    
    $rg
        .mask('0000000000')
        .blur(function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(10)) {
                        // Valido
                        if ($this.attr('data-unico')) {
                            $this.unico(function (json) {
                                if (!json.length) {
                                    // Não existe, pode seguir

                                    $this
                                        .removeClass('is-invalid')
                                        .addClass('is-valid');

                                    $this[0].setCustomValidity('');

                                } else {
                                    // Já existe, erro

                                    $this
                                        .removeClass('is-valid')
                                        .addClass('is-invalid');

                                    $this[0].setCustomValidity('invalid');

                                    $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                }
                            });
                        } else {
                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');
                        }
                    } else {
                        // Inválido
                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 0000000000</div>');
                    }
                }
            }
        });    

    //
    // // campo CPF
    //
    // var $cpf = $('[name=cpf]');
    var $cpf = $('[data-mascara_validacao="cpf"]');    
    $cpf
        .mask('000.000.000-00')
        .blur(function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(14)) {
                        // Valido
                        if ($this.attr('data-unico')) {
                            $this.unico(function (json) {
                                if (!json.length) {
                                    // Não existe, pode seguir

                                    $this
                                        .removeClass('is-invalid')
                                        .addClass('is-valid');

                                    $this[0].setCustomValidity('');

                                } else {
                                    // Já existe: erro

                                    $this
                                        .removeClass('is-valid')
                                        .addClass('is-invalid');

                                    $this[0].setCustomValidity('invalid');

                                    $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                }
                            });
                        } else {
                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');
                        }
                    } else {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 000.000.000-00</div>');
                    }
                }
            }
        });


    //
    // // campo CNPJ
    //
    // var $cnpj = $('[name=cnpj]');
    var $cnpj = $('[data-mascara_validacao="cnpj"]');     
    $cnpj
        .mask('00.000.000/0000-00')
        .blur(function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(18)) {
                        // Valido

                        if ($this.attr('data-unico')) {
                            $this.unico(function (json) {
                                if (!json.length) {
                                    // Não existe, pode seguir

                                    $this
                                        .removeClass('is-invalid')
                                        .addClass('is-valid');

                                    $this.setCustomValidity('');

                                } else {
                                    // Já existe, erro

                                    $this
                                        .removeClass('is-valid')
                                        .addClass('is-invalid');

                                    $this[0].setCustomValidity('invalid');

                                    $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                }
                            });
                        } else {
                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');
                        }
                    } else {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 00.000.000/0000-00</div>');
                    }
                }
            }
        });

    //
    // // campo TELEFONE
    //
    // var $telefone = $('[name=telefone], [name=contato_telefone]');
    var $telefone = $('[data-mascara_validacao="telefone"]');       
    $telefone
        .mask('(00)0000-0000')
        .blur(function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(13)) {
                        // Valido
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Inválido
                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        // Função nativa javascript para setar campo com :valid :invalid
                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: (00)0000-0000</div>');
                    }
                }
            }
        });

    //
    // // campo CELULAR
    //
    // var $celular = $('[name=celular], [name=contato_celular]');
    var $celular = $('[data-mascara_validacao="celular"]');   

    $celular
        .mask('(00)00000-0000')
        .blur(function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(14)) {
                        // Valido
                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Inválido
                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: (00)00000-0000</div>');
                    }
                }
            }
        });

    //
    // // campo DATA
    //
    // var $data = $('[name^=data_]');
    var $data = $('[data-mascara_validacao="data"]');   

    $data
        .mask('00/00/0000')
        .datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true
        })
        .change(function () {

            var $this = $(this),
                valor = $this.val();

            valor = valor.split('/');

            var data = valor[0] + '/' + valor[1] + '/' + valor[2];

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if (valor != '') {
                if ($this.attr('data-anterior') != $this.val()) {
                    if (
                        (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                        (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                        (validaDat(data) == false)
                    ) {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Data inválida.</div>');
                    } else {
                        // Valido

                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');
                    }
                }
            }
        });

    //
    // // campo SIGLA
    //
    // $('[name=sigla]')
    $('[data-mascara_validacao="sigla"]')   
        .mask('ZZZZZ', {
            translation: {
                'Z': {
                    pattern: /[A-Za-z]/
                }
            }
        });

    //
    // // campo EMAIL
    //
    // var $email = $('[name=email], [name=contato_email]');
    var $email = $('[data-mascara_validacao="email"]');

    $email
        .blur(function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();;

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validaEmail()) {
                        // Valido
                        if ($this.attr('data-unico')) {
                            $this.unico(function (json) {
                                if (!json.length) {
                                    // Não existe, pode seguir

                                    $this
                                        .removeClass('is-invalid')
                                        .addClass('is-valid');

                                    $this[0].setCustomValidity('');

                                } else {
                                    // Já existe, erro

                                    $this
                                        .removeClass('is-valid')
                                        .addClass('is-invalid');

                                    $this[0].setCustomValidity('invalid');

                                    $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');
                                }
                            });
                        } else {
                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');
                        }
                    } else {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">E-mail inválido. Tente outro.</div>');
                    }
                }
            }
        });

    //
    // // campo CEP
    //
    // var $cep = $('[name=cep]');
    var $cep = $('[data-mascara_validacao="cep"]');

    $cep
        .mask('00000-000')
        .blur(function () {

            var $this = $(this);

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {
                    if ($this.validationLength(9)) {
                        // Valido

                        $this
                            .removeClass('is-invalid')
                            .addClass('is-valid');

                        $this[0].setCustomValidity('');

                        $this.addClass('loading');

                        $.ajax({
                            url: 'http://api.postmon.com.br/v1/cep/' + $this.val(),
                            type: 'GET',
                            dataType: 'json',
                            success: function (json) {

                                $this.removeClass('loading');

                                if (typeof json.logradouro != 'undefined') {
                                    $('[name=endereco]').val(json['logradouro']);
                                    $('[name=numero]').focus();
                                }

                                if (typeof json.bairro != 'undefined') {
                                    $('[name=bairro]').val(json['bairro']);
                                }

                                if (typeof json.cidade != 'undefined') {
                                    $('[name=cidade]').val(json['cidade']);
                                }
                            }
                        });
                    } else {
                        // Inválido

                        $this
                            .removeClass('is-valid')
                            .addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Preencha o campo no formato: 00000-000</div>');
                    }
                }
            }
        });

    //
    // // campo NUMERO
    //
    //$('[name=numero]')
    $('[data-mascara_validacao="numero"]')
        .mask('0#');

    //
    // // campo MONETÁRIO, SALÁRIO, CUSTO
    //
    //var $monetario = $('[name=salario], [name^=preco], [name=custo], [name=dinheiro]');
    var $monetario = $('[data-mascara_validacao="monetario"]');    
    $monetario
        .mask('#.##0,00', {
            reverse: true
        })
        .blur(function () {

            var $this = $(this),
                value = $this.val(),
                anterior = $this.attr('data-anterior'),
                text_label = $this.siblings('label').find('span').text();

            var pode_zero  =  $this.attr('data-podeZero');
                if(pode_zero != undefined && pode_zero == 'true'){
                    pode_zero = true;
                }else{
                    pode_zero = false;
                }    

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if (value) {

                if (anterior != value) {

                    var value = value.replace('.', '').replace('.', '').replace('.', '').replace('.', '').replace('.', ''), 
                        value = value.replace(',', '.')
                        value = parseFloat(value);

                        
                        if (value <= parseFloat(0)) {

                            if ( pode_zero == true ){
                                $this
                                    .removeClass('is-invalid')
                                    .addClass('is-valid');

                                $this[0].setCustomValidity('');

                            }else{
                                $this
                                    .removeClass('is-valid')
                                    .addClass('is-invalid');

                                $this[0].setCustomValidity('invalid');

                                $this.after('<div class="invalid-feedback">' + text_label + ' precisa ser maior que 0.</div>');
                            }
                        } else {

                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');
                        }   
                }
            } else {
                $this.val('');
            }
        });

    //
    // // campo COMISSÃO, PORCENTAGEM 
    //
    // var $porcentagem = $('[name=comissao], [name=porcent]');
    var $porcentagem = $('[data-mascara_validacao="porcentagem"]');  

    $porcentagem
        .mask('00,00%', {
            reverse: true
        })
        .blur(function () {

            var $this = $(this),
                value = $this.val().replace('%', ''),
                anterior = $this.attr('data-anterior').replace('%', ''),
                text_label = $this.siblings('label').find('span').text();

            var pode_zero  =  $this.attr('data-podeZero');
                if(pode_zero != undefined && pode_zero == 'true'){
                    pode_zero = true;
                }else{
                    pode_zero = false;
                }    

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();

            if (value) {

                if (anterior != value) {

                    var value = value.replace('.', ''), 
                        value = value.replace(',', '.')
                        value = parseFloat(value);
                     
                        if (value <= parseFloat(0)) {

                            if ( pode_zero == true ){
                                
                                $this
                                    .removeClass('is-invalid')
                                    .addClass('is-valid');

                                $this[0].setCustomValidity('');

                            }else{
                                $this
                                    .removeClass('is-valid')
                                    .addClass('is-invalid');

                                $this[0].setCustomValidity('invalid');

                                $this.after('<div class="invalid-feedback">' + text_label + ' precisa ser maior que 0.</div>');
                            }
                        } else {

                            $this
                                .removeClass('is-invalid')
                                .addClass('is-valid');

                            $this[0].setCustomValidity('');
                        }   
                }
            } else {
                $this.val('');
            }
        })
        .change('blur change', function () {

            var dtAnterior = $(this).attr('data-anterior');

            dtAnterior = dtAnterior.replace('%', '');
            dtAnterior = dtAnterior + '%';

            $(this).attr('data-anterior', dtAnterior);
        })
        .change();

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///                                                                     
    ///     INTERAÇÕES ENTRE OS ELEMENTOS, FUNCIONALIDADES, EVENTOS
    ///
    ///////////////////////////////////////////////////////////////////////////////////////////////

    //
    // Função que valida as alterações necessárias para o submit
    //
    $('.needs-validation').submit(function (event) {
        var form = this;

        if (form.checkValidity() == false) {
            // Primeira validação de todos os campos(de todos os tipos. Ex.: required, mascara, unico)
            // Da foco no primeiro campo inválido
            $(form).find('.is-invalid, :invalid').first().focus();
            // Para o evento de submit
            event.preventDefault();

        } else {
            // Todos os campos do formulário estão válidos quando submita
            // Executa o blur de todos os campos do formulário novamente
            $(form).find('.form-control, .form-check-input').trigger('blur');

            if (form.checkValidity() == false) {
                // Segunda validação de todos os campos(de todos os tipos. Ex.: required, mascara, unico)
                // Da foco no primeiro campo inválidos
                $(form).find('.is-invalid, :invalid').first().focus();
                // Para o evento de submit
                event.preventDefault();

            } else {
                // Todos os campos do formulário estão válidos novamente
                var $alteracoes = $('[name=alteracoes]');

                if ($alteracoes.val() != '') { // Editar
                    
                    // Faz um foreach em todos os campos do formulário para ver os valores atuais e os valores anteiores
                    var campos_alterados = '';
                    $(form).find('input[type=text], input[type=hidden]:not([name=alteracoes]), input[type=radio]:checked, textarea, select').each(function (index, el) {

                        var valorAtual = $(el).val(),
                            dataAnterior = $(el).attr('data-anterior');

                        valorAtual = String(valorAtual).trim().toUpperCase();
                        dataAnterior = String(dataAnterior).trim().toUpperCase();

                        if (dataAnterior != valorAtual) {
                            campos_alterados += '[' + $(el).attr('name').toUpperCase() + ' de (' + $(el).data('anterior') + ') para (' + $(el).val() + ')]';
                        }
                    });

                    if (campos_alterados != '') {

                        $alteracoes.val($alteracoes.val() + '##' + campos_alterados);
                        console.log("confirmar antes do Editar - " + $alteracoes.val());
                        if (!confirm('Tem certeza?')) {
                            event.preventDefault();
                        }
                    } else {
                        // Se o usuario entrou para editar e submitou sem alterar nada
                        alert("Nenhuma alteração foi feita!");
                        event.preventDefault();
                    }
                } else { // Adicionar
                    console.log("confirmar antes do Adicionar");
                    if (!confirm('Tem certeza?')) {
                        event.preventDefault();
                        
                    }
                }

            }
        }

        form.classList.add('was-validated');
    });

    $('#menu-toggle').click(function () {
        $('#wrapper').toggleClass('toggled');
    });

    $('[name=searchDataTable]').keyup(function () {
        dataTable.search(this.value).draw();
    });

    $('[data-toggle="tooltip"]').tooltip();


    // Todos os checkbox virão com o atributo required se obrigatório
    $('[type=checkbox]').on('blur change invalid valid', function () {

        var $hidden = $(this).parent().siblings('[type=hidden]'),
            $checkeds = $(this).parents('.form-checkbox').find(':checked'),
            arrCheckeds = [];

        // Pega todos os checados e transforma em um novo array
        $checkeds.each(function (i, el) {
            arrCheckeds.push($(el).val());
        });

        // Transforma o array em uma string separada por virgula
        arrCheckeds = arrCheckeds.join(', ');

        // Seta no hidden a string com os checkbox marcados
        $hidden
            .val(arrCheckeds)
            .change()
            .blur();

        $(this)
            .parents('.form-checkbox')
            .removeClass('is-invalid is-valid');

        if ($hidden.attr('required') == 'required') {
            if ($hidden.val() == '') {
                // Inválido

                $(this)
                    .parents('.form-checkbox')
                    .addClass('is-invalid');

            } else {
                // Válido
                $(this)
                    .parents('.form-checkbox')
                    .addClass('is-valid');
            }
        } else {
            // Válido

            $(this)
                .parents('.form-checkbox')
                .addClass('is-valid');
        }
    });

    var $requiredRadios = $(':radio[required]');
    $('[type=radio]').on('change invalid valid', function () {
        if ($requiredRadios.is(':checked')) {
            $(this)
                .parents('.form-radio')
                .addClass('is-valid')
                .removeClass('is-invalid');
        } else {
            $(this)
                .parents('.form-radio')
                .addClass('is-invalid')
                .removeClass('is-valid');
        }
    });

    var $campos = $('#form-principal').find('input[type=text], input[type=hidden]:not([name=alteracoes]), input[type=radio], textarea, select');
    $campos.on('ready change blur', function () {
        habilitaBotao($campos);
    });

    $('input, textarea, select').on('blur', function () {
        if ( $(this)[0].hasAttribute('data-mascara_validacao') && $(this).attr('data-mascara_validacao') == 'false') {
            if ($(this).val() != '' && $(this).attr('data-anterior') != $(this).val()) {
                $(this).addClass('is-valid');
            } else {
                $(this).removeClass('is-valid');
            }
        }
    });
});