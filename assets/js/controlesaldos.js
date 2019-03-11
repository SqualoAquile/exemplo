$(document).ready(function () {

    $("#saldo_total_inicio").attr('disabled','disabled');    
    $("#saldo_banco_inicio");    
    $("#saldo_online_inicio");    
    $("#saldo_caixa_inicio");    
    $("#entradas").attr('disabled','disabled');    
    $("#saidas").attr('disabled','disabled');
    $("#resultado").attr('disabled','disabled');    
    $("#diferenca").attr('disabled','disabled');        
    $("#saldo_total_final").attr('disabled','disabled');    
    $("#saldo_banco_final");    
    $("#saldo_online_final");    
    $("#saldo_caixa_final");       
    

    
    

    $('[data-mascara_validacao="data"]')
    .mask('00/00/0000')
    .datepicker(datepickerOptions)
    .change(function () {

        var $this = $(this),
            valor = $this.val();

        valor = valor.split('/');
        valor[0] = '01';
        var data = valor[0] + '/' + valor[1] + '/' + valor[2];

        $this.removeClass('is-valid is-invalid');
        $this.siblings('.invalid-feedback').remove();

        if (valor != '') {
            if ($this.attr('data-anterior') != $this.val()) {
                if (
                    (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                    (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                    (validaDat(data) == false)
                ) {
                    // Inválido

                    $this
                        .removeClass('is-valid')
                        .addClass('is-invalid');

                    $this[0].setCustomValidity('invalid');

                    $this.after('<div class="invalid-feedback">Data inválida.</div>');
                } else {
                    // Valido   
                    if( valor[0] == '01' ){
                        console.log('data certa: ' + data);
                        $this
                        .val(data)
                        .removeClass('is-invalid')
                        .addClass('is-valid');
                        $this[0].setCustomValidity('');

                        $this.datepicker('update');

                    }else{
                        // inválido
                        $this
                        .val('')
                        .removeClass('is-valid')
                        .addClass('is-invalid');
                        $this[0].setCustomValidity('invalid');
                        $this.after('<div class="invalid-feedback">Somente datas com dia iguais a 01 são válidas.</div>');
                        
                    }
                    
                }
            }
        }
    });
});

function validaDat(valor) {
    var date = valor;
    var ardt = new Array;
    var ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
    ardt = date.split('/');
    erro = false;
    if (date.search(ExpReg) == -1) {
        erro = true;
    }
    else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30))
        erro = true;
    else if (ardt[1] == 2) {
        if ((ardt[0] > 28) && ((ardt[2] % 4) != 0))
            erro = true;
        if ((ardt[0] > 29) && ((ardt[2] % 4) == 0))
            erro = true;
    }
    if (erro) {
        return false;
    }
    return true;
}