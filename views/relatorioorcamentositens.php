<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatorioorcamentositens.js" type="text/javascript"></script>

<style>
.dataTable thead th:first-child, .dataTable tbody td:first-child {
    display:none;
}
</style>

<?php
// Constroi o cabeçalho
require "_header_browser_relatorios.php";
?>

<div class="collapse mb-5" id="collapseFluxocaixaResumo">
    <div class="row">
        
    </div>


        <div>
        <div class="row" id="somasResumo">
            <div class="col-lg">
                <div class="row">

                    <div class="col-lg">
                        <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                            <p class="m-0">Quantidade de Produtos</p>
                            <h5 id="quantidadeProdutos"></h5>
                        </div>

                        <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                            <p class="m-0">Valor Total de Produtos</p>
                            <h5 id="totalProdutos"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                            <p class="m-0">Quantidade de Serviços</p>
                            <h5 id="quantidadeServicos"></h5>
                        </div>
                        <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                            <p class="m-0">Valor Total de Serviços</p>
                            <h5 id="totalServicos"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <div class="card card-body py-1 text-black text-center my-3 py-3 shadow">
                            <p class="m-0">Quantidade de Serviços Compl.</p>
                            <h5 id="quantidadeServicosCompl"></h5>
                        </div>
                        <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                            <p class="m-0">Valor Total de Serviços Compl</p>
                            <h5 id="totalServicosCompl"></h5>
                        </div>
                    </div>

                    <!-- <div class="col-lg">
                        <div class="card card-body py-1 text-success text-center my-3 py-3 shadow">
                            <p class="m-0">Valor Total</p>
                            <h5 id="totalItens"></h5>
                        </div>
                    </div> -->

                    <div class="col-lg">
                        <div class="card card-body py-1 text-black text-center my-3 py-3 shadow" >
                            <canvas id="chart-div"></canvas>
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
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>