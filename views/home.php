<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>
<script src="<?php echo BASE_URL?>/assets/js/home.js" type="text/javascript"></script>

<h1 class="display-4 font-weight-bold pt-4 text-center">Home</h1>

<div class="card text-center">
    <div class="card-header py-3">
        <div class="row">
            <div class="col-lg-6">
                <h4 class="text-weight-bold text-dark">Financeiro</h4>
            </div>
            <div class="col-lg-6">
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

    <div class="card-body p-2">
        <div class="row my-1 ">

            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2 ">
                        <h6 class="card-title"><i class="fas fa-angle-double-up"></i> Receita Realizada</h6>
                        <h2 class="card-text" id="receita_realizada">R$ 0,00</h2>
                    </div>
                    
                </div>
            </div>
            
            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title"><i class="fas fa-angle-double-down"></i> Despesa Realizada</h6>
                        <h2 class="card-text" id="despesa_realizada">R$ 0,00</h2>
                    </div>
                    
                </div>
            </div>

            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title"><i class="fas fa-dollar-sign"></i> Lucro</h6>
                        <h2 class="card-text" id="lucro_realizado">R$ 0,00</h2>
                    </div>
                    
                </div>
            </div>

            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title"><i class="fas fa-percent"></i> Lucratividade</h6>
                        <h2 class="card-text" id="lucratividade_realizada"> 0%</h2>
                    </div>
                   
                </div>
            </div>
        </div>
    </div>


    <div class="card mt-4">
        <div class="card-body" style="height: 400px">
            <canvas id="chart-div2"></canvas>
        </div>
    </div>

    <div class="card-body p-2 mt-2">
        <div class="row my-1 ">
            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2 ">
                        <h6 class="card-title"><i class="fas fa-angle-double-up"></i> Receita Prevista</h6>
                        <h2 class="card-text" id="receita_prevista">R$ 0,00</h2>
                    </div>
                    
                </div>
            </div>
            
            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title"><i class="fas fa-angle-double-down"></i> Despesa Prevista</h6>
                        <h2 class="card-text" id="despesa_prevista">R$ 0,00</h2>
                    </div>
                    
                </div>
            </div>

            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title"><i class="fas fa-dollar-sign"></i> Lucro Previsto</h6>
                        <h2 class="card-text" id="lucro_previsto">R$ 0,00</h2>
                    </div>
                    
                   
                </div>
            </div>

            <div class="col-lg-3 mx-0 my-1">
                <div class="card text-center">
                    <div class="card-body p-2">
                        <h6 class="card-title"><i class="fas fa-percent"></i> Lucratividade Prevista</h6>
                        <h2 class="card-text" id="lucratividade_prevista"> 30%</h2>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</div>

<div class="card mt-4">
    <div class="card-body" style="height: 400px">
        <canvas id="chart-div3"></canvas>
    </div>
</div>

    
   