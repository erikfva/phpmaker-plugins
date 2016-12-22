<?php
	global $plgConf;
	$plgConf = array(	"include" => array(),
										"plg_main" 	=> array("header" => "plg_main/header.php","footer"=>"plg_main/footer.php"),
										"plg_metro" 	=> array("header" => "plg_main/header_metro.php"),
										"plg_coolui" => array("userfn" => "plg_coolui/userfn.php" ,"header" => "plg_coolui/header.php","footer"=>"plg_coolui/footer.php"),	
										"plg_uidatetime" => array("header" => "plg_uidatetime/header.php","footer"=>"plg_uidatetime/footer.php"),
										"plg_autosizetextarea" => array("header" => "plg_autosizetextarea/header.php","footer"=>"plg_autosizetextarea/footer.php")							 
									);

function addPlg($plgName, $page=""){
	global $plgConf;
	if(empty($page)) $page = CurrentPage()->PageObjName;
	$plgConf["include"][$page]= (!empty($plgConf["include"][$page])?
																										$plgConf["include"][CurrentPage()->PageObjName]	. "," : "").$plgName; 
}

function includePlg($posicion="header",$page=""){
	global $plgConf;
	$plgNames = !empty($plgConf["include"]["all"])? $plgConf["include"]["all"] : ""; //plugins para todas las paginas "all"
	if(empty($page)) $page = CurrentPage()->PageObjName;
	$plgNames.= (!empty($plgNames)?",":"") . (!empty($plgConf["include"][$page])? $plgConf["include"][$page] : "");
	$plgList = explode(",",$plgNames);
	foreach ($plgList as $plg) {
		if (!empty($plgConf[$plg]) && !empty($plgConf[$plg][$posicion])) {
			include_once $plgConf[$plg][$posicion]; 
		}
	}
}

//incluyendo las funciones de usuario de cada plugin (para todas las páginas)
foreach ($plgConf as $plg) {
	if (!empty($plg["userfn"])) {
		include_once $plg["userfn"]; 
	}
}

