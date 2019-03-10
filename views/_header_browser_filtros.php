<script src="<?php echo BASE_URL?>/assets/js/filtros.js" type="text/javascript"></script>

<?php if(!empty($aviso)): ?>
    <div class="alert alert-danger position-fixed my-toast m-3 shadow-sm alert-dismissible" role="alert"> 
        <?php echo $aviso ?>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
<?php endif ?>

<?php
    $indexTiltroTexto = 1;
    $indexFiltroFaixa = 1;
?>

<header class="pt-4 pb-5"> <!-- Cabeçalho -->
    <div class="row align-items-center"> <!-- Alinhar as linhas -->
        <div class="col-lg"> <!--Colunas da esquerda -->
            <h1 class="display-4 text-capitalize font-weight-bold"><?php echo isset($labelTabela["labelBrowser"]) && !empty($labelTabela["labelBrowser"]) ? $labelTabela["labelBrowser"] : $modulo ?></h1>
        </div>
        <div class="col-lg"> 
            <div class="input-group mb-3 mb-lg-0">
                <!--Input com os dados da tabela-->
                <input type="text" name="searchDataTable" id="searchDataTable" aria-label="Pesquise por qualquer campo..." class="form-control" placeholder="Pesquise por qualquer campo..." aria-describedby="search-addon">
                <div class="input-group-append">
                    <span class="input-group-text" id="search-addon">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="col-lg-1">
            <button type="button" class="btn btn-warning btn-block" data-toggle="collapse" data-target="#collapseFiltros" aria-expanded="false" aria-controls="collapseFiltros">
                <i class="fas fa-filter"></i>
            </button>
        </div>
    </div>
    <div class="collapse" id="collapseFiltros">
        <div class="card mt-5 bg-light">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3 class="m-0">Filtros</h3>
                <div>
                    <label for="limpar-filtro" class="btn btn-secondary btn-sm m-0">Limpar Filtros</label>
                    <button id="criar-filtro" type="button" class="btn btn-success btn-sm">Mais Filtros</button>
                </div>
            </div>
            <form id="card-body-filtros" class="card-body pb-1">
                <input type="reset" class="d-none" id="limpar-filtro">
                <?php if ($modulo == "fluxocaixa"): ?>

                    <?php
                        $indexTiltroTexto = 2;
                        $indexFiltroFaixa = 2;
                    ?>

                    <div class="row mb-3">
                        <div class="col">
                            <fieldset>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" name="movimentacao" data-index="2" id="todosCheckReceita" value="receita">
                                    <label class="form-check-label" for="todosCheckReceita">Receita</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="checkbox" name="movimentacao" data-index="2" id="todosCheckDespesa" value="despesa">
                                    <label class="form-check-label" for="todosCheckDespesa">Despesa</label>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                <?php endif ?>
                <div class="filtros row mb-3">
                    <div class="filtros-faixa col">
                        <div class="input-group">
                            <select class="custom-select input-filtro-faixa">
                                <option selected disabled>Filtrar por...</option>
                                <?php for($j = 1; $j < count($colunas); $j++): ?>
                                    <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                                        <?php if(array_key_exists("label", $colunas[$j]["Comment"]) && array_key_exists("filtro_faixa", $colunas[$j]["Comment"]) && $colunas[$j]["Comment"]["filtro_faixa"]): ?>
                                            <option value="<?php echo $indexFiltroFaixa ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                                <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                                            </option>
                                        <?php endif ?>
                                        <?php $indexFiltroFaixa++ ?>
                                    <?php endif ?>
                                <?php endfor ?>
                            </select>
                            <input type="text" class="form-control input-filtro-faixa min" placeholder="de...">
                            <input type="text" class="form-control input-filtro-faixa max" placeholder="até...">
                        </div>
                    </div>
                    <div class="filtros-texto col">
                        <div class="input-group">
                            <select class="custom-select">
                                <option selected disabled>Filtrar por...</option>
                                <?php for($m = 1; $m < count($colunas); $m++): ?>
                                    <?php if ($colunas[$m]["Comment"]["ver"] == "true"): ?>
                                        <?php if(!array_key_exists("filtro_faixa", $colunas[$m]["Comment"])): ?>
                                            <option value="<?php echo $indexTiltroTexto ?>" data-tipo="<?php echo $colunas[$m]["Type"] ?>">
                                                <?php echo array_key_exists("label", $colunas[$m]["Comment"]) ? $colunas[$m]["Comment"]["label"] : $colunas[$m]["Field"] ?>
                                            </option>
                                        <?php endif ?> 
                                        <?php $indexTiltroTexto++ ?>
                                    <?php endif ?>
                                <?php endfor ?>
                            </select>
                            <input type="text" class="form-control input-filtro-texto">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</header>