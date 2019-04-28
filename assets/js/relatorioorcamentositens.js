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
            tipo:3,
            valor: 8,
            quantidade: 9,
            data_aprov:14
        }
    
    // exibir tudo
    dataTable.page.len(-1).draw();

    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            if (data[14]) {
                var retorno = false;
            }else{
                var retorno = true;
            }
            
            return retorno;
        }
    );
        
    dataTable.draw();       
         

    function resumo () {  

        // $.fn.dataTable.ext.search.push(
        //     function( settings, data, dataIndex ) {
        //         if (data[indexColumns.data_aprovacao]) {
        //             var retorno = false;
        //         }else{
        //             var retorno = true;
        //         }
                
        //         return retorno;
        //     }
        // );
        
        // dataTable.draw();       
        
        
        var rowData = dataTable.rows().data(),
        quantidadeProdutos = 0,
        quantidadeServicos = 0,
        quantidadeServicosCompl = 0,
        totalServicos = 0,
        totalServicosCompl = 0,
        totalProdutos = 0,
        totalItens = 0;
    
        i = 0;
        rowData.each(function () {                                              
            var valor = rowData[i][indexColumns.valor];
            var quantidade = rowData[i][indexColumns.quantidade];
            var tipo = rowData[i][indexColumns.tipo];
            var data = rowData[i][indexColumns.data_aprov];            
            
            //#baile
            // tem que mostrar apenas as linhas que tenham alguma data na coluna de data_aprovacao;
            if (data) {
                valor = valor.replace('R$  ', '');
                valor = floatParaPadraoInternacional(valor);
    
                valor = valor * quantidade;
    
                if(tipo=="Produtos"){
                    totalProdutos += parseFloat(valor);
                    quantidadeProdutos += parseInt(quantidade);
                }else if(tipo=="Servicos"){
                    totalServicos += parseFloat(valor);
                    quantidadeServicos += parseInt(quantidade);
                }else if(tipo=="Servicoscomplementares"){
                    totalServicosCompl += parseFloat(valor);
                    quantidadeServicosCompl += parseInt(quantidade);
                }
            }
            i++;
    
        });

        totalItens = parseFloat(totalProdutos) + parseFloat(totalServicos) + parseFloat(totalServicosCompl);

        i = 0;
       
        $('#totalItens').text(floatParaPadraoBrasileiro(totalItens));

        $('#quantidadeServicos').text(parseInt(quantidadeServicos));
        $('#totalServicos').text(floatParaPadraoBrasileiro(totalServicos));

        $('#quantidadeServicosCompl').text(parseInt(quantidadeServicosCompl));
        $('#totalServicosCompl').text(floatParaPadraoBrasileiro(totalServicosCompl));


        $('#quantidadeProdutos').text(parseInt(quantidadeProdutos));
        $('#totalProdutos').text(floatParaPadraoBrasileiro(totalProdutos));

        dataTable.page.len(10).draw();
        $('#DataTables_Table_0_length').removeClass('d-none');
  
    };

    $('#DataTables_Table_0_length').addClass('d-none');
    $('#DataTables_Table_0_wrapper').addClass('d-none');
    $('#graficos').addClass('d-none');

    $('#collapseFluxocaixaResumo').on('show.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').removeClass('d-none');
        resumo();
      });

    $('#collapseFluxocaixaResumo').on('hide.bs.collapse', function () {
        $('#DataTables_Table_0_wrapper').addClass('d-none');
        dataTable.page.len(-1).draw();
    });


    $('#limpar-filtro').on('click', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#graficos').on('click', function () {
        $('#collapseFiltros').collapse('hide');
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });

    $('#card-body-filtros').on('change', function () {
        $('#collapseFluxocaixaResumo').collapse('hide');
        $('#DataTables_Table_0_wrapper').addClass('d-none');
    });


    $('#botaoRelatorio').on('click', function(){

        var selectFaixa = $('.input-filtro-faixa');
        var selectF = selectFaixa.siblings('input');
        var faixa = false;
       
        selectF.each(function(){
            if($(this).val()){
                faixa = true;
            }
        });

        var selectTexto = $('.input-filtro-texto');
        var selectT = selectTexto.siblings('input');
        var texto = false;

        selectT.each(function(){
            if($(this).val()){
                texto = true;
            }
        });
    
        if(!faixa && !texto) {
            alert("Aplique um filtro para emitir um relatório!");
            event.stopPropagation();
        }else{
            resumo();
            $('#DataTables_Table_0_wrapper').removeClass('d-none');
        }
    });
      
});
