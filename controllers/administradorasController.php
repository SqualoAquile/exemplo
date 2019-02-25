<?php
class administradorasController extends controller{

    protected $table = "administradoras";
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
        $dados = array();
        $dados["infoUser"] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"] = $this->shared->labelTabela();
        $this->loadTemplate($this->table, $dados);      
    }
    
    // public function adicionar() {
        
    //     if(in_array("administradoras_add",$_SESSION["permissoesUsuario"]) == FALSE){
    //         header("Location: ".BASE_URL."/administradoras"); 
    //     }
        
    //     $array = array();
    //     $dados['infoUser'] = $_SESSION;
    //     $a = new Administradoras();
        
    //     if(isset($_POST["nome"]) && !empty($_POST["nome"]) && isset($_POST["bandeira"]) && isset($_POST["infos"]) && isset($_POST["txant"]) && isset($_POST["txcre"])){
            
    //         $nome = addslashes($_POST["nome"]);
    //         $bandeiras = $_POST["bandeira"]; //ids de cadastro das bandeiras 
    //         $informacoes = $_POST["infos"];
    //         $txantecipacoes = $_POST["txant"];
    //         $txcreditos = $_POST["txcre"];
    //         $a->adicionar($nome,$bandeiras,$informacoes,$txantecipacoes,$txcreditos);
    //         header("Location: ".BASE_URL."/administradoras");
    //     }else{

    //         $dados["listaBandeiras"] = $a->pegarListaBandeiras();
    //         $this->loadTemplate("administradoras-form",$dados);
    //     }  
    // }

    public function adicionar() {
        
        if(in_array($this->table. "_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }
        
        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){ 
            $this->model->adicionar($_POST);
            header("Location: " . BASE_URL . "/" . $this->table);
        }else{ 
            $dados["colunas"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Adicionar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $dados["listaBandeiras"] = $this->model->pegarListaBandeiras();
            $this->loadTemplate($this->table . "-form", $dados);
        }
    }
    
    public function editar($id) {
        if(in_array("administradoras_edt",$_SESSION["permissoesUsuario"]) == FALSE || empty($id) || !isset($id)){
            header("Location: ".BASE_URL."/administradoras"); 
        }
        $array = array();
        $dados['infoUser'] = $_SESSION;
        $a = new Administradoras();
        
        $id = addslashes($id); // id da administradora de cartão
        if(isset($_POST["nome"]) && !empty($_POST["nome"]) && isset($_POST["bandeira"]) && isset($_POST["infos"]) && isset($_POST["txant"]) && isset($_POST["txcre"])){
            
            $nome = addslashes($_POST["nome"]); //nome da administradora
            $bandeiras = $_POST["bandeira"]; // [idCadBandAceitas] => [idCadBandeiras]
            $informacoes = $_POST["infos"];
            $txantecipacoes = $_POST["txant"];
            $txcreditos = $_POST["txcre"];
            $alter = addslashes($_POST["alter"]);
            
            $a->editar($id, $nome,$bandeiras,$informacoes,$txantecipacoes,$txcreditos,$alter);
            header("Location: ".BASE_URL."/administradoras");
        }else{
            
            $dados["infoAdm"] = $a->pegarInfoAdm($id);
            $dados["listaBandeiras"] = $a->pegarListaBandeiras();
            $dados["bandeirasAceitas"] = $a->pegarBandeirasAceitas($id);
            $this->loadTemplate("administradoras-edt",$dados);
        } 

    }

    public function excluir($id) {
        if(in_array("administradoras_exc",$_SESSION["permissoesUsuario"]) == FALSE || empty($id) || !isset($id)){
            header("Location: ".BASE_URL."/administradoras"); 
        }
        
        $a = new Administradoras();
        $id = addslashes($id);

        $a->excluir($id);
        header("Location: ".BASE_URL."/administradoras");  
      }
    }   
  
?>