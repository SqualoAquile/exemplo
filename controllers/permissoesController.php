<?php
class permissoesController extends controller{

    protected $table = "permissoes";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {

        parent::__construct();
        
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
        $dados["infoUser"] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $dados["labelTabela"] = $this->shared->labelTabela();
        $this->loadTemplate($this->table, $dados);
    } 
    
    public function adicionar() {
        
        if(in_array("permissoes_add",$_SESSION["permissoesFuncionario"]) == FALSE){
            header("Location: ".BASE_URL."/permissoes"); 
        }
        
        $array = array();
        $dados['infoUser'] = $_SESSION;
        $p = new Permissoes();
           
        if(isset($_POST["nome"]) && !empty($_POST["nome"]) && isset($_POST["permissoes"]) && !empty($_POST["permissoes"])){
             
             $pnome = addslashes($_POST["nome"]);
             $pLista = $_POST["permissoes"];
             $p->adicionarGrupo($pnome,$pLista,$_SESSION["idEmpresaFuncionario"]);
             header("Location: ".BASE_URL."/permissoes");
        }else{

             $dados["listaPermissoes"] = $p->pegarListaPermissoes();
             $dados["viewInfo"] = ["title" => "Adicionar"];
             $this->loadTemplate("permissoes-form",$dados);
        }  
    }
    
    public function editar($id) {
        if(in_array("permissoes_edt",$_SESSION["permissoesUsuario"]) == FALSE || empty($id) || !isset($id)){
            header("Location: ".BASE_URL."/permissoes"); 
        }
        $array = array();
        $dados['infoUser'] = $_SESSION;
        $p = new Permissoes();
        
        $id = addslashes($id);
        if(isset($_POST["enome"]) && !empty($_POST["enome"]) && isset($_POST["epermissoes"]) && !empty($_POST["epermissoes"])){
            
            $pnome = addslashes($_POST["enome"]);
            $pLista = $_POST["epermissoes"];
            $palter = addslashes($_POST["alter"]);
            $p->editarGrupo($pnome,$pLista,$palter,$id,$_SESSION["idEmpresaFuncionario"]);
            header("Location: ".BASE_URL."/permissoes");
        }else{
            
            $dados["listaPermissoes"] = $p->pegarListaPermissoes();
            $dados["permAtivas"] = $p->pegarPermissoesAtivas($id);
            $dados["viewInfo"] = ["title" => "Editar"];
            $dados["labelTabela"] = $this->shared->labelTabela();
            $this->loadTemplate("permissoes-form",$dados);
        } 

    }
      

    public function excluirGrupo($id) {
        if(in_array("permissoes_exc",$_SESSION["permissoesFuncionario"]) == FALSE || empty($id) || !isset($id)){
            header("Location: ".BASE_URL."/permissoes"); 
        }
        
        $p = new Permissoes();
        $id_grupo = addslashes($id);
        $numFunc = $p->excluirGrupo($id_grupo,$_SESSION["idEmpresaFuncionario"]);  
        
        $dados = array();
        $dados["aviso"] = "";
        if($numFunc != 0){
            $dados["aviso"] = "Nenhum funcionário pode estar associado ao grupo para ocorrer a exclusão.<br/>".$numFunc." funcionário(s) está(ão) associado(s) ao grupo.";
        }
                
        $dados['infoUser'] = $_SESSION;       
        $dados["listaGrupoPermissoes"]  = $p->pegarListaGrupos();
        $this->loadTemplate("permissoes",$dados);  
      }
    }   
  
?>

