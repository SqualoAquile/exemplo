<?php
class parametrosController extends controller{

    protected $table = "parametros";

    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {

        parent::__construct();

        $this->usuario = new Usuarios();

        $this->shared = new Shared($this->table);
        $tabela = ucfirst($this->table);
        $this->model = new $tabela();

        if($this->usuario->isLogged() == false){
            header("Location: ".BASE_URL."/login"); 
        }
    }
     
    public function index() {

      $dados = array();
      
      $dados["infoUser"] = $_SESSION;
      $dados["tabelas"] = $this->model->index();
      $dados["registros"] = $this->model->pegarFixos();
      $dados["labelTabela"] = $this->shared->labelTabela();

      $this->loadTemplate($this->table, $dados); 
    }

    public function listar() {
        if (isset($_POST) && !empty($_POST)) {
            echo json_encode($this->model->listar($_POST));
        }
    }
    
    public function adicionar() {
        if (isset($_POST) && !empty($_POST)) {
            echo json_encode($this->model->adicionar($_POST));
        }
    }

    public function excluir($id) {
        if (isset($_POST) && !empty($_POST)) {
            if (isset($id) && !empty($id)) {
                echo json_encode($this->model->excluir($_POST, $id));
            }
        }
    }

    public function editar($id) {
        if (isset($_POST) && !empty($_POST)) {
            if (isset($id) && !empty($id)) {
                echo json_encode($this->model->editar($_POST, $id));
            }
        }
    }

    public function editarFixos($id) {
        if (isset($_POST) && !empty($_POST)) {
            if (isset($id) && !empty($id)) {
                echo json_encode($this->model->editarFixos($_POST, $id));
            }
        }
    }
  
}
?>