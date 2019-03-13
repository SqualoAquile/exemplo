$(function () {

    var $selectGraf = $('#selectGraficos');

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Pega os dados da última query do datatable (pegar valores filtrados)

    $selectGraf
        .on('change', function() {
            drawChart();
        });

    function drawChart() {

        if (!$selectGraf.val()) {
            $selectGraf.val($selectGraf.find('option:not([disabled])').first().val()).change()
        };

        var group = $selectGraf.val();

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

                    var chart_div = document.getElementById('chart_div');

                    var options = {
                        'title': $selectGraf.find(':selected').text().trim(),
                        'width': 500,
                        'height': 400
                    };

                    var chart = new google.visualization.PieChart(chart_div);

                    chart.draw(data, options);
                }
            }
        });
    }
});