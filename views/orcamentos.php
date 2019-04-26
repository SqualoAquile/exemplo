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
    <div class="modal-dialog modal-lg" role="document">
        <form class="modal-content" method="POST" action="<?php echo BASE_URL . "/" . $modulo . "/imprimir/" ?>">
            <div class="modal-header">
                <h5 class="modal-title" id="modalConfImpLabel">Imprimir Orçamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="checkMedidas" id="checkMedidas" value="medidas">
                            <label class="form-check-label" for="checkMedidas">Medidas</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="checkUnitario" id="checkUnitario" value="unitario">
                            <label class="form-check-label" for="checkUnitario">Preço Unitário e Sub Totais</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="checkAvisos" id="checkAvisos" value="avisos">
                            <label class="form-check-label" for="checkAvisos">Avisos</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="collapse" id="collapseAvisos">
                            <div class="h4">Selecionar avisos:</div>
                            <div class="relacional-dropdown-wrapper dropdown"> 
                                <input 
                                type="text" 
                                class="dropdown-toggle form-control relacional-dropdown-input" 
                                data-toggle="dropdown" 
                                autocomplete="new-password"
                                aria-haspopup="true" 
                                aria-expanded="false"
                                />
                                <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle">
                                    <i class="fas fa-caret-down"></i>
                                </label>
                                <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown">
                                    <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
                                    <div class="dropdown-menu-wrapper"></div>
                                </div>
                            </div>        
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-warning">Imprimir</button>
            </div>
        </form>
    </div>
</div>
<script>
    $('#modalConfImp').on('shown.bs.modal', function (event) {
        let id = $(event.relatedTarget).attr('data-id'),
            $form = $(this).find('form');

        $form.attr('action', $form.attr('action') + id);
    });
</script>