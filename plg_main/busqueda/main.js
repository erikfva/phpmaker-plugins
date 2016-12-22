$(document).ready(function(){
	$('#form-busqueda').submit(function() {
		//alert('Handler for .submit() called.');
		buscar($('#texto-busqueda').val());
		return false;
	});	
	$('#btnBuscar').click(function(){$('#form-busqueda').submit();});
});

		
function success(){
	$('#mensaje-buscando').hide();
    $('#resultado-busqueda').fadeIn();  
}

function buscar(q){
	if(!q){return}
var url = 'pacientelist.php?cmd=search&t=paciente&psearchtype=AND&psearch=' + q.replace(" ","+");
$('#resultado-busqueda').hide();
$('#mensaje-buscando').show();
				$('#marco-pacientelist').one('load',function(){ 
					
					if($('div.metro-pivot').data('metro-pivot')){
						 $('div.metro-pivot').data('metro-pivot').goToItemByName('pacientelist');
					}
					if($(this).attr("src") != ""){success()};	
				}).attr('src',url);
}
