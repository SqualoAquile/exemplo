<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatoriosaldos.js" type="text/javascript"></script>

<?php
// Constroi o cabeçalho
require "_header_browser_relatorios.php";
?>

<div class="collapse mb-5" id="collapseFluxocaixaResumo">

        <div class="row" id="somasResumo">
            <div class="col-lg">

                <!-- Resumo -->
                <div class="row">

                    <div class="col-lg">
                        <div class="card card-body py-1 text-dark text-center my-1 shadow">
                            <p class="m-0"> Total Inicial </p>
                            <h5 id="totalInicial"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-success text-center my-1 shadow">
                            <p class="m-0"> Total Entradas </p>
                            <h5 id="totalEntradas"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-danger text-center my-1 shadow">
                            <p class="m-0"> Total Saidas </p>
                            <h5 id="totalSaidas"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-center my-1 shadow">
                            <p class="m-0"> Resultado </p>
                            <h5 id="resultado"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-dark text-center my-1 shadow">
                            <p class="m-0"> Total Final </p>
                            <h5 id="totalFinal"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-warning text-center my-1 shadow">
                            <p class="m-0"> Diferença </p>
                            <h5 id="diferenca"></h5>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>

        <div class="row mt-2">
            <!-- Saldo Bancário -->
            <div class="card card-body my-1 mx-2">
                <div class="col-lg">

                    <div class="row">
                        <div class="card card-body py-1 bg-light text-dark text-center my-1">
                            <p class="m-0"> Saldo Bancário Inicial </p>
                            <h5 id="bancoInicial"></h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card card-body py-1 bg-light text-dark text-center my-1">
                            <p class="m-0"> Saldo Bancário Final </p>
                            <h5 id="bancoFinal"></h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card card-body py-1 text-center my-1" id="cardResultadoBanco">
                            <p class="m-0"> Resultado do Saldo Bancário </p>
                            <h5 id="resultadoBanco"></h5>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Saldo Caixa -->
            <div class="card card-body my-1 mx-2">
                <div class="col-lg">

                    <div class="row">
                        <div class="card card-body py-1 bg-light text-dark text-center my-1">
                            <p class="m-0"> Saldo em Caixa Inicial </p>
                            <h5 id="caixaInicial"></h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card card-body py-1 bg-light text-dark text-center my-1">
                            <p class="m-0"> Saldo em Caixa Final </p>
                            <h5 id="caixaFinal"></h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card card-body py-1 text-white text-center my-1" id="cardResultadoCaixa">
                            <p class="m-0"> Resultado do Saldo em Caixa </p>
                            <h5 id="resultadoCaixa"></h5>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- Saldo Online -->
            <div class="card card-body my-1 mx-2">
                <div class="col-lg">

                    <div class="row">
                        <div class="card card-body py-1 bg-light text-dark text-center my-1">
                            <p class="m-0"> Saldo Online Inicial </p>
                            <h5 id="onlineInicial"></h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card card-body py-1 bg-light text-dark text-center my-1">
                            <p class="m-0"> Saldo Online Final </p>
                            <h5 id="onlineFinal"></h5>
                        </div>
                    </div>

                    <div class="row">
                        <div class="card card-body py-1 text-white text-center my-1" id="cardResultadoOnline">
                            <p class="m-0"> Resultado do Saldo Online </p>
                            <h5 id="resultadoOnline"></h5>
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