function addJSLib($libreria,$posicion="header"){
	global $EW_RELATIVE_PATH;
	switch ( strtoupper($libreria) ) {  
		case "AUTOSIZETEXTAREA":
			if($posicion=="footer"){
				echo "
				<script type=\"text/javascript\">
				jQuery(document).ready(function(){
					autosize($('textarea.autosize'));
				});
				</script>
				";
			}else{ 
				ew_AddClientScript("autosize/dist/autosize.min.js");  
			}
			break;
		case "SHEDULER":
			if($posicion=="header"){ 
				ew_AddStylesheet("metro/jquery.metro.css");
				ew_AddClientScript("metro/jquery.metro.js"); 
				echo "<script type=\"text/javascript\"> ";
				include "sheduler.php";
				echo "</script>";
			}
			break;    
		case "BOOTSTRAPCALENDAR":
			if($posicion=="footer"){ 
				ew_AddClientScript("bootstrapcalendar/underscore-min.js");  
				ew_AddClientScript("bootstrapcalendar/language/es-MX.js"); 
				ew_AddClientScript("bootstrapcalendar/jstz.min.js");  
				ew_AddClientScript("bootstrapcalendar/bootstrapcalendar.min.js");
			}else{ 
				ew_AddStylesheet("bootstrapcalendar/css/calendar.min.css");
			}
			break; 
		case "UIDATETIME":
			if($posicion=="footer"){ 
				ew_AddClientScript("uidatetime/ui-datetime.js"); 
			}else{ 
				global $customstyle;
				$customstyle .= ".btn-cell-selected,.btn-cell:hover{background-color:#0072C6;color:#fff;opacity:1}";
			}
			break;  
		case "JQUERYUI":       
			if($posicion=="header"){ ew_AddStylesheet("ui/themes/cupertino/jquery-ui.min.css");}
			else{ew_AddClientScript("ui/jquery-ui-1.10.0.custom.min.js",array("requiere" => $EW_RELATIVE_PATH."jquery/jquery-1.11.3.min.js"));}                            
			break;
		case "UIDIALOG":
			if($posicion=="header"){ew_AddStylesheet("uidialog/jquery.dialogr.css");}
			else{ew_AddClientScript("uidialog/ui.dialogr.min.js",array("requiere" => "jquery-ui-1.10.0.custom.min.js"));} 
			break;
		case "LIMESURVEY": 
			if($posicion=="footer")
				ew_AddClientScript("limesurvey/scripts/survey_runtime.js");
			break; 
		case "UIFORM": 
			if($posicion=="footer")
				ew_AddClientScript("ui/ui.main.js");
			break; 
		case "RESIZEPANEL": 
			if($posicion=="footer")
				ew_AddClientScript("resizepanel/resizepanel.jQuery.js");
			break;            
		case "UICOMBOBOX":  
			if($posicion=="footer"){
			ew_AddClientScript("ui/ui.combobox.js"); 
			echo "
<script type=\"text/javascript\"> 
	 jQuery(document).ready(function(){ 
		$.ui.autocomplete.prototype.options.autoSelect = true;
		$( '.ui-autocomplete-input' ).live( 'blur', function( event ) {
			var autocomplete = $( this ).data( 'ui-autocomplete' );
			if ( !autocomplete.options.autoSelect || autocomplete.selectedItem ) { return; }
			var matcher = new RegExp( $.ui.autocomplete.escapeRegex( $(this).val() ) , 'i' );
			autocomplete.widget().children( '.ui-menu-item' ).each(function() {
				var item = $( this ).data( 'ui-autocomplete-item' );
				if ( matcher.test( item.label || item.value || item ) ) {
					autocomplete.selectedItem = item;
					return false;
				}
			});
			if ( autocomplete.selectedItem ) {
				autocomplete._trigger( 'select', event, { item: autocomplete.selectedItem } );
				$(this).val(autocomplete.selectedItem.value);
			}
		});
		$('select:not([readonly=\"readonly\"]):not(.unstyled)').combobox().each(function(){ $(this).next().css('display','inline-block')});
	 });
</script>
		";  
			}
			break;  
		case "TIMEPICKER":             
			if($posicion=="header"){ew_AddStylesheet("timepicker/jquery-ui-timepicker-addon.css");}
			else{
				ew_AddClientScript("timepicker/jquery-ui-timepicker-addon.min.js");
				ew_AddClientScript("timepicker/jquery-ui-sliderAccess.js");
				ew_AddClientScript("timepicker/localization/jquery-ui-timepicker-es.js");             
				echo "
	   <script type=\"text/javascript\">
	   jQuery(document).ready(function(){
		$.datepicker.regional['es'] = {
			closeText: 'Cerrar',
			prevText: '&#x3C;Ant',
			nextText: 'Sig&#x3E;',
			currentText: 'Hoy',
			monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
			'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
			monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',         
			'Jul','Ago','Sep','Oct','Nov','Dic'],
			dayNames: ['Domingo','Lunes','Martes','Mi\u00e9rcoles','Jueves','Viernes','S\u00e1bado'],
			dayNamesShort: ['Dom','Lun','Mar','Mi\u00e9','Juv','Vie','S\u00e1b'],
			dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','S\u00e1'],
			weekHeader: 'Sm',
			dateFormat: 'dd/mm/yy',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,                                                    
			yearSuffix: ''};
		$.datepicker.setDefaults($.datepicker.regional['es']);
		   $('.datetimecontrol').datetimepicker({timeFormat: 'HH:mm:ss',
												 AddSliderAccess:true,
												 sliderAccessArgs:{touchonly:false}});
		   $('.datecontrol').datepicker();
		   $('.timecontrol').timepicker({stepMinute: 5});
	   });
	   </script> 
			";
			}
			break; 
		case "DOSIFICADOR": 
			if($posicion=="footer")
				ew_AddClientScript("dosificador/dosificador.jquery.js");  
			break;  
		case "KEYPAD":
			if($posicion=="header"){
				ew_AddStylesheet("keypad/jquery.keypad.css");
			} else {
				ew_AddClientScript("keypad/jquery.plugin.min.js"); 
				ew_AddClientScript("keypad/jquery.keypad.min.js");
				ew_AddClientScript("keypad/jquery.keypad-es.js"); 
				echo "
	<script type=\"text/javascript\">
		jQuery(document).ready(function(){
			$.keypad.setDefaults({
				keypadClass : 'dropdown-menu',
				beforeShow : function(div, inst){
					div
					.find('.keypad-key,.keypad-space').css({'width':'50px','display':'inline-block'}).end()
					.find('.keypad-key').addClass('btn btn-large').end()
					.find('.keypad-special:not(.keypad-close)').addClass('btn btn-info').end()
					.find('.keypad-close').addClass('btn btn-warning');
				}
			})
		});
	</script> 
				";
			}
			break; 
		case "JUPLOAD":       
			if($posicion=="footer"){    
			include_once "jupload/fileupload.php";
			ew_AddClientScript("jupload/js/tmpl.min.js");
			ew_AddClientScript("jupload/js/load-image.min.js");  
			ew_AddClientScript("jupload/js/jquery.iframe-transport.js");
			ew_AddClientScript("jupload/js/jquery.fileupload.js");
			ew_AddClientScript("jupload/js/jquery.fileupload-process.js");
			ew_AddClientScript("jupload/js/jquery.fileupload-image.js"); 
			ew_AddClientScript("jupload/js/jquery.fileupload-audio.js");
			ew_AddClientScript("jupload/js/jquery.fileupload-video.js");
			ew_AddClientScript("jupload/js/jquery.fileupload-validate.js");
			ew_AddClientScript("jupload/js/jquery.fileupload-ui.js");  
			ew_AddClientScript("blockUI/jquery.blockUI.js");
			echo "
	<script type=\"text/javascript\">             
	jQuery(document).ready(function(){ 
		$.getScript( 'jupload/js/jquery.fileupload-jquery-ui.js',function(){ 
			$.getScript( 'jupload/js/main.js', function(){ 
				$('.uploadcontrol').each(function(){
					fileupload_inicializar({'editor':$(this),emptyimage:'".ew_DomainUrl().(strrpos(ew_CurrentUrl(),"/")?substr(ew_CurrentUrl(), 0, strrpos(ew_CurrentUrl(),"/")) :"")."/jupload/img/pictures.png'});
				});    
				resizeIFRM();            
			}); 
		});    
	});            
	</script>    
			";            
			}                     
			break;                        
	}                             
}