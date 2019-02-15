<?php

class Shared extends model {

    protected $config;
    protected $table;

    public function __construct($table) {
        global $config;
        $this->config = $config;
        $this->table = $table;
        parent::__construct(); 
    }

    private function formataacoes($id){
        $stringBtn = '';
        $stringBtn .= '<form  method="POST" class="btn-group btn-group-sm" role="group" aria-label="Ações">';
        
        if( in_array( $this->table.'_edt' , $_SESSION["permissoesUsuario"]) ){
            $stringBtn .=  '<a href="' . BASE_URL . '/' . $this->table . '/editar/' . $id . '" class="btn btn-primary">Editar</a>';      
        }

        if(in_array($this->table."_exc", $_SESSION["permissoesUsuario"])){
            $stringBtn .= '<input type="hidden" name="id" value="'. $id .'"><button type="submit" onclick="return confirm(\'Tem Certeza?\')"class="btn btn-secondary"">Excluir</button>';
        }
        
        $stringBtn .= '</form>';
        
        return $stringBtn;
    }

    public function montaDataTable() {
        //print_r($_SESSION); exit;
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "acoes") {

                    
                    
                    //echo "aquiaaaa"; exit;
                    $stringBtn = '';
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($id, $row) {
                            return $this->formataacoes($id);
                        }
                    ];
                } else {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index
                    ];
                }
                $index++;
            }
            
        };
        //print_r($columns); exit;
        return Ssp::complex($_POST, $this->config, $this->table, "id", $columns, null, "situacao='ativo'");
    }

    public function unico($campo, $valor) {
        $array = array();
        $sql = "SELECT " . $campo . " FROM $this->table WHERE $campo = '$valor' AND situacao = 'ativo'";      
        $sql = $this->db->query($sql);
        if($sql->rowCount()>0){
            $array = $sql->fetchAll(PDO::FETCH_ASSOC);
        }
        return $array;
    }

    public function nomeDasColunas(){
        $sql = $this->db->query("SHOW FULL COLUMNS FROM " . $this->table);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($result as $key => $value) {
            //print_r($result); exit;
            $result[$key]["Comment"] = json_decode($result[$key]["Comment"], true);
            
            // CRIA UMA CHAVE NOVA NO VETOR COM A INFORMAÇÃO DO TAMANHO MÁXIMO QUE O CAMPO PODE RECEBER, ALIMENTAR O MAXLEGTH
            $tipo = $result[$key]["Type"];
            $inicio = intval( strpos($tipo,"(") + 1);
            $tamanho = intval( intval(strpos($tipo, ")")) - $inicio); 
            $maxl = intval( substr ( $tipo , $inicio , $tamanho));
            $result[$key]["tamanhoMax"] = $maxl != 0 ? $maxl : '' ;          

            // PEGAS AS INFORMAÇÕES DA TABELA RELACIONAL (UNIDIMENSIONAL) NECESSÁRIA PARA MONTAR AS OPÇÕES DO CAMPO NO FORM (SELECT E CHECKBOX)
            $lista = array();
            $arrayAux = array();

            if(array_key_exists("type", $result[$key]["Comment"]) && $result[$key]["Comment"]["type"] == "relacional"){

                $tabela =  lcfirst($result[$key]["Comment"]["info_relacional"]["tabela"]);
                $campo = lcfirst($result[$key]["Comment"]["info_relacional"]["campo"]);

                $sql = "SELECT id, ". $campo ." FROM  ". $tabela ." WHERE situacao = 'ativo'";      
                $sql = $this->db->query($sql);

                if($sql->rowCount()>0){
                    $arrayAux = $sql->fetchAll(PDO::FETCH_ASSOC); 

                    foreach ($arrayAux as $chave => $valor){
                        $lista[] = [
                            "id" => $valor["id"], 
                            "$campo" => ucwords($valor["$campo"])
                        ];
                    }

                    $result[$key]['Comment']['info_relacional']['resultado'] = $lista;
                }
            }
            if(array_key_exists("type", $result[$key]["Comment"]) && $result[$key]["Comment"]["type"] == "checkbox"){

                $tabela =  lcfirst($result[$key]["Comment"]["info_relacional"]["tabela"]);
                $campo = lcfirst($result[$key]["Comment"]["info_relacional"]["campo"]);

                $sql = "SELECT ". $campo ." FROM  ". $tabela ." WHERE situacao = 'ativo'";      
                $sql = $this->db->query($sql);

                if($sql->rowCount()>0){
                    $arrayAux = $sql->fetchAll(PDO::FETCH_ASSOC); 
                    
                    foreach ($arrayAux as $chave => $valor){
                        $lista[] = ucwords($valor["$campo"]);
                    }

                    $result[$key]['Comment']['info_relacional']['resultado'] = $lista;
                }
            }        

        }
        
        //print_r($result); exit;
        return $result;
    } 

    public function pegarListas($table) {
        $array = array();
        $sql = "SELECT * FROM " . $table . " WHERE situacao = 'ativo' ORDER BY id DESC";
        $sql = $this->db->query($sql);
        if($sql->rowCount()>0){
            $array = $sql->fetchAll(); 
        }
        return $array; 
    }

    public function formataDadosParaBD($registro) {
        if(isset($registro) && !empty($registro)){
            $array = array();
            $nomeColunas = $this->nomeDasColunas();        // busca o nome dos campos das colunas para ver qual o tipo a ser formatado
            $primeiroElemento = array_shift($nomeColunas); // usado só para retirar o primeiro elemento do array que é o ID

            $i=0;
            
            foreach ($registro as $chave => $valor) {
                //testo se é o valor referente ao mesmo campo do nome das colunas
                if($nomeColunas[$i]['Field'] == $chave){ 

                    if($nomeColunas[$i]['Type'] == 'date'){
                        //formatação de data padrão internacional
                        $dtaux = explode("/",addslashes($registro[$chave]));
                        $array[$chave] = $dtaux[2]."-".$dtaux[1]."-".$dtaux[0];

                    }elseif (substr_count($nomeColunas[$i]['Type'], "float") > 0){
                        //formatação de float padrão internacional "." - divisor decimal e "," - divisor milhão
                        $array[$chave]  = floatval(str_replace(",",".",str_replace(".", "",addslashes($registro[$chave]))));

                    }elseif (substr_count($nomeColunas[$i]['Type'], "int") > 0 ){
                        // formatação de inteiros    
                        $array[$chave] = intval(addslashes($registro[$chave]));

                    }else{
                        // só aplica o addslashes nos registros do tipo varchar e text
                        $array[$chave] = addslashes($registro[$chave]);
                    } 

                }
                $i++;
            }
            return $array;
        }
    }

    public function formataDadosDoBD($registro) {
        if(isset($registro) && !empty($registro)){
            $array = array();
            $nomeColunas = $this->nomeDasColunas();        // busca o nome dos campos das colunas para ver qual o tipo a ser formatado
            
            $i=0;
            foreach ($registro as $chave => $valor) {

                //testo se é o valor referente ao mesmo campo do nome das colunas
                if($nomeColunas[$i]['Field'] == $chave){ 

                    if($nomeColunas[$i]['Type'] == 'date'){
                        //formatação de data padrão internacional
                        $dtaux = explode("-",addslashes($registro[$chave]));
                        $array[$chave] = $dtaux[2]."/".$dtaux[1]."/".$dtaux[0];

                    }elseif (substr_count($nomeColunas[$i]['Type'],'float') > 0 ){
                        //formatação de float padrão internacional "." - divisor decimal e "," - divisor milhão
                        $array[$chave]  = number_format(floatval(addslashes($registro[$chave])),2,',','.');

                    }elseif (substr_count($nomeColunas[$i]['Type'], "int") > 0 ){
                        // formatação de inteiros    
                        $array[$chave] = intval(addslashes($registro[$chave]));

                    }else{
                        // só aplica o addslashes nos registros do tipo varchar e text
                        $array[$chave] = $registro[$chave];
                    } 

                }
                $i++;
            }
            return $array;
        }
    }
    public function labelTabela() {
        $sql = "SELECT table_comment as table_comment FROM INFORMATION_SCHEMA.TABLES WHERE table_name = '" . $this->table."'";
        $sql = $this->db->query($sql);
        $sql = $sql->fetch(PDO::FETCH_ASSOC);
        
        $labels = array();
        $labels =  json_decode($sql["table_comment"], true);
        //print_r($labels); exit;        
        return $labels;
    }
    
}
?>