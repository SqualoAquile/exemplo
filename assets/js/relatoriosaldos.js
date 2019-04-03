function floatParaPadraoBrasileiro(valor){
    var valortotal = valor;
    valortotal = number_format(valortotal,2,',','.');
    return valortotal;
}

function floatParaPadraoInternacional(valor){
    
    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format( numero, decimal, decimal_separador, milhar_separador ){ 
        numero = (numero + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+numero) ? 0 : +numero,
            prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
            sep = (typeof milhar_separador === 'undefined') ? ',' : milhar_separador,
            dec = (typeof decimal_separador === 'undefined') ? '.' : decimal_separador,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
 
        // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
}

$(function () {

    var $collapse = $('#collapseFluxocaixaResumo'),
        $cardBodyFiltros = $('#card-body-filtros'),
        dataTable = window.dataTable,
        indexColumns = {
            cmesReferencia : 2,
            ctotalInicial : 3,
            ctotalEntradas : 4,
            ctotalSaidas : 5,
            ctotalFinal : 6,
            ccaixaInicial : 7,
            conlineInicial : 8,
            cbancoInicial : 9,
            ccaixaFinal : 10,
            conlineFinal : 11,
            cbancoFinal : 12,
            cresultado : 13,
            cdiferenca : 14
        }
    
    
    dataTable.page.len(-1).draw();
    

    function resumo () {
        
        var rowData = dataTable.rows().data(),
        mesReferencia = 0,
        totalInicial = 0,
        totalEntradas = 0,
        totalSaidas = 0,
        totalFinal = 0,
        caixaInicial = 0,
        onlineInicial = 0,
        bancoInicial = 0,
        caixaFinal = 0,
        onlineFinal = 0,
        cbancoFinal = 0,
        resultado = 0,
        diferenca = 0,
        resultadoCaixa = 0,
        resultadoOnline = 0,
        resultadoBanco = 0,
    
        i = 0;
        rowData.each(function () {

            totalInicial += rowData[i][indexColumns.ctotalInicial];
            totalEntradas += rowData[i][indexColumns.ctotalEntradas];
            totalSaidas += rowData[i][indexColumns.ctotalSaidas];
            totalFinal += rowData[i][indexColumns.ctotalFinal];
            caixaInicial += rowData[i][indexColumns.ccaixaInicial];
            onlineInicial += rowData[i][indexColumns.conlineInicial];
            bancoInicial += rowData[i][indexColumns.cbancoInicial];
            caixaFinal += rowData[i][indexColumns.ccaixaFinal];
            onlineFinal += rowData[i][indexColumns.conlineFinal];
            bancoFinal += rowData[i][indexColumns.cbancoFinal];
            resultado += rowData[i][indexColumns.cresultado];
            diferenca += rowData[i][indexColumns.cdiferenca];
            i++;
        });
    
        $('#totalInicial').text(floatParaPadraoBrasileiro(totalInicial));
        $('#totalEntradas').text(floatParaPadraoBrasileiro(totalEntradas));
        $('#totalSaidas').text(floatParaPadraoBrasileiro(totalSaidas));
        $('#totalFinal').text(floatParaPadraoBrasileiro(totalFinal));
        $('#caixaInicial').text(floatParaPadraoBrasileiro(caixaInicial));
        $('#onlineInicial').text(floatParaPadraoBrasileiro(onlineInicial));
        $('#bancoInicial').text(floatParaPadraoBrasileiro(bancoInicial));
        $('#caixaFinal').text(floatParaPadraoBrasileiro(caixaFinal));
        $('#onlineFinal').text(floatParaPadraoBrasileiro(onlineFinal));
        $('#bancoFinal').text(floatParaPadraoBrasileiro(bancoFinal));
        $('#resultado').text(floatParaPadraoBrasileiro(resultado));
        $('#diferenca').text(floatParaPadraoBrasileiro(diferenca));

        resultadoBanco = bancoFinal - bancoInicial;
        resultadoCaixa = caixaFinal - caixaInicial;
        resultadoOnline = onlineFinal - onlineInicial;

        $('#resultadoBanco').text(floatParaPadraoBrasileiro(resultadoBanco));
        $('#resultadoCaixa').text(floatParaPadraoBrasileiro(resultadoCaixa));
        $('#resultadoOnline').text(floatParaPadraoBrasileiro(resultadoOnline));

        if(resultado <= 0){
            $('#cardResultado').removeClass('bg-success text-white').addClass('bg-danger text-white');
        } else{
            $('#cardResultado').removeClass('bg-danger text-white').addClass('bg-success text-white');
        }

        if(resultadoBanco <= 0){
            $('#cardResultadoBanco').removeClass('bg-success text-white').addClass('bg-danger text-white');
        } else{
            $('#cardResultadoBanco').removeClass('bg-danger text-white').addClass('bg-success text-white');
        }

        if(resultadoOnline <= 0){
            $('#cardResultadoOnline').removeClass('bg-success text-white').addClass('bg-danger text-white');
        } else{
            $('#cardResultadoOnline').removeClass('bg-danger text-white').addClass('bg-success text-white');
        }

        if(resultadoCaixa <= 0){
            $('#cardResultadoCaixa').removeClass('bg-success text-white').addClass('bg-danger text-white');
        } else{
            $('#cardResultadoCaixa').removeClass('bg-danger text-white').addClass('bg-success text-white');
        }


    };

    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');
    $('#graficos').addClass('d-none');

    $('#collapseFluxocaixaResumo').on('show.bs.collapse', function () {
        resumo();
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
      });

    $('#collapseFluxocaixaResumo').on('hide.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#limpar-filtro').on('click', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        
    });

    $('#card-body-filtros').on('change', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

});
