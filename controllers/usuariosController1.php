<?php
class usuariosController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "usuarios";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {
        
        // Instanciando as classes usadas no controller
        $this->shared = new Shared($this->table);
        $this->model = new $this->table();
        $this->usuario = new Usuarios();
    
        $this->colunas = $this->shared->nomeDasColunas();

        // Verificar se o funcionário está logado ou nao
        if($this->usuario->isLogged() == false){
            header("Location: " . BASE_URL . "/login"); 
        }

        // verifica se tem permissão para ver esse módulo
        if(in_array($this->table . "_ver", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/home"); 
        }
        
    }
     
    public function index() {
        $dados['infoUser'] = $_SESSION;
        $dados["colunas"] = $this->colunas;
        $this->loadTemplate($this->table, $dados);      
    }
    
    public function adicionar() {
        
        if(in_array($this->table. "_add", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }
        
        $dados['infoUser'] = $_SESSION;
        
        // Verifica se está adicionando ou se está apenas chamando a página
        if(isset($_POST) && !empty($_POST)){ //adiciona
            $this->model->adicionar($_POST);
            header("Location: " . BASE_URL . "/" . $this->table);
        }else{ //exibe
            $dados["colunas"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Adicionar"];
            $this->loadTemplate($this->table . "-form", $dados);
        }
    }
    
    public function editar($id) {
        
        // [add][edt]criar type password via javascript no input senha do formulário
        // [add][edt]criar input senha2 para a validação da senha
        // [add][edt]criar a regra de criação da senha
        // [add][edt]criar a validação dos campos de senha no editar
        // [add][edt]

        if(in_array($this->table . "_edt", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }

        $dados['infoUser'] = $_SESSION;
        
        if(isset($_POST) && !empty($_POST)){
            $this->model->editar($id, $_POST);
            header("Location: " . BASE_URL . "/" . $this->table); 
        }else{
            $dados["item"] = $this->model->infoItem($id);
            $dados["colunas"] = $this->colunas;
            $dados["viewInfo"] = ["title" => "Editar"];
            $this->loadTemplate($this->table . "-form", $dados); // Chama a view com base no nome da tabela
        }
    }

    public function excluir($id){

        if(in_array($this->table . "_exc", $_SESSION["permissoesUsuario"]) == false || empty($id) || !isset($id)){
            header("Location: " . BASE_URL . "/" . $this->table); 
        }

        $this->model->excluir($id);

        header("Location: " . BASE_URL . "/" . $this->table);
    }
    
}   
?>