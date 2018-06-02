var EW_PAGE_ID = 'main';


/**************************************
	 Motor de busqueda estilo Google
**************************************/

			jQuery(document).ready(function(){
				$('#formulario-buscar').appendTo('.navbar.navbar-static-top .navbar-custom-menu');

			})

/**************************************
	Barra de men� izquierda
**************************************/
function leftbarToggle(el){
	if($(el).is('.busy')) return false;
	$('.glyphicon',el).toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
	$('.btnleftmenu').toggleClass('open').addClass('busy');
	$('#leftmenu').animate({left: $('.btnleftmenu').hasClass('open')?'0px':- ( $('#leftmenu').position().left + $('#leftmenu').width() ) + 'px' },'fast',function(){
		adjustAll();
		$('html, body').animate({scrollTop:0,scrollLeft:0}, 'fast');
		/*
		$('#mainbody').animate({'margin-left':($('.btnleftmenu').hasClass('open')?'90px':'0px')}, 200);
		if($('.btnleftmenu').hasClass('open')){ 
			$('html, body').animate({scrollTop:0,scrollLeft:0}, 'fast');
			$('body').width( $('body').width() + 90 );
		} else {
			$('body').width( $('body').width() - 90 );
		}
		if( $('.btnleftmenu').hasClass('open') && $(window).width()<700 && $('.btnTopMenu').hasClass('open') )
			$('.btnTopMenu').trigger('click');
		*/
		
		$('.btnleftmenu').removeClass('busy');
	});
	return false;
}

/**************************************
	Barra de men� superior
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
	$('.main-header .navbar').addClass('navbar-fixed-top');
})

//**************************************
//PANTALLAS ESTILO ANDROID
//**************************************

jQuery(document).ready(function(){

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
				headersTemplate: function () { return $("<div class='headers'>"); },
				controlInitialized: function(){
					this.data('metro-pivot',this);

					//this.headers.children(":contains(Inicio)").hide();
				},
				beforeItemChanged: function(index){

					var iframe = this.find('.pivot-item:eq(' + index + ')').find('iframe');

					if(iframe.length && ( iframe.attr('id')=='frame-content' || iframe.is('.empty')) ){ //load left menu content					
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
			}
			
			
			$('#mainbody').css('margin-left', $('#leftmenu').width() + 'px' );
			
			$("div.metro-pivot").metroPivot(defaults);
			$("div.metro-pivot").find('.headers').appendTo('.navbar.navbar-static-top');

			$('.pivot-item iframe:not(.lazyload)').each(function(){ $(this).attr('src', $(this).data('url') ).removeClass('empty'); });
			//$('.headers .header:last').addClass('hidden');
			
			/**************************************
			AdminLTE
			**************************************/
			if(  $('.main-sidebar').position().left >= 0 )
				$('[data-toggle="push-menu"]').pushMenu('toggle');
			$(document).on('expanded.pushMenu', function(){
				setTimeout(adjustAll, 500);
				$('html, body').animate({scrollTop:0,scrollLeft:0}, 'fast');
				/*
				$('#mainbody').animate({'margin-left':'0px'}, 200);
				$('body').width( $('body').width() + 220 );
				$('html, body').animate({scrollTop:0,scrollLeft:0}, 'fast');
				*/
				
			}).on('collapsed.pushMenu', function(){
				setTimeout(adjustAll, 500);
				/*
				$('#mainbody').animate({'margin-left':($('.btnleftmenu').hasClass('open')?'90px':'0px')}, 200);
				$('body').width( $('body').width() - 220 );
				*/
			})
			
			$(window).trigger('resize');
})

function urlContent(url){
					if($('#frame-content').is(':visible')){
						$('#frame-content').attr('src',url + '?cmd=resetall&opciones=reset');
					}
					$('#frame-content').data('url',url + '?cmd=resetall&opciones=reset');

					$('div.metro-pivot').data('metro-pivot').goToItemByName('contenido');
					$('[data-toggle="push-menu"]').pushMenu('toggle');
					$('.pageload-overlay').show();
}

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
				//update top margin for iframe div.
				//$('#mainbody').css('margin-top',$('.navbar-static-top').height() ); 
	});

var isScrolling = false;

(function( $ ) {
	$(function() {
			$( window ).scroll(function() {
				isScrolling = true;
				clearTimeout( $.data( this, "checkScroll" ) );
				$.data( this, "checkScroll", setTimeout(function() {
					isScrolling = false;
				}, 250) );
			});
	});
})( jQuery );

$('.pageload-overlay').fadeOut();

function adjustAll(){
	if ($('body').hasClass('adjusting')) return;
	$('body').addClass('adjusting');
  
  //leftmenu
	if(  $('.main-sidebar').position().left >= 0 && ($('#leftmenu').position().left == 230 || $('#leftmenu').position().left == 0) ) //hide leftmenu
		leftbarToggle( $('.btnleftmenu').get(0) ); 	
	$('#leftmenu').css('padding-top', $('.navbar-static-top').height() + 'px' );
	
	
	//mainbody
	var leftmargin = $('#leftmenu').position().left == 0 || $('#leftmenu').position().left == 230? $('#leftmenu').width() : 0;
	 
	$('#mainbody').css('margin-left', leftmargin + 'px');
	
	$('.pivotItem.current iframe').each(function(){
		if(this.contentWindow.resizeIFRM) this.contentWindow.resizeIFRM();
	})
	
	$('body').removeClass('adjusting');
}

jQuery(document).ready(function(){
	adjustAll();
})