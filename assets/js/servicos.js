$(document)
    .on('submit', '.form-servicos', function (event) {

        event.preventDefault();

        var $this = $(this),
            $inputs = $this.find('.input-servicos'),
            id = $this.attr('data-id'),
            objSend = {},
            campos_alterados = '';

        $inputs.blur();

        if (this.checkValidity() == false) {

            $this
                .find('.is-invalid, :invalid')
                .first()
                .focus();

        } else {

            if (confirm('Tem Certeza?')) {
                
                $inputs.each(function () {
    
                    let $input = $(this),
                        $label = $input.siblings('label').find('span');
    
                    objSend[$input.attr('name')] = $input.val();
    
                    $input.attr('data-anterior', $input.val())
    
                    if ($input.val() != $input.attr('data-anterior')) {
                        campos_alterados += '{' + $label.text().toUpperCase() + ' de (' + $input.attr('data-anterior') + ') para (' + $input.val() + ')}';
                    }
                });
    
                campos_alterados = $this.attr('data-alteracoes') + '##' + campos_alterados;
                objSend['alteracoes'] = campos_alterados;

                $.ajax({
                    url: baselink + '/servicos/editar/' + id,
                    type: 'POST',
                    data: objSend,
                    dataType: 'json',
                    success: function (data) {

                        if (data.erro[0] == '00000') {

                            Toast({
                                message: 'Serviço editado com sucesso!',
                                class: 'alert-success'
                            });

                            $this
                                .attr('data-alteracoes', data.result.alteracoes)
                                .removeClass('was-validated');

                            $inputs.each(function () {
                                
                                let $input = $(this);

                                $input
                                    .removeClass('is-valid is-invalid')
                                    .keyup();

                            });

                        }
                    }
                });
            
            }

        }

        $this.addClass('was-validated');

    })
    .on('keyup', '.input-fixos', function () {
        
        var $this = $(this),
            $submit = $this.parents('form').find('[type=submit]');

        if ($this.val() != $this.attr('data-anterior')) {
            $submit.removeAttr('disabled');
        } else {
            $submit.attr('disabled', 'disabled');
        }
    });

$(function () {

    function floatPadroaInternacional(valor1){
        valor = valor1.val();

        if(valor != ""){
            valor = valor.replace(".","").replace(".","").replace(".","").replace(".","");
            valor = valor.replace(",",".");
            valor = parseFloat(valor);
            return valor;
        }else{
            valor = '';
            return valor;
        }
    }
    
    function maiorque (valMenor, valMaior){

        valorMenor = floatPadroaInternacional(valMenor);
        valorMaior = floatPadroaInternacional(valMaior);        

        if( valorMenor != '' && valorMaior != ''){

            if(valorMenor < valorMaior){
                return true; 
            }else{
                return false;
            }
        }else{
            return false;
        }
    }
    
    $("#custocriacao_arte, #preco_vendacriacao_arte").blur(function(){
        var $custo = $("#custocriacao_arte");
        var $preco = $("#preco_vendacriacao_arte");

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });
    
    $("#custovetorizacao, #preco_vendavetorizacao").blur(function(){
        var $custo = $("#custovetorizacao");
        var $preco = $("#preco_vendavetorizacao");

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });
    
    $("#custocorte, #preco_vendacorte").blur(function(){
        var $custo = $("#custocorte");
        var $preco = $("#preco_vendacorte");

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });
    
    $("#custorefile, #preco_vendarefile").blur(function(){
        var $custo = $("#custorefile");
        var $preco = $("#preco_vendarefile");

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });
    
    $("#custoaplicacao, #preco_vendaaplicacao").blur(function(){
        var $custo = $("#custoaplicacao");
        var $preco = $("#preco_vendaaplicacao");

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });

});