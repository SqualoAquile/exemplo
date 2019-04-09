<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>

<script src="<?php echo BASE_URL?>/assets/js/relatorioorcamentos.js" type="text/javascript"></script>

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
    <div class="card card-body">
        <div class="row" id="somasResumo">
            <div class="col-lg">
                <div class="row d-none d-lg-flex">
                    <div class="col">
                        <h5 class="my-4 text-center">
                        Quantidade de Orçamentos
                        </h5>
                    </div>
                    <div class="col">
                        <h5 class="my-4 text-center">
                        Total Orçado
                        </h5>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg">
                        <h5 class="my-4 text-center d-lg-none">
                        Quantidade de Orçamentos 
                        </h5>
                        <div class="card card-body py-1 text-success text-center my-3">
                            <h5 id="quantidadeOrcamentos"></h5>
                        </div>
                    </div>

                    <div class="col-lg">
                        <h5 class="my-4 text-center d-lg-none">
                        Total Orçado
                        </h5>
                        <div class="card card-body py-1 text-success text-center my-3">
                            <h5 id="totalOrcado"></h5>
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