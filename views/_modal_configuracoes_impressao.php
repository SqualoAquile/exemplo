<div class="modal fade" id="modalConfImp" tabindex="-1" role="dialog" aria-labelledby="modalConfImpLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <form class="modal-content" method="POST" id="formModal" target="_blank" action="<?php echo BASE_URL . "/" . $modulo . "/imprimir/" ?>">
            <div class="modal-header">
                <h5 class="modal-title" id="modalConfImpLabel">Imprimir</h5>
                <button type="button" class="close"  data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" checked="checked" name="checkMedidas" id="checkMedidas" value="medidas">
                            <label class="form-check-label" for="checkMedidas">Medidas</label>
                        </div>
                        <?php if ($modulo !='ordemservico'): ?>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" checked="checked" name="checkUnitario" id="checkUnitario" value="unitario">
                                <label class="form-check-label" for="checkUnitario">Preço Unitário e Subtotais</label>
                            </div>
                        <?php endif; ?>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" name="checkAvisos" id="checkAvisos" value="avisos">
                            <label class="form-check-label" for="checkAvisos">Avisos</label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="collapse" id="collapseAvisos">
                            <div class="py-4">
                                <h6>Selecionar Avisos</h6>
                                <div class="relacional-dropdown-wrapper dropdown"> 
                                    <input 
                                    type="text" 
                                    class="dropdown-toggle form-control relacional-dropdown-input" 
                                    data-toggle="dropdown" 
                                    autocomplete="off"
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
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-warning">Imprimir</button>
            </div>
        </form>
    </div>
</div>
<script>

    $('#formModal').submit(function() {
        $('#modalConfImp').modal('toggle'); 
    });

    $('#modalConfImp').on('shown.bs.modal', function (event) {
        let id = $(event.relatedTarget).attr('data-id'),
            $form = $(this).find('form');

        $form.attr('action', '<?php echo BASE_URL . "/" . $modulo . "/imprimir/" ?>' + id);

    });

    $(document)
        .ready(function() {
            $.ajax({
                url: baselink + "/ajax/getRelacionalDropdownOrcamentos",
                type: "POST",
                data: {
                    tabela: "avisos"
                },
                dataType: "json",
                success: function(data) {

                    var htmlDropdown = "";

                    htmlDropdown += '<div id="opcoesAvisos">';

                    data.forEach(element => {
                        htmlDropdown += `
                            <label for="avisos`+ element["id"]+ `" class="list-group-item list-group-item-action relacional-dropdown-element">
                                <div class="d-flex align-items-center">
                                    <input class="lista-itens mr-3" type="checkbox" id="avisos`+ element["id"]+ `" name="avisos[]" value="`+ element["id"]+ `">
                                    <div>
                                        <div>`+ element["titulo"] + `</div>
                                        <small>` + element["mensagem"] + `</small>
                                    </div>
                                </div>
                            </label>
                        `;
                    });

                    htmlDropdown += '</div>';

                    $('#modalConfImp #collapseAvisos .relacional-dropdown-wrapper .dropdown-menu .dropdown-menu-wrapper').html(htmlDropdown);
                    $('#collapseAvisos .form-control').removeAttr('disabled');

                }
            });
        })
        .on('change', '#checkAvisos', function() {
            $('#collapseAvisos').collapse('toggle');
        });
</script>
<style>
#collapseAvisos .relacional-dropdown-input {
    background-image: none;
    padding-right: 0.75rem;
    border-color: #ced4da;
}
#collapseAvisos .relacional-dropdown-input:focus {
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}
</style>