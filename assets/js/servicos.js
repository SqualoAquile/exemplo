$(function () {

    function floatPadraoInternacional(valor1){
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

        valorMenor = floatPadraoInternacional(valMenor);
        valorMaior = floatPadraoInternacional(valMaior);        

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

    function comparar ($custo, $preco, $element) {

        if( $custo.val() != "" && $preco.val() == "" ){
            return;
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback feedback-maiorque">O valor do preço deve ser maior do que o valor do custo.</div>');
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.siblings('.feedback-maiorque').remove();
                $preco.after('<div class="invalid-feedback feedback-maiorque">O valor do preço deve ser maior do que o valor do custo.</div>');
                return;
            }    
        }
    }

    $(document)
        .ready(function () {
            $('.input-servicos').keyup();
        })
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
                    
                $inputs.each(function () {
    
                    let $input = $(this),
                        $label = $input.siblings('label').find('span');
    
                    objSend[$input.attr('name')] = $input.val();
    
                    if ($input.val() != $input.attr('data-anterior')) {
                        campos_alterados += '{' + $label.text().toUpperCase() + ' de (' + $input.attr('data-anterior') + ') para (' + $input.val() + ')}';
                    }

                    $input.attr('data-anterior', $input.val());

                });

                if (campos_alterados.length) {
                    campos_alterados = $this.attr('data-alteracoes') + '##' + campos_alterados;
                    objSend['alteracoes'] = campos_alterados;

                    if (confirm('Tem Certeza?')) {
                    
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

                                    location.reload();
                                }
                            }
                        });

                    }
                }
                
            }
    
            $this.addClass('was-validated');
    
        })
        .on('keyup', '.input-servicos', function () {
            
            var $this = $(this),
                $submit = $this.parents('form').find('[type=submit]');
    
            if ($this.val() != $this.attr('data-anterior')) {
                $submit.removeAttr('disabled');
            } else {
                $submit.attr('disabled', 'disabled');
            }
        });
    
    $('[name="custo"], [name="preco_venda"]').on('blur', function(){

        let $pai = $(this).parents('form'),
            $custo = $pai.find('[name="custo"]'),
            $preco = $pai.find('[name="preco_venda"]');

        comparar($custo, $preco, $(this));
    });
});