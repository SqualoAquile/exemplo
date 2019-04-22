<script src="<?php echo BASE_URL;?>/assets/js/orcamentositens_form.js" type="text/javascript"></script>

<h3 class="mt-5 mb-4">Itens do Orçamento</h3>
<div class="table-responsive tableFixHead">
    <table id="itensOrcamento" class="table table-striped table-hover bg-white table-nowrap first-column-fixed">
        <thead>
            <tr>
                <th>Ações</th>
                <th>Item</th>
                <th>SubItem</th>
                <th>Quant</th>
                <th>Largura Unit.</th>
                <th>Comprimento Unit.</th>
                <th>Quant. Usada Unit.</th>
                <th>Serviço/Produto</th>
                <th>Material/Serviço</th>
                <th>Tipo de Material</th>
                <th>Unidade</th>
                <th>Custo Total</th>
                <th>Preço Total</th>
                <th>Observação</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>
<div class="row justify-content-end">
    <div class="col-lg">
        <div class="card card-body text-center">
            <p>Custo Total</p>
            <p class="h2" id="resumoItensCustoTota">0</p>
        </div>
    </div>
    <div class="col-lg">
        <div class="card card-body text-center">
            <p>Valor Total</p>
            <p class="h2" id="resumoItensValorTotal">0</p>
        </div>
    </div>
</div>
