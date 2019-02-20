<?php
class model{

    protected $db = null;

    public function __construct() {
        
        global $config;
        
        // Conexão com o banco de dados
        try{
            
            if ($this->db === null) {
                
                $this->db = new PDO(
                    "mysql:dbname=" . $config["db"] . ";host=" . $config["host"] . ";",
                    $config["user"],
                    $config["pass"]
                );

                $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->db->exec('SET NAMES utf8');
            }

            return $this->db;

        } catch (PDOException $e){
            // Exibir mensagem de erro caso não seja possível a conexão com o banco
            echo "FALHA : ".$e->getMessage()."<br/> Entre em contato com o administrador do sistema.";
        }
    }
}
?>