<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<script src="<?php echo BASE_URL?>/assets/js/vendor/html2canvas.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/FileSaver.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/orcamentos-imp.js" type="text/javascript"></script>

<?php
$infos = [];
$infos["cliente"] = "Fulano da Silva";
$infos["faturado_para"] = "Ciclano Nunes";
$infos["contato_cliente"] = "51-99555-3346";
$infos["tecnico"] = "Funcionário 1";
$infos["contato_tecnico"] = "51-98124-2746";
$infos["codigo"] = "OÇ1234OÇ";
$infos["status"] = "em espera";
$infos["descricao"] = "Valquira - Adesivagem de Geladeira";
$infos["prazo_entrega"] = "30 dias";
$infos["forma_pagamento"] = "Até 6x sem juros no cartão";
$infos["data_emissao"] = "13/04/2019";
$infos["data_validade"] = "25/04/2019";

$infos["itens_geral"]["preco_total"] = "1500,00";
$infos["itens_geral"]["preco_alternativo"] = "1300,00";
$infos["itens_geral"]["desconto"] = "200,00";
$infos["itens_geral"]["deslocamento"] = "10 km";
$infos["itens_geral"]["desconto"] = "0,00";


for ($k=0; $k <8 ; $k++) { 
    for ($i=0; $i <9 ; $i++) { 
        $infos["itens"][$k]["nome"] = "Nome do Item";
        $infos["itens"][$k]["preco_total"] = "450,00";
        $infos["itens"][$k]["preco_alternativo"] = "300,00";
        $infos["itens"][$k]["itens"][$i]["nome"] = "Produto/Servico";
        $infos["itens"][$k]["itens"][$i]["quantidade"] = "3";
        $infos["itens"][$k]["itens"][$i]["medidas"] = "L: 0,5 x C: 1,25";
        $infos["itens"][$k]["itens"][$i]["unidade"] = "M²";
        $infos["itens"][$k]["itens"][$i]["preco_unitario"] = "1,5";
        $infos["itens"][$k]["itens"][$i]["preco_total"] = "4,50";

    }

}

?>

<style>
    p.small {
    line-height: 0.5;
    }

    p.big {
    line-height: 1.8;
    }

    .borderless td, .borderless th {
        border: none;
    }

    .table {
    font-size: 12px;
    }

    .table tr,.table td {
    height: 10px;
    }

    .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th{
    padding:0; 
    }

 @media print {


    @page {
        size: A4;
        margin-top: 15mm;
        margin-bottom: 10mm;
    }

    body {margin-top: 15mm; margin-bottom: 10mm; 
           margin-left: 3mm; margin-right: 3mm}

    .break-before { page-break-before: always; }

    #imprimirPDF, #imprimirJPG, #header, footer{ display:none !important;}

    table { page-break-after:auto; margin-bottom:3rem }
    tr    { page-break-inside:avoid; page-break-after:auto }
    td    { page-break-inside:avoid; page-break-after:auto }
    thead { display:table-header-group }
    tfoot { display:table-footer-group }

    tbody::after {
        content: ''; display: block;
        page-break-after: always;
        page-break-inside: avoid;
        page-break-before: always;        
    }
 } 

</style>

<!-- PRIMEIRO CABEÇALHO - INFORMAÇÕES DA EMPRESA -->
<div class="card">
    <div class="card-body">
        <div class="row">

            <div class="col-4">
                <img class="card-img-left img-fluid" src="<?php echo BASE_URL?>/assets/images/IDFX.png" width = "50%" height = "auto">
            </div>

            <div class="col-8 text-left">
                <p class="h2">Identifixe</p>
                <p class="small"> AV. TERESÓPOLIS, 2547 - TERESÓPOLIS - PORTO ALEGRE - RS </p>
                <p class="small"> CNPJ: 10.639.459/0001-93 | CEP: 90.870-001 | (51) 3109 - 2500 </p>
                <p class="small"> www.identifixe.com.br | contato@identifixe.com.br</p>
            </div>
        </div>
    </div>
</div>

<!-- BOTOES DE IMPRESSAO -->
<div class="row">
    <button type="button" class="btn btn-info mt-2 mx-3" id="imprimirPDF"> 
        <a onClick="window.print();">
            Salvar em PDF
        </a>
    </button>
    
    <button type="button" class="btn btn-info mt-2" id="imprimirJPG"> 
        Salvar como imagem
    </button>
</div>

<!-- SEGUNDO CABEÇALHO - INFORMAÇÕES BÁSICAS DO ORÇAMENTO -->
<div class = "card mt-3">
    <div class = "text-center">
        <div class="card-header h2">
            Orçamento
        </div>
    </div>

    <div class="card-body">
        <div class="container">
            <div class="col-sm d-flex justify-content-between">
                <div class="row-sm">
                    <p class="small"> <b>Código: </b> <?php echo $infos["codigo"]; ?> </p>
                    <p class="small"> <b>Data de Emissão: </b> <?php echo $infos["data_emissao"]; ?></p>
                    <p class="small"> <b>Data de Validade:</b> <?php echo $infos["data_validade"]; ?>  </p>      
                </div>

                <div class="row-sm">
                    <p class="small"> <b>Cliente: </b> <?php echo $infos["cliente"]; ?> </p>
                    <p class="small"> <b>Descrição: </b> <?php echo $infos["descricao"]; ?>  </p>
                    <p class="small"> <b>Contato vendedor: </b> <?php echo $infos["tecnico"]; ?> </p>
                </div>

                <div class="row-sm">
                    <p class="small"> <b>Prazo de Entrega: </b> <?php echo $infos["prazo_entrega"]; ?> </p>
                    <p class="small"> <b>Forma de Pagamento: </b> <?php echo $infos["forma_pagamento"]; ?>  </p>
                </div>
            </div>
        </div>
    </div>

</div>

<table class="table borderless my-3" >
<!-- CABEÇALHO DA TABELA -->
    <thead>
        <tr>
        <th scope="col"><b>Item</b></th>
        <th scope="col"><b>Quantidade</b></th>
        <th scope="col"><b>Produto/Serviço</b></th>
        <th scope="col"><b>Medidas</b></th>
        <th scope="col"><b>Unidade</b></th>
        <th scope="col"><b>Preço Unitário</b></th>
        <th scope="col"><b>Preço Total</b></th>
        </tr>
    </thead>


    <?php for ($j=0; $j < sizeof($infos["itens"])-1 ; $j++): ?>
        <tbody> 
            <div class="break-after">
                <?php $cor="";?>

            <!-- TITULO DO ITEM -->
                <tr>
                    <th scope="row"> <?php echo $infos["itens"][$j]["nome"] ?></th>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                </tr>

                <?php for ($i=0; $i < 30 ; $i++): ?>
                <!-- VERIFICACAO DE MATERIAL ALTERNATIVO -->
                    <?php $i ==  1 ? $cor = "color:red" : $cor = "" ?>

                    <?php if(isset($infos["itens"][$j]["itens"][$i])): ?>
                    <!-- SUBITENS E INFORMAÇÕES -->
                        <tr style="<?php echo $cor ?>">
                            <td> </td>
                            <th scope="row"><?php echo $infos["itens"][$j]["itens"][$i]["quantidade"] ?></th>
                            <td><?php echo $infos["itens"][$j]["itens"][$i]["nome"] ?></td>
                            <td><?php echo $infos["itens"][$j]["itens"][$i]["medidas"] ?></td>
                            <td><?php echo $infos["itens"][$j]["itens"][$i]["unidade"] ?></td>
                            <td><?php echo $infos["itens"][$j]["itens"][$i]["preco_unitario"] ?></td>
                            <td><?php echo $infos["itens"][$j]["itens"][$i]["preco_total"] ?></td>
                        </tr>
                    <?php endif ;?>
                <?php endfor ?>

                <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td><b>Preço: </b> </td>
                    <td> <?php echo $infos["itens"][$j]["preco_total"] ?> </td>
                </tr>

                <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td style="color:red"><b>Preço Alternativo: </b> </td>
                    <td style="color:red"> <?php echo $infos["itens"][$j]["preco_alternativo"] ?> </td>
                </tr>

            </div>
        </tbody>
    <?php endfor ?>

<!-- ESPACO ENTRE A TABELA E O FIM -->
    <tr>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
    </tr>
    <tr>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
    </tr>

<!-- VALOR FINAL -->
    <tr>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td>Deslocamento:  </td>
        <td><b> <?php echo $infos["itens_geral"]["deslocamento"] ?> </b> </td>
    </tr>

    <tr>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td>Desconto:  </td>
        <td><b> <?php echo $infos["itens_geral"]["desconto"] ?> </b> </td>
    </tr>

    <tr>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td>Preço Total:  </td>
        <td><b> <?php echo $infos["itens_geral"]["preco_total"] ?> </b> </td>
    </tr>

    <tr style="color:red">
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td> </td>
        <td>Preço Alternativo:  </td>
        <td><b> <?php echo $infos["itens_geral"]["preco_alternativo"] ?> </b> </td>
    </tr>
</table>

<div class="card mt-2">
    <div class="card-body">
    <small>
        <div class="row justify-content-between">
            <div class="col-6-sm">
            <p class = "small">OBS. OS ITENS EM VERMELHO SÃO FEITOS COM MATERIAL ALTERNATIVO.</p>
            <p class = "small">O DESCONTO É REFERENTE AOS ITENS DESCRITOS EM PRETO.</p>
            <p class = "small">* ESTE TRABALHO TEM 1 ANO DE GARANTIA DE APLICAÇÃO.</p>
            <p class = "small">* O PAGAMENTO P ODE SER FEITO EM ATÉ 6X SEM JUROS NO CARTÃO</p>
            <p class = "small">* ESTE ORÇAMENTO TEM VALIDADE DE 15 DIAS, A PARTIR DA SUA DATA DE EMISSÃO</p>
            </div>
            <div class="col-6-sm">
            <p class = "small">* MATERIAL IMPORTADO TRADICIONAL, TEM 5 ANOS DE GARANTIA DE DURABILIDADE.</p>
            <p class = "small">* MATERIAL NACIONAL, TEM 2 ANOS DE GARANTIA DE DURABILIDADE (EXTERNO)</p>
            <p class = "small">* PARA CONFIRMAR O AGENDAMENTO, SOLICITAMOS UMA ENTRADA DE 30% DO PREÇO FINAL DO TRABALHO.</p>
            <p class = "small">* NÃO ACEITAMOS PAGAMENTOS COM CHEQUE.</p>
            </div>
        </div>
    </small>
    </div>
</div>

