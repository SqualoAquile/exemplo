<?php
class orcamentosController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "orcamentos";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {
        
        // Instanciando as classes usadas no controller
        $this->shared = new Shared($this->table);
        $tabela = ucfirst($this->table);
        $this->model = new $tabela();
        $this->usuario = new Usuarios();
    
        $this->colunas = $this->shared->nomeDasColunas();

        // verifica se tem permissão para ver esse módulo
        if(in_array($this->table . "_ver", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/home"); 
        }
        // Verificar se está logado ou nao
        if($this->usuario->isLogged() == false){
            header("Location: " . BASE_URL . "/login"); 
        }
    }
     
    public function index() {
        
        if(isset($_POST) && !empty($_POST)){ 
            
            $id = addslashes($_POST['id']);
            if(in_array($this->table . "_exc", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
                header("Location: " . BASE_URL . "/" . $this->table); 
            }
            if($this->shared->idAtivo($id) == false){
                header("Location: " . BASE_URL . "/" . $this->table); 
            }
            $this->model->excluir($id);
            header("Location: " . BASE_URL . "/" . $this->table);
        }
        
        $dados['infoUser'] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"] = $this->shared->labelTabela();

        $this->loadTemplate($this->table, $dados);
    }
    
    public function adicionar() {
        
        if(in_array($this->table. "_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }
        
        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){ 
            $this->model->adicionar($_POST);
            header("Location: " . BASE_URL . "/" . $this->table);

        }else{ 
            $dados["colunasOrcamentos"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Adicionar"];
            $dados["labelTabela"] = $this->shared->labelTabela();

            $itm = new Shared('orcamentositens');
            $dados["colunasItensOrcamentos"] = $itm->nomeDasColunas();
            
            $this->loadTemplate($this->table . "-form", $dados);
        }
    }
    
    public function editar($id) {

        if(in_array($this->table . "_edt", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }

        if($this->shared->idAtivo($id) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }

        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){
            $this->model->editar($id, $_POST);
            header("Location: " . BASE_URL . "/" . $this->table); 
        }else{

            $item = new Shared('orcamentositens');
            
            $dados["item"] = $this->model->infoItem($id); 
            $dados["viewInfo"] = ["title" => "Editar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $dados["colunasOrcamentos"] = $this->colunas;
            $dados["colunasItensOrcamentos"] = $item->nomeDasColunas();

            $this->loadTemplate($this->table . "-form", $dados); 
        }
    }

    public function imprimir($id) {

        $request = $_POST;

        $infos['infoUser'] = $_SESSION;

        $request["tabela"] = "avisos";
        $avisos = $this->model->getRelacionalDropdown($request);
        $infos["avisos"] = $avisos;

        $informacoes = $this->model->infosOrcamento($id);
        $infos["cliente"] = $informacoes[0]['nome_cliente'];
        $infos["tecnico"] = $informacoes[0]['funcionario'];
        $infos["descricao"] = $informacoes[0]['titulo_orcamento'];
        $infos["prazo_entrega"] = $informacoes[0]['prazo_entrega'];
        $infos["forma_pagamento"] = $informacoes[0]['forma_pgto_descricao'];
        $dataAux1 = explode("-",$informacoes[0]['data_emissao']);
        $infos["data_emissao"] = $dataAux1[2]."/".$dataAux1[1]. "/".$dataAux1[0];
        $dataAux2 = explode("-",$informacoes[0]['data_validade']);
        $infos["data_validade"] = $dataAux2[2]."/".$dataAux2[1]. "/".$dataAux2[0];

        $infos["preco_total"] = number_format($informacoes[0]['sub_total'],2,",",".");
        $infos["desconto"] =  number_format($informacoes[0]['desconto'],2,",",".");
        $infos["preco_final"] = number_format($informacoes[0]['valor_total'],2,",",".");

        $infos["deslocamento"] = $informacoes[0]['deslocamento_km']. " km";

        $itens = $this->model->itensOrcamento($id);
        $qtdItens = $this->model->qtdItensOrcamento($id);
        $precoItens = $this->model->precosItens($id);

        $k=0;
        $j=0;
        
        for ($i=0; $i < sizeof($itens) ; $i++) {

            if ($i>0 && ($itens[$i]['descricao_item'] != $itens[$i-1]['descricao_item'] || 
                        $itens[$i]['descricao_subitem'] != $itens[$i-1]['descricao_subitem'])) {

                $infos["itens"][$k]["nome"] = $itens[$i]['descricao_item'] . " - " . $itens[$i]['descricao_subitem'];
                $k++;
                $j=0;
            } else if ($i==0){
                $infos["itens"][$k]["nome"] = $itens[$i]['descricao_item'] . " - " . $itens[$i]['descricao_subitem'];
                $k++;
            }
            
            $infos["itens"][$k-1]["subitens"][$j]["produto_servico"] = ucfirst(str_replace("_"," ",$itens[$i]['material_servico']));
            $infos["itens"][$k-1]["subitens"][$j]["tipo_material"] = $itens[$i]['tipo_material'];
            $infos["itens"][$k-1]["subitens"][$j]["quantidade"] = str_replace(".",",",$itens[$i]['quant']);
            $infos["itens"][$k-1]["subitens"][$j]["medidas"] = "L: ".str_replace(".",",",$itens[$i]['largura']). " x C: ".str_replace(".",",",$itens[$i]['comprimento']);
            $infos["itens"][$k-1]["subitens"][$j]["unidade"] = $itens[$i]['unidade'];
            $infos["itens"][$k-1]["subitens"][$j]["preco_unitario"] = floatval($itens[$i]['preco_tot_subitem']) / floatval(floatval($itens[$i]['quant'])*floatval($itens[$i]['quant_usada']));
            $infos["itens"][$k-1]["subitens"][$j]["preco_total"] =  $itens[$i]['preco_tot_subitem'];

            $j++;
        }
        
        $totalAlternativo = 0;
        for ($p=0; $p < $k ; $p++) {
            $precoPrincipal = 0;
            $precoAlternativo = 0;
            for ($j=0; $j < sizeof($infos["itens"][$p]["subitens"]) ; $j++) {

                $precoTotal = $infos["itens"][$p]["subitens"][$j]["preco_total"];

                if ( $infos["itens"][$p]["subitens"][$j]["tipo_material"]=='') {
                    $precoPrincipal += $precoTotal;
                    $precoAlternativo += $precoTotal;
                }else if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='principal'){
                    $precoPrincipal += $precoTotal;
                }else if ($infos["itens"][$p]["subitens"][$j]["tipo_material"]=='alternativo'){
                    $precoAlternativo += $precoTotal;
                }
            }
            
            $infos["itens"][$p]["total_principal"] = $precoPrincipal;
            $infos["itens"][$p]["total_alternativo"] = $precoAlternativo;
            $totalAlternativo += $precoAlternativo;
        }

        $infos["preco_alternativo"] = number_format($totalAlternativo,2,",","."); 

        // FORMATAÇÃO
        for ($p=0; $p < $k ; $p++) {
            $infos["itens"][$p]["total_principal"] = number_format($infos["itens"][$p]["total_principal"],2,",",".");
            $infos["itens"][$p]["total_alternativo"] = number_format($infos["itens"][$p]["total_alternativo"],2,",",".");

            for ($j=0; $j < sizeof($infos["itens"][$p]["subitens"]) ; $j++) {
                $precoUnitFormat = $infos["itens"][$p]["subitens"][$j]["preco_unitario"];
                $precoTotalFormat =  $infos["itens"][$p]["subitens"][$j]["preco_total"];
                
                $infos["itens"][$p]["subitens"][$j]["preco_unitario"] = number_format($precoUnitFormat,2,",",".");
                $infos["itens"][$p]["subitens"][$j]["preco_total"] = number_format($precoTotalFormat,2,",",".");
            }
        }

        $mostraMedidas = isset($request["checkMedidas"]) ? true : false;
        $mostraPrecos = isset($request["checkUnitario"]) ? true : false;
        $mostraAvisos = isset($request["checkAvisos"]) ? true : false;
        $avisos = [
            "1" => "Aviso 1",
            "2" => "Aviso 2"
        ];
        
        require_once __DIR__ . '/../vendor/vendor/autoload.php';
        
        //$mpdf=new Mpdf\Mpdf(); 
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'c',
            'margin_left' => 10,
            'margin_right' => 10,
            'margin_top' => 45,
            'margin_bottom' => 25,
            'margin_header' => 10,
            'margin_footer' => 10,
            'setAutoTopMargin' => 'false'
        ]);

        $mpdf->SetDisplayMode('fullpage');

        $htmlHeader = '
        <table width="800" style="border:1px solid #000000;" cellPadding="9"><thead></thead>
            <tbody>
            <tr>
                <td><img class="card-img-left img-fluid" src='.BASE_URL.'/assets/images/IDFX.png width = "20%" height = "auto"></td>
                <td>
                    <h2><b>Identifixe</b></h2>
                    <p class="small text-center"> AV. TERESÓPOLIS, 2547 - TERESÓPOLIS - PORTO ALEGRE - RS </p>
                    <p class="small"> CNPJ: 10.639.459/0001-93 | CEP: 90.870-001 | (51) 3109 - 2500 </p>
                    <p class="small"> www.identifixe.com.br | contato@identifixe.com.br</p>
                </td>
                <td></td>
            </tr>

            </tbody>
        </table>
        ';

        $mpdf->SetHTMLHeader($htmlHeader);

        $html ='
        <table width="800" style="border:1px solid #000000;" cellPadding="9"><thead></thead>
            <tbody>
                <tr>

                    <td align="center">
                        <h2>ORÇAMENTO</h2>
                    </td>
                </tr>
            </tbody>
        </table>
        <br></br>
        ';


        // CABEÇALHO - INFORMAÇÕES BÁSICAS DO ORÇAMENTO --------------------------------------------------------
        $html .= '
            
        <table width="800" style="border:1px solid #000000;" cellPadding="9"><thead></thead>
            <tbody>
                <tr>
                    <td>
                        <p> <b>Data de Emissão: </b> '.$infos['data_emissao'].'</p>
                        <p> <b>Data de Validade:</b> '.$infos['data_validade'].'</p>
                    </td>

                    <td>
                        <p> <b>Cliente: </b>'.$infos['cliente'].' </p>
                        <p> <b>Descrição: </b> '.$infos['descricao'].'  </p>
                        <p> <b>Contato vendedor: </b> '.$infos['tecnico'].' </p>
                    </td>

                    <td>
                        <p class="small"> <b>Prazo de Entrega: </b> '.$infos['prazo_entrega'].' </p>
                        <p class="small"> <b>Forma de Pagamento: </b> '.$infos['forma_pagamento'].'  </p>
                    </td>   

                </tr>
            </tbody>
        </table>
        <br></br>
        ';


        // CABEÇALHO DA TABELA DE ITENS --------------------------------------------------------
        $html .='
        <table style="border:1px solid #000000; line-height:20%" width="800" cellPadding="9">
            <thead>
                <tr>
                    <th scope="col"><b>Item</b></th>
                    <th scope="col"><b>Quantidade</b></th>
                    <th scope="col"><b>Produto/Serviço</b></th>
                    <th scope="col" ><b>Unidade</b></th>
                    ';

                    if ($mostraMedidas==true) {
                        $html.='<th scope="col"><b>Medidas</b></th>';
                    }

                    if ($mostraPrecos==true) {
                        $html.='
                            <th scope="col" class="preco"><b>Preço Unit.</b></th>
                            <th scope="col" class="preco"><b>Preço Total</b> </th>
                            ';
                    }

                    $html.='
                    
                </tr>
            </thead>

        ';

        //INICIO DA LISTA DE ITENS E SUBITENS

        $htmlRows = '
        <tbody>
        ';

        for ($k=0; $k < sizeof($infos["itens"]) ; $k++){

            //NOME DO ITEM
            
            $htmlRows .='
            <tr>
                <td colspan="2"><b>'.$infos["itens"][$k]["nome"].' </b></td>
                <td></td>
                <td></td>
                <td></td>
                ';
                if ($mostraMedidas==true) { $htmlRows.='<td></td>';}
                if ($mostraPrecos==true) { $htmlRows.='<td></td> <td></td>';}
            $htmlRows.='
            </tr>
            ';

            
            // LOOP PARA DESCREVER OS SUBITENS ASSOCIADOS (ex.: material, corte, aplicação, etc)
            for ($j=0; $j < sizeof($infos["itens"][$k]["subitens"]); $j++){

                $tipo_material = $infos["itens"][$k]["subitens"][$j]["tipo_material"];
                if ($tipo_material=='alternativo') {
                    $cor = 'style="color:red"';
                    $temAlternativo = true;
                    $temAlternativoGlobal = true;            
                }else{
                    $cor = '';
                }

                $htmlRows .='
                    <tr>
                        <td></td>                
                        <td height="10px" align="center" '.$cor.'>'. $infos["itens"][$k]["subitens"][$j]["quantidade"].'</td>
                        <td height="10px" align="center" '.$cor.'> '.$infos["itens"][$k]["subitens"][$j]["produto_servico"].'</td>
                        <td height="10px" align="center" '.$cor.'>'. $infos["itens"][$k]["subitens"][$j]["unidade"].'</td>
                        ';

                    if ($mostraMedidas==true) {
                        $htmlRows.='<td height="10px" align="center" '.$cor.'>'.$infos["itens"][$k]["subitens"][$j]["medidas"].' </td>';
                    }

                    if ($mostraPrecos==true) {
                        $htmlRows.='
                            <td height="10px" align="center" '.$cor.'> R$ '.$infos["itens"][$k]["subitens"][$j]["preco_unitario"].'</td>
                            <td height="10px" align="center" '.$cor.'> R$ '.$infos["itens"][$k]["subitens"][$j]["preco_total"].'</td>
                        ';
                    }

                    $htmlRows.='
                    </tr>
                ';
            };

            //VALOR PRINCIPAL E ALTERNATIVO DO SUBITEM
            $htmlRows .='
            <tr>
                <td> </td>
                <td> </td>
                <td> </td>';
                if ($mostraMedidas==true) { $htmlRows.='<td></td>';}     
                if ($mostraPrecos==true) { $htmlRows.='<td></td>';}
            $htmlRows.='
                <td><b>Preço Principal: </b> </td>
                <td>R$ '.$infos["itens"][$k]["total_principal"].'</td>
            </tr>
            ';

            if(isset($infos["itens"][$k]["total_alternativo"]) && $infos["itens"][$k]["total_alternativo"] !=0 && $temAlternativo==true){
                $htmlRows .='
                <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>';
                    if ($mostraMedidas==true) { $htmlRows.='<td></td>';}     
                    if ($mostraPrecos==true) { $htmlRows.='<td></td>';}
                $htmlRows.='
                    <td style="color:red"><b>Preço Alternativo: </b> </td>
                    <td style="color:red">R$ '.$infos["itens"][$k]["total_alternativo"].'</td>
                </tr>
                ';
            }
        };

        $html .= $htmlRows;
        $html .= '
            </tbody>
        </table>
        <br></br>
        ';

        // BLOCO COM INFORMAÇÕES GERAIS

        $html .='
        <table style="border:1px solid #000000; line-height:20%" width="800" cellPadding="9">
            <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td><b>Deslocamento:  </b></td>
                <td><b>'.$infos["deslocamento"].'</b> </td>
            </tr>

            <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td><b>Preço Total: </b> </td>
                <td><b> '.$infos["preco_total"] .' </b> </td>
            </tr>

            <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td><b>Desconto:  </b></td>
                <td><b> '.$infos["desconto"].'</b></td>
            </tr>

            <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td><b>Preço Final:  </b></td>
                <td><b> '.$infos["preco_final"].' </b> </td>
            </tr>
                ';

        if(isset($infos["preco_alternativo"]) && $infos["preco_alternativo"] != 0 && $temAlternativoGlobal==true ){

            $html.='
            <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td style="color:red"><b>Preço Alternativo:  </b></td>
                <td style="color:red"><b> '.$infos["preco_alternativo"].' </b> </td>
             </tr>
             </table>
             <br></br>
            ';
           
        }else{
            $html.='
            </table>
            <br></br>
            ';
        }


        // BLOCO COM AVISOS

        if ($mostraAvisos==true) {
            $html .='
            <table style="border:1px solid #000000; line-height:120%; font-size:9pt" width="800" cellPadding="9">
                <thead>
                    <tr>
                        <td align="center">
                            <h3>AVISOS</h3>
                        </td>
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        <td>';

                        foreach ($avisos as $key => $value) {
                            $html.='
                                <p id='.$key.'> - '. $value.'</p>
                            ';
                        }

            $html.='
                        </td>
                    </tr>
                </tbody>
            </table>
            <br></br>
            ';

        }


        // BLOCO COM NOTIFICAÇÕES

        $html.='

        <table style="border:1px solid #000000; line-height:120%; font-size:9pt" width="800" cellPadding="9">
            <tr>
                <td>
                    <p class = "small">Obs.: Os itens em vermelho são feitos com material alternativo.</p>
                    <p class = "small">O desconto é referente aos itens descritos em preto.</p>
                    <p class = "small">* Este trabalho tem 1 ano de garantia de aplicação.</p>
                    <p class = "small">* O pagamento pode ser feito em até 6x sem juros no cartão</p>
                    <p class = "small">* Este orçamento tem validade de 15 dias, a partir da sua data de emissão</p>
                </td>
                <td>
                    <p class = "small">* Material importado tradicional, tem 5 anos de garantia de durabilidade.</p>
                    <p class = "small">* Material nacional, tem 2 anos de garantia de durabilidade (externo)</p>
                    <p class = "small">* Para confirmar o agendamento, solicitamos uma entrada de 30% do preço final do trabalho</p>
                    <p class = "small">* Não aceitamos pagamentos com cheque</p>
                </td>
            </tr>
        </table>

        ';


        //arranjar outro jeito de direcionar o require
        $mpdf->WriteHTML($html);

        $mpdf->Output('Orcamento.pdf','I');
    
    }
}   
            
?>


