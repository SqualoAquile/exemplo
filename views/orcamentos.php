<?php
// Transforma o nome do arquivo para o nome do módulo
$modulo = str_replace("-form", "", basename(__FILE__, ".php"));
// Constroi o cabeçalho
require "_header_browser.php";
// Constroi a tabela
require "_table_datatable.php";
?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'  // usa o nome da tabela como nome do módulo, necessário para outras interações
</script>
<div class="modal fade" id="modalConfImp" tabindex="-1" role="dialog" aria-labelledby="modalConfImpLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form class="modal-content" method="POST" action="<?php echo BASE_URL . "/" . $modulo . "/imprimir/2" ?>">
            <div class="modal-header">
                <h5 class="modal-title" id="modalConfImpLabel">Imprimir Orçamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="checkMedidas" id="checkMedidas" value="medidas">
                    <label class="form-check-label" for="checkMedidas">Medidas</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="checkUnitario" id="checkUnitario" value="unitario">
                    <label class="form-check-label" for="checkUnitario">Preço Unitário</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" name="checkAvisos" id="checkAvisos" value="avisos">
                    <label class="form-check-label" for="checkAvisos">Avisos</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-warning">Imprimir</button>
            </div>
        </form>
    </div>
</div>