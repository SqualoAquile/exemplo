<?php
class Orcamentos extends model {

    protected $table = "orcamentos";
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

    private function adicionarItens($_itens, $id_orcamento) {

        $returnItens = false;

        if ($_itens != "") {

            $format_itens = str_replace("][", "|", $_itens);
            $format_itens = str_replace(" *", ",", $format_itens);
            $format_itens = str_replace("[", "", $format_itens);
            $format_itens = str_replace("]", "", $format_itens);
    
            $itens = explode("|", $format_itens);
    
            foreach ($itens as $keyItem => $item) {
    
                $explodedItem = explode(", ", $item);
    
                $tipoProdutoServico = $explodedItem[6];
                $tipoMaterial = $explodedItem[8];
    
                if (trim($tipoProdutoServico) != "produtos") {
                    $tipoMaterial = "";
                }
    
                $sqlItens = "INSERT INTO orcamentositens 
                (
                    descricao_item, 
                    descricao_subitem, 
                    quant, 
                    largura, 
                    comprimento, 
                    quant_usada, 
                    tipo_servico_produto, 
                    material_servico, 
                    tipo_material, 
                    unidade, 
                    custo_tot_subitem, 
                    preco_tot_subitem, 
                    observacao_subitem, 
                    id_orcamento, 
                    situacao
                ) 
                VALUES (
                    '" . $explodedItem[0] . "',
                    '" . $explodedItem[1] . "',
                    '" . $explodedItem[2] . "',
                    '" . $explodedItem[3] . "',
                    '" . $explodedItem[4] . "',
                    '" . $explodedItem[5] . "',
                    '" . $tipoProdutoServico . "',
                    '" . $explodedItem[7] . "',
                    '" . $tipoMaterial . "',
                    '" . $explodedItem[9] . "',
                    '" . $explodedItem[10] . "',
                    '" . $explodedItem[11] . "',
                    '" . $explodedItem[12] . "',
                    '" . $id_orcamento . "',
                    'ativo'
                )";
    
                self::db()->query($sqlItens);
    
                $erroItens = self::db()->errorInfo();
    
                if (empty($erro[2])){
                    $returnItens = true;
                }
    
            }

        }


        return $returnItens;

    }

    public function aprovar($id, $id_ordemservico) {

        if(!empty($id)){

            $id = addslashes(trim($id));

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = " | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - APROVADO";

            $sql = "UPDATE ". $this->table ." SET alteracoes = CONCAT(alteracoes, '$palter'), status = 'Aprovado' WHERE id = '$id' ";
            
            self::db()->query($sql);

            $erro = self::db()->errorInfo();

            return [
                "id_ordemservico" => $id_ordemservico,
                "message" => $erro
            ];

        }
    }

    private function excluirItens($id_orcamento) {

        $returnItens = false;

        if(!empty($id_orcamento)) {

            $id_orcamento = addslashes(trim($id_orcamento));

            $sql = "DELETE FROM orcamentositens WHERE id_orcamento = '$id_orcamento' ";
            self::db()->query($sql);
            $erro = self::db()->errorInfo();

            if (empty($erro[2])){
                $returnItens = true;
            }

        }

        return $returnItens;

    }

    public function adicionar($request) {
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $request["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        
        $request["situacao"] = "ativo";
        $request["status"] = "Em Espera";

        if (isset($request['quem_indicou'])) {
            unset($request['quem_indicou']);
        }

        if (isset($request['observacao_cliente'])) {
            unset($request['observacao_cliente']);
        }

        $keys = implode(",", array_keys($request));

        $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($request))) . "'";

        $sql = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";
        
        self::db()->query($sql);

        $erro = self::db()->errorInfo();

        $id_orcamento = self::db()->lastInsertId();
        $erroItensBoolean = $this->adicionarItens($request["itens"], $id_orcamento);

        if (empty($erro[2]) && $erroItensBoolean){

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

            $erroItensBooleanExcluir = $this->excluirItens($id);
            $erroItensBooleanAdicionar = $this->adicionarItens($request["itens"], $id);

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

            if (isset($request["quem_indicou"])) {
                unset($request["quem_indicou"]);
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

            if (empty($erro[2]) && $erroItensBooleanExcluir && $erroItensBooleanAdicionar){

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

    public function cancelar($id, $motivo){
        if(!empty($id) && !empty($motivo)) {

            $id = addslashes(trim($id));
            $motivo = addslashes(trim($motivo));

            $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  

                $sql = $sql->fetch();
                $palter = $sql["alteracoes"];
                $ipcliente = $this->permissoes->pegaIPcliente();
                $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CANCELAMENTO >> Motivo da Desistência: ".ucfirst( $motivo );

                $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', status = 'Cancelado', motivo_desistencia = '$motivo' WHERE id = '$id' ";
                
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
                $erroA = self::db()->errorInfo();
                $sqlB = "UPDATE orcamentositens SET situacao = 'excluido' WHERE id_orcamento = '$id' ";
                self::db()->query($sqlB);
                $erroB = self::db()->errorInfo();
                if (empty($erroA[2]) && empty($erroB[2])){
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

    public function itensOrcamento($id) {
        if(!empty($id)){

            $id = addslashes(trim($id));
            
            $sql = 
            "SELECT * 
            FROM `orcamentositens`
            WHERE id_orcamento='$id' and situacao='ativo' 
            ORDER BY descricao_item, descricao_subitem";

            // "SELECT 
            // tipo_material,descricao_item, quant, descricao_subitem, material_servico,largura,comprimento,unidade,custo_tot_subitem,preco_tot_subitem,
            // comentarios
            // FROM orcamentositens AS T1
            // INNER JOIN servicos AS T2 ON T1.material_servico = T2.descricao
            // ORDER BY descricao_item, descricao_subitem";

            $sql = self::db()->query($sql);
        
            return $sql->fetchAll(PDO::FETCH_ASSOC);
            
        }
    }

    public function qtdItensOrcamento($id) {
        if(!empty($id)){

            $id = addslashes(trim($id));
            $sql = "SELECT descricao_item from orcamentositens where id_orcamento='$id' and situacao='ativo' group by descricao_item";
            $sql = self::db()->query($sql);
            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);
            return sizeof($sql);
        }
    }

    public function infosOrcamento($id) {

        if(!empty($id)){

            $id = addslashes(trim($id));
            
            $sql = "SELECT * FROM orcamentos WHERE id='$id' AND situacao='ativo'";

            $sql = self::db()->query($sql);
                    
            return $sql->fetchAll(PDO::FETCH_ASSOC);
            
        }
    }

    public function custoDeslocamento() {

        $sql = "SELECT valor FROM parametros WHERE parametro='custo_deslocamento' AND situacao='ativo'";
        $sql = self::db()->query($sql);
        $sql = $sql->fetchAll(PDO::FETCH_ASSOC);
        $sql = $sql[0]['valor'];
        return $sql;
                
    }

    // VER COMO O NISSARGAM VAI FAZER A CONVENÇÃO DE MATERIAL PRINCIPAL E ALTERNATIVO
    public function precosItens($id){

        if(!empty($id)){

            $id = addslashes(trim($id));
            
            $sql = 
            "SELECT descricao_item,descricao_subitem, SUM(preco_tot_subitem) as valor
            FROM `orcamentositens` 
            WHERE id_orcamento='$id' AND situacao='ativo'
            GROUP BY descricao_item, descricao_subitem";

            $sql = self::db()->query($sql);
                    
            return $sql->fetchAll(PDO::FETCH_ASSOC);
            
        }
    }

    public function getRelacionalDropdown($request) {

        if ($request["tabela"]) {
            $tabela = trim($request["tabela"]);
            $tabela = addslashes($tabela);
        }

        $sql = "SELECT * FROM " . $tabela . " WHERE situacao = 'ativo'";

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function changeStatus($id_orcamento, $status) {

        if(!empty($id_orcamento)){

            $id_orcamento = addslashes(trim($id_orcamento));

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = " | ". ucwords($_SESSION["nomeUsuario"]) . " - $ipcliente - " . date('d/m/Y H:i:s') . " - " . strtoupper($status);

            $sql = "UPDATE ". $this->table ." SET alteracoes = CONCAT(alteracoes, '$palter'), status = '" . $status . "' WHERE id = '$id_orcamento' ";
            
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

    public function duplicar($id_orcamento) {

        if(!empty($id_orcamento)){

            $id_orcamento = addslashes(trim($id_orcamento));

            $sqlSelect = "SELECT * FROM " . $this->table . " WHERE id='$id_orcamento' AND situacao='ativo'";
            $sqlSelect = self::db()->query($sqlSelect);
                    
            $returnSelect = $sqlSelect->fetch(PDO::FETCH_ASSOC);

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = " | ". ucwords($_SESSION["nomeUsuario"]) . " - $ipcliente - " . date('d/m/Y H:i:s') . " - CADASTRO";

            if ($returnSelect["id"]) {
                unset($returnSelect["id"]);
            }
            
            $returnSelect["alteracoes"] = $palter;
            $returnSelect["titulo_orcamento"] = $returnSelect["titulo_orcamento"] . "_2";

            $keys = implode(",", array_keys($returnSelect));

            $values = "'" . implode("','", array_values($returnSelect)) . "'";

            $sqlInsert = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";

            self::db()->query($sqlInsert);

            $erro = self::db()->errorInfo();

            if (empty($erro[2])){

                $_SESSION["returnMessage"] = [
                    "mensagem" => "Registro duplicado com sucesso!",
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