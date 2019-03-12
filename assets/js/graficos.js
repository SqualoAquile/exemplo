$(function () {

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Pega os dados da última query do datatable (pegar valores filtrados)

    $('#botaoGrafico').on('click', function() {
        drawChart();
    });

    function drawChart() {

        console.log("escutando search.dt");


        var $selectGraf = $('#selectGraficos'),
        group = $selectGraf.val();

        $.ajax({ 
            url: baselink + '/ajax/gerarGraficoFiltro', 
            type: 'POST', 
            data: {
                params: dataTable.ajax.params(), 
                campo_group: group,
                campo_sum: 'valor_total'
            },
            dataType: 'json', 
            success: function (resultado) { 

                if (resultado.data){

                    var data = new google.visualization.DataTable();

                    data.addColumn('string', 'Campo');
                    data.addColumn('number', 'Total');
                    arrTeste = [];

                    for (var i = 0; i < resultado.data.length; i++) {

                        var result = resultado.data,
                        element = result[i];

                        arrTeste.push([element[0], parseInt(element[1])]);

                    }

                    data.addRows(arrTeste);

                    var options = {
                        'title': $selectGraf.text(),
                        'width': 400,
                        'height': 300
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));

                    chart.draw(data, options);
                }
            }
        });
    }
});