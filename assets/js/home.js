var charts = [];

$(function () {
   
    var $selectGrafTemporal = $('#selectGraficosTemporais'),
        modo = "agrupar", // agrupar (doughnut, bar, horizontalBar), temporal(line, bar, combo)
        id1 = "#chart-div2",
        id2 = "#chart-div3",
        id3 = "#graf_despesa_analitica",
        id4 = "#graf_receita_analitica",
        tipo = "bar",
        ctx = document.getElementById(id1.substr(1)).getContext('2d');

    $selectGrafTemporal
        .val(7)
        .on('change', function() {
            drawChart();
            receita_despesa_analitica();
            grafico_saldos();
        })
        .change();

    function drawChart() {
        var titulo, titulo2, intervalo = [], intervalo2 = [];
        var $receitaRealizada = $("#receita_realizada");
        var $despesaRealizada = $("#despesa_realizada");
        var $lucroRealizado = $("#lucro_realizado");
        var $lucratividadeRealizada = $("#lucratividade_realizada");

        var $receitaPrevista = $("#receita_prevista");
        var $despesaPrevista = $("#despesa_prevista");
        var $lucroPrevisto = $("#lucro_previsto");
        var $lucratividadePrevista = $("#lucratividade_prevista");


            if (!$selectGrafTemporal.val() ) {
                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
            };

            //// FLUXO DE CAIXA REALIZADO
            titulo = 'Fluxo de Caixa Realizado de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            intervalo = intervaloDatasRealizado($selectGrafTemporal.val());

            ///// GRÁFICO FLUXO CAIXA REALIZADO
            $.ajax({ 
                url: baselink + '/ajax/graficoFluxoCaixaRealizado', 
                type: 'POST', 
                data: {
                    intervalo: intervalo,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   
                         
                        var eixoDatas = [], receitas = [], despesas = [], result = [], resultAcul = [];
                        var recReal = parseFloat(0), despReal = parseFloat(0), lucroReal = parseFloat(0), lucrativReal = parseFloat(0);
                        
                        for (var i = 0; i < Object.keys(resultado[0]).length; i++) {
                            eixoDatas[i] = Object.keys(resultado[0])[i];
                            despesas[i] =  parseFloat(parseFloat(-1) * parseFloat(Object.values(resultado[0])[i]));
                            receitas[i] = parseFloat(Object.values(resultado[1])[i]);
                            result[i] = parseFloat(parseFloat(Object.values(resultado[1])[i]) - parseFloat(Object.values(resultado[0])[i]));
                            if(i == 0){
                                resultAcul[i] = parseFloat(result[i]).toFixed(2);    
                            }else{
                                resultAcul[i] = parseFloat(parseFloat(resultAcul[i-1]) + parseFloat(result[i])).toFixed(2);      
                            }
                            
                            despReal = despReal + parseFloat(Object.values(resultado[0])[i]);
                            recReal = recReal + parseFloat(Object.values(resultado[1])[i]);                         
                        }

                        lucroReal = recReal - despReal;
                        lucrativReal = parseFloat(lucroReal / recReal) * 100;

                        $receitaRealizada.text( 'R$ ' + floatParaPadraoBrasileiro(recReal) );
                        $despesaRealizada.text( 'R$ ' + floatParaPadraoBrasileiro(despReal) );
                        $lucroRealizado.text( 'R$ ' + floatParaPadraoBrasileiro(lucroReal) );
                        $lucratividadeRealizada.text( floatParaPadraoBrasileiro(lucrativReal) + ' %' );

                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas,
                                datasets: [{
                                    type: 'line',
                                    label: 'Resultado Acumulado',
                                    backgroundColor: '#020627',
                                    fill:false,
                                    data: resultAcul,
                                    borderColor: '#020627',
                                    borderWidth: 3
                                },{
                                    type: 'line',
                                    label: 'Resultado',
                                    backgroundColor: '#17bae8',
                                    fill:false,
                                    data: result,
                                    borderDash: [10,5],
                                    borderColor: '#17bae8',
                                    borderWidth: 2
                                }, {
                                    type: 'bar',
                                    label: 'Despesas',
                                    backgroundColor: '#418fe2',
                                    data: despesas,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }, {
                                    type: 'bar',
                                    label: 'Receitas',
                                    backgroundColor: '#064c92',
                                    data: receitas,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
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
                        }
    
                        if(typeof charts[id1] == "undefined") {   
                            charts[id1]= new (function(){
                            this.ctx=$(id1); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id1].chart.destroy();
                            charts[id1].chart=new Chart(charts[id1].ctx, config); 
                        }
                    }
                }
            });

            /////  FLUXO DE CAIXA PREVISTO
            titulo2 = 'Fluxo de Caixa Previsto de hoje até ' + $selectGrafTemporal.children("option:selected").text().trim() +'.';
            intervalo2 = intervaloDatasAQuitar($selectGrafTemporal.val());

            $.ajax({ 
                url: baselink + '/ajax/graficoFluxoCaixaPrevisto', 
                type: 'POST', 
                data: {
                    intervalo: intervalo2,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   
                         
                        var eixoDatas2 = [], receitas2 = [], despesas2 = [], result2 = [], resultAcul2 = [];
                        var recPrev = parseFloat(0), despPrev = parseFloat(0), lucroPrev = parseFloat(0), lucrativPrev = parseFloat(0);
                        
                        for (var i = 0; i < Object.keys(resultado[0]).length; i++) {
                            eixoDatas2[i] = Object.keys(resultado[0])[i];
                            despesas2[i] =  parseFloat(parseFloat(-1) * parseFloat(Object.values(resultado[0])[i]));
                            receitas2[i] = parseFloat(Object.values(resultado[1])[i]);
                            result2[i] = parseFloat(parseFloat(Object.values(resultado[1])[i]) - parseFloat(Object.values(resultado[0])[i]));
                            if(i == 0){
                                resultAcul2[i] = parseFloat(result2[i]).toFixed(2);    
                            }else{
                                resultAcul2[i] = parseFloat(parseFloat(resultAcul2[i-1]) + parseFloat(result2[i])).toFixed(2);      
                            }   
                            
                            despPrev = despPrev + parseFloat(Object.values(resultado[0])[i]);
                            recPrev = recPrev + parseFloat(Object.values(resultado[1])[i]);                         
                        }

                        lucroPrev = recPrev - despPrev;
                        lucrativPrev = parseFloat(lucroPrev / recPrev) * 100;

                        $receitaPrevista.text( 'R$ ' + floatParaPadraoBrasileiro(recPrev) );
                        $despesaPrevista.text( 'R$ ' + floatParaPadraoBrasileiro(despPrev) );
                        $lucroPrevisto.text( 'R$ ' + floatParaPadraoBrasileiro(lucroPrev) );
                        $lucratividadePrevista.text( floatParaPadraoBrasileiro(lucrativPrev) + ' %' );

                        var config = {
                            type: 'bar',
                            data: {
                                labels: eixoDatas2,
                                datasets: [{
                                    type: 'line',
                                    label: 'Resultado Acumulado',
                                    backgroundColor: '#020627',
                                    fill:false,
                                    data: resultAcul2,
                                    borderColor: '#020627',
                                    borderWidth: 3
                                },{
                                    type: 'line',
                                    label: 'Resultado',
                                    backgroundColor: '#17bae8',
                                    fill:false,
                                    data: result2,
                                    borderDash: [10,5],
                                    borderColor: '#17bae8',
                                    borderWidth: 2
                                }, {
                                    type: 'bar',
                                    label: 'Despesas',
                                    backgroundColor: '#418fe2',
                                    data: despesas2,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }, {
                                    type: 'bar',
                                    label: 'Receitas',
                                    backgroundColor: '#064c92',
                                    data: receitas2,
                                    borderColor: 'white',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                title: {
                                    display: true,
                                    text: titulo2,
                                    position: "top"
                                },
                                legend: {
                                    display: true,
                                    position: "top"
                                },
                            }
                        }
    
                        if(typeof charts[id2] == "undefined") {   
                            charts[id2]= new (function(){
                            this.ctx=$(id2); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id2].chart.destroy();
                            charts[id2].chart=new Chart(charts[id2].ctx, config); 
                        }
                    }
                }
            });

    }

    function receita_despesa_analitica() {
        var titulo, titulo2, intervalo = [];

            if (!$selectGrafTemporal.val() ) {
                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
            };

            //// DESPESAS ANALÍTICAS REALIZADAS
            titulo = 'Despesas Separadas por Conta Analítica de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            titulo2 = 'Receitas Separadas por Conta Analítica de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            intervalo = intervaloDatasRealizado($selectGrafTemporal.val());

            ///// despesas e receitas agrupadas por conta analítica
            $.ajax({ 
                url: baselink + '/ajax/graficoReceitaDespesaAnalitica', 
                type: 'POST', 
                data: {
                    intervalo: intervalo,
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   

                        var labelsDespesa = [], valoresDespesa = [], coresDespesa = [];
                        var labelsReceita = [], valoresReceita = [], coresReceita = [];
                    
                        labelsDespesa = Object.keys( resultado[0] );
                        valoresDespesa = Object.values( resultado[0] );
                        coresDespesa = ['#022346','#359db5','#0b7bff','#1e43af','#17bae8'];
                        
                        labelsReceita = Object.keys( resultado[1] );
                        valoresReceita = Object.values( resultado[1] );
                        coresReceita = ['#022346','#0b7bff'];
                        
                        var config = {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: valoresDespesa,
                                    backgroundColor: coresDespesa,
                                }],
                                labels: labelsDespesa
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: titulo
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
    
                        if(typeof charts[id3] == "undefined") {   
                            charts[id3]= new (function(){
                            this.ctx=$(id3); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id3].chart.destroy();
                            charts[id3].chart=new Chart(charts[id3].ctx, config); 
                        }

                        var config = {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: valoresReceita,
                                    backgroundColor: coresReceita,
                                }],
                                labels: labelsReceita
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: titulo2
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
    
                        if(typeof charts[id4] == "undefined") {   
                            charts[id4]= new (function(){
                            this.ctx=$(id4); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id4].chart.destroy();
                            charts[id4].chart=new Chart(charts[id4].ctx, config); 
                        }
                    }
                }
            });            
    }

    function grafico_saldos() {
        var titulo, titulo2, intervaloDiasMesAtual = [], intervaloMesesAno = [] ;

            if (!$selectGrafTemporal.val() ) {
                $selectGrafTemporal.val($selectGrafTemporal.find('option:not([disabled])').first().val()).change();
            };

            //// DESPESAS ANALÍTICAS REALIZADAS
            titulo = 'Saldo do mês + resultado de ' + $selectGrafTemporal.children("option:selected").text().trim() +' até hoje.';
            titulo2 = 'Fluxo de Caixa do Ano '
            intervaloDiasMesAtual = intervaloDatasRealizado($selectGrafTemporal.val());
            intervaloMesesAno = intervaloDatasSaldos(dataAtual());
            // intervaloMesesAno = intervaloDatasSaldos('13/12/2019');
            
            ///// saldos do ano e do mês
            $.ajax({ 
                url: baselink + '/ajax/saldosMeseAno', 
                type: 'POST', 
                data: {
                    intervaloDias: intervaloDiasMesAtual,
                    intervaloMeses: intervaloMesesAno
                },
                dataType: 'json', 
                success: function (resultado) { 
                    if (resultado){   

                        var labelsDespesa = [], valoresDespesa = [], coresDespesa = [];
                        var labelsReceita = [], valoresReceita = [], coresReceita = [];
                        var receitaAux = parseFloat(0), saldoAux = parseFloat(0), saldo = parseFloat(0);
                    
                        labelsDespesa = Object.keys( resultado[0] );
                        valoresDespesa = Object.values( resultado[0] );
                        coresDespesa = ['#022346','#359db5','#0b7bff','#1e43af','#17bae8'];
                        
                        labelsReceita = Object.keys( resultado[1] );
                        valoresReceita = Object.values( resultado[1] );
                        coresReceita = ['#022346','#0b7bff'];

                        for ( var i = 0; i < valoresReceita.length; i++ ){
                            receitaAux = receitaAux + parseFloat( valoresReceita[i] );
                        }

                        
                        var config = {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: valoresDespesa,
                                    backgroundColor: coresDespesa,
                                }],
                                labels: labelsDespesa
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: titulo
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
    
                        if(typeof charts[id3] == "undefined") {   
                            charts[id3]= new (function(){
                            this.ctx=$(id3); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id3].chart.destroy();
                            charts[id3].chart=new Chart(charts[id3].ctx, config); 
                        }

                        var config = {
                            type: 'doughnut',
                            data: {
                                datasets: [{
                                    data: valoresReceita,
                                    backgroundColor: coresReceita,
                                }],
                                labels: labelsReceita
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'right',
                                },
                                title: {
                                    display: true,
                                    text: titulo2
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
    
                        if(typeof charts[id4] == "undefined") {   
                            charts[id4]= new (function(){
                            this.ctx=$(id4); 
                            this.chart=new Chart(this.ctx, config);
                            })();     
                        } else {
                            charts[id4].chart.destroy();
                            charts[id4].chart=new Chart(charts[id4].ctx, config); 
                        }
                    }
                }
            });            
    }

});

function dataAtual() {
    var dt, dia, mes, ano, dtretorno;
    dt = new Date();
    dia = dt.getDate();
    mes = dt.getMonth() + 1;
    ano = dt.getFullYear();

    if (dia.toString().length == 1) {
        dia = "0" + dt.getDate();
    }
    if (mes.toString().length == 1) {
        mes = "0" + mes;
    }

    dtretorno = dia + "/" + mes + "/" + ano;

    return dtretorno;
}

function proximoDiaUtil(dataInicio, distdias) {

    if (dataInicio) {
        if (distdias != 0) {
            var dtaux = dataInicio.split("/");
            var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

            //soma a quantidade de dias para o recebimento/pagamento
            dtvenc.setDate(dtvenc.getDate() + distdias);

            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }

            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;
            return dtvenc;
        } else {
            return dataInicio;
        }
    } else {
        return false;
    }
}

function floatParaPadraoBrasileiro(valor) {
    var valortotal = valor;
    valortotal = number_format(valortotal, 2, ',', '.');
    return valortotal;
}

function floatParaPadraoInternacional(valor) {

    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
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

function intervaloDatasRealizado(intervalo) {
    var hoje, dtaux, dtaux1, dia, mes, ano, dia1, mes1, ano1, retorno = [];

        // calculando o valor de HOJE
        dtaux = new Date();
        
        dia = dtaux.getDate();
        if (dia.toString().length == 1) {
            dia = "0" + dtaux.getDate();
        }

        mes = dtaux.getMonth() + 1;
        if (mes.toString().length == 1) {
            mes = "0" + mes;
        }
        ano = dtaux.getFullYear();

        hoje = ano + '-' + mes + '-' + dia;

        // criando o array de DATAS

        if(parseInt(intervalo) != parseInt(0)){
            k=0;
            for(i = parseInt(intervalo) ; i > 0 ; i--){
                dtaux1 = new Date(ano, parseInt(mes) - 1, dia); 
                dtaux1.setDate(dtaux1.getDate() - i);

                dia1 = dtaux1.getDate();
                if (dia1.toString().length == 1) {
                    dia1 = "0" + dtaux1.getDate();
                }
                
                mes1 = dtaux1.getMonth() + 1;
                if (mes1.toString().length == 1) {
                    mes1 = "0" + mes1;
                }
                ano1 = dtaux1.getFullYear();

                retorno[k] = ano1 + '-' + mes1 + '-' + dia1;
                k++;
            }
        }
        
        retorno[parseInt(intervalo)] = hoje;

        return retorno;

}

function intervaloDatasAQuitar(intervalo) {
    var hoje, dtaux, dtaux1, dia, mes, ano, dia1, mes1, ano1, retorno = [];

        // calculando o valor de HOJE
        dtaux = new Date();
        
        dia = dtaux.getDate();
        if (dia.toString().length == 1) {
            dia = "0" + dtaux.getDate();
        }

        mes = dtaux.getMonth() + 1;
        if (mes.toString().length == 1) {
            mes = "0" + mes;
        }
        ano = dtaux.getFullYear();

        hoje = ano + '-' + mes + '-' + dia;

        // criando o array de DATAS

        if(parseInt(intervalo) != parseInt(0)){
            k=1;
            for(i = 1; i < parseInt(intervalo)  ; i++){
                dtaux1 = new Date(ano, parseInt(mes) - 1, dia); 
                dtaux1.setDate(dtaux1.getDate() + i);
                
                dia1 = dtaux1.getDate();
                if (dia1.toString().length == 1) {
                    dia1 = "0" + dtaux1.getDate();
                }
                
                mes1 = dtaux1.getMonth() + 1;
                if (mes1.toString().length == 1) {
                    mes1 = "0" + mes1;
                }
                ano1 = dtaux1.getFullYear();
                
                retorno[k] = ano1 + '-' + mes1 + '-' + dia1;
                k++;
            }
        }
        
        retorno[0] = hoje;
        
        return retorno;

}

function intervaloDatasSaldos(dtAtual) {
    var mes1, ano1, retorno = [];

        // calculando o valor de HOJE
        dtAtual = dtAtual.split('/');
        
        mesAtual = dtAtual[1];
        anoAtual = dtAtual[2];

        console.log('mesatual: ', mesAtual, 'anoatual: ', anoAtual);
        console.log(parseInt(mesAtual));
        // criando o array de DATAS

        if(parseInt(mesAtual) > parseInt(0)){
            k=0;
            for(i = 1; i <= parseInt(mesAtual)  ; i++){
            
                if (i.toString().length == 1) {
                    mes1 = "0" + i;
                }else{
                    mes1 = i;
                }
                ano1 = anoAtual;
                
                retorno[k] = ano1 + '-' + mes1 + '-01';
                k++;
            }
        }
        
        // if(retorno.length == 1){
        //     retorno[1] = anoAtual + '-01-01';
        // }
        // retorno[0] = ano1 + '-01-01';
        
        return retorno;

}

function aleatorioEntre(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}