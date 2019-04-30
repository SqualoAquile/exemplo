<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>
<script src="<?php echo BASE_URL?>/assets/js/home.js" type="text/javascript"></script>

<!-- <h1 class="display-4 font-weight-bold py-4">Home</h1> -->

<div class="card my-3">
    <div class="card-header">
        <div class="row">
            <div class="col-lg">
                <h4 class="text-weight-bold text-dark">Financeiro</h4>
            </div>
            <div class="col-lg-2">
                <select class="custom-select" id="selectGraficosTemporais">
                    <option selected disabled>Selecione o Período</option>
                    <option value="0" >Hoje</option>
                    <option value="7" >7 dias</option>
                    <option value="15">15 dias</option>
                    <option value="30">30 dias</option>
                </select>
            </div>
        </div>        
    </div>
</div>


    <div class="card card-body my-3">
        <div class="row">
            <div class="col-lg-5">
                <div class="row">

                    <div class="col-lg-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-angle-double-up"></i> Receita Realizada</small>
                                <h5 class="card-text" id="receita_realizada">R$ 0,00</h5>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div class="col-lg-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-angle-double-down"></i> Despesa Realizada</small>
                                <h5 class="card-text" id="despesa_realizada">R$ 0,00</h5>
                            </div>
                            
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card text-center">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-dollar-sign"></i> Lucro</small>
                                <h5 class="card-text" id="lucro_realizado">R$ 0,00</h5>
                            </div>
                            
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card text-center">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-percent"></i> Lucratividade</small>
                                <h5 class="card-text" id="lucratividade_realizada"> 0%</h5>
                            </div>
                        
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7">
                <canvas id="chart-div2"></canvas>
            </div>
        </div>
    </div>

    <div class="card card-body my-3">
        <div class="row">
            <div class="col-lg-5">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-angle-double-up"></i> Receita Prevista</small>
                                <h5 class="card-text" id="receita_prevista">R$ 0,00</h5>
                            </div>
                            
                        </div>
                    </div>
                    
                    <div class="col-lg-6">
                        <div class="card text-center mb-3">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-angle-double-down"></i> Despesa Prevista</small>
                                <h5 class="card-text" id="despesa_prevista">R$ 0,00</h5>
                            </div>
                            
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card text-center">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-dollar-sign"></i> Lucro Previsto</small>
                                <h5 class="card-text" id="lucro_previsto">R$ 0,00</h5>
                            </div>
                            
                        
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="card text-center">
                            <div class="card-body">
                                <small class="card-title"><i class="fas fa-percent"></i> Lucrativ. Prevista</small>
                                <h5 class="card-text" id="lucratividade_prevista"> 30%</h5>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7">
                <canvas id="chart-div3"></canvas>
            </div>
        </div>
    </div>

<div class="card card-body my-3">
    <div class="row">
        <div class="col-lg-4">
            <canvas id="graf_saldos"></canvas>
        </div>
        <div class="col-lg-4">
            <canvas id="graf_receita_analitica"></canvas>
        </div>
        <div class="col-lg-4">
            <canvas id="graf_despesa_analitica"></canvas>
        </div>
    </div>
</div>

<div class="card card-body my-3">
    <div class="row">
        <div class="col-lg">
            <canvas id="graf_saldosAno"></canvas>
        </div>
    </div>
</div>

<div class="card card-body my-3">
    <div class="row">
        <div class="col-lg">
            //tabela de registros vencidos e próximos de vencer
        </div>
    </div>
</div>


