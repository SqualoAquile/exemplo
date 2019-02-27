$(function () {

    var $inclusoes = $('#inclusoes'),
        $taxa_debito = $('[name=txdebito]'),
        $taxa_credito = $('[name=txcredcom]'),
        $bandeira = $('[name=band]'),
        $dias_debito = $('[name=diasdebito]'),
        $dias_credito = $('[name=diascredcom]'),
        $dias_antecipacao = $('[name=diasantecip]'),
        $formBandeiras = $('#form-bandeiras'),
        $mainForm = $('#main-form'),
        indexTrTable = 0;
    
    $inclusoes.hide();

    $('#form-bandeiras').submit(function (event) {
        event.preventDefault();
        if (this.checkValidity()) {
            Save();
        }
    });

    $(document)
        .ready(function() {

            if (!infoAdm) return;

            $inclusoes.show();

            bandeirasAceitas.forEach(function (bandeiraAceita) {
                
                let idBandeira = bandeiraAceita.nome,
                    $bandeira = listaBandeiras.filter(function (listaBandeira) {
                        return listaBandeira.id == idBandeira;
                    }),
                    bandeiraAceitainformacoes = bandeiraAceita.informacoes,
                    bandeira = $bandeira[0].nome,
                    informacoes = bandeiraAceitainformacoes.split('-'),
                    txRcbDeb = informacoes[0],
                    diasRcbDeb = informacoes[1],
                    txRcbCred = informacoes[2],
                    diasRcbCred = informacoes[3],
                    diasAntecip = informacoes[4],
                    parcelas = informacoes[5],
                    txantecipacao = bandeiraAceita.txantecipacao,
                    txAntecipacao = txantecipacao.split('-'),
                    txcredito = bandeiraAceita.txcredito,
                    txCredito = txcredito.split('-'),
                    antecipacoes = [],
                    creditos = [];

                txRcbDeb = txRcbDeb.replace('.', ',');
                txRcbCred = txRcbCred.replace('.', ',');

                txAntecipacao.forEach(function(antecipacao, index) {
                    antecipacao = antecipacao.replace('.', ',');
                    antecipacoes.push({
                        index: index + 1,
                        value: antecipacao
                    });
                });

                txCredito.forEach(function(credito, index) {
                    credito = credito.replace('.', ',');
                    creditos.push({
                        index: index + 1,
                        value: credito
                    });
                });

                Popula(
                    idBandeira,
                    bandeira,
                    txRcbDeb,
                    diasRcbDeb,
                    txRcbCred,
                    diasRcbCred,
                    diasAntecip,
                    parcelas,
                    antecipacoes,
                    creditos,
                    bandeiraAceita.id
                );
            });
        })
        .on('click', '.editar-inclusao', function () {
            Edit(this);
        })
        .on('click', '.excluir-inclusao', function () {
            Delete(this);
        });

    $('.percent-mask').mask('00,00%', { reverse: true });
    $('.number-mask').mask('00');

    $('[name=nroparc]')
        .change(function () {
            
            $taxas = $('#tabela-taxas'),
                value = $(this).val();

            if (value) {

                var $taxasTr = $taxas.find('tbody tr');

                $taxasTr.hide()
                
                $taxasTr.not(':lt(' + value + ')').find('input')
                    .val(0)
                    .removeClass('active');
                
                $taxas
                    .find('tbody tr:lt(' + value + ')').show()
                    .find('.taxas').addClass('active');

                $taxas.show();
            } else {
                $taxas.hide();
            }
        })
        .change();

    $('#iband')
        .change(function() {

            var $this = $(this);

            $this
                .removeClass('is-invalid')
                .addClass('is-valid');

            $this[0].setCustomValidity('');

            $this.siblings('.invalid-feedback').remove();
                        
            if (BandeiraSendoUsada($this.val())) {

                $this
                    .removeClass('is-valid')
                    .addClass('is-invalid');

                $this[0].setCustomValidity('invalid');

                $this.after('<div class="invalid-feedback">Essa bandeira já está sendo usada.</div>');
            }
        });

    $('#incluir').click(function () {
        Save();
    });

    function Save() {
        
        $inclusoes.show();

        var antecipacoes = [],
            creditos = [];
        
        $('.taxas-antecipacao').each(function(index, el) {

            let valueTransform = $(el).val().replace('%', '');

            antecipacoes.push({
                index: index + 1,
                value: valueTransform
            });
        });
        
        $('.taxas-credito').each(function(index, el) {

            let valueTransform = $(el).val().replace('%', '');

            creditos.push({
                index: index + 1,
                value: valueTransform
            });
        });

        let id_bandeira = $bandeira.val(),
            bandeira = $('[name=band] option:selected').text(),
            parcelas = $('[name="nroparc"] option:selected').text(),
            taxa_debito_clean = $taxa_debito.val().replace('%', ''),
            taxa_credito_clean = $taxa_credito.val().replace('%', '');

        Popula(
            id_bandeira,
            bandeira,
            taxa_debito_clean,
            $dias_debito.val(),
            taxa_credito_clean,
            $dias_credito.val(),
            $dias_antecipacao.val(),
            parcelas,
            antecipacoes,
            creditos
        );
    };

    function Popula(paramIdBandeira, bandeira, taxa_debito, dias_debito, taxa_credito, dias_credito, dias_antecipacao, parcelas, antecipacoes, creditos, bandeiraAceitaId) {

        let infos = taxa_debito.replace(',', '.') + '-' + dias_debito + '-' + taxa_credito.replace(',', '.') + '-' + dias_credito + '-' + dias_antecipacao + '-' + parcelas,
            txantecipacao = [],
            antecipacoesHtml = '',
            txcredito = [],
            creditosHtml = '';

        antecipacoes.forEach(function (antecipacao) {
            
            txantecipacao.push(antecipacao.value.replace(',', '.'));

            if (antecipacao.value != '0') {
                antecipacoesHtml += `
                    <div class="d-flex">
                        <div>` + antecipacao.index + `x</div>
                        <span class="px-2">-</span>
                        <div>` + antecipacao.value + `%</div>
                    </div>
                `;
            }
        });

        creditos.forEach(function (credito) {

            txcredito.push(credito.value.replace(',', '.'));

            if (credito.value != '0') {
                creditosHtml += `
                    <div class="d-flex">
                        <div>` + credito.index + `x</div>
                        <span class="px-2">-</span>
                        <div>` + credito.value + `%</div>
                    </div>
                `;
            }
        });

        var indexEditando = $formBandeiras.attr('data-editando'),
            tds = `
                <td>
                    <div class="id_bandeira">
                        <input type="hidden" value="` + paramIdBandeira + `">
                        ` + bandeira + `
                    </div>
                </td>
                <td>` + parcelas + `</td>
                <td>
                    <div class="d-flex flex-column">` + antecipacoesHtml + `</div>
                </td>
                <td>
                    <div class="d-flex flex-column">` + creditosHtml + `</div>
                </td>
                <td>` + taxa_debito + `%</td>
                <td>` + dias_debito + `</td>
                <td>` + taxa_credito + `%</td>
                <td>` + dias_credito + `</td>
                <td>` + dias_antecipacao + `</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Ações">
                        <a href="javascript:void(0)" class="editar-inclusao btn btn-primary btn-sm">Editar</a>
                        <a href="javascript:void(0)" class="excluir-inclusao btn btn-secondary btn-sm">Excluir</a>
                    </div>
                </td>
            `;

        txantecipacaojoin = txantecipacao.join('-');
        txcreditojoin = txcredito.join('-');

        SetInput(paramIdBandeira, bandeira, infos, txantecipacaojoin, txcreditojoin, bandeiraAceitaId);

        $('#form-bandeiras').trigger('reset');
        $('[name="nroparc"]').change();

        if (!indexEditando) {
            $('#table-inclusoes tbody')
                .prepend('<tr data-index="' + indexTrTable + '">' + tds + '</tr>');

            indexTrTable++;
        } else {
            $('#table-inclusoes tbody tr[data-index=' + indexEditando + ']')
                .html(tds);
        }
    };

    function SetInput(paramIdBandeira, bandeira, infos, txantecipacao, txcredito, bandeiraAceitaId) {

        var indexEditando = $formBandeiras.attr('data-editando');

        if (paramIdBandeira) {
            if (!indexEditando) {
                $mainForm
                    .append(`
                        <div class="conteudos-escondidos" data-tr-index="` + indexTrTable + `">
                            <input type="text" data-bandeira="` + paramIdBandeira + `" class="bandeiraaceita_id" name="bandeiraaceita_id` + paramIdBandeira + `" value="` + bandeiraAceitaId + `" required>
                            <input type="text" data-bandeira="` + paramIdBandeira + `" class="flag" name="flag` + paramIdBandeira + `" value="` + paramIdBandeira + `" required>
                            <input type="text" data-bandeira="` + paramIdBandeira + `" class="bandeira" name="bandeira[` + paramIdBandeira + `]" value="` + bandeira + `" required>
                            <input type="text" data-bandeira="` + paramIdBandeira + `" class="infos" name="infos[` + paramIdBandeira + `]" value="` + infos + `" required>
                            <input type="text" data-bandeira="` + paramIdBandeira + `" class="txant" name="txant[` + paramIdBandeira + `]" value="` + txantecipacao + `" required>
                            <input type="text" data-bandeira="` + paramIdBandeira + `" class="txcre" name="txcre[` + paramIdBandeira + `]" value="` + txcredito + `" required>
                        </div>
                    `);
            } else {
                
                var $divHiddensEditando = $mainForm.find('[data-tr-index="' + indexEditando + '"]')

                $divHiddensEditando
                    .find('.bandeiraaceita_id')
                    .attr('name', 'bandeiraaceita_id' + paramIdBandeira)
                    .attr('data-bandeira', paramIdBandeira);

                $divHiddensEditando
                    .find('.flag')
                    .attr('name', 'flag' + paramIdBandeira)
                    .attr('data-bandeira', paramIdBandeira)
                    .val(paramIdBandeira);

                $divHiddensEditando
                    .find('.bandeira')
                    .attr('name', 'bandeira[' + paramIdBandeira + ']')
                    .attr('data-bandeira', paramIdBandeira)
                    .val(bandeira);
                    
                $divHiddensEditando
                    .find('.infos')
                    .attr('name', 'infos[' + paramIdBandeira + ']')
                    .attr('data-bandeira', paramIdBandeira)
                    .val(infos);

                $divHiddensEditando
                    .find('.txant')
                    .attr('name', 'txant[' + paramIdBandeira + ']')
                    .attr('data-bandeira', paramIdBandeira)
                    .val(txantecipacao);

                $divHiddensEditando
                    .find('.txcre')
                    .attr('name', 'txcre[' + paramIdBandeira + ']')
                    .attr('data-bandeira', paramIdBandeira)
                    .val(txcredito);

                $formBandeiras.removeAttr('data-editando');
            }
        }
    };

    function Edit(_this) {

        let par = $(_this).closest('tr'),
            id_bandeira = par.find('.id_bandeira input').val(),
            index_editando = $(par).attr('data-index'),
            $divHiddensEditando = $('.conteudos-escondidos[data-tr-index="' + index_editando + '"]');

        par.find('.btn').addClass('disabled');

        $bandeira.val(id_bandeira).focus();

        $('#form-bandeiras').attr('data-editando', par.attr('data-index'));

        var infos = $divHiddensEditando.find('.infos').val().split('-'),
            taxas_antecipacao = $divHiddensEditando.find('.txant').val().split('-'),
            taxas_credito = $divHiddensEditando.find('.txcre').val().split('-'),
            taxa_debito = infos[0],
            dias_debito = infos[1],
            taxa_credito = infos[2],
            dias_credito = infos[3],
            dias_antecipacao = infos[4],
            parcelas = infos[5];

        $taxa_debito.val(taxa_debito.replace('.', ',') + '%');
        $dias_debito.val(dias_debito);
        $taxa_credito.val(taxa_credito.replace('.', ',') + '%');
        $dias_credito.val(dias_credito);
        $dias_antecipacao.val(dias_antecipacao);
        
        $('[name="nroparc"]').val(parcelas).change();

        taxas_antecipacao.forEach(function (taxa, index) {
            $('#itxantecip_' + (index + 1)).val(taxa.replace('.', ',') + '%');
        });

        taxas_credito.forEach(function (taxa, index) {
            $('#itxcredsemjuros_' + (index + 1)).val(taxa.replace('.', ',') + '%');
        });

    };

    function Delete(_this) {

        var par = $(_this).closest('tr'),
            id_bandeira = par.find('.id_bandeira input').val();

        $('[data-bandeira=' + id_bandeira + ']').remove();
        par.remove();
    };

    function BandeiraSendoUsada(idCompare) {
        let exist = false;
        $('.conteudos-escondidos').each(function () {
            if ($(this).find('.flag').val() == idCompare) {
                exist = true;
            }
        });
        return exist;
    }
});