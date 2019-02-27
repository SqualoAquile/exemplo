<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<!-- Chama o arquivo específico do módulo, caso não exista,  -->
<!-- Este javaScript serve para fazer verificações inerentes à cada módulo, por exemplo o radio de Clientes -->
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="d-lg-flex align-items-center my-5">
    <?php if(in_array($modulo . "_ver", $infoUser["permissoesUsuario"])): ?>
        <a href="<?php echo BASE_URL . '/' . $modulo ?>" class="btn btn-secondary mr-lg-4" title="Voltar">
            <i class="fas fa-chevron-left"></i>
        </a>
    <?php endif ?>
    <h1 class="display-4 m-0 text-capitalize font-weight-bold"><?php echo $viewInfo["title"]." ".ucfirst($labelTabela["labelForm"]); ?></h1>
</header>

<section class="mb-5">

    <form id="main-form" method="POST" class="needs-validation" autocomplete="off" novalidate>
        <input type="hidden" name="alteracoes" value="<?php echo isset($infoAdm) ? $infoAdm["alteracoes"] : "" ?>">
        <div class="form-group pb-3">
            <label for="inome" class="font-weight-bold">
                <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                <span>Nome da Administradora</span>
            </label>
            <input type="text" name="nome" id="inome" class="form-control" data-anterior="<?php echo isset($infoAdm) ? $infoAdm["nome"] : "" ?>" value="<?php echo isset($infoAdm) ? $infoAdm["nome"] : "" ?>" required/>
        </div>
        <input id="form-send" type="submit" class="d-none">
    </form>

    <form id="form-bandeiras" class="needs-validation" autocomplete="off" novalidate>
        <div class="card card-body">
            <div class="form-group">
                <label for="iband" class="font-weight-bold">
                    <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                    <span>Bandeira</span>
                </label>
                <select id="iband" name="band" class="form-control" required>
                    <option disabled selected value>Selecione</option>
                    <?php foreach ($listaBandeiras as $p):?>
                    <option value="<?php echo $p["id"];?>"><?php echo ucfirst($p["nome"]);?></option>
                    <?php endforeach;?>
                </select>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="itxdebito" class="font-weight-bold">
                            <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                            <span>Taxa de Recebimento no Débito</span>
                        </label>
                        <input type="text" name="txdebito" id="itxdebito" class="form-control percent-mask" required/>
                    </div>
                </div>
                <div class="col">
                    <label for="idiasdebito" class="font-weight-bold">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <span>Dias de Recebimento no Débito</span>
                    </label>
                    <input type="text" name="diasdebito" id="idiasdebito" class="form-control number-mask" required/>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="itxcredcom" class="font-weight-bold">
                            <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                            <span>Taxa Recebimento Crédito c/ Juros</span>
                        </label>
                        <input type="text" name="txcredcom" id="itxcredcom" class="form-control percent-mask" required/>
                    </div>
                </div>
                <div class="col">
                    <label for="idiascredcom" class="font-weight-bold">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <span>Dias Recebimento Crédito c/ Juros</span>
                    </label>
                    <input type="text" name="diascredcom" id="idiascredcom" class="form-control number-mask" required/>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="idiasantecip" class="font-weight-bold">
                            <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                            <span>Dias Recebimento Antecipação</span>
                        </label>
                        <input type="text" name="diasantecip" id="idiasantecip" class="form-control number-mask" required/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="inroparc" class="font-weight-bold">
                            <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                            <span>Número Máximo Parcelas</span>
                        </label>
                        <select id="inroparc" name="nroparc"  class="form-control" required>
                            <option disabled selected value>Selecione</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                </div>
            </div>
            <table id="tabela-taxas" class="table table-hover table-striped mt-3">
                <thead>
                    <tr>
                        <th class="border-bottom-0">Taxa de Antecipação</th>
                        <th class="border-bottom-0">Taxa de Crédito Sem Juros</th>
                    </tr>
                </thead>
                <tbody>
                <?php for($i=1;$i<=12;$i++):?>
                    <tr>
                        <td>
                            <input type="text" id="itxantecip_<?php echo $i ?>" placeholder="Taxa de recebimento com antecipação <?php echo $i ?>x" class="form-control percent-mask taxas taxas-antecipacao" required />
                        </td>
                        <td>
                            <input type="text" id="itxcredsemjuros_<?php echo $i ?>" placeholder="Taxa de recebimento no crédito sem juros <?php echo $i ?>x" class="form-control percent-mask taxas taxas-credito" required />
                        </td>
                    </tr>
                <?php endfor;?>
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-lg-2">
                <button type="submit" class="btn btn-block btn-primary mt-5">Incluir</button>
            </div>
        </div>
        <div id="inclusoes">
            <h3 class="mb-4 mt-5">Bandeiras Selecionadas</h3>
            <div class="table-responsive">
                <table id="table-inclusoes" class="table table-striped table-hover table-nowrap last-column-fixed bg-white">
                    <thead>
                        <th>Bandeira</th>
                        <th>N. Máx. Parcelas</th>
                        <th>Tx. de Antecipação</th>
                        <th>Tx. de Créd. s/ Juros</th>
                        <th>Tx. de Rcb. no Déb.</th>
                        <th>Dias de Rcb. no Déb.</th>
                        <th>Tx. Rcb. Créd. c/ Juros</th>
                        <th>Dias Rcb. Créd. c/ Juros</th>
                        <th>Dias Rcb. Antecipação</th>
                        <th>Ações</th>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="row">
                <div class="col-lg-2">
                    <label for="form-send" class="btn btn-block btn-primary mt-5">Salvar</label>
                </div>
            </div>
        </div>
    </form>
</section>
<script>
    var bandeirasAceitas = <?php echo isset($bandeirasAceitas) ? json_encode($bandeirasAceitas) : "undefined" ?>,
        listaBandeiras = <?php echo isset($listaBandeiras) ? json_encode($listaBandeiras) : "undefined" ?>,
        infoAdm = <?php echo isset($infoAdm) ? json_encode($infoAdm) : "undefined" ?>;
</script>