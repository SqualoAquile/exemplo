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
                        <button class="editar btn btn-sm btn-primary">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="excluir btn btn-sm btn-secondary">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    $wrapper.html(htmlContentSearch);
};

$(document)
    .on('click touchstart', function (event) {
        
        var $currentElement = $(event.target);

        if (!$currentElement.parents('.search-body').length) {
            $('.search-body.active .list-group-filtereds-wrapper').hide();
            $('.search-body.active').removeClass('active');
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

            $this.keyup();

        }, {
            value: this.value,
            tabela: $contentSearchThis.parents('.search-body').attr('id'),
            campo: campo
        });
    })
    .on('keyup', '.search-input', function () {

        var $this = $(this),
            $contentSearchThis = $this.siblings('.list-group-filtereds-wrapper').find('.list-group-filtereds'),
            id = $(this).attr('data-id'),
            $searchBody = $this.parents('.search-body'),
            campo = $searchBody.attr('data-campo');
            tabela = $searchBody.attr('id'),
            $elAdd = $contentSearchThis.siblings('.elements-add');

        if (id == undefined) {
            // Pesquisando

            Ajax('listar', function(data) {

                Popula($contentSearchThis, data, campo);

                var nenhumaResultado = '',
                    htmlElAdd = '';

                if ($this.val()) {
                    
                    if (!data.length) {
                        nenhumaResultado = '<div class="pt-2">Nenhum resultado encontrado</div>';
                    }

                    if ((data.length && data[0][campo].toUpperCase() != $this.val().toUpperCase()) || !data.length) {
                        htmlElAdd +=`
                            <div class="p-3">
                                <button class="btn adicionar btn-success btn-block">Criar: ` + $this.val() + `</button>
                                    ` + nenhumaResultado + `
                                </div>
                            </div>
                        `;
                    }
                }

                $elAdd.html(htmlElAdd);

            }, {
                value: this.value,
                tabela: tabela,
                campo: campo
            });

        } else {
            // Editando

            if (!this.value.length) {

                $(this)
                    .removeAttr('data-id')
                    .focus();

                $(this).parents('.col').siblings('.save-parametros').addClass('d-none');
            }
            
            $('.list-group-filtereds #' + id + ' .text').text(this.value);
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

        Ajax('editar/' + $inputSearch.attr('data-id'), function(data) {
            if (data[0] == '00000') {
                $this.parent().addClass('d-none');
                $inputSearch.val('').focus().removeAttr('data-id');
            }
        }, {
            value: $inputSearch.val(),
            tabela: tabela,
            campo: campo
        });
    })
    .on('click', '.adicionar', function() {

        var $inputSearch = $(this).parents('.list-group-filtereds-wrapper').siblings('.search-input'),
            $searchBody = $(this).parents('.search-body'),
            tabela = $searchBody.attr('id'),
            campo = $searchBody.attr('data-campo');

        Ajax('adicionar', function(data) {
            if (data[0] == '00000') {
                $inputSearch
                    .val('')
                    .focus();
            }
        }, {
            value: $inputSearch.val(),
            campo: campo,
            tabela: tabela
        });
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