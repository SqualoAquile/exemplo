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
            acoes: 0,
            valor_total: 22,
            data_emissao: 8,
            data_validade: 9,
            status:16
        }
    
    
    dataTable.page.len(-1).draw();
    

    function resumo () {
        
        var rowData = dataTable.rows().data(),
        quantidadeOrcamentos = 0,
        totalOrcado = 0;
    
    
        i = 0;
        rowData.each(function () {
            if (rowData[i][indexColumns.status].toLowerCase() == 'ativo') {
                               
                var valor = rowData[i][indexColumns.valor_total];
                valor = valor.replace('R$  ', '');
                valor = floatParaPadraoInternacional(despesa);
                totalOrcado += valor;
                quantidadeOrcamentos++;
            }
            i++;
        });

        i = 0;
       

        $('#quantidadeOrcamentos').text(parseInt(quantidadeOrcamentos));
        $('#totalOrcado').text(floatParaPadraoBrasileiro(totalOrcado));


    };

    $('#graficos').addClass('d-none');
    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');

    $('#collapseFluxocaixaResumo').on('show.bs.collapse', function () {
        resumo();
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
      });

    $('#collapseFluxocaixaResumo').on('hide.bs.collapse', function () {
        resumo();   
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
