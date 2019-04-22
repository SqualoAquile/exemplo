
$(function () {
    
    // $('#imprimirJPG').on('click', function () {
    //     $('#cardOpcoes, #nav, #sidebar-wrapper').addClass('d-none');
    //     html2canvas(document.body).then(function(canvas) {
    //         // Export canvas as a blob 
    //         canvas.toBlob(function(blob) {
    //             // Generate file download
    //             window.saveAs(blob, "orcamento.jpg");
    //             window.location.href = baselink+"/orcamentos";
    //         });
    //     });
    // });

    // function myRenderFunction (){
    //     // Export canvas as a blob 
    //     canvas.toBlob(function(blob) {
    //         // Generate file download
    //         window.saveAs(blob, "orcamento.jpg");
    //         window.location.href = baselink+"/orcamentos";
    //     });
    // }

    // $('#imprimirJPG').on('click', function () {
    //     $('#cardOpcoes, #nav, #sidebar-wrapper').addClass('d-none');
    //         html2canvas(document.body, {
    //             scale: 2,
    //             onrendered: myRenderFunction
    //         });
    //         // Create a canvas with 144 dpi (1.5x resolution).
    //         html2canvas(document.body, {
    //             dpi: 144,
    //             onrendered: myRenderFunction
    //         });
    //     });


        $('#imprimirJPG').on('click', function () {
            $('#cardOpcoes, #nav, #sidebar-wrapper').addClass('d-none');
            var scaleBy = 5;
            var w = 1000;
            var h = 1000;
            var div = document.querySelector('#screen');
            var canvas = document.createElement('canvas');
            canvas.width = w * scaleBy;
            canvas.height = h * scaleBy;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            var context = canvas.getContext('2d');
            context.scale(scaleBy, scaleBy);
        
            html2canvas(document.body, {
                canvas:canvas,
                onrendered: function (canvas) {
                    theCanvas = canvas;
                    document.body.appendChild(canvas);
        
                    Canvas2Image.saveAsPNG(canvas);
                    $(body).append(canvas);
                }
            });
        });

    $("input[name='checkMedidas']").on('click', function(){
        if($(this).is(":checked")){
            $('.medidas').show();
        }else{
            $('.medidas').hide();
        }
    });

    $("input[name='checkUnitario']").on('click', function(){
        if($(this).is(":checked")){
            $('.unitario').show();
        }else{
            $('.unitario').hide();
        }
    });

});
