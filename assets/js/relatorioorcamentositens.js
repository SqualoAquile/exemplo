
var charts = [];

var labelProdutosGlobal = [];
var dataProdutosGlobal = [];



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

    var id = "#chart-div";
    var ctx = document.getElementById(id.substr(1)).getContext('2d');


    var $collapse = $('#collapseFluxocaixaResumo'),
        $cardBodyFiltros = $('#card-body-filtros'),
        dataTable = window.dataTable,
        indexColumns = {
            acoes: 0,
            tipo:3,
            material_servico:4,
            valor: 8,
            quantidade: 9,
            data_aprov:14
        }
    
    // exibir tudo
    dataTable.page.len(-1).draw();

    // filtrar pra exibir apenas itens com data de aprovacao - nao tá funcionando essa merda
    // $.fn.dataTable.ext.search.push(
    //     function( settings, data, dataIndex ) {
    //         if (parseInt(data[14])>0) {
    //             var retorno = false;
    //         }else{
    //             var retorno = true;
    //         }
            
    //         return retorno;
    //     }
    // );
        
    // dataTable.draw();
    
    function exists(arr, search) {
        return arr.some(row => row.includes(search));
    }
         

    function resumo () { 
        
        var rowData = dataTable.rows().data(),
        quantidadeProdutos = 0,
        quantidadeServicos = 0,
        quantidadeServicosCompl = 0,
        totalServicos = 0,
        totalServicosCompl = 0,
        totalProdutos = 0,
        totalItens = 0,
        nomeProduto = [],
        quantidadeProduto = [],
        listaProdutos =[];

        i = 0;
        k=0;
        rowData.each(function () {                                              
            var valor = rowData[i][indexColumns.valor];
            var quantidade = parseInt(rowData[i][indexColumns.quantidade]);
            var tipo = rowData[i][indexColumns.tipo];
            var data = rowData[i][indexColumns.data_aprov];
            var produto = rowData[i][indexColumns.material_servico];          
            
            //#baile
            // tem que mostrar apenas as linhas que tenham alguma data na coluna de data_aprovacao
            if (data) {
                valor = valor.replace('R$  ', '');
                valor = floatParaPadraoInternacional(valor);
    
                valor = valor * quantidade;

                // Separando os dados para Top 5 Produtos mais vendidos
                if (tipo == "Produtos" && exists(nomeProduto,produto) == false) {
                    nomeProduto[k] = produto;
                    quantidadeProduto[k] = quantidade;

                    var entrada = [nomeProduto[k],quantidadeProduto[k]];
                    listaProdutos[k]=entrada;

                    k++;

                }else if (tipo == "Produtos" && exists(nomeProduto,produto) == true) {
                    var m = nomeProduto.indexOf(produto);
                    quantidadeProduto[m] += parseInt(quantidade);
                    var entrada = [nomeProduto[m],quantidadeProduto[m]];
                    listaProdutos[m] = entrada;
                }
                
                // Calculo para os cards do relatorio
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


        listaProdutos = listaProdutos.sort(function(a,b) {
            return b[1]-a[1];
        });

        var dataProdutos = [];
        var labelProdutos = [];

        for (let i = 0; i < listaProdutos.length; i++) {
            labelProdutos[i] = listaProdutos[i][0];
            dataProdutos[i] = listaProdutos[i][1];
        }

        if (labelProdutos.length>5 || dataProdutos.length>5) {
            labelProdutos = labelProdutos.slice(0,5);
            dataProdutos = dataProdutos.slice(0,5);
        }

        labelProdutosGlobal = labelProdutos;
        dataProdutosGlobal = dataProdutos;

        totalItens = parseFloat(totalProdutos) + parseFloat(totalServicos) + parseFloat(totalServicosCompl);
       
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
        drawChart(id);
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

    function drawChart(id) {
        var titulo;

        titulo = '5 Produtos mais vendidos';
            
        var config = {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: dataProdutosGlobal,
                    backgroundColor: [
                        '#2a4c6b',
                        '#4a85b8',
                        '#adcbe6',
                        '#e7eff7',
                        '#62abea'
                    ]
                }],
                labels: labelProdutosGlobal
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                title: {
                    display: true,
                    text: titulo,
                    position: "top"
                },
                legend: {
                    display: true,
                    position: "top"
                },
            }
        };


        if(typeof charts[id] == "undefined") {   
            charts[id]= new (function(){
            this.ctx=$(id); 
            this.chart=new Chart(this.ctx, config);
            })();     
        } else {
            charts[id].chart.destroy();
            charts[id].chart=new Chart(charts[id].ctx, config); 
        }
        
        console.log("até aqui ok");
    };



    // function drawChart(id) {
    //     var coluna, titulo, intervalo = [];

    //         titulo = '5 Produtos mais vendidos';
            
    //         $.ajax({ 
    //             url: baselink + '/ajax/top5produtos', 
    //             type: 'POST', 
    //             data: {
    //                 columns: dataTable.ajax.params(), 
    //                 modulo: currentModule
    //             },
    //             dataType: 'json', 
    //             success: function (resultado) { 
    //                 if (resultado){
    //                     var itens = [], quantidades = [];
    //                     var tamanho = resultado.length;

    //                     // pra pegar só o top 5
    //                     if (tamanho>5) {
    //                         tamanho = 5;
    //                     }

    //                     for (var i = 0; i < tamanho; i++) {
    //                         itens[i] = resultado[i][0];
    //                         quantidades[i] = resultado[i][1]; 
    //                     }
    
                        
    //                     var config = {
    //                         type: 'doughnut',
    //                         data: {
    //                             labels: itens,
    //                             datasets: [{
    //                                 data: quantidades,
    //                                 backgroundColor: [
    //                                     '#2a4c6b',
    //                                     '#4a85b8',
    //                                     '#adcbe6',
    //                                     '#e7eff7',
    //                                     '#62abea'
    //                                 ]
    //                             }]
    //                         },
    //                         options: {
    //                             responsive: true,
    //                             maintainAspectRatio: false,
    //                             title: {
    //                                 display: true,
    //                                 text: titulo,
    //                                 position: "top"
    //                             },
    //                             legend: {
    //                                 display: true,
    //                                 position: "right"
    //                             },
    //                         }
    //                     };
    
    //                     if(typeof charts[id] == "undefined") {   
    //                         charts[id]= new (function(){
    //                         this.ctx=$(id); 
    //                         this.chart=new Chart(this.ctx, config);
    //                         })();     
    //                     } else {
    //                         charts[id].chart.destroy();
    //                         charts[id].chart=new Chart(charts[id].ctx, config); 
    //                     }
    //                 }
    //             }
    //         });

    // }
      
});
