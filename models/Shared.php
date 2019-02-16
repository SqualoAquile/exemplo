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
        $stringBtn .= '<form method="POST">';
        
        if( in_array( $this->table.'_edt' , $_SESSION["permissoesUsuario"]) ){
            $stringBtn .=  '<a href="' . BASE_URL . '/' . $this->table . '/editar/' . $id . '" class="btn btn-primary btn-sm mr-1"><i class="fas fa-edit"></i></a>';
        }

        if(in_array($this->table."_exc", $_SESSION["permissoesUsuario"])){
            $stringBtn .= '<input type="hidden" name="id" value="'. $id .'"><button type="submit" onclick="return confirm(\'Tem Certeza?\')" class="btn btn-sm btn-secondary ml-1"><i class="fas fa-trash-alt"></i></button>';
        }
        
        $stringBtn .= '</form>';
        
        return $stringBtn;
    }

    public function montaDataTable() {
        $index = 0;
        foreach ($this->nomeDasColunas() as $key => $value) {
            if(isset($value["Comment"]) && array_key_exists("ver", $value["Comment"]) && $value["Comment"]["ver"] != "false") {
                if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "acoes") {

                    $stringBtn = '';
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($id, $row) {
                            return $this->formataacoes($id);
                        }
                    ];
                    
                // FORMATAÇÃO DE NÚMEROS E DATAS NA TABELA
                } elseif (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "data") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            return date( 'd/m/Y', strtotime($d))
                            ;
                        }
                    ];    
                } elseif (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "monetario") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            return "R$  " .number_format($d,2,",",".");
                        }
                    ];
                } elseif (array_key_exists("mascara_validacao", $value["Comment"]) && $value["Comment"]["mascara_validacao"] == "porcentagem") {
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {
                            return number_format($d, 2, ",", ".") . "%";
                        }
                    ]; 
                } elseif (array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "table") {
                    
                    $columns[] = [
                        "db" => $value["Field"],
                        "dt" => $index,
                        "formatter" => function($d,$row) {

                            $return_contatos = "";

                            if (strlen($d)) {

                                $format_contato = str_replace("][", "|", $d);
                                $format_contato = str_replace(" *", ",", $format_contato);
                                $format_contato = str_replace("[", "", $format_contato);
                                $format_contato = str_replace("]", "", $format_contato);
    
                                $contatos = explode("|", $format_contato);
    
                                $first_contato = $contatos[0];
                                $resto_contatos = array_slice($contatos, 1);

                                if (count($contatos) > 1) {

                                    // Coloca cada contato que ficará escondido, em volta de uma div
                                    // Usaremos isso para depois filtrar a busca e deixar visível os contatos que o usuario esta filtrando
                                    $resto_contatos = implode('', array_map(
                                        function ($resto_contato) {
                                            return sprintf("<div class='contatos-escondidos'>%s</div>", $resto_contato);
                                        },
                                        $resto_contatos
                                    ));

                                    $return_contatos = '
                                        <div class="contatos-filtrados d-flex">
                                            <button class="btn btn-sm btn-link text-info" type="button" data-toggle="collapse" data-target="#collapseContato' . $row["id"] . '" aria-expanded="false" aria-controls="collapseContato' . $row["id"] . '">
                                                <i class="fas fa-plus-circle"></i>
                                            </button>
                                            <div>
                                                <span>' . $first_contato . '</span>
                                                <div class="collapse" id="collapseContato' . $row["id"] . '">
                                                    ' . $resto_contatos . '
                                                </div>
                                            </div>
                                        </div>
                                    ';
                                } else {
                                    $return_contatos = '<div class="ml-3 pl-3">' . $first_contato . '</div>';
                                }
                            }
                            return $return_contatos;
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