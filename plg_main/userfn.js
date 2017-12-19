function mainwin(w){
	if(!w.frameElement) return w;
	if(w.frameElement.className == 'ui-dialog-frame') return w;
	return mainwin(w.parent);
}

function resizeIFRM(delay){
	delay = typeof delay == "undefined"?0:delay;
	setTimeout(function(){
  	if(window.frameElement && $(window.frameElement).hasClass('autosize') && !$(window.frameElement).hasClass('iframe-resizing') ){
  		w = mainwin(window);
  		w.$(w).data('curscroll',w.$(w.document).scrollTop());
  		iframe = $(window.frameElement);
  		iframe.css({'height':'5px'});
  		maxwidth = iframe[0].contentWindow.document.body.scrollWidth;
  		maxheight = iframe[0].contentWindow.document.body.scrollHeight;
  		if(maxheight > 5){
  			iframe.addClass('iframe-resizing');
  			iframe.css('height',maxheight + 10 + 'px');
  			setTimeout(function(){iframe.css('height',iframe[0].contentWindow.document.body.scrollHeight + 10 + 'px') },200);
  			if(!iframe.hasClass('fixedwidth') ){ iframe.css('width',maxwidth + 'px') }
  			iframe.removeClass('iframe-resizing');
  			w = mainwin(window);
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

		$("#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog").on("shown.bs.modal",function(){
			var $dlg = $(this).find('.modal-content');
			resizeIFRMto($dlg ,{'y':70});
		})
		.on("hidden.bs.modal",function(){
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

PHPMaker_ew_ModalDialogShow =  ew_ModalDialogShow;
ew_ModalDialogShow = function(args) {

	var $ = jQuery, f = args.f, $f = $(f);
	if (f && $f) { // Check form
	 	if (!$f[0])
			return;
		if (!ew_KeySelected($f[0])) {
			ew_Prompt("<p class=\"text-danger\">" + ewLanguage.Phrase("NoRecordSelected") + "</p>");
			return;
		}
	}

	var $dlg = ewModalDialog || $("#ewModalDialog").on("hidden.bs.modal", ew_ModalDialogHide);

	// fail
	var _fail = function(o) {
		$dlg.modal("hide");
		if (o.status)
			ew_Alert("Server Error " + o.status + ": " + o.statusText);
	}

	// always
	var _always = function(o) {
		$("body").css("cursor", "default");
	}

	// submit success
	var _submitsuccess = function(data) {
		var results;
		if (data) {
			try {
				results = $.parseJSON(data);
			} catch(e) {}
		}
		if (results && results.length > 0) {
			$dlg.modal("hide");
			var result = results[0];
			var url = result.url;

			//console.log(url);
			//AJAX refresh content -> The user must be declarate the function refreshContent in this context!!!
			if(!$.isUndefined(window.refreshContent)){
				refreshContent();
			} else {
				window.location = url;
			}
		} else {
			var body = ew_StripScript(data).match(/<body[\s\S]*>[\s\S]*<\/body>/i);
			$dlg.find(".modal-body").html($(body[0]).not("div[id^=ew].modal, #ewTooltip"));
			var footer = "";
			var cf = $(data).find("#a_confirm");
			var ct = $(data).find("#a_conflict");
			if (ct && ct.val() == "1") { // Conflict page
				footer += "<button type=\"button\" id=\"btnOverwrite\" class=\"btn btn-primary ewButton\">" + ewLanguage.Phrase("OverwriteBtn") + "</button>";
				footer += "<button type=\"button\" id=\"btnReload\" class=\"btn btn-default ewButton\">" + ewLanguage.Phrase("ReloadBtn") + "</button>";
				footer += "<button type=\"button\" class=\"btn btn-default ewButton\" data-dismiss=\"modal\">" + ewLanguage.Phrase("CancelBtn") + "</button>";
				$dlg.find(".modal-footer").html(footer);
				$dlg.find(".modal-footer #btnOverwrite").on('click', {action: 'overwrite'}, _submit);
				$dlg.find(".modal-footer #btnReload").on('click', {action: 'I'}, _submit);
			} else if (cf && cf.val() == "F") { // Confirm page
				footer += "<button type=\"button\" class=\"btn btn-primary ewButton\">" + ewLanguage.Phrase("ConfirmBtn") + "</button>";
				footer += "<button type=\"button\" class=\"btn btn-default ewButton\">" + ewLanguage.Phrase("CancelBtn") + "</button>";
				$dlg.find(".modal-footer").html(footer);
				$dlg.find(".modal-footer .btn-primary").click(_submit).focus();
				$dlg.find(".modal-footer .btn-default").on('click', {action: 'X'}, _submit);
			} else { // Normal page
				if (args.url && args.caption)
					footer += "<button type=\"button\" class=\"btn btn-primary ewButton\">" + args.caption + "</button>";
				footer += "<button type=\"button\" class=\"btn btn-default ewButton\" data-dismiss=\"modal\">" + ewLanguage.Phrase("CancelBtn") + "</button>";
				$dlg.find(".modal-footer").html(footer);
				$dlg.find(".modal-footer .btn-primary").click(_submit).focus();
			}
			ew_ExecScript(data, "ModalDialog");
		}
	}

	// submit
	var _submit = function(e) {

		var form = $dlg.find(".modal-body form")[0];
		var frm = ewForms[form.id];
		frm.UpdateTextArea();
		var action = e && e.data ? e.data.action : null;
		var input = form.a_add || form.a_edit || form.a_update;

		if (action && input)
			input.value = action; // Update action
		if (frm.Validate()) {
			frm.DestroyEditor();
			$.post(form.action, $(form).serialize(), _submitsuccess).fail(_fail);
		}
		return false;
	}

	$dlg.modal("hide");
	$dlg.data("args", args);

	var success = function(data) {
		var $data = $(data), $lnk = $(args.lnk);
		$dlg.find(".modal-title").html($lnk.data("caption") || $lnk.data("original-title"));
		var footer = "";
		//var header = '<button type="button" class="close" data-dismiss="modal">&times;</button>';
		if (args.url && args.caption)
			footer += "<button type=\"button\" class=\"btn btn-primary ewButton\">" + args.caption + "</button>";
		if (footer != "")
			footer += "<button type=\"button\" class=\"btn btn-default ewButton\" data-dismiss=\"modal\">" + ewLanguage.Phrase("CancelBtn") + "</button>";
		else
			footer = "<button type=\"button\" class=\"btn btn-default ewButton\" data-dismiss=\"modal\">" + ewLanguage.Phrase("CloseBtn") + "</button>";
		$dlg.find(".modal-footer").html(footer);

		//Inyectando controles del footer en el header
		$dlg.find(".modal-title").prepend('<div class="pull-right btn-group btn-group-xs">' + footer + '</div>');
		$dlg.find(".modal-header .btn-primary").click(_submit).focus();

		var body = ew_StripScript(data).match(/<body[\s\S]*>[\s\S]*<\/body>/i);
		$dlg.find(".modal-body").append($(body[0]).not("div[id^=ew].modal, #ewTooltip"));
		$dlg.find(".modal-body form").keypress(function(e) {
			if (e.which == 13)
				return _submit();
		});
		ewModalDialog = $dlg.modal("show");
		$dlg.find(".modal-dialog").addClass("table-" + $lnk.data("table"));
		$dlg.find(".modal-footer .btn-primary").click(_submit).focus();
		ew_ExecScript(data, "ModalDialog");
		$dlg.trigger("load.ew"); // Trigger load event for, e.g. YouTube videos, ReCAPTCHA and Google maps
		ew_InitPasswordOptions();
	};

	$("body").css("cursor", "wait");

	var url = args.url;
	if (f && $f) { // Post form
		$("<input>").attr({type: "hidden", name: "modal", value: "1"}).appendTo($f);
		$.post(url, $f.serialize(), success).fail(_fail).always(_always);
	} else {
		url += (url.split("?").length > 1 ? "&" : "?") + "modal=1&rnd=" + ew_Random();
		$.get(url, success).fail(_fail).always(_always);
	}
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
//			ew_ApplyTemplate("tpd_pacientelist", "tpm_pacientelist");
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

/*
function refreshTable(options){

	var referencia = '#' + options.containerTable.attr('id');
	if(!$.isUndefined(top) && !$.isUndefined(top.isScrolling) && !top.isScrolling)
	if(( options.condition.call() && !$('.pageload-overlay:visible').length && $(window.frameElement?window.frameElement:window).is(':visible') && $(referencia).is(':visible:not(.updating)') && options.containerTable.find('input:checkbox:checked').length === 0)|| options.forceRefresh ){
		$(referencia).addClass('updating');
		options.onbefore.call(this,options);

		$.get( options.url + ( options.params != null?(options.url.indexOf('?')==-1 ? '?' : '&') + jQuery.param( options.params ):'') , function(data) {


			//$(referencia).empty().append($(data).find(referencia).html());
			$(referencia).find('table.ewTable').html($(data).find('table.ewTable').html());
			//console.log($(data).find('table.ewTable'));
			ew_ApplyTemplate("tpd_pacientelist", "tpm_pacientelist");
			//options.oncomplete.call();
			//ApplyTemplateTable($(referencia));
			//resizeIFRM(3000);
			$(referencia).removeClass('updating'); //.css('visibility','initial');

		});

		$('.ewpagerform').load(location.href + ' .ewpagerform .ewPager', function(){ $(this).form(); });
	}
	if(options.time > 0) //si se desea refrescar en periodos de tiempo
		setTimeout(function(){refreshTable(options);},options.time);
}
*/
/*
function refreshTable(options){
	var opt = options;
	var referencia = '#' + opt.containerTable.attr('id');
	if($(window.frameElement?window.frameElement:window).is(':visible') && $(referencia).is(':visible:not(.updating)') && opt.containerTable.find('input:checkbox:checked').length === 0){
		$(referencia).addClass('updating');
		opt.onbefore.call();
		$(referencia).load(location.href + ' ' + referencia, function(){
			ew_ApplyTemplate("tpd_pacientelist", "tpm_pacientelist");
			//ApplyTemplateTable($(this));
			//resizeIFRM(3000);
			//opt.oncomplete.call();
			$(this).removeClass('updating');
		});
		$('#ewpagerform').load(location.href + ' #ewpagerform .ewPager', function(){ $(this).form(); });
	}
	//setTimeout(function(){refreshTable(opt);},opt.time);
}
*/

function isScrolledIntoView(el) {
    var elemTop = el.getBoundingClientRect().top;
    var elemBottom = el.getBoundingClientRect().bottom;

    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    return isVisible;
}

function refreshTable(options){
	var referencia = '#' + options.containerTable.attr('id');
	if($(window.frameElement?window.frameElement:window).is(':visible') && $(referencia).is(':visible:not(.updating)') && options.containerTable.find('input:checkbox:checked').length === 0){
		$(referencia).addClass('updating');
		options.onbefore.call();
		$(referencia).load(location.href + ' ' + referencia, function(){
			ApplyTemplateTable($(this));
			resizeIFRM(2000);
			options.oncomplete.call();
			$(this).removeClass('updating');
		});
		$('#ewpagerform').load(location.href + ' #ewpagerform .ewPager', function(){ $(this).form(); });
	}
	console.log(options.time, $(window.frameElement?window.frameElement:window).is(':visible') );
	if($(window.frameElement?window.frameElement:window).is(':visible'))
		setTimeout(function(){refreshTable(options);},options.time>0 ? options.time : 7000 );
}

function refreshTableOn(options){
	var defaultopt = {
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
	if(!isScrolledIntoView(defaultopt.containerTable.get(0))) return;
	ApplyTemplateTable(defaultopt.containerTable);
	console.log(defaultopt);
	setTimeout(function(){refreshTable(defaultopt)}, defaultopt.time );
}

function urlContent(url){
					if($('#frame-content').is(':visible')){
						$('#frame-content').attr('src',url + '?cmd=resetall&opciones=reset');
					}
					$('#frame-content').data('url',url + '?cmd=resetall&opciones=reset');

					$('div.metro-pivot').data('metro-pivot').goToItemByName('contenido');
					$('.pageload-overlay').show();
}
