function Ajax (url, callback, send = {}) {
    $.ajax({
        url: './parametros/' + url,
        type: 'POST',
        data: send,
        dataType: 'json',
        success: callback
    });
};

function Popula($wrapper, data, campo) {
    
    var htmlContentSearch = '';

    data.forEach(element => {
        htmlContentSearch += `
            <div id="` + element.id + `" class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text">` + element[campo] + `</span>
                    <div>
                        <button class="editar btn btn-sm btn-primary" tabindex="-1">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="excluir btn btn-sm btn-secondary" tabindex="-1">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    $wrapper.html(htmlContentSearch);
};

function Toast (options) {
    $('body').append(`
        <div class="position-fixed my-toast m-3 shadow-sm alert ` + options.class + ` alert-dismissible fade show" role="alert">
            ` + options.message + `
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);

    window.setTimeout(function() {
        $('.alert').alert('close');
    }, 4000);
}

// Dropdowns
$(document)
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
            $contentSearchThisWrapper = $this.siblings('.list-group-filtereds-wrapper'),
            $contentSearchThis = $contentSearchThisWrapper.find('.list-group-filtereds'),
            campo = $contentSearchThis.parents('.search-body').attr('data-campo');

        $contentSearchThis.parents('.search-body').addClass('active');
        $contentSearchThisWrapper.show();

        Ajax('listar', function(data) {
            
            Popula($contentSearchThis, data, campo);

            $this.trigger('input');

        }, {
            value: this.value,
            tabela: $contentSearchThis.parents('.search-body').attr('id'),
            campo: campo
        });
    })
    .on('input', '.search-input', Debounce(function () {

        var $this = $(this),
            $contentSearchThis = $this.siblings('.list-group-filtereds-wrapper').find('.list-group-filtereds'),
            id = $this.attr('data-id'),
            $searchBody = $this.parents('.search-body'),
            campo = $searchBody.attr('data-campo');
            tabela = $searchBody.attr('id'),
            $elAdd = $contentSearchThis.siblings('.elements-add'),
            $saveParametros = $this.parents('.col').siblings('.save-parametros').find('.salvar');

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
            }
            
            $('.list-group-filtereds #' + id + ' .text').text($this.val());
        }
    }, 500))
    .on('keydown', '.search-input', function(event) {

        var $this = $(this),
            $saveParametros = $this.parents('.col').siblings('.save-parametros').find('.salvar'),
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
        
        var $parent = $(this).closest('.list-group-item'),
            tabela = $parent.parents('.search-body').attr('id');

        if (confirm('Tem Certeza?')) {
            Ajax('excluir/' + $parent.attr('id'), function(data) {
                if (data[0] == '00000') {
                    $parent.remove();
                }
            }, {
                tabela: tabela
            });
        }
    })
    .on('click', '.salvar', function() {
        
        var $this = $(this),
            $searchBody = $this.parents('.search-body'),
            $inputSearch = $this.parents('.search-body').find('.search-input'),
            tabela = $searchBody.attr('id'),
            campo = $searchBody.attr('data-campo');

        if ($inputSearch.val()) {
            if ($inputSearch.attr('data-id') == undefined) {
    
                Ajax('adicionar', function(data) {
                    if (data[0] == '00000') {
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
                        $this.parent().addClass('d-none');
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
            $saveParametros = $parent.parents('.col').siblings('.save-parametros'),
            $inputSearch = $parent.parents('.list-group-filtereds-wrapper').siblings('.search-input');

        $saveParametros.removeClass('d-none');
        
        $inputSearch
            .val($parent.find('.text').text())
            .focus();

        $inputSearch.attr('data-id', $parent.attr('id'));
    });

// Fixos
$(document)
    .on('submit', '.form-params-fixos', function (event) {

        var $this = $(this),
            $input = $this.find('.input-fixos');
            value = $input.val(),
            id = $input.attr('data-id');

        Ajax('editarFixos/' + id, function(data) {
            if (data[0] == '00000') {
                Toast({
                    message: 'Parâmetro editado com sucesso!',
                    class: 'alert-success'
                });
            }
        }, {
            value: value
        });

        event.preventDefault();
        event.stopPropagation();
    });