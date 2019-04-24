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

            return $infos;

        }

    }

}