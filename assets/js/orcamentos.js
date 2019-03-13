$(function () {

    // if( $('#senha')[0].hasAttribute('required') ){
    //     //o campo senha só tem o atributo required quando o form for de adicionar
    //     $('#email').val('');
    //     $('#email').change().blur();
        
    // }else{
    //     var $label = $('#senha').siblings();
    //     $label.text('Senha');
    //     $label.removeClass('font-weight-bold');
    //     $('#nome').blur();

    // }

    // $('#email').attr('autocomplete','off');
    // $('#senha').attr('autocomplete','off');
    // $('#senha').val('').blur();
    // $('#senhaaux').val('').blur();
    // $('#senhaaux').attr('autocomplete','off');
    $('#form-principal').children('.row').children('[class^="col-lg"]:nth-child(-n+17)').appendTo('#esquerda');
    $('#form-principal').children('.row').children('[class^="col-lg"]:nth-child(n+2):nth-child(-n+9)').appendTo('#direita');
    

});