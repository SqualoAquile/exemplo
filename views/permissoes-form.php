<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>'
</script>

<header class="d-lg-flex align-items-center my-5">
    <?php if(in_array($modulo . "_ver", $infoUser["permissoesUsuario"])): ?>
        <a href="<?php echo BASE_URL . '/' . $modulo ?>" class="btn btn-secondary mr-lg-4" title="Voltar">
            <i class="fas fa-chevron-left"></i>
        </a>
    <?php endif ?>
    <h1 class="display-4 m-0 text-capitalize font-weight-bold"><?php echo $viewInfo["title"]." ".ucfirst($labelTabela["labelForm"]); ?></h1>
</header>

<form method="POST" class="mb-5">

    <div class="form-group pb-4">
        <input type="text" name="enome" id="inome" placeholder="Nome do Grupo" class="form-control" value="<?php echo isset($permAtivas) ? $permAtivas["nome"] : "" ?>" required/>
    </div>
        
    <table class="table table-striped table-hover bg-white table-nowrap">
        <thead>
            <tr>
                <th>Ver</th>
                <th>Adicionar</th>
                <th>Editar</th>
                <th>Excluir</th>
            </tr>
        </thead>
        <tbody>
                
            <?php for($i=0;$i<= count($listaPermissoes)-3;$i+=4):?>
            <tr>
                <td>
                    <input type="checkbox" name='epermissoes[]' value="<?php echo $listaPermissoes[$i+0]["id"];?>" id="p_<?php echo $listaPermissoes[$i+0]["id"];?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+0]["id"], $permAtivas["params"]))?'checked="checked"':'';?>/>
                    <label for="p_<?php echo $listaPermissoes[$i+0]["id"];?>"><?php echo $listaPermissoes[$i+0]["nome"];?></label><br/>
                </td>
                <td>
                    <input type="checkbox" name='epermissoes[]' value="<?php echo $listaPermissoes[$i+1]["id"];?>" id="p_<?php echo $listaPermissoes[$i+1]["id"];?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+1]["id"], $permAtivas["params"]))?'checked="checked"':'';?>/>
                    <label for="p_<?php echo $listaPermissoes[$i+1]["id"];?>"><?php echo $listaPermissoes[$i+1]["nome"];?></label><br/>
                </td>
                <td>
                    <input type="checkbox" name='epermissoes[]' value="<?php echo $listaPermissoes[$i+2]["id"];?>" id="p_<?php echo $listaPermissoes[$i+2]["id"];?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+2]["id"], $permAtivas["params"]))?'checked="checked"':'';?>/>
                    <label for="p_<?php echo $listaPermissoes[$i+2]["id"];?>"><?php echo $listaPermissoes[$i+2]["nome"];?></label><br/>
                </td>
                <td>
                    <input type="checkbox" name='epermissoes[]' value="<?php echo $listaPermissoes[$i+3]["id"];?>" id="p_<?php echo $listaPermissoes[$i+3]["id"];?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[$i+3]["id"], $permAtivas["params"]))?'checked="checked"':'';?>/>
                    <label for="p_<?php echo $listaPermissoes[$i+3]["id"];?>"><?php echo $listaPermissoes[$i+3]["nome"];?></label><br/>
                </td>
            </tr>  
            <?php endfor;?>
            <tr>
                <td>
                    <input type="checkbox" name='epermissoes[]' value="<?php echo $listaPermissoes[count($listaPermissoes)-2]["id"];?>" id="p_<?php echo $listaPermissoes[count($listaPermissoes)-2]["id"];?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[count($listaPermissoes)-2]["id"], $permAtivas["params"]))?'checked="checked"':'';?>/>
                    <label for="p_<?php echo $listaPermissoes[count($listaPermissoes)-2]["id"];?>"><?php echo $listaPermissoes[count($listaPermissoes)-2]["nome"];?></label><br/>
                </td>
                <td>
                    <input type="checkbox" name='epermissoes[]' value="<?php echo $listaPermissoes[count($listaPermissoes)-1]["id"];?>" id="p_<?php echo $listaPermissoes[count($listaPermissoes)-1]["id"];?>" <?php echo (isset($permAtivas) && in_array($listaPermissoes[count($listaPermissoes)-1]["id"], $permAtivas["params"]))?'checked="checked"':'';?>/>
                    <label for="p_<?php echo $listaPermissoes[count($listaPermissoes)-1]["id"];?>"><?php echo $listaPermissoes[count($listaPermissoes)-1]["nome"];?></label><br/>
                </td>

            </tr>

        </tbody>

    </table>

    <input type="hidden" name="alter" value="<?php echo $permAtivas["alteracoes"];?>">

    <button type="submit" class="btn btn-primary" onclick="return confirm('Tem certeza?')">Editar</button>
   
</form>