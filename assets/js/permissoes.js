$(function () {

    function checkboxs() {

        $('[type=checkbox]').each(function () {
                    
            var $this = $(this),
                textPermissao = $this.attr('id');
    
            textPermissaoSplit = textPermissao.split('_');
    
            var nome = textPermissaoSplit[0],
                permissao = textPermissaoSplit[1],
                $brothers = $('[type=checkbox][id^=' + nome + '_]:not(#' + textPermissao + ')');
                
            if (permissao == 'ver') {
    
                if ($this.is(':checked')) {
                    $brothers.removeAttr('disabled');
                } else {
                    $brothers.attr('disabled', 'disabled');
                    $brothers.prop('checked', false);

                    $('#fluxocaixa_add').removeAttr('disabled');
                }
            }
        });
    }

    $(this)
        .ready(function () {
            checkboxs();
        })
        .on('change', '[type=checkbox]', function () {
            checkboxs();
        })
        .on('submit', 'form', function (e) {

            var $alteracoes = $('[name=alteracoes]');

            if ($alteracoes.val() != '') {

                var campos_alterados = '';
                $('[type=checkbox]').each(function () {

                    let $this = $(this),
                        text_label = $this.siblings('label').text();

                    if (!!$this.attr('data-anterior') != $this.prop('checked')) {
                        
                        let dataAnterior = $this.attr('data-anterior') == 'true' ? 'Tem Permissão' : 'Não Tem Permissão',
                            valorAtual = $this.prop('checked') ? 'Tem Permissão' : 'Não Tem Permissão';

                        campos_alterados += '{' + text_label.toUpperCase() + ' de (' + dataAnterior + ') para (' + valorAtual + ')}';
                    }
                });

                $('[type=text]').each(function () {

                    let $this = $(this),
                        text_label = $this.siblings('label').find('span').text(),
                        dataAnterior = $this.attr('data-anterior'),
                        valorAtual = $this.val();

                    if (dataAnterior != valorAtual) {
                        campos_alterados += '{' + text_label.toUpperCase() + ' de (' + dataAnterior + ') para (' + valorAtual + ')}';
                    }
                });

                if (campos_alterados != '') {

                    $alteracoes.val($alteracoes.val() + '##' + campos_alterados);
                }
            }
        });;
});