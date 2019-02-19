<?php
class Parametros extends model {

    protected $table;
    protected $permissoes;
    
    public function __construct() {
        parent::__construct();
        $this->permissoes = new Permissoes();
    }

    public function index() {

        $sql = "SHOW TABLES";
        $sql = $this->db->query($sql);
        $tabelas = $sql->fetchAll();

        $infosTabelas = [];
        foreach ($tabelas as $key => $value) {

            $sqlB = "SHOW TABLE STATUS WHERE Name='" . $value[0] . "'";
            $sqlB = $this->db->query($sqlB);
            $infoTabela = $sqlB->fetchAll();

            foreach ($infoTabela as $key => $value) {
                $infoTabela[$key]["Comment"] = json_decode($value["Comment"], true);
            }

            array_push($infosTabelas, $infoTabela);
        }

        return $infosTabelas;
    }

    public function listar($request) {
        
        $this->table = $request["tabela"];

        $value_sql = "";
        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);

            $value_sql = " AND " . $campo . " LIKE '%" . $value . "%'";
        }

        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'" . $value_sql;

        $sql = $this->db->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function adicionar($request) {

        $this->table = $request["tabela"];

        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);
        }

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        $sql = "INSERT INTO " . $this->table . " (" . $campo . ", alteracoes, situacao) VALUES ('" . $value . "', '" . $alteracoes . "', 'ativo')";
        
        $this->db->query($sql);

        return $this->db->errorInfo();
    }

    public function excluir($request, $id) {

        $this->table = $request["tabela"];

        $id = addslashes(trim($id));

        $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
        $sql = $this->db->query($sql);

        if ($sql->rowCount() > 0) {
            
            $sql = $sql->fetch();
            $palter = $sql["alteracoes"];

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

            $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
            $this->db->query($sqlA);
        }

        return $this->db->errorInfo();
    }

    public function editar($request, $id) {
        
        $this->table = $request["tabela"];

        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);
        }

        $id = addslashes(trim($id));

        $sql = "UPDATE " . $this->table . " SET " . $campo . " = '" . $value . "' WHERE id='" . $id . "'";
             
        $this->db->query($sql);

        return $this->db->errorInfo();
    }

    public function pegarFixos() {

        $this->table = "parametros";
        
        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'";
        $sql = $this->db->query($sql);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $key => $value) {
            $result[$key]["comentarios"] = json_decode($value["comentarios"], true);
        }

        return $result;
    }

    public function editarFixos($request, $id) {
        
        $this->table = "parametros";

        if ($request["value"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
        }

        $id = addslashes(trim($id));

        $sql = "UPDATE " . $this->table . " SET valor = '" . $value . "' WHERE id='" . $id . "'";
             
        $this->db->query($sql);

        return $this->db->errorInfo();

    }
}