
$(function () {
    
    $('#imprimirJPG').on('click', function () {
        $('#imprimirJPG, #imprimirPDF, #nav, #sidebar-wrapper').addClass('d-none');
        html2canvas(document.body).then(function(canvas) {
            // Export canvas as a blob 
            canvas.toBlob(function(blob) {
                // Generate file download
                window.saveAs(blob, "orcamento.jpg");
                window.location.href = baselink+"/orcamentos";
            });
        });
    });
});
