<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<!-- Chama o arquivo específico do módulo, caso não exista,  -->
<!-- Este javaScript serve para fazer verificações inerentes à cada módulo, por exemplo o radio de Clientes -->
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="pt-4 pb-5">
    <h1 class="display-4 text-capitalize text-nowrap font-weight-bold"><?php echo isset($labelTabela["labelBrowser"]) && !empty($labelTabela["labelBrowser"]) ? $labelTabela["labelBrowser"] : $modulo ?></h1>
</header>

<section class="mb-5">
    <div class="row">
        <?php foreach ($tabelas as $key => $value): ?>

            <?php $parametro = $value[0]["Name"] ?>
            
            <?php if (isset($value[0]["Comment"])): ?>
                <?php if (array_key_exists("parametro", $value[0]["Comment"])): ?>
                    
                    <?php $campo = $value[0]["Comment"]["parametro_campo"] ?>

                    <?php if ($value[0]["Comment"]["parametro"] == "true"): ?>

                        <div class="col-lg-<?php echo isset($value[0]["Comment"]["column"]) ? $value[0]["Comment"]["column"] : "12" ?>">

                            <div class="card card-body my-4">

                                <h3 class="text-capitalize"><?php echo $parametro ?></h3>
                                
                                <ul id="<?php echo $parametro ?>" data-campo="<?php echo $campo ?>" class="search-body list-unstyled mt-2">
                                    <li>
                                        <div class="row">
                                            <div class="col">
                                                <div class="position-relative">
                                                    <input type="text" class="form-control search-input" placeholder="Procure por <?php echo $parametro ?>">
                                                    <div class="icons-search-input d-flex align-items-center">
                                                        <button class="btn btn-sm down-btn" tabindex="-1">
                                                            <i class="fas fa-sort-down"></i>
                                                        </button>
                                                        <button class="btn btn-sm text-secondary close-btn" tabindex="-1">
                                                            <i class="fas fa-times-circle"></i>
                                                        </button>
                                                    </div>
                                                    <div class="list-group-filtereds-wrapper position-absolute w-100 shadow bg-white">
                                                        <div class="elements-add"></div>
                                                        <div class="list-group-filtereds list-group-flush"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="save-parametros col flex-grow-0">
                                                <button class="salvar btn btn-primary" tabindex="-1" disabled="disabled">Incluir</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>

                            </div>
                        
                        </div>

                    <?php endif ?>
                <?php endif ?>
            <?php endif ?>

        <?php endforeach ?>
    </div>
</section>