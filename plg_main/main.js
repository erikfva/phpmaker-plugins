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
function changePage(op){
	if( typeof op.url === "undefined" ) return;
	var url = op.url; 
	var iframe = $('#frame-' + op.id);
	if(iframe.length == 0 ) return;

	//ocultando el componente indicador de 'pagina cargando...' del iframe actual
	var currIframe = $('div.metro-pivot').find('.pivotItem.current .metro-page>iframe');
	if(currIframe.length && currIframe[0].contentWindow.splashLoadingOff){
		setTimeout(() => {
			currIframe[0].contentWindow.splashLoadingOff();			
		}, 200);
	} 

	iframe.attr('src',url);
	$('div.metro-pivot').data('metro-pivot').goToItemByName(op.nombre); 
}

jQuery(document).ready(function(){

	//Pagina links del menu principal
	ewLanguage.obj.label_contenido = 'contenido';

			var defaults = {
				animationDuration: 250,
				headerOpacity: 1, //sin disminucion del color cuando esta inactivo.
				fixedHeaders: true,
				headerSelector: function (item) { return item.children("h3").first();  },
				itemSelector: function (item) { return item.children(".pivot-item"); },
				headerItemTemplate: function () { return $("<span class='header btn btn-xs btn-link'>"); },
				pivotItemTemplate: function () { return $("<div class='pivotItem'>"); },
				itemsTemplate: function () { return $("<div class='items'>"); },
				headersTemplate: function () { return $("<div class='headers btn-group navbar-custom-menu'>"); },
				controlInitialized: function(){
					this.data('metro-pivot',this);
					$(this).find('[onactive]').each(function(){
						$(this).on('page:active',function(){
							eval(this.getAttribute('onactive'));
						})
					});

					//this.headers.children(":contains(Inicio)").hide();
				},
				beforeItemChanged: function(index){

					var page = this.find('.pivot-item:eq(' + index + ')').find('.metro-page');
					if(page.length){
						page.trigger('page:active');
					}
					

					this.headers.find('.header').removeClass('bg-aqua-gradient shadow-b')
					.filter('.current').addClass('bg-aqua-gradient shadow-b');

					$("body").css("width", "inherit").css("height", "inherit");
					
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
  						} else {
						//	$("body").css("width", "inherit");
						}
					}
				}
			}
			
			
			$('#mainbody').css('margin-left', $('#leftmenu').width() + 'px' );
			
			$("div.metro-pivot").metroPivot(defaults);
			$("div.metro-pivot").find('.headers').appendTo('.navbar.navbar-static-top');

			$('.pivot-item iframe:not(.lazyload)').each(function(){ $(this).attr('src', $(this).data('url') ).removeClass('empty'); });
			$('#mainbody').removeClass('hide');
			
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
			$('.sidebar-menu.tree').on('expanded.tree', function(){ 
				adjustAll(); 
			})
			
			$(window).trigger('resize');
})

//**************************************
// Reacondicionando los links del menu 
// para que se abran en el iframe de contenido
//**************************************
function urlContent(url){
	if($('#frame-content').is(':visible')){
		$('#frame-content').attr('src',url + '?cmd=resetall&opciones=reset');
	}
	$('#frame-content').data('url',url + '?cmd=resetall&opciones=reset');
	$('div.metro-pivot').data('metro-pivot').goToItemByName('contenido');
	$('[data-toggle="push-menu"]').pushMenu('toggle');
	$('.pageload-overlay').show();
}
$('#ewMenu a').each(function(){
	var ref = $(this).attr('href');
	if(ref && ref != '#')
	$(this)
	.click(function(){
		$('[data-toggle="push-menu"]').pushMenu('toggle');
		if($('#frame-content').is(':visible')){ 
			$('#frame-content').attr('src', ref + '?cmd=resetall&opciones=reset'); 
		} 
		$('#frame-content').data('url', ref + '?cmd=resetall&opciones=reset'); 
		$('div.metro-pivot').data('metro-pivot').goToItemByName('contenido');
		$('.pageload-overlay').show();
	})
	.attr('href','#');
})

resizeTimer = 0;

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
	if( $('#leftmenu').length &&  $('.main-sidebar').position().left >= 0 && ($('#leftmenu').position().left == 230 || $('#leftmenu').position().left == 0) ) //hide leftmenu
		leftbarToggle( $('.btnleftmenu').get(0) ); 	
	$('#leftmenu').css('padding-top', $('.navbar-static-top').height() + 'px' );
	
	
	//mainbody
	var leftmargin = $('#leftmenu').length && ( $('#leftmenu').position().left == 0 || $('#leftmenu').position().left == 230) ? $('#leftmenu').width() : 0;
	 
	$('#mainbody').css('margin-left', leftmargin + 'px');
	
	$('.pivotItem.current iframe').each(function(){
		if(this.contentWindow.resizeIFRM) this.contentWindow.resizeIFRM();
	})
	
	$('body').removeClass('adjusting');
}

jQuery(document).ready(function(){
	adjustAll();
	leftbarToggle( $('.btnleftmenu').get(0) );
})