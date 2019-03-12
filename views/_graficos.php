<script src="<?php echo BASE_URL?>/assets/js/vendor/loader.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/graficos.js" type="text/javascript"></script>

<select class="custom-select" id="selectGraficos">
    <option selected disabled>Filtrar campo</option>
    <?php for($j = 1; $j < count($colunas); $j++): ?>
        <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
            <?php if(array_key_exists("label", $colunas[$j]["Comment"]) && array_key_exists("type", $colunas[$j]["Comment"]) && $colunas[$j]["Comment"]["type"] =="relacional" ): ?>
                <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                    <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                </option>
            <?php endif ?>
        <?php endif ?>
    <?php endfor ?>
</select>

<div id="chart_div"></div>

<button id="botaoGrafico">Dados</button>