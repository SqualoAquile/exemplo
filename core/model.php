<?php
class model{
    
    protected $db;

    public function __construct() {
        global $config;
        
        // Conexão com o banco de dados
        try{
            $this->db = new PDO(
                "mysql:dbname=" . $config["db"] . ";host=" . $config["host"] . ";",
                $config["user"],
                $config["pass"],
                // Comandro (driver) usado para cada conexão com o banco de dados
                array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
            );
        // Exibir mensagem de erro caso não seja possível a conexão com o banco
        } catch (PDOException $e){
             echo "FALHA : ".$e->getMessage()."<br/> Entre em contato com o administrador do sistema.";
        }
    }
}

?>
    