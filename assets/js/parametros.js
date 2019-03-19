const parametrosSemAcoes = [
    'dinheiro',
    'cartão débito',
    'cartão crédito',
    'boleto',
    'cheque',
    'transferência',
    'TED',
    'DOC',
    'Elo',
    'Visa',
    'MasterCard',
    'BanriCompras',
    'Hiper',
    'Visa Electron',
    'Hipercard'
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
    .on('click', '.down-btn', function () {
        $(this).parents('.search-body').find('.search-input').focus();
    })
    .on('click', '.close-btn', function () {

        var $searchBody = $(this).parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input');

        if ($inputSearch.attr('data-id')) {

            $inputSearch[0].setCustomValidity('');

            $inputSearch
                .removeClass('is-invalid is-valid')
                .removeAttr('data-id')
                .val('')
                .focus();

        } else {

            if ($searchBody.find('.elements-add').children().length) {

                $inputSearch
                    .removeClass('is-invalid is-valid')
                    .removeAttr('data-id')
                    .val('')
                    .trigger('input')
                    .focus();
            } else {

                $searchBody.find('.list-group-filtereds-wrapper').hide();
                $searchBody.removeClass('active');
            }

        }
    })
    .on('click touchstart', function (event) {
        
        var $currentElement = $(event.target);

        if (!$currentElement.parents('.search-body').length) {

            var $searchBodyActive = $('.search-body');

            $searchBodyActive
                .find('.search-input')
                .blur();

            $searchBodyActive
                .removeClass('active')
                .find('.list-group-filtereds-wrapper')
                    .hide();

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
                .find('.excluir')
                    .hide();
    
            $created
                .find('.editar')
                    .removeClass('editar btn-primary')
                    .addClass('salvar btn-success')
                .find('.fas')
                    .removeClass('fa-edit')
                    .addClass('fa-save');

            $created
                
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

        if (($this.val() && $this.attr('data-id')) || (!$this.val() && !$this.attr('data-id'))) {

            Ajax('listar', function(data) {
                
                Popula($contentSearchThis, data, campo);

                if ($this.attr('data-id')) {
                    $this.trigger('input');
                }
    
            }, {
                value: value,
                tabela: $searchBody.attr('id'),
                campo: campo
            });
        }

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
                    htmlElAdd += `
                        <div class="p-3">
                            <span>Nenhum resultado encontrado</span>
                            <button class="salvar btn btn-success btn-block text-truncate mt-2">Adicionar: ` + $this.val() + `</button>
                        </div>
                    `;
                }

                $elAdd.html(htmlElAdd);

            }, {
                value: $this.val(),
                tabela: tabela,
                campo: campo
            });

        } else {
            // Editando

            var $btnSalvar = $contentSearchThis.find('.salvar');

            $this.removeClass('is-invalid is-valid');

            if ($this.val()) {
                if ($this.val() != $this.attr('data-anterior')) {
                    
                    $this[0].setCustomValidity('');
                    $this.addClass('is-valid');

                    $btnSalvar.removeAttr('disabled');

                } else {

                    $btnSalvar.attr('disabled', 'disabled');

                }
            } else {

                $this[0].setCustomValidity('invalid');
                $this.addClass('is-invalid');

                $btnSalvar.attr('disabled', 'disabled');
            }

            $('.list-group-filtereds #' + id + ' .text').text($this.val());
            
        }
    })
    .on('keydown', '.search-input', function(event) {

        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $searchBody.find('.search-input'),
            code = event.keyCode || event.which;

        if (code == 27 || code == 9) {
            // Esc || Tab

            $inputSearch[0].setCustomValidity('');

            $inputSearch
                .removeClass('is-valid is-invalid')
                .removeAttr('data-id')
                .val('')
                .trigger('input')
                .blur();

            $searchBody
                .find('.elements-add')
                    .html('');

            $searchBody.find('.icons-search-input .close-btn').click();

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

        if ($inputSearch.attr('data-id') != $inputSearch.val() && $inputSearch.val()) {
            if ($inputSearch.attr('data-id') == undefined) {
    
                Ajax('adicionar', function(data) {
                    if (data[0] == '00000') {

                        Toast({
                            message: 'Parâmetro incluso com sucesso!',
                            class: 'alert-success'
                        });

                        $inputSearch
                            .removeClass('is-valid is-invalid')
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

                        $inputSearch
                            .removeClass('is-valid is-invalid')
                            .removeAttr('data-id')
                            .val('')
                            .focus()
                            .trigger('input');
                    }
                }, {
                    value: $inputSearch.val(),
                    tabela: tabela,
                    campo: campo
                });
    
            }
        } else {

            $inputSearch[0].setCustomValidity('invalid');
            
            $inputSearch
                .focus()
                .addClass('is-invalid');
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