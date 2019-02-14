<?php if (isset($item) && !empty($item)): ?>
    <?php $alteracoes = explode("|", $item["alteracoes"]) ?>
    <section id="historico" class="collapse card card-body my-5">
        <h4 class="text-center py-4">Histórico de Alterações</h4>
        <div class="wrapper">
            <?php foreach (array_reverse($alteracoes) as $key => $value): ?>
                <div class="card card-body py-2 mb-3">
                    <p class="card-text small m-0"><?php echo $value ?></p>
                </div>
            <?php endforeach ?>
        </div>
    </section>
<?php endif ?>