function mainwin(w){
	if(!w.frameElement) return w;
	return mainwin(w.parent);
}

function resizeIFRM(delay){
	var winres = window;
	var timedelay = typeof delay == "undefined"?0:delay;
	//console.log('resize');
	setTimeout(function(){

  	if(winres.frameElement && $(winres.frameElement).is(':visible') && $(winres.frameElement).hasClass('autosize') && !$(winres.frameElement).hasClass('iframe-resizing') ){

		var wwini = 5000;
		var whini = 5;  
		var iframe = $(winres.frameElement);

		if(typeof w == 'undefined')	w = mainwin(winres);	
		
		if( typeof CurrentForm != 'undefined' && typeof CurrentForm.PageID != 'undefined' && CurrentForm.PageID != 'list'){

		if(CurrentForm){
			iframe.addClass('iframe-resizing');

			//resetenado el width en caso de que haya sido ajustado a una pagina anterior
			$(w.document.body).css({'width':'inherit','height':'inherit'});
			//Si es fixedwidth hay que volver a resetear el valor al recargar el listado.
			if(iframe.hasClass('fixedwidth') ){
				var oldwidth = iframe.attr('width') || iframe.width(); 
				iframe.one('load',function(){  
					iframe.css({'width': oldwidth + 'px'});
					if(iframe[0].contentWindow.parent && iframe[0].contentWindow.parent.frameElement)
						iframe[0].contentWindow.parent.frameElement.style.width = oldwidth + 'px';
				});
			}else{
				iframe.css({'width':'inherit'});
			}

			//console.log(CurrentForm);

			var gridaddedit = CurrentForm.$Element? CurrentForm.$Element.find('.ewGridAddEdit') : $('#' + CurrentForm.ID);
			var	maxwidth = gridaddedit.length && top.$('html').width() < gridaddedit.width()? gridaddedit.width() + 'px' : '100%';
			//console.log(top.$('html').width(), gridaddedit.width());
			iframe.css({'width':maxwidth});

			if(iframe[0].contentWindow.parent && iframe[0].contentWindow.parent.frameElement){
				iframe[0].contentWindow.parent.frameElement.style.width = maxwidth;
			}						

			var maxheight = iframe[0].contentWindow.document.body.scrollHeight;
			
			iframe.css('height',maxheight + 50 + 'px');

			var $dlg = $('.modal.in');
			if($dlg.length){ //Si hay una ventana de dialogo abierta. 
				doResizeDlg($dlg);
			}

			iframe.removeClass('iframe-resizing');
			if (winres.top !== winres && winres.parent.frameElement){
				winres.parent.resizeIFRM();
			} else {
				
				maxheight = CurrentForm.$Element && CurrentForm.$Element.height() >0 ? CurrentForm.$Element.height() : $('.ewForm:visible').height() || 0; 
				var minheight = w.$('#ewMenu').height();
				$(w.document.body).css({
					height : (minheight > maxheight ? minheight :  maxheight) + 150 + 'px',
					width : maxwidth
				});
			}
			return;			
		}
		}


  		if( typeof CurrentPageID != 'undefined' && CurrentPageID == 'list'){
			w.$(w).data('curscroll',w.$(w.document).scrollTop());
		}

		if(!iframe.hasClass('fixedwidth') )	
			iframe.css({'width': wwini + 'px'});
		iframe.css({'height': whini + 'px'});
  		
  		
  		var maxheight = iframe[0].contentWindow.document.body.scrollHeight;
  		if(maxheight > 5){
  			iframe.addClass('iframe-resizing');
			iframe.css('height',maxheight + 10 + 'px');

			var maxwidth = $(iframe[0].contentWindow.document.body).find('.ewBox').width() || iframe[0].contentWindow.document.body.scrollWidth ;

			if( typeof CurrentPageID != 'undefined' && CurrentPageID != 'list'){
				maxwidth = CurrentForm.$Element.width();
			}
			if( $('.ewMasterTable').length &&  $('.ewMasterTable').width() > maxwidth){
				maxwidth = $('.ewMasterTable').width()
			}
			  
  			setTimeout(function(){ iframe.css('height',iframe[0].contentWindow.document.body.scrollHeight + 10 + 'px') },100);
  			
  			$(w.document.body).each(function(){
				if(!iframe.hasClass('fixedwidth') ){ 
					var leftbarspace = w.$('.main-sidebar').length && w.$('.main-sidebar').position().left >= 0 ? w.$('.main-sidebar').width() : 0;
					leftbarspace = leftbarspace == 0 
									&& w.$('#leftmenu').length 
									&& ( w.$('#leftmenu').position().left == 0 || w.$('#leftmenu').position().left == 230) ? w.$('#leftmenu').width() : leftbarspace;

					$(this).css('width', maxwidth + leftbarspace + 50 + 'px');//css('overflow-x','auto').
					iframe.css({'width': maxwidth + leftbarspace + 50 + 'px' });
				}
				var minheight = w.$('#ewMenu').height();
				$(this).css('height',(minheight > maxheight ? minheight :  maxheight) + 150 + 'px');
				//$(this).css('height',maxheight + 150 + 'px');
			})
  				//console.log(maxwidth,w);
  			
			
			setTimeout(function(){
				iframe.removeClass('iframe-resizing');
			}, timedelay);		
			
			  
  			//w = mainwin(window);
  			if( (typeof CurrentPageID != 'undefined') && (CurrentPageID == 'list') )
  				w.$(w.document).scrollTop( w.$(w).data('curscroll') );
  			if (winres.top !== winres && winres.parent.frameElement && winres.parent.resizeIFRM){
				winres.parent.resizeIFRM(200);
  			}
  		}else{
  			resizeIFRM(200);
  		}
  	}
	},timedelay);
}

function resizeIFRMto($el,deltaxy){
	var deltax = typeof deltaxy == "undefined"?0:(typeof deltaxy.x == "undefined"?0: parseInt(deltaxy.x));
	var deltay = typeof deltaxy == "undefined"?0:(typeof deltaxy.y == "undefined"?0: parseInt(deltaxy.y));

			if (window.frameElement && window.innerHeight < $el.height() + deltay ) {
				var ifrm = window.frameElement;

				$(ifrm).addClass('iframe-resizing');
				$(ifrm).css({ height: $el.height() + deltay + 'px'});
				$(ifrm).removeClass('iframe-resizing');			
  			}
}
//********
//*Realizando el mejor ajuste del ancho del iframe basado en su contenido y el ancho del navegador
//********
function doResize(){
	if(!window.frameElement || $(window.frameElement).hasClass('iframe-resizing') ) return;
	if(!$(window.frameElement).hasClass('fixedwidth')) $(window.frameElement).css({'width':'98%'});
	resizeIFRM();
}

function doResizeDlg($dlg){
	if(!window.frameElement) return;

	setTimeout(() => {

		if( $(window.frameElement).height() < $dlg.find('.modal-content').height() ){
			$dlg.height( $dlg.find('.modal-content').height() + 150 );
			$(window.frameElement).height(
				$dlg.height() + 150
			)
		}		
	
		$dlg.scrollTop(0);
		(!isCrossOrigin()) && top.$("html, body").animate({scrollTop: 0, scrollLeft: 0 }, 500);

		if( !isCrossOrigin() && $dlg.width() > top.innerWidth){
			var newwidth = top.innerWidth - window.frameElement.offsetLeft - window.frameElement.offsetParent.offsetLeft;
			$dlg.width( newwidth > 700 ? newwidth : 700);
		}

		if(!isCrossOrigin() && $dlg.parent() && $dlg.parent().parent() && top.$('body').width() < $dlg.parent().parent().width())
			top.$('body').width($dlg.parent().parent().width()-20);
	}, 800);
}

if(window.frameElement){ //-> Si es un iframe
	$(window).on('load',function(){ //-> Se definen acciones realizadas al cargar el contenido del iframe
		//Volviendo el scroll al inicio.
		(!isCrossOrigin()) && top.$("html, body").animate({scrollTop: 0, scrollLeft: 0 }, 500);
		//Realizando autoajuste del alto del iframe despues de milisegundos
		setTimeout(function(){
			doResize();
		},250)

		$('.collapse').on('shown.bs.collapse hidden.bs.collapse', function(){
			resizeIFRM();
		});

		$(".ewModalDialog,#ewPrompt,#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog")
		.on("show.bs.modal",function(){

		})
		.on("shown.bs.modal",function(){
			var $dlg = $(this);

			//Fix: habilitando el boton guardar nuevamente.
			var actionBtn = $dlg.find('button.btn-primary.ewButton');
			if(actionBtn.length){
				actionBtn.prop('disabled', false);
			}

			doResizeDlg($dlg);								
		})
		.on("hidden.bs.modal",function(){
			$(this).css('width','inherit');
			if($('.modal.in').length == 0)
				resizeIFRM();
		});

		$('.ewAddBlankRow').on('click',function(){ resizeIFRM(); });
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			resizeIFRM();
		})
	});

	//Ajustando el contenido de iframe al cambiar de tamanio la pantalla principal
	if(!isCrossOrigin()){
		top.$(top).bind('resize', function () {
			//doResize();
				if(top && top.resizeTimer) top.clearTimeout(top.resizeTimer);
				if(top) top.resizeTimer = top.setTimeout(function(){
							doResize();
					}, 250);
					
		})
	}

}

function isCrossOrigin() {
    try{
        //try to access the document object
        if (top.document || top.document.domain){
          //we have the same document.domain value!
        }
    }catch(e) {
      //We don't have access, it's cross-origin!
        return true;
    }
    return false;
};

function splashLoadingOff(){
	//if(top) top.$('.pageload-overlay').fadeOut();
	try {
		// ...but not to the document inside it
		if(top) top.$('.pageload-overlay').hide();
		//$('.pageload-overlay').fadeOut();
		$('.pageload-overlay').hide();
	} catch(e) {
		//alert(e); // Security Error (another origin)
	}

}

if(typeof ew_OnError == 'function'){
	PHPMaker_ew_OnError =  ew_OnError;
	ew_OnError = function (frm, el, msg) {
		setTimeout(function(){ splashLoadingOff(); }, 200);
		PHPMaker_ew_OnError(frm, el, msg);
	}
}


jQuery(window).on('load', function(){
	splashLoadingOff();
})

jQuery(document).ready(function(){

	//Mostrar la pantalla de cargando... al dar click en los sgtes elementos:
	$('.ewDetailAddGroup , .ewBreadcrumbs a, .ewListOptionBody .btn:not(.ewGridLink):not(.dropdown-toggle), .ewPager .btn').on('click',function(){ 
		//$('.pageload-overlay').show(); 
		//console.log('show');
		if(!isCrossOrigin())
			if(top) top.$('.pageload-overlay').show();

	});
	//Ocultar la pantalla de cargando... al cerrar los siguientes dialogos modal:
	$("#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog").on("hide.bs.modal",function(){
		splashLoadingOff();
	});

	//FIX tooltip position when overflow-x is hidden
	$('.ewTooltipLink').on("shown.bs.popover", function(e) {
		var pw = this.parentElement.clientWidth || 0;
		if(pw > 0 && pw < $(this).width()){
			var $tip = $(this).data("bs.popover").tip();
			var dx = $(this).width() - pw;
			$tip.css('left',parseInt($tip.css('left')) - dx + 'px');
		}
	});	
})

//+++++ FUNCIONES PARA REFRESCAR EL CONTENIDO DEL LISTADO MEDIANTE AJAX

//USO => En la seccion Client Script/ Table-Specific/ List Page/ StartUp Script invocar a la funcion de la sgte. manera:
//function refreshContent(t){
//	refreshTableOn({
//		time:(!$.isUndefined(t)?t:0),
//		oncomplete:function(){
//			calcular_edad();
//			hideEmpty();
//		}
//	});
//}

//jQuery(window).ready(function(){
//	refreshContent(7000);
//});

function ApplyTemplateTable(containerTable){
	containerTable.find("table." + EW_TABLE_CLASSNAME + ":not(.ewExportTable):not(#" + EW_REPORT_CONTAINER_ID + " table)").each(ew_SetupTable); // Init tables
	containerTable.find("table." + EW_GRID_CLASSNAME + ":not(.ewExportTable):not(#" + EW_REPORT_CONTAINER_ID + " table)").each(ew_SetupGrid); // Init grids
	coolTemplate(containerTable);
}

function isScrolledIntoView(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}

function refreshTable(options){
	if(typeof options.containerTable  == 'undefined' ) return;
	let ref = '#' + options.containerTable.attr('id');
	w = mainwin(window);
	if(!(w.isScrolling || false) && $(window.frameElement?window.frameElement:window).is(':visible') && $(ref).is(':visible:not(.updating)') && options.containerTable.find('input:checkbox:checked').length === 0){
		
		options.onbefore.call();
		
		/*
		$(referencia).load(location.href + ' ' + referencia, function(){
			ApplyTemplateTable($(this));
			resizeIFRM(2000);
			options.oncomplete.call();
			$(this).removeClass('updating');
		});
		*/
	var pageID = CurrentForm.ID.substring(1);
	$(ref).addClass('updating');
	
	$('#tbl_' + pageID).load(location.href + ' ' + '#tbl_' + pageID + '>*', function(){
		
		if ($("#tpd_" + pageID).length) //Has template definition?
			ew_ApplyTemplate("tpd_" + pageID, "tpm_" + pageID, pageID, "", ewVar.templateData);
		ApplyTemplateTable(options.containerTable);
		resizeIFRM(500);
		options.oncomplete.call();
		$(ref).removeClass('updating');
		if(options.time>0 )
			setTimeout(function(){refreshTable(options)},options.time);
	});
		
		
	}else{
	
		if(options.time>0)
			setTimeout(function(){refreshTable(options);}, options.time );
	}
}

function refreshTableOn(options){
	let defaultopt = {
		time: 10000, //10 segundos
		onbefore : function(){},
		oncomplete : function(){},
		containerTable : $('div[id*="gmp_"]'),
		condition : function(){return true},
		params : null,
		forceRefresh : false,
		url : (location.href.indexOf('about:blank')!=-1?$(window.frameElement).data('url'):location.href)
	}
	if(typeof options  !== 'undefined' ) $.extend(defaultopt, options);
	
	//if(!isScrolledIntoView(defaultopt.containerTable.get(0))) return;
	//console.log(options.containerTable.attr('id'));
	//ApplyTemplateTable(defaultopt.containerTable);
	//console.log(defaultopt.time);
	setTimeout(function(){refreshTable(defaultopt)}, defaultopt.time );
}

