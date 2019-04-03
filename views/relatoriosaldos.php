<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatoriosaldos.js" type="text/javascript"></script>

<?php
// Constroi o cabeçalho
require "_header_browser_relatorios.php";
?>

<div class="collapse mb-5" id="collapseFluxocaixaResumo">
    <div class="card card-body">
        <div class="row" id="somasResumo">
            <div class="col-lg">
                <div class="row">
                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Total Inicial
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="totalInicial"></h5>
                        </div>

                        <h5 class="my-4 text-center">
                        Total Final
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="totalFinal"></h5>
                        </div>

                        <h5 class="my-4 text-center">
                        Resultado
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3" id="cardResultado">
                            <h5 id="resultado"></h5>
                        </div>

                        <h5 class="my-4 text-center d-lg-none">
                        Diferença
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="diferenca"></h5>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Saldo Bancário Inicial
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="bancoInicial"></h5>
                        </div>

                        <h5 class="my-4 text-center">
                        Saldo Bancário Final
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="bancoFinal"></h5>
                        </div>

                        <h5 class="my-4 text-center">
                        Resultado Saldo Bancário
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3" id="cardResultadoBanco">
                            <h5 id="resultadoBanco"></h5>
                        </div>
                    </div>
                </div>

                <div class="row">

                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Saldo em Caixa Inicial
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="caixaInicial"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Saldo em Caixa Final
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="caixaFinal"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Resultado em Caixa
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3" id="cardResultadoCaixa">
                            <h5 id="resultadoCaixa"></h5>
                        </div>
                    </div>

                    
                </div>

                <div class="row">

                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Saldo Online Inicial
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="onlineInicial"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Saldo Online Final
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3">
                            <h5 id="onlineFinal"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <h5 class="my-4 text-center">
                        Resultado Online
                        </h5>
                        <div class="card card-body py-1 text-white text-center my-3" id="cardResultadoOnline">
                            <h5 id="resultadoOnline"></h5>
                        </div>
                    </div>

                </div>

            </div>
            
        </div>
    </div>
</div>


<?php require "_table_datatable.php" ?>

<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>