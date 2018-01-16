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
  					$(this).css('overflow-x','auto').css('width',maxwidth + 50 + (!$(this).hasClass('sidebar-collapse')?220: ( $(this).find('.btnleftmenu').hasClass('open')?90: 0) ) + 'px');
  				}); 
  				//console.log(maxwidth,w);
  			}
  			iframe.removeClass('iframe-resizing');
  			//w = mainwin(window);
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
		
	/*
	$(referencia).addClass('updating');
	$.ajax({
  	url: location.href + '&opciones=webservices',
  	dataType: "json",
  	cache: false
	}).done(function( data ) {
    
   // ewVar.templateData.rows = data.rows;
    var pageID = CurrentForm.ID.substring(1);
    //console.log(pageID,ewVar.templateData, data);
    //console.log( $( "#tpm_" + pageID).render(data) )
    ew_ApplyTemplate("tpd_" + pageID, "tpm_" + pageID, pageID, "", data);

    options.oncomplete.call();
		$(referencia).removeClass('updating');
		$('#ewpagerform').load(location.href + ' #ewpagerform .ewPager', function(){ $(this).form(); });
  });
		*/
		
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

