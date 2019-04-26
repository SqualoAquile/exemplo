<?php
class Ordemservico extends model {

    protected $table = "ordemservico";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }
    
    public function infoItem($id) {
        $array = array();
        $arrayAux = array();

        $id = addslashes(trim($id));
        $sql = "SELECT * FROM " . $this->table . " WHERE id='$id' AND situacao = 'ativo'";      
        $sql = self::db()->query($sql);

        if($sql->rowCount()>0){
            $array = $sql->fetch(PDO::FETCH_ASSOC);
            $array = $this->shared->formataDadosDoBD($array);
        }
        
        return $array; 
    }

    public function adicionar($request) {
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $request["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        
        $request["situacao"] = "ativo";

        $keys = implode(",", array_keys($request));

        $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($request))) . "'";

        $sql = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";
        
        self::db()->query($sql);

        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            $_SESSION["returnMessage"] = [
                "mensagem" => "Registro inserido com sucesso!",
                "class" => "alert-success"
            ];
        } else {
            $_SESSION["returnMessage"] = [
                "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                "class" => "alert-danger"
            ];
        }
    }


    public function aprovar($request) {
        print_r("to chegando no model caralho");
        $ipcliente = $this->permissoes->pegaIPcliente();
        $request["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        
        $request["situacao"] = "ativo";

        $keys = implode(",", array_keys($request));

        $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($request))) . "'";

        $sql = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";
        
        self::db()->query($sql);

        $lastInsertId = self::db()->lastInsertId();

        $erro = self::db()->errorInfo();

        return [
            "id_ordemservico" => $lastInsertId,
            "id_orcamento" => $request["id_orcamento"],
            "message" => $erro
        ];

    }

    public function editar($id, $request) {
        
        if(!empty($id)){

            $id = addslashes(trim($id));
            
            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){ 
                $request['alteracoes'] = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            }else{
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> Registro sem histórico de alteração.",
                    "class" => "alert-danger"
                ];
                return false;
            }
            
            $sharedaux = new Shared('ordemservico');
            $colunas = $sharedaux->nomeDasColunas();
            // print_r($request); exit;
            $request = $sharedaux->formataDadosParaBD($request);

            // print_r($request); exit;
            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $sql = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
            
            // echo $sql; exit;
            self::db()->query($sql);

            $erro = self::db()->errorInfo();

            // print_r($erro); exit;
            if (empty($erro[2])){

                $_SESSION["returnMessage"] = [
                    "mensagem" => "Registro alterado com sucesso!",
                    "class" => "alert-success"
                ];
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                    "class" => "alert-danger"
                ];
            }
        }
    }
    
    public function excluir($id){
        if(!empty($id)) {

            $id = addslashes(trim($id));

            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  

                $sql = $sql->fetch();
                $palter = $sql["alteracoes"];
                $ipcliente = $this->permissoes->pegaIPcliente();
                $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

                $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
                self::db()->query($sqlA);

                $erro = self::db()->errorInfo();

                if (empty($erro[2])){

                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Registro deletado com sucesso!",
                        "class" => "alert-success"
                    ];
                } else {
                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                        "class" => "alert-danger"
                    ];
                }
            }
        }
    }

    public function cancelarOS($id, $motivo){
        if(!empty($id) && !empty($motivo)) {

            $id = addslashes(trim($id));
            $motivo = addslashes(trim($motivo));

            $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  

                $sql = $sql->fetch();
                $palter = $sql["alteracoes"];
                $ipcliente = $this->permissoes->pegaIPcliente();
                $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CANCELAMENTO >> Motivo do Cancelamento: ".ucfirst( $motivo );

                $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', status = 'Cancelada', motivo_cancelamento = '$motivo' WHERE id = '$id' ";
                
                self::db()->query($sqlA);

                $erro = self::db()->errorInfo();

                if (empty($erro[2])){

                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Registro cancelado com sucesso!",
                        "class" => "alert-success"
                    ];
                } else {
                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                        "class" => "alert-danger"
                    ];
                }
            }
        }
    }

    public function infosOrcamento($id) {

        if(!empty($id)){

            $id = addslashes(trim($id));
            
            $sql = 
            "SELECT * FROM orcamentos WHERE id='$id' AND situacao='ativo'";

            $sql = self::db()->query($sql);
                    
            return $sql->fetchAll(PDO::FETCH_ASSOC);
            
        }
    }

    public function imprimir($id){
        if(!empty($id)){
            $id = addslashes(trim($id));
            $infos=[];
            
            //---------------------------------------------------------------------------------------------
            // Pega algumas infos da OS
            $sql = "SELECT * FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);
            $informacoes = $sql[0];

            $infos['cliente'] = ucwords($informacoes['nome_razao_social']);
            $infos['tecnico'] = ucwords($informacoes['tec_responsavel']);
            $infos['vendedor'] = ucwords($informacoes['vendedor']);
            $infos['observacao'] = $informacoes['observacao'];
            $dataAux1 = explode('-',$informacoes['data_inicio']);
            $informacoes['data_inicio'] != "0000-00-00" ? $infos['data_inicio'] = $dataAux1[2]."/".$dataAux1[1]. "/".$dataAux1[0] : $infos['data_inicio'] = "" ;
            $dataAux2 = explode('-',$informacoes['data_fim']);
            $informacoes['data_fim'] != "0000-00-00" ? $infos['data_fim'] = $dataAux2[2]."/".$dataAux2[1]. "/".$dataAux2[0] : $infos['data_fim'] = "" ;
            $dataAux3 = explode('-',$informacoes['data_aprovacao']);
            $informacoes['data_aprovacao'] != "0000-00-00" ? $infos['data_aprovacao'] = $dataAux3[2]."/".$dataAux3[1]. "/".$dataAux3[0] : $infos['data_aprovacao'] = "" ;
            $infos['preco_total'] = number_format($informacoes['subtotal'],2,",",".");
            $infos['desconto'] =  number_format($informacoes['desconto'],2,",",".");
            $infos['preco_final'] = number_format($informacoes['valor_final'],2,",",".");

            //---------------------------------------------------------------------------------------------
            
            $id_cliente = $informacoes['id_cliente'];
            unset($sql);
            // Pega informações do cliente
            $sql = "SELECT endereco,numero,complemento,bairro,cidade,telefone,celular,email,cpf_cnpj FROM clientes WHERE id = '$id_cliente' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);

            $informacoes = $sql[0];

            $infos['endereco'] = $informacoes['endereco'] .",". $informacoes['numero'];
            empty($informacoes['complemento']) ? $infos['endereco'] = $infos['endereco'] .",". $informacoes['complemento'] : $infos['endereco'] = $infos['endereco'] ;
            $infos['endereco'] = $infos['endereco'] .",". $informacoes['bairro'] .",". $informacoes['cidade'];
            $infos['email'] = $informacoes['email'];
            if(empty($informacoes['telefone'])){
                $infos['contato'] = $informacoes['celular'];
            }else{
                $infos['contato'] = $informacoes['celular'] ." / ". $informacoes['telefone'];
            }
            $infos['cpf_cnpj'] = $informacoes['cpf_cnpj'];

            //---------------------------------------------------------------------------------------------
            
            unset($sql);
            // Pega a ID do orçamento
            $sql = "SELECT id_orcamento FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);

            $id_orcamento = $sql[0]['id_orcamento'];


            //---------------------------------------------------------------------------------------------
            unset($sql);
            // Pega as informações do orçamento através do ID 
            $sql = "SELECT * FROM orcamentos WHERE id='$id_orcamento' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);

            $informacoes = $sql[0];

            $infos["descricao"] = $informacoes['titulo_orcamento'];
            $infos["prazo_entrega"] = $informacoes['prazo_entrega'];
            $infos["forma_pagamento"] = $informacoes['forma_pgto_descricao'];
            $infos["deslocamento"] = $informacoes['deslocamento_km']. " km";

            //---------------------------------------------------------------------------------------------
            unset($sql);
            // Pega as informações dos itens de orçamento através do ID de orçamento
            $sql = "SELECT * FROM orcamentositens WHERE id_orcamento='$id_orcamento' AND situacao='ativo'";
            $sql = self::db()->query($sql);
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);

            $itens = $sql;

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
                $infos["itens"][$k-1]["subitens"][$j]["quantidade"] = $itens[$i]['quant'];
                $infos["itens"][$k-1]["subitens"][$j]["medidas"] = "L: ".$itens[$i]['largura']. " x C: ".$itens[$i]['comprimento'];
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
            
            require_once __DIR__ . '/../vendor/vendor/autoload.php';
            
            //$mpdf=new Mpdf\Mpdf(); 
            $mpdf = new \Mpdf\Mpdf([
                'default_font' => 'arial',
                'mode' => 'c',
                'margin_left' => 10,
                'margin_right' => 10,
                'margin_top' => 40,
                'margin_bottom' => 25,
                'margin_header' => 10,
                'margin_footer' => 10,
                'setAutoTopMargin' => 'false'
            ]);
    
            $mpdf->SetDisplayMode('fullpage');
    
            $htmlHeader = '
            <table width="800" style="border:1px solid #000000; font-size:10pt;" cellPadding="9"><thead></thead>
                <tbody>
                <tr>
                    <td><img class="card-img-left img-fluid" src="' . __DIR__ . '/../assets/images/IDFX.png" width = "20%" height = "auto"></td>
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
                            <h2>ORDEM DE SERVIÇO</h2>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br></br>
            ';
    
    
            // CABEÇALHO - INFORMAÇÕES BÁSICAS DO ORÇAMENTO --------------------------------------------------------
            $html .= '
                
            <table width="800" style="border:1px solid #000000; font-size:9pt" cellPadding="9"><thead></thead>
                <tbody>
                    <tr>                
                        <td>
                            <p> <b>Descrição: </b> '.$infos["descricao"].'</p>
                            <p> <b>Forma de Pagamento: </b> '.$infos['forma_pagamento'].' </p>  
                            <p> <b>Vendedor: </b> '.$infos['vendedor'].'  </p>
                            <p> <b>Técnico: </b> '.$infos['tecnico'].'  </p>
                        </td>

                        <td> 
                            <p> <b>Cliente: </b> '.$infos["cliente"].' </p>
                            <p> <b>CPF/CNPJ: </b> '.$infos["cpf_cnpj"].' </p>
                            <p> <b>Email: </b> '.$infos["email"].' </p>
                            <p> <b>Contato do Cliente: </b> '.$infos['contato'].'  </p>
                            <p> <b>Endereço: </b>'.$infos['endereco'].' </p>
                        </td>   

                        <td>
                            <p> <b>Prazo de Entrega: </b> '.$infos['prazo_entrega'].' </p>  
                            <p> <b>Data de Aprovação: </b> '.$infos['data_aprovacao'].' </p>
                            <p> <b>Data de Inicio: </b> '.$infos['data_inicio'].'  </p>
                            <p> <b>Data de Finalização: </b> '.$infos['data_fim'].'  </p>
                        </td> 
    
                    </tr>
                </tbody>
            </table>
            <br></br>
            ';
    
    
            // CABEÇALHO DA TABELA DE ITENS --------------------------------------------------------
            $html .='
            <table style="border:1px solid #000000; line-height:10%; font-size:9pt; padding-top:10px; padding-bottom:10px" width="800" cellPadding="8">
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
                                <td height="10px" align="right" '.$cor.'> R$ '.$infos["itens"][$k]["subitens"][$j]["preco_unitario"].'</td>
                                <td height="10px" align="right" '.$cor.'> R$ '.$infos["itens"][$k]["subitens"][$j]["preco_total"].'</td>
                            ';
                        }
    
                        $htmlRows.='
                        </tr>
                    ';
                };
    
                //VALOR ALTERNATIVO E PRINCIPAL DO SUBITEM
    
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
                        <td align="right" style="color:red">R$ '.$infos["itens"][$k]["total_alternativo"].'</td>
                    </tr>
                    ';
                }
    
                $htmlRows .='
                <tr style="border-bottom-style:thin solid;">
                    <td> </td>
                    <td> </td>
                    <td> </td>';
                    if ($mostraMedidas==true) { $htmlRows.='<td></td>';}     
                    if ($mostraPrecos==true) { $htmlRows.='<td></td>';}
                $htmlRows.='
                    <td><b>Preço Principal: </b> </td>
                    <td align="right">R$ '.$infos["itens"][$k]["total_principal"].'</td>
                </tr>
                
                ';
                
            };
    
            $html .= $htmlRows;
            $html .= '
                </tbody>
            </table>
            <br></br>
            ';
    
            // BLOCO COM INFORMAÇÕES GERAIS
    
            $html .='
            <table style="border:1px solid #000000; font-size:9pt; padding-top:5px; padding-bottom:5px; line-height:10%" width="800" cellPadding="5">
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
                    <td><b>R$ '.$infos["preco_total"] .' </b> </td>
                </tr>
    
                <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td><b>Desconto:  </b></td>
                    <td><b>R$ '.$infos["desconto"].'</b></td>
                </tr>';
    
                if(isset($infos["preco_alternativo"]) && $infos["preco_alternativo"] != 0 && $temAlternativoGlobal==true ){
    
                    $html.='
                    <tr>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td> </td>
                        <td style="color:red"><b>Preço Alternativo:  </b></td>
                        <td style="color:red"><b>R$ '.$infos["preco_alternativo"].' </b> </td>
                     </tr>
                    ';
                }
                
                $html.='
                <tr>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td><b>Preço Final:  </b></td>
                    <td><b>R$ '.$infos["preco_final"].' </b> </td>
                </tr>
                </table>
                <br></br>
                    ';
    
    
            // BLOCO COM AVISOS
    
            if ($mostraAvisos==true) {
                $html .='
                <table style="border:1px solid #000000; line-height:120%; font-size:10pt" width="800" cellPadding="9">
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
    <table style="border:1px solid #000000;  line-height:100%; font-size:4pt; font-size:9pt" width="800" cellPadding="9">
    
        <tr>
            <td>
                <br></br>
                <br></br>
                <p>_________________________________</p>
                <p>Assinatura do técnico responsável</p>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </td>
            <td>
                <br></br>
                <br></br>
                <p>_________________________________</p>
                <p>Assinatura do cliente</p>
                <br></br>
                <p>Afirmo que li e concordo com todo o conteúdo desta ordem de serviço e autorizo a execução da mesma. </p>
                <p>Afirmo que o serviço foi prestado de forma correta de acordo com o conteúdo aqui especificado.</p>
                <p>Autorizo o uso de imagem do bem (objeto do serviço) para divulgação em qualquer tipo de mídia.</p>
                <p>Concordo em realizar as revisões do serviço em 15 dias e 30 dias após a data de realização do serviço.</p>
            </td>
        </tr>
    </table>

    ';


//arranjar outro jeito de direcionar o require
$mpdf->WriteHTML($html);

$mpdf->Output('OrdemServico.pdf','I');
    

        }

    }

}