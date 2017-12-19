<?php
echo "<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1, user-scalable=no' name='viewport' />";

global $Breadcrumb,$Language;


if(isset($Breadcrumb->Links)){

	//Quitando el link de "inicio" del path
	if($Breadcrumb->Links[0][0]=="home"){array_splice($Breadcrumb->Links, 0, 1);}

	//Agregando los botones de accion en la misma fila del path
	if(isset(CurrentPage()->PageID) && (CurrentPage()->PageID == "edit" || CurrentPage()->PageID == "add" ) ){
		global $customstyle;
		$PageCaption = $Language->Phrase("EditBtn");
		array_splice( $Breadcrumb->Links, count($Breadcrumb->Links)-1, 0, array(array("editbtn","SaveBtn" , "javascript:$('#btnAction').trigger('click');\" class=\"btn btn-sm btn-primary", "", CurrentPage()->TableVar, false) ) );
		$customstyle.= ".breadcrumb .active{display:none !important}";
	}

	//En algunos casos es necesario adicionar el link para volver atras
	if( (empty($opciones) || !strpos($opciones,"hidebkmainpage")) && isset(CurrentPage()->TableVar) && !empty($_SESSION[EW_PROJECT_NAME . "_" . CurrentPage()->TableVar . "_" . EW_TABLE_MASTER_TABLE]) && count($Breadcrumb->Links) == 1 ) {
		$masterTbl = $_SESSION[EW_PROJECT_NAME . "_" . CurrentPage()->TableVar . "_" . EW_TABLE_MASTER_TABLE];
		$PageLnk = $_SESSION[EW_PROJECT_NAME ."_".$_SESSION[EW_PROJECT_NAME . "_" . CurrentPage()->TableVar . "_" . EW_TABLE_MASTER_TABLE]."_exportreturn"];
		array_splice( $Breadcrumb->Links, count($Breadcrumb->Links)-1, 0, array(array(
		$masterTbl,
		$masterTbl ,
		ew_DomainUrl().$PageLnk,
		"",
		$masterTbl,
		false) ) );
	}

}


//Para mostrar solo la tabla de datos sin encabezado y pie de pagina
global $gbSkipHeaderFooter;
global $EW_RELATIVE_PATH;
global $Page;


$gbSkipHeaderFooter = TRUE;


if(!empty($Page) && $Page->PageObjName == "main_php"){
	ew_AddStylesheet($plgConf["plugins_path"]."plg_main/metro/jquery.metro.css");
	ew_AddStylesheet($plgConf["plugins_path"]."plg_main/main.css");
	global $customstyle;
	$customstyle.= ".content-header{display:none}.content-wrapper,.wrapper.ewLayout{background-color:transparent}";
	$gbSkipHeaderFooter = FALSE;
}
ew_AddClientScript($plgConf["plugins_path"]."plg_main/userfn.js");

if (IsLoggedIn()){
	if (empty(CurrentPage()->Export) && !ew_IsMobile()) {
		//Mensaje deslizable cargando...
		ew_AddStylesheet($plgConf["plugins_path"]."plg_main/loading/css/loading.css");
		echo '
			<div class="pageload-overlay">
				<!-- the component -->
				<ul class="bokeh">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
		';
	}
}

?>