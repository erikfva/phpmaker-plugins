function resizeIFRM(delay){

	if(!window.frameElement || $(window.frameElement).hasClass('iframe-resizing') ) return;
	
	delay = typeof delay == "undefined"?100:delay;
	setTimeout(function(){
		$(window.frameElement).addClass('iframe-resizing');
		if (window.self != window.top) {
			$(parent.document).find('iframe').each(function() {
			if (this.contentWindow.document == window.document) {
					var ifrm = this;
					var h = $('.modal-dialog:visible').outerHeight();
					h = h && h > $('body').height()+30? h + $('.modal-dialog:visible').offset().top * 2 : $('body').height()+30;
					$(ifrm).css({ height: h + 'px'});
					if(!$(ifrm).hasClass('fixedwidth') && (document.body.scrollWidth - 15 > $(ifrm).width())) $(ifrm).css({'width':document.body.scrollWidth + 'px'});
				}
			});
		}	
		$(window.frameElement).removeClass('iframe-resizing');
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
	$(window).load(function(){ 
		
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
			console.log(url);
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
		if (args.url && args.caption)
			footer += "<button type=\"button\" class=\"btn btn-primary ewButton\">" + args.caption + "</button>";
		if (footer != "")
			footer += "<button type=\"button\" class=\"btn btn-default ewButton\" data-dismiss=\"modal\">" + ewLanguage.Phrase("CancelBtn") + "</button>";
		else
			footer = "<button type=\"button\" class=\"btn btn-default ewButton\" data-dismiss=\"modal\">" + ewLanguage.Phrase("CloseBtn") + "</button>";
		$dlg.find(".modal-footer").html(footer);
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