<script src="<?php echo BASE_URL?>/assets/js/graficos.js" type="text/javascript"></script>

<div class="collapse" id="collapseGraficos">
    <div class="card mt-4">
        <div class="card-header">

            <select class="custom-select" id="selectGraficos">
                <option selected disabled>Filtrar campo pizza</option>
                <?php for($j = 1; $j < count($colunas); $j++): ?>
                    <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                        <?php if(array_key_exists("label", $colunas[$j]["Comment"]) &&
                                 array_key_exists("type", $colunas[$j]["Comment"]) &&
                                $colunas[$j]["Comment"]["type"] =="relacional"  ): ?>
                            <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                            </option>
                        <?php endif ?>
                    <?php endif ?>
                <?php endfor ?>
            </select>
        </div>

        <div class="card-header">
            <select class="custom-select" id="selectGraficosTemporal">
                <option selected disabled>Filtrar campo temporal</option>
                <?php for($j = 1; $j < count($colunas); $j++): ?>
                    <?php if($colunas[$j]["Comment"]["ver"] == "true"): ?>
                        <?php if(   array_key_exists("label", $colunas[$j]["Comment"]) &&
                                    $colunas[$j]["Type"] == "date"  ): ?>
                            <option value="<?php echo $colunas[$j]["Field"] ?>" data-tipo="<?php echo $colunas[$j]["Type"] ?>" data-mascara="<?php echo $colunas[$j]["Comment"]["mascara_validacao"] ?>">
                                <?php echo array_key_exists("label", $colunas[$j]["Comment"]) ? $colunas[$j]["Comment"]["label"] : $colunas[$j]["Field"] ?>
                            </option>
                        <?php endif ?>
                    <?php endif ?>
                <?php endfor ?>
            </select>
        </div>

        <div class="card-header">
            <select class="custom-select" id="selectGrafOpcoes">
                <option selected disabled>Agrupar por</option>
                <option value="" data-tipograf = 'line'>Dias</option>
                <option value="WEEKDAY" data-tipograf = 'line'>Dias da Semana</option>
                <option value="WEEK" data-tipograf = 'line'>Semanas</option>
                <option value="MONTH" data-tipograf = 'line'>Mês</option>
                <option value="YEAR" data-tipograf = 'line'>Ano</option>
            </select>
        </div>

        <div class="card-body">
            <canvas id="fluxocaixaGrafico"></canvas>
        </div>
    </div>
</div>