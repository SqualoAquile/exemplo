<script src="<?php echo BASE_URL?>/assets/js/controlecaixa.js" type="text/javascript"></script>
<?php
// Transforma o nome do arquivo para o nome do módulo
$modulo = str_replace("-form", "", basename(__FILE__, ".php"));
// Constroi o cabeçalho
require "_header_browser_filtros.php";
?>

<div class="collapse mb-5 sticky-top" id="collapseFluxocaixaResumo">
    <div class="card card-body">
        <div class="row">
            <div class="col-lg-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon-calendar">
                            <i class="fas fa-calendar-alt"></i>
                        </span>
                    </div>
                    <input type="text" class="form-control" data-provide="datepicker" placeholder="Data de Quitação" aria-label="Data de Quitação" aria-describedby="basic-addon-calendar">
                </div>
            </div>
            <div class="col-lg-3 flex-grow-0">
                <button class="btn btn-danger btn-block" id="quitar">Quitar <span></span> Lançamentos</button>
            </div>
            <div class="col-lg-2 flex-grow-0">
                <button class="btn btn-secondary btn-block">Excluir Selecionados</button>
            </div>
        </div>
    </div>
</div>

<?php
// Constroi a tabela
require "_table_datatable.php";
?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>
