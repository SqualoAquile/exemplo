<?php
class Servicos extends model {

    protected $table = "servicos";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        parent::__construct(); 
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }

    public function listar() {
        
        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'";
        $sql = $this->db->query($sql);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $key => $value) {
            $result[$key]["comentarios"] = json_decode($value["comentarios"], true);
        }

        return $result;
    }
    
    public function infoItem($id) {
        $array = array();
        $arrayAux = array();

        $id = addslashes(trim($id));
        $sql = "SELECT * FROM " . $this->table . " WHERE id='$id' AND situacao = 'ativo'";      
        $sql = $this->db->query($sql);

        if($sql->rowCount()>0){
            $array = $sql->fetch(PDO::FETCH_ASSOC);
            $array = $this->shared->formataDadosDoBD($array);
        }
        
        return $array; 
    }

    public function editar($request, $id) {

        if(!empty($id)){

            $id = addslashes(trim($id));

            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){ 
                $request['alteracoes'] = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            }

            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $update = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
                
            $update = $this->db->query($update);

            $erro = $this->db->errorInfo();

            if (empty($erro[2])){
                $select = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo' AND id = '" . $id . "'";
                $select = $this->db->query($select);
                $select = $select->fetch(PDO::FETCH_ASSOC);
            }

            return [
                "result" => $select,
                "erro" => $erro
            ];
        }
    }
    
    public function idAtivo($id){
        if(!empty($id)) {
    
            $id = addslashes(trim($id));
            
            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT * FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = $this->db->query($sql);
            
            if($sql->rowCount() > 0){  
                return true;
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Erro no endereço, você foi redirecionado para ".ucwords($this->table),
                    "class" => "alert-danger"
                ];
                return false;
            }
        }
    }
}