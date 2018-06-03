function mainwin(w){
	if(!w.frameElement) return w;
	if(w.frameElement.className == 'ui-dialog-frame') return w;
	return mainwin(w.parent);
}

function resizeIFRM(delay){
	delay = typeof delay == "undefined"?0:delay;

	setTimeout(function(){
  	if(window.frameElement && $(window.frameElement).is(':visible') && $(window.frameElement).hasClass('autosize') && !$(window.frameElement).hasClass('iframe-resizing') ){
  		w = mainwin(window);
  		if( (typeof CurrentPageID != 'undefined') && (CurrentPageID == 'list'))
  			w.$(w).data('curscroll',w.$(w.document).scrollTop());
  		iframe = $(window.frameElement);
  		iframe.css({'width':'2000px'});
  		iframe.css({'height':'5px'});
  		
  		maxheight = iframe[0].contentWindow.document.body.scrollHeight;
  		if(maxheight > 5){
  			iframe.addClass('iframe-resizing');
  			iframe.css('height',maxheight + 10 + 'px');
  			maxwidth = $(iframe[0].contentWindow.document.body).find('.ewBox').width() || iframe[0].contentWindow.document.body.scrollWidth ;
  			setTimeout(function(){ iframe.css('height',iframe[0].contentWindow.document.body.scrollHeight + 10 + 'px') },100);
  			if(!iframe.hasClass('fixedwidth') ){ 
  				$(w.document.body).each(function(){
  					var leftbarspace = w.$('.main-sidebar').length && w.$('.main-sidebar').position().left >= 0 ? w.$('.main-sidebar').width() : 0;
  					leftbarspace = leftbarspace == 0 
  												&& w.$('#leftmenu').length 
  												&& ( w.$('#leftmenu').position().left == 0 || w.$('#leftmenu').position().left == 230) ? w.$('#leftmenu').width() : leftbarspace;
  					//console.log(maxwidth, leftbarspace );
  					$(this).css('overflow-x','auto').css('width', maxwidth + leftbarspace + 50 + 'px');
  				})
  				//console.log(maxwidth,w);
  			}
  			iframe.removeClass('iframe-resizing');
  			//w = mainwin(window);
  			if( (typeof CurrentPageID != 'undefined') && (CurrentPageID == 'list') )
  				w.$(w.document).scrollTop( w.$(w).data('curscroll') );
  			if (window.top !== window && window.parent.frameElement){
  				window.parent.resizeIFRM();
  			}
  		}else{
  			setTimeout(function(){
  					resizeIFRM();
  				},200);
  		}
  	}
	},delay);
}

function resizeIFRMto($el,deltaxy){
	var deltax = typeof deltaxy == "undefined"?0:(typeof deltaxy.x == "undefined"?0: parseInt(deltaxy.x));
	var deltay = typeof deltaxy == "undefined"?0:(typeof deltaxy.y == "undefined"?0: parseInt(deltaxy.y));

			if (window.frameElement && window.innerHeight < $el.height() + deltay ) {
  				$(parent.document).find('iframe').each(function() {
						if (this.contentWindow.document == window.document) {
							$(this).css({ height: $el.height() + deltay + 'px'});
						}
					});
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

if(window.frameElement){
	$(window).on('load',function(){

		setTimeout(function(){
			doResize();
		},250)

		$('.collapse').on('shown.bs.collapse hidden.bs.collapse', function(){
			resizeIFRM();
		});

		$(".ewModalDialog,#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog")
		.on("show.bs.modal",function(){

		})
		.on("shown.bs.modal",function(){
			var $dlg = $(this);
			
			if(window.frameElement){
				if($dlg.width() > top.innerWidth){
					var newwidth = top.innerWidth - window.frameElement.offsetLeft - window.frameElement.offsetParent.offsetLeft;
					$dlg.width( newwidth > 700 ? newwidth : 700);
				}

			}
						
			var $dlg = $(this).find('.modal-content');
			resizeIFRMto($dlg ,{'y':70});
		})
		.on("hidden.bs.modal",function(){
			$(this).css('width','inherit');
			resizeIFRM();
		});

		$('.ewAddBlankRow').on('click',function(){ resizeIFRM(); });
	});

	//Ajustando el contenido de iframe al cambiar de tamanio la pantalla principal
		top.$(top).bind('resize', function () {
				if(top && top.resizeTimer) top.clearTimeout(top.resizeTimer);
				if(top) top.resizeTimer = top.setTimeout(function(){
							doResize();
					}, 250);
		});
}

function splashLoadingOff(){
	if(top) top.$('.pageload-overlay').fadeOut();
	 $('.pageload-overlay').fadeOut();
}
PHPMaker_ew_OnError =  ew_OnError;
ew_OnError = function (frm, el, msg) {
	setTimeout(function(){ splashLoadingOff(); }, 200);
	PHPMaker_ew_OnError(frm, el, msg);
}

jQuery(window).on('load', function(){
	splashLoadingOff();
	if(top.jQuery.fn.block) top.jQuery.unblockUI();
})

jQuery(document).ready(function(){
	$('.ewDetailAddGroup , .ewBreadcrumbs a, .ewListOptionBody .btn:not(.ewGridLink)').on('click',function(){ $('.pageload-overlay').show(); });
	$("#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog").on("hide.bs.modal",function(){
		splashLoadingOff();
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

