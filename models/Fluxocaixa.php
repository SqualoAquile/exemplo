<?php
class Fluxocaixa extends model {

    protected $table = "fluxocaixa";
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

    public function quitar($request) {

        $data_quitacao = $request["data_quitacao"];
        $arr_quitar_id = $request["aquitares"];
        
        if (!empty($data_quitacao) && !empty($arr_quitar_id)) {

            $dtaux = explode("/", $data_quitacao);
            if (count($dtaux) == 3) {
                $data_quitacao = $dtaux[2] . "-" . $dtaux[1] . "-" . $dtaux[0];
            }
            
            $ipcliente = $this->permissoes->pegaIPcliente();
            $alteracoes = " | " . ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - QUITAÇÃO";

            $idImploded = implode(",", $arr_quitar_id);

            $stringUpdate = "UPDATE " . $this->table . " SET status='Quitado', data_quitacao='" . $data_quitacao . "', alteracoes=CONCAT(alteracoes, '" . $alteracoes . "') WHERE id IN (" . $idImploded . ")";
            
            self::db()->query($stringUpdate);

            return self::db()->errorInfo();
        }
    }

    public function excluirChecados($request) {

        $checados = $request["checados"];
        
        if (!empty($checados)) {
            
            $ipcliente = $this->permissoes->pegaIPcliente();
            $alteracoes = " | " . ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

            $idImploded = implode(",", $checados);

            $stringUpdate = "UPDATE " . $this->table . " SET situacao='excluido', alteracoes=CONCAT(alteracoes, '" . $alteracoes . "') WHERE id IN (" . $idImploded . ")";
            
            self::db()->query($stringUpdate);

            return self::db()->errorInfo();
        }
    }

    public function inlineEdit($request) {
        
        $id = $request["id"];
        $valor_total = $request["valor_total"];
        $data_vencimento = $request["data_vencimento"];
        $observacao = $request["observacao"];

        $dtaux = explode("/", $data_vencimento);
        if (count($dtaux) == 3) {
            $data_vencimento = $dtaux[2] . "-" . $dtaux[1] . "-" . $dtaux[0];
        }

        $valor_total = preg_replace('/\./', '', $valor_total);
        $valor_total = preg_replace('/\,/', '.', $valor_total);

        if (!empty($id)) {

            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));
            $alteracoes = $hist[0] . " | " . ucwords($_SESSION["nomeUsuario"]) . " - $ipcliente - " . date('d/m/Y H:i:s') . " - ALTERAÇÃO >> " . $hist[1];

            $stringUpdate = "UPDATE " . $this->table . " SET valor_total='" . $valor_total . "', data_vencimento='" . $data_vencimento . "', observacao='" . $observacao . "', alteracoes=CONCAT(alteracoes, '" . $alteracoes . "') WHERE id=" . $id;

            self::db()->query($stringUpdate);

            return self::db()->errorInfo();
        }
    }

    public function adicionar($request) {

        $ipcliente = $this->permissoes->pegaIPcliente();

        $sql = '';
        foreach ($request as $linha => $arrayRegistro) {

            $arrayRegistro["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
            $arrayRegistro["situacao"] = "ativo";
            
            $keys = implode(",", array_keys($arrayRegistro));
            $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($arrayRegistro))) . "'";
            
            $sql .= "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ");";               
        }
        
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

            $request = $this->shared->formataDadosParaBD($request);

            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $sql = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
             
            self::db()->query($sql);

            $erro = self::db()->errorInfo();

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

    public function receitasDespesas($infoConsulta){
        
        $array = array();
        if(!empty($infoConsulta) && isset($infoConsulta)){
            $data1 = '';
            $data2 = '';
            $tabela = addslashes(trim($infoConsulta['tabela']));
            $campo = addslashes(trim($infoConsulta['campo']));
            $dataInicio = addslashes(trim($infoConsulta['dataInicio']));
            $dataInicio = explode("/",$dataInicio);
            $data1 = $dataInicio[2]."-".$dataInicio[1]."-".$dataInicio[0];
            
            if( $dataInicio[1] == '2'){
                if( is_int(intval($dataInicio[2]) / intval(4)) ){
                    $data2 = $dataInicio[2]."-".$dataInicio[1]."-29";
                }else{
                    $data2 = $dataInicio[2]."-".$dataInicio[1]."-28";
                }
            }else if($dataInicio[1] == '1' || $dataInicio[1] == '3' || $dataInicio[1] == '5'  ||
                     $dataInicio[1] == '7' || $dataInicio[1] == '8' || $dataInicio[1] == '10' || $dataInicio[1] == '12'){

                $data2 = $dataInicio[2]."-".$dataInicio[1]."-31";

            }else{

                $data2 = $dataInicio[2]."-".$dataInicio[1]."-30";
            }

            $sql1 = "SELECT SUM(valor_total) as despesatotal FROM fluxocaixa WHERE despesa_receita = 'Despesa' AND data_quitacao BETWEEN '$data1' AND '$data2'";
            $sql1 = self::db()->query($sql1);

            if($sql1->rowCount() > 0){  
                $sql1 = $sql1->fetch();
                $despesa = floatval($sql1['despesatotal']);
            }else{
                $despesa = floatval(0);
            }    

            $sql2 = "SELECT SUM(valor_total) as receitatotal FROM fluxocaixa WHERE despesa_receita = 'Receita' AND data_quitacao BETWEEN '$data1' AND '$data2'";
            $sql2 = self::db()->query($sql2);

            if($sql2->rowCount() > 0){  
                $sql2 = $sql2->fetch();
                $receita = floatval($sql2['receitatotal']);
            }else{
                $receita = floatval(0);
            }    

            $resultado = floatval($receita - $despesa);
            $array['Receita'] = $receita;
            $array['Despesa'] = $despesa;
            $array['Resultado'] = $resultado;

        }
        return $array;
    }

    public function buscaDespId($idProcurado){
        
        $array = array();
        if(!empty($idProcurado) && isset($idProcurado)){
            
            $idProcurado = addslashes(trim($idProcurado));

            $sql1 = "SELECT SUM(valor_total) as despesatotal FROM fluxocaixa WHERE despesa_receita = 'Despesa' AND nro_pedido = '$idProcurado'";
            $sql1 = self::db()->query($sql1);

            if($sql1->rowCount() > 0){  
                $sql1 = $sql1->fetch();
                $despesa = floatval($sql1['despesatotal']);
            }else{
                $despesa = floatval(0);
            }    

            $array['DespesaId'] = $despesa;

        }
        return $array;
    }
}