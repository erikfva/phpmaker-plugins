var EW_PAGE_ID = 'main';

/**************************************
	 Motor de busqueda estilo Google
**************************************/

			jQuery(document).ready(function(){

			})

/**************************************
	Barra de menú izquierda
**************************************/
function leftbarToggle(el){
	if($(el).is('.busy')) return false;
	$('.glyphicon',el).toggleClass('glyphicon-chevron-right glyphicon-chevron-left'); 
	$('.btnleftmenu').toggleClass('open').addClass('busy');
	$('#leftmenu').animate({left: $('.btnleftmenu').hasClass('open')?'0px':'-' + $('#leftmenu').width()  },'fast',function(){
		$('#mainbody').animate({'margin-left':($('.btnleftmenu').hasClass('open')?'90px':'0px')}, 200); 
		if($('.btnleftmenu').hasClass('open')){ $('html, body').animate({scrollTop:0,scrollLeft:0}, 'fast'); };
		if( $('.btnleftmenu').hasClass('open') && $(window).width()<700 && $('.btnTopMenu').hasClass('open') ) 
			$('.btnTopMenu').trigger('click');
		$('.btnleftmenu').removeClass('busy'); 
	}); 
	return false;
}

/**************************************
	Barra de menú superior
**************************************/
function topbarToggle(el){
	if($(el).is('.busy')) return false;
	$('.glyphicon',el).toggleClass('glyphicon-chevron-up glyphicon-chevron-down'); 
	$('.btnTopMenu').toggleClass('open').addClass('busy');
	var TopMenu = $('#formulario-buscar,.metro-pivot>.headers').css('display','block');
	TopMenu.animate({top: $('.btnTopMenu').hasClass('open')?'0px':'-100px' },'fast',function(){
		if( $('.btnTopMenu').hasClass('open') && $(window).width()<700 && $('.btnleftmenu').hasClass('open')) 
			$('.btnleftmenu').trigger('click'); 
		TopMenu.css('display',$('.btnTopMenu').hasClass('open')?'block':'none');
		$('.btnTopMenu').removeClass('busy');
	}); 
	return false;
}


jQuery(document).ready(function(){

//**************************************
//MENU ESTILO ANDROID
//**************************************
				var htmlmenu = $('#RootMenu').clone(false);
				htmlmenu.removeAttr("id").removeAttr("class").find(".dropdown-menu, .dropdown-submenu, li, ul").removeAttr("id").removeAttr("class");
				htmlmenu.appendTo('#slidx_menu').linkesDrillDown({lbHome:'<i class="glyphicon glyphicon-home goHome ewIcon"></i>',cssCaret:'glyphicon glyphicon-play-circle'});
				$('#user_info').prependTo('#slidx_menu ul:first').show();	
				
//**************************************
//PANTALLAS ESTILO ANDROID
//**************************************

/*
	ewLanguage.obj.label_paciente = 'pacientelist';
	$('#marco-pacientelist').on('load',function(){	$(this).removeClass('empty') }).attr('src',$('#marco-pacientelist').data('url'));
	//Pagina resultados de busqueda
	$('#marco-resultado-busqueda').on('load',function(){ 
					if($('div.metro-pivot').data('metro-pivot')) $('div.metro-pivot').data('metro-pivot').goToItemByName('Resultado');
	});	
	//Pagina de solicitud de analisis
	ewLanguage.obj.label_analisis_solicitud = 'analisis_solicitudlist';
	$('#marco-analisis_solicitudlist').on('load',function(){ $(this).removeClass('empty') }).attr('src',$('#marco-analisis_solicitudlist').data('url'));
	//Pagina de resultados de analisis
	ewLanguage.obj.label_analisis_resultados = 'analisis_resultadoslist';
	$('#marco-analisis_resultadoslist').on('load',function(){ $(this).removeClass('empty') }).attr('src',$('#marco-analisis_resultadoslist').data('url'));
	
	ewLanguage.obj.label_listado_prueba = 'listado_pruebalist';
*/

	//Pagina links del menu principal
	ewLanguage.obj.label_contenido = 'contenido';
	
			var defaults = {
				animationDuration: 250,
				headerOpacity: 0.25,
				fixedHeaders: true,
				headerSelector: function (item) { return item.children("h3").first(); },
				itemSelector: function (item) { return item.children(".pivot-item"); },
				headerItemTemplate: function () { return $("<span class='header'>"); },
				pivotItemTemplate: function () { return $("<div class='pivotItem'>"); },
				itemsTemplate: function () { return $("<div class='items'>"); },
				headersTemplate: function () { return $("<div style='position:relative' class='headers'>"); },
				controlInitialized: function(){
					this.data('metro-pivot',this);

					//this.headers.children(":contains(Inicio)").hide();
				},
				beforeItemChanged: function(index){
					
					var iframe = this.find('.pivot-item:eq(' + index + ')').find('iframe');

					if(iframe.length && (iframe.attr('id')=='frame-content' || iframe.is('.empty')) ){
						$('.pageload-overlay').show();
						iframe.attr('src', iframe.data('url') ).removeClass('empty');
					}
					
				},
				selectedItemChanged: function(index){

					
					if(this.items != undefined){
						var iframe = this.find('.pivot-item:eq(' + index + ')').find('iframe');

						if(iframe.length){ 
							
								if(iframe[0].contentWindow && iframe[0].contentWindow.doResize)
									iframe[0].contentWindow.doResize();
								if(iframe[0].contentWindow && typeof iframe[0].contentWindow.refreshContent === 'function'){
									iframe[0].contentWindow.refreshContent();
								}
  					}
					}
				}
			};	
			$('#mainbody').css('margin-left', $('#leftmenu').width() + 'px' );

			$("div.metro-pivot").metroPivot(defaults);
			$('.pivot-item iframe:not(.lazyload)').each(function(){ $(this).attr('src', $(this).data('url') ).removeClass('empty'); });
			$('.headers .header:last').addClass('hidden');
})


resizeTimer = 0;
ToggleBarTimer = 0;		

	function doToggleBar() {
	/*
					if($(window).width()<1024 && $('.btnleftmenu').hasClass('open')) $('.btnleftmenu').trigger('click');
					if($(window).width()<700 && $('.btnTopMenu').hasClass('open') ) $('.btnTopMenu').trigger('click');
	*/
	};
	$(window).bind('resize', function () {
				clearTimeout(ToggleBarTimer);
				ToggleBarTimer = top.setTimeout(doToggleBar, 1000);
	});

var isScrolling = false;

(function( $ ) {
	$(function() {
			$( window ).scroll(function() {
				isScrolling = true;
				clearTimeout( $.data( this, "scrollCheck" ) );
				$.data( this, "scrollCheck", setTimeout(function() {
					isScrolling = false;
				}, 250) );
			});
	});
})( jQuery );

$('.pageload-overlay').fadeOut();
