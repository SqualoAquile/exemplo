<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo str_replace(array("-add", "-edt"), "", basename(__FILE__, ".php")) ?>'
</script>
<?php if (isset($_SESSION["returnMessage"])): ?>

  <div class="alert <?php echo $_SESSION["returnMessage"]["class"] ?> alert-dismissible">

    <?php echo $_SESSION["returnMessage"]["mensagem"] ?>

    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>

  </div>

<?php endif?>

<h1 class="display-4 font-weight-bold pt-4">Home</h1>

<div class="card text-center">
        <div class="card-header alert-success py-1">
            <h4 class="text-weight-bold">Financeiro</h4>
        </div>
        <div class="card-body">
            <div class="row my-1 ">

            <div class="col-lg-3 mx-0">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title"><i class="fas fa-save"></i> Exemplo Título 1</h6>
                            <h2 class="card-text">R$ 1.000,00</h2>
                        </div>
                        <div class="card-footer text-muted">
                            Na última semana
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-3 mx-0">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title"><i class="fas fa-save"></i> Exemplo Título 1</h6>
                            <h2 class="card-text">R$ 1.000,00</h2>
                        </div>
                        <div class="card-footer text-muted">
                            Na última semana
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 mx-0">
                    <div class="card text-center">
                        <div class="card-body">
                            <h6 class="card-title"><i class="fas fa-save"></i> Exemplo Título 1</h6>
                            <h2 class="card-text">R$ 1.000,00</h2>
                        </div>
                        
                    <div class="card-footer text-muted">
                            Na última semana
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 mx-0">
                    <div class="card text-center">
                        <div class="card-body alert-danger">
                            <h6 class="card-title"><i class="fas fa-save"></i> Exemplo Título 1</h6>
                            <h2 class="card-text">R$ 1.000,00</h2>
                        </div>
                        <div class="card-footer">
                            <i class="fas fa-arrow-up"></i> 14% na última semana
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    
<!-- <section id="charts">
    <div class="row my-5">
        <div class="col-xl-6">
          <canvas id="chartBar"></canvas>
        </div>
        <div class="col-xl-6">
          <canvas id="chartPie"></canvas>
        </div>
    </div>
    <div class="row my-5">
        <div class="col-xl-6">
          <canvas id="chartPolarArea"></canvas>
        </div>
        <div class="col-xl-6">
          <canvas id="chartLine"></canvas>
        </div>
    </div>
</section> -->
<script>
var ctxBar = document.getElementById("chartBar").getContext('2d');
var ctxPie = document.getElementById("chartPie").getContext('2d');
var ctxLine = document.getElementById("chartLine").getContext('2d');
var ctxPolarArea = document.getElementById("chartPolarArea").getContext('2d');

var chartBar = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '0 de Votos',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                '#007DFF',
                '#3076BF',
                '#0051A6',
                '#409EFF',
                '#73B8FF'
            ]
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

var chartPie = new Chart(ctxPie, {
    type: 'doughnut',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                '#007DFF',
                '#3076BF',
                '#0051A6',
                '#409EFF',
                '#73B8FF'
            ]
        }]
    }
});

var chartLine = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '0 de Votos',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: '#007DFF',
            options: {
                scales: {
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        }]
    }
});

var chartPolarArea = new Chart(ctxPolarArea, {
    type: 'polarArea',
    data: {
        datasets: [{
            data: [10, 20, 30],
            backgroundColor: [
                '#007DFF',
                '#3076BF',
                '#0051A6',
                '#409EFF',
                '#73B8FF'
            ]
        }],
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    }
});
</script>