function canAccessGoogleVisualization() {
    if ((typeof google === 'undefined') || (typeof google.visualization === 'undefined')) {
        return false;
    } else{
        return true;
    }
}

$(function () {

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    var $selectGraf = $('#selectGraficos'),
        dataTable = window.dataTable;

        // ainda nao esta pronto o dataTable
    $('.dataTable')
        .on('draw.dt', function() {
            if (canAccessGoogleVisualization()) {
                drawChart();
            }
        });

    $selectGraf
        .on('change', function() {
            drawChart();
        });

    function drawChart() {

        if (!$selectGraf.val()) {
            $selectGraf.val($selectGraf.find('option:not([disabled])').first().val()).change();
        };

        var group = $selectGraf.val();

        $.ajax({ 
            url: baselink + '/ajax/gerarGraficoFiltro', 
            type: 'POST', 
            data: {
                columns: dataTable.ajax.params(), 
                campo_group: group,
                campo_sum: 'valor_total'
            },
            dataType: 'json', 
            success: function (resultado) { 

                if (resultado.data){

                    var dataGrafico = new google.visualization.DataTable();

                    dataGrafico.addColumn('string', 'Campo');
                    dataGrafico.addColumn('number', 'Total');
                    arrTeste = [];

                    for (var i = 0; i < resultado.data.length; i++) {

                        var result = resultado.data,
                        element = result[i];

                        arrTeste.push([element[0], parseInt(element[1])]);

                    }

                    dataGrafico.addRows(arrTeste);

                    var chart_div = document.getElementById('chart_div');

                    var options = {
                        'title': $selectGraf.find(':selected').text().trim(),
                        'width': 500,
                        'height': 400,
                        colors: ['#2a4c6b', '#4a85b8', '#adcbe6', '#e7eff7', '#62abea']
                    };

                    var chart = new google.visualization.PieChart(chart_div);

                    chart.draw(dataGrafico, options);
                }
            }
        });
    }
});