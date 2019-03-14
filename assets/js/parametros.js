const parametrosSemAcoes = [
    'dinheiro',
    'cartão débito',
    'cartão crédito',
    'boleto',
    'cheque',
    'transferência',
    'TED',
    'DOC'
];

function Ajax (url, callback, send = {}) {
    $.ajax({
        url: baselink + '/parametros/' + url,
        type: 'POST',
        data: send,
        dataType: 'json',
        success: callback
    });
};

function Popula ($wrapper, data, campo) {
    
    var htmlContentSearch = '';

    data.forEach(element => {

        var htmlAcoes = '';

        if (parametrosSemAcoes.indexOf(element[campo]) == -1) {
            htmlAcoes = `
                <div>
                    <button class="editar btn btn-sm btn-primary" tabindex="-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="excluir btn btn-sm btn-danger" tabindex="-1">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
        }
        
        htmlContentSearch += `
            <div id="` + element.id + `" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text">` + element[campo] + `</span>`
                    + htmlAcoes +
                `</div>
            </div>
        `;
    });

    $wrapper.html(htmlContentSearch);
};

// Dropdowns
$(document)
    .on('click touchstart', '.down-btn', function () {
        $(this).parents('.search-body').find('.search-input').focus();
    })
    .on('click touchstart', '.close-btn', function () {

        var $searchBody = $(this).parents('.search-body');

        $searchBody.find('.list-group-filtereds-wrapper').hide();
        $searchBody.removeClass('active');
        $searchBody.find('.search-input').blur().trigger('input');
    })
    .on('click touchstart', function (event) {
        
        var $currentElement = $(event.target);

        if (!$currentElement.parents('.search-body').length) {
            $('.search-body.active .list-group-filtereds-wrapper').hide();
            $('.search-body.active').removeClass('active');
        } else {

            var $notCurrent = $('.search-body.active').not($currentElement.parents('.search-body'))

            $notCurrent
                .find('.list-group-filtereds-wrapper')
                .hide();

            $notCurrent.removeClass('active');
        }
    })
    .on('DOMNodeInserted', '.list-group-item', function (event) {
        
        var $created = $(event.target),
            $inputSearch = $created.parents('.list-group-filtereds-wrapper').siblings('.search-input');

        if ($created.attr('id') == $inputSearch.attr('data-id')) {
    
            $created
                .find('.btn')
                .attr('disabled', 'disabled');

            $created.addClass('disabled');
        }
    })
    .on('focus', '.search-input', function () {

        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $contentSearchThisWrapper = $searchBody.find('.list-group-filtereds-wrapper'),
            $contentSearchThis = $contentSearchThisWrapper.find('.list-group-filtereds'),
            campo = $searchBody.attr('data-campo'),
            value = $this.val();

        $searchBody.addClass('active');
        $contentSearchThisWrapper.show();

        if ($this.attr('data-id')) {
            value = $this.attr('data-anterior');
        }

        Ajax('listar', function(data) {
            
            Popula($contentSearchThis, data, campo);

            $this.trigger('input');

        }, {
            value: value,
            tabela: $searchBody.attr('id'),
            campo: campo
        });
    })
    .on('input', '.search-input', function () {

        var $this = $(this),
            $contentSearchThis = $this.siblings('.list-group-filtereds-wrapper').find('.list-group-filtereds'),
            id = $this.attr('data-id'),
            $searchBody = $this.parents('.search-body'),
            campo = $searchBody.attr('data-campo');
            tabela = $searchBody.attr('id'),
            $elAdd = $contentSearchThis.siblings('.elements-add'),
            $saveParametros = $searchBody.find('.salvar');

        if (id == undefined) {
            // Pesquisando

            Ajax('listar', function(data) {

                Popula($contentSearchThis, data, campo);

                var htmlElAdd = '';
                    
                if (!data.length) {
                    htmlElAdd += '<div class="p-3">Nenhum resultado encontrado</div>';
                }

                if ($this.val()) {
                    if ((data.length && (data[0][campo].toUpperCase() != $this.val().toUpperCase())) || !data.length) {
                        $saveParametros.removeAttr('disabled');
                    } else {
                        $saveParametros.attr('disabled', 'disabled');
                    }
                }

                $elAdd.html(htmlElAdd);

            }, {
                value: $this.val(),
                tabela: tabela,
                campo: campo
            });

        } else {
            // Editando

            if (!$this.val().length) {

                $this
                    .removeAttr('data-id')
                    .focus();

                $saveParametros.attr('disabled', 'disabled');
            } else {

                if ($this.val() != $this.attr('data-anterior')) {
                    $saveParametros.removeAttr('disabled');
                }
            }
            
            $('.list-group-filtereds #' + id + ' .text').text($this.val());
        }
    })
    .on('keyup', '.search-input', function(event) {

        var $this = $(this),
            $saveParametros = $this.parents('.search-body').find('.salvar'),
            code = event.keyCode || event.which;

        if (code == 27 || code == 9) {
            // Esc || Tab
            $this.parents('.search-body').find('.close-btn').click();
        } else if (code == 13) {
            // Enter
            $saveParametros.click();
        }
    })
    .on('click', '.excluir', function() {
        
        var $this = $(this),
            $parent = $this.closest('.list-group-item'),
            $input = $this.parents('.search-body').find('.search-input')
            tabela = $parent.parents('.search-body').attr('id');

        if (confirm('Tem Certeza?')) {
            Ajax('excluir/' + $parent.attr('id'), function(data) {
                if (data[0] == '00000') {

                    Toast({
                        message: 'Parâmetro excluido com sucesso!',
                        class: 'alert-success'
                    });

                    $parent.remove();
                    $input.focus();
                }
            }, {
                tabela: tabela
            });
        }
    })
    .on('click', '.salvar', function() {
        
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input'),
            tabela = $searchBody.attr('id'),
            campo = $searchBody.attr('data-campo');

        if ($inputSearch.val()) {
            if ($inputSearch.attr('data-id') == undefined) {
    
                Ajax('adicionar', function(data) {
                    if (data[0] == '00000') {

                        Toast({
                            message: 'Parâmetro incluso com sucesso!',
                            class: 'alert-success'
                        });

                        $searchBody
                            .find('.salvar')
                            .attr('disabled', 'disabled');

                        $inputSearch
                            .val('')
                            .focus()
                            .trigger('input');
                    }
                }, {
                    value: $inputSearch.val(),
                    campo: campo,
                    tabela: tabela
                });
    
            } else {
    
                Ajax('editar/' + $inputSearch.attr('data-id'), function(data) {
                    if (data[0] == '00000') {

                        Toast({
                            message: 'Parâmetro editado com sucesso!',
                            class: 'alert-success'
                        });

                        $searchBody
                            .find('.salvar')
                            .attr('disabled', 'disabled');

                        $inputSearch
                            .val('')
                            .focus()
                            .trigger('input')
                            .removeAttr('data-id');
                    }
                }, {
                    value: $inputSearch.val(),
                    tabela: tabela,
                    campo: campo
                });
    
            }
        }

    })
    .on('click', '.editar', function() {

        var $parent = $(this).closest('.list-group-item'),
            $inputSearch = $parent.parents('.list-group-filtereds-wrapper').siblings('.search-input');
        
        $inputSearch
            .val($parent.find('.text').text())
            .attr('data-id', $parent.attr('id'))
            .attr('data-anterior', $parent.find('.text').text())
            .focus();
    });

// Fixos
$(document)
    .on('submit', '.form-params-fixos', function (event) {

        event.preventDefault();

        var $this = $(this),
            $input = $this.find('.input-fixos');
            value = $input.val(),
            campos_alterados = '',
            id = $input.attr('data-id'),
            $label = $this.find('label span');

        $input.blur();

        if (this.checkValidity() == false) {

            $this
                .find('.is-invalid, :invalid')
                .first()
                .focus();

        } else {

            if ($input.val() != $input.attr('data-anterior')) {
                campos_alterados += '{' + $label.text().toUpperCase() + ' de (' + $input.attr('data-anterior') + ') para (' + $input.val() + ')}';
                campos_alterados = $input.attr('data-alteracoes') + '##' + campos_alterados;
            }
    
            if (confirm('Tem Certeza?')) {
                Ajax('editarFixos/' + id, function(data) {
    
                    if (data.erro[0] == '00000') {
    
                        Toast({
                            message: 'Parâmetro editado com sucesso!',
                            class: 'alert-success'
                        });

                        $this
                            .removeClass('was-validated');
        
                        $input
                            .attr('data-anterior', value)
                            .attr('data-alteracoes', data.result.alteracoes)
                            .removeClass('is-valid is-invalid')
                            .keyup();
    
                    }
    
                }, {
                    value: value,
                    alteracoes: campos_alterados
                });
            }

        }

        $this.addClass('was-validated');

    })
    .on('keyup', '.input-fixos', function () {
        
        var $this = $(this),
            $submit = $this.parents('form').find('[type=submit]');

        if ($this.val() != $this.attr('data-anterior')) {
            $submit.removeAttr('disabled');
        } else {
            $submit.attr('disabled', 'disabled');
        }
    });