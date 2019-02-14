<?php
class Usuarios extends model {

    protected $table = "usuarios";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        parent::__construct(); 
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }
    
    public function infoItem($id) {
        $array = array();
        $arrayAux = array();

        $sql = "SELECT * FROM " . $this->table . " WHERE id='$id' AND situacao = 'ativo'";      
        $sql = $this->db->query($sql);

        if($sql->rowCount()>0){
            $array = $sql->fetch(PDO::FETCH_ASSOC);
            $array = $this->shared->formataDadosDoBD($array);
        }
        return $array; 
    }

    public function adicionar($request) {
        
        $req = array();
        
        $idgp = $request["grupo_permissao"];
        $sql = "SELECT nome FROM permissoes WHERE id = '$idgp' AND situacao = 'ativo'";
        $sql = $this->db->query($sql);
            
        if($sql->rowCount() > 0){  
            $sql = $sql->fetch();
            $request["grupo_permissao"] = $sql['nome'];
            $request["id_grupo_permissao"] = $idgp;
        } 

        $ipcliente = $this->permissoes->pegaIPcliente();

        $req["nome"]                = addslashes($request["nome"]);
        $req["email"]               = addslashes($request["email"]);
        $req["grupo_permissao"]     = $request["grupo_permissao"];
        $req["id_grupo_permissao"]  = $idgp;
        $req["observacao"]          = addslashes($request["observacao"]);
        $req["senha"]               = md5(addslashes($request["senha"]));
        $req["cod_atual"]           = "";
        $req["alteracoes"]          = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        $req["situacao"]            = "ativo";


        $keys = implode(",", array_keys($req));
       
        $values = "'" . implode("','", array_values($req)) . "'";

        $sql = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";

        $this->db->query($sql);
        $erro = $this->db->errorInfo();

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
            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){
                $request['alteracoes'] = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERACAO >> ".$hist[1];     
            }else{
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> Registro sem histórico de alteração.",
                    "class" => "alert-danger"
                ];
                return false;
            }

            $req = array();
        
            $idgp = $request["grupo_permissao"];
            $sql = "SELECT nome FROM permissoes WHERE id = '$idgp' AND situacao = 'ativo'";
            $sql = $this->db->query($sql);
                
            if($sql->rowCount() > 0){  
                $sql = $sql->fetch();
                $request["grupo_permissao"] = $sql['nome'];
                $request["id_grupo_permissao"] = $idgp;
            } 
    
            $req["nome"]                = addslashes($request["nome"]);
            $req["email"]               = addslashes($request["email"]);
            $req["grupo_permissao"]     = $request["grupo_permissao"];
            $req["id_grupo_permissao"]  = $idgp;
            $req["observacao"]          = addslashes($request["observacao"]);
            $req["senha"]               = md5(addslashes($request["senha"]));
            $req["cod_atual"]           = "";
            $req["alteracoes"]          = $request['alteracoes'];    


            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $sql = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
            //echo $sql; exit;
            $this->db->query($sql);
            $erro = $this->db->errorInfo();

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

            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = $this->db->query($sql);
            
            if($sql->rowCount() > 0){  

                $sql = $sql->fetch();
                $palter = $sql["alteracoes"];
                $ipcliente = $this->permissoes->pegaIPcliente();
                $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

                $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
                $this->db->query($sqlA);

                $erro = $this->db->errorInfo();

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


    ///////////////////////////////////////////////////////////////////////////////////
    ///         A PARTIR DAQUI COMEÇAM AS FUNÇÕES DE LOGIN                          ///    
    ///                                                                             ///
    ///////////////////////////////////////////////////////////////////////////////////

    public function fazerLogin($email,$senha){
        $array = array();
        if(!empty($senha) && !empty($email)){
            $senha = addslashes($senha);
            $email = addslashes($email);

            $sql = "SELECT * FROM ". $this->table ." WHERE email='$email' AND senha = '$senha' AND situacao = 'ativo'";


            $sql = $this->db->query($sql);
            if($sql->rowCount()>0){
                $sql = $sql->fetch(PDO::FETCH_ASSOC);


                //buscar as informaçoes do usuario logado
                $_SESSION["nomeUsuario"] = $sql["nome"];
                $_SESSION["idUsuario"] = $sql["id"];
                $_SESSION["emailUsuario"] = $sql["email"];

                //buscar as permissoes que o usuario tem
                $_SESSION["permissoesUsuario"] = $this->permissoes->getPermissoes($sql["id_grupo_permissao"]);

                //verifica se todas as informações de login estão corretas
                if( empty($_SESSION["nomeUsuario"])  || empty($_SESSION["idUsuario"]) || 
                    empty($_SESSION["emailUsuario"]) || empty($_SESSION["permissoesUsuario"])){
                    return false;     
                }

                //$ip = $_SERVER['REMOTE_ADDR']; // usa o IP para gerar o cod_atual
                $ip = gethostbyaddr($_SERVER['REMOTE_ADDR']);
                //coloca o ip do pc de quem acabou de logar
                $sqlB = "UPDATE ". $this->table ." SET cod_atual = '$ip' WHERE email='$email'";
                $this->db->query($sqlB);

                return true;
            }else{
                return false;     
            }
        }
        }

    public function isLogged(){
        if( isset($_SESSION["idUsuario"]) && !empty($_SESSION["idUsuario"]) &&
            isset($_SESSION["nomeUsuario"]) && !empty($_SESSION["nomeUsuario"]) &&
            isset($_SESSION["permissoesUsuario"]) && !empty($_SESSION["permissoesUsuario"])){
            
            $id = $_SESSION['idUsuario'];
            //$ip = $_SERVER['REMOTE_ADDR'];
            $ip = gethostbyaddr($_SERVER['REMOTE_ADDR']);
            
            $sql = "SELECT * FROM ". $this->table ." WHERE id='$id' AND cod_atual = '$ip' AND situacao = 'ativo'";
            $sql = $this->db->query($sql);
            if($sql->rowCount()>0){
                //identificou que o ip salvo é igual ao ip que acabou de logar
                return true; 
            }else{
                //identificou que o ip salvo é diferente do ip que acabou de logar
                return false;
            }  
        }else{
            return false;
        }
    }

}