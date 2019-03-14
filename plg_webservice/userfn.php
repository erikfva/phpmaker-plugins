<?php

if (@$GLOBALS["_SERVER"]["REQUEST_METHOD"] == "POST" && empty($_POST)){
	$_POST = json_decode(trim(file_get_contents('php://input')), true);
}

//-----------------------------------//
//***FIX: limpiando 'amp;' en los indices de $_POST
// cuando se llama el script desde file_get_content
//-----------------------------------//
if(!empty($_POST))
foreach($_POST as $key => $value){ 
//while ( list($key, $value) = each($_POST) ){
	//var_dump($key, $value);
	$newkey = str_replace('amp;', '', $key);
	if ($newkey != $key) {
		global $_POST;
		$_POST[$newkey] = $_POST[$key];
		unset($_POST[$key]);
	}
}

//--------------------------------------------------//
//***procesando el parámetro de opciones adicionales
//--------------------------------------------------//
	global $opciones,$_GET,$_POST;	
	$opciones = isset($_GET["opciones"])?$_GET["opciones"]:( isset($_POST["opciones"])? $_POST["opciones"]:'');

//----------------------------------------------------------------------//
//Login con key de session guardada en variable $_SESSION utilizado para integracion con otros sistemas.
//----------------------------------------------------------------------//
if(ew_CurrentPage() != "login.php" && !IsLoggedIn() && (@$_SESSION[EW_PROJECT_NAME . "_Username"] == "") ){ 
	
	//var_dump($_SESSION); exit;
	$sessionid = @$_POST["session_key"] .  @$_GET["session_key"];

	if($sessionid){
		if (session_id() != "") @session_destroy();
		session_id($sessionid);
		session_start();

	}	
}

  //----------------------------------------------------------------------//
  //***procesando respuestas especiales por webservice o solicitudes json
  //----------------------------------------------------------------------//
  if(strpos($opciones,"webservice")>-1 || strpos($opciones,"json")>-1 || strpos($opciones,"addjsn")>-1 ){
	  	
  	global $Language;

  	// Language object
  	if (!isset($Language)) $Language = new cLanguage();
  	if(strpos($opciones,"language")>-1){
  		echo json_encode($Language);
  		exit();
  	}

  	if(ew_CurrentPage() != "login.php" && !(strpos($opciones,"login")>-1) && !IsLoggedIn() && (@$_SESSION[EW_PROJECT_NAME . "_Username"] == "")){ //validando opciones de autologin
  		//autologin con parámetro 'session_key'		    
		$sessionid = @$_POST["session_key"] .  @$_GET["session_key"];

  		if($sessionid){
  			if (session_id() != "") @session_destroy();
  			session_id($sessionid);
			session_start();
			header('Access-Control-Allow-Origin: *'); //Permitir cross-domain	
			if (session_id() == ""){
				echo '{success:0,msg:"' . ew_DeniedMsg() .'"}';
				exit;				
			}	
  		} else {
			header('Access-Control-Allow-Origin: *'); //Permitir cross-domain

			//***verificando acceso anonimo
			global $UserProfile, $Security;
			// User profile
			$UserProfile = new cUserProfile();
			// Security
			$Security = new cAdvancedSecurity();
			$TableName = ew_CurrentPage();
			$action = "";
			if(strpos($TableName, "list") !== false) $action = "list";
			if(strpos($TableName, "edit") !== false) $action = "edit";
			if(strpos($TableName, "add") !== false) $action = "add";
			if(strpos($TableName, "delete") !== false) $action = "delete";

			$find = array("list","edit", "add", "delete", ".php");
			$TableName = str_replace($find,"",$TableName);
			$Security->LoadCurrentUserLevel(CurrentProjectID() . $TableName);
			$authorized = false;
			switch ($action) {
				case "list":
					$authorized = $Security->CanList();
					break;
				case "edit":
					$authorized = $Security->CanEdit();
					break;
				case "add":
					$authorized = $Security->CanAdd();
					break;
				case "delete":
					$authorized = $Security->CanDelete();
					break;
			}
			if( !$authorized ){
				echo '{success:0,msg:"' . ew_DeniedMsg() .'"}';
				exit;
			}
		}
  	}
	  
	if(ew_CurrentPage() =="ewupload14.php"){
  		if( @$_GET[@$_GET["id"]] != "" && @$_GET["rnd"] == ""){			
  			$file_name = ew_UploadTempPath().$_GET[$_GET["id"]];
  			$key = EW_RANDOM_KEY . session_id();
        /*
        $fn = $plgConf["plugins_path"]."plg_webservice/ewfile.php?t=" . ew_Encrypt($_GET["table"], $key) ."&fn=" . ew_Encrypt($file_name, $key).(@$_GET["version"]=="thumbnail"?"":"&width=0&height=0");	
        header('Location: '.$fn); exit;
        */
        $_GET["t"]= ew_Encrypt($_GET["table"], $key);
        $_GET["fn"]= ew_Encrypt($file_name, $key);
        if(@$_GET["version"]!="thumbnail"){
	        $_GET["width"] = 0;
	        $_GET["height"] = 0;        	
        }
        include_once $plgConf["plugins_path"]."plg_webservice/ewfile.php";
        exit;
  		}
  	}

  }

  //-------------------------//
  //***Funciones de soporte
  //-------------------------//
  function chkopt($op){
  	return strpos(strtoupper(@$_SESSION[CurrentPage()->PageObjName."_opciones"]),strtoupper($op)) > -1 ||
  	strpos(strtoupper(@$opciones),strtoupper($op)) > -1;
  }

  function setWSR($key,$value=null){ //Web Service Response
  	global $_SESSION;
  	if (func_num_args() >= 2){
  		$_SESSION[CurrentPage()->PageObjName."_WSR"][$key] = $value;
  	} else {
  		if(!is_null($obj = json_decode($key,TRUE))){
  			foreach($obj as $okey=>$oval){
  				 setWSR($okey,$oval);
  			}
  		}
  	}
  }

  function toJSON($page){

	//** Get Fields Info */
	$FieldList = Array();
	$orderField = "";     
	$orderBy = $page->getSessionOrderBy();
	$orderType = strpos($orderBy, "ASC")!==false?"ASC":"DESC";
	foreach ($page->fields as $FldVar => $field) {
	$FieldList[] = array('id'=>$field->FldVar,'name' => $FldVar,
			'caption' => $field->FldCaption() ,
			'sortable' => ($page->SortUrl($field) == ""?false:true),
			'visible' => $field->Visible);
			$orderField = strpos($orderBy, $FldVar)!==false? $FldVar: $orderField;
	}

	//** Get Security Info */
	global $Security;
	$Allowed = array(
		'CanView'		=> $Security->CanView(),
		'CanEdit'		=> $Security->CanEdit(),
		'CanDelete'	=> $Security->CanDelete(),
		'CanAdd'		=> $Security->CanAdd(),
		'CanList'		=> $Security->CanList(),
		'CanAdmin'	=> $Security->CanAdmin(),
		'CanSearch'	=> $Security->CanSearch(),
		'CanReport'	=> $Security->CanReport()
	);

	$utf8 = (strtolower(EW_CHARSET) == "utf-8");
	$bSelectLimit = $page->UseSelectLimit;

  //** Load recordset
	if ($bSelectLimit) {
		$page->TotalRecs = $page->ListRecordCount();
	} else {
		if (!$page->Recordset)
			$page->Recordset = $page->LoadRecordset();
		$rs = &$page->Recordset;
		if ($rs)
			$page->TotalRecs = $rs->RecordCount();
	}
	$page->StartRec = 1;
	
  //** Export one page only
	$page->SetupStartRec(); // Set up start record position

	// Set the last record to display
	if ($page->DisplayRecs <= 0) {
		$page->StopRec = $page->TotalRecs;
	} else {
		$page->StopRec = $page->StartRec + $page->DisplayRecs - 1;
	}

	if ($bSelectLimit){
		$rs = $page->LoadRecordset($page->StartRec-1, $page->DisplayRecs <= 0 ? $page->TotalRecs : $page->DisplayRecs);
	/*
		$sSql = !empty($page->customSQL)? $page->customSQL : $page->ListSQL();
		$offset = $page->StartRec-1;
		$rowcnt = $page->DisplayRecs <= 0 ? $page->TotalRecs : $page->DisplayRecs;
		$sSql .= " LIMIT $rowcnt OFFSET $offset";	
		global $ADODB_FETCH_MODE;
		$auxADODB_FETCH_MODE = $ADODB_FETCH_MODE;
		$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC;
		error_reporting(~E_STRICT);
		$rs = ew_LoadRecordset($sSql);
		$ADODB_FETCH_MODE = $auxADODB_FETCH_MODE;
	*/
	}
	
	if (!$rs) {
		header("Content-Type:"); // Remove header
		header("Content-Disposition:");
		$page->ShowMessage();
		return;
	}

	$Pager = new cPrevNextPager($page->StartRec, $page->DisplayRecs, $page->TotalRecs);

//** Create Json Document */
	$page->Export = "json";
	$page->ExportDoc = ew_ExportDocument($page, "h");
	$Doc = &$page->ExportDoc;

//** Set range limits	
	 if ($bSelectLimit) {
	 	$page->StartRec = 1;
	 	$page->StopRec = $page->DisplayRecs <= 0 ? $page->TotalRecs : $page->DisplayRecs;
	 } 

	// Call Page Exporting server event
	//--	$page->ExportDoc->ExportCustom = !$page->Page_Exporting();
	//--	$ParentTable = "";
	//--	$page->Page_DataRendering($page->PageHeader);
		$page->ExportDocument($Doc, $rs, $page->StartRec, $page->StopRec, "");
	//--	$page->Page_DataRendered($page->PageFooter);

		// Close recordset
		$rs->Close();
		// Call Page Exported server event
	//--	$page->Page_Exported();

		// Export header and footer
	//--	$Doc->ExportHeaderAndFooter();

		// Output data
	//	return json_encode($Doc->Items, 0);



	return json_encode(
		array(
			'psearch'		=> $page->BasicSearch->Keyword,
			'TableVar'		=> $page->TableVar,
			'TableCaption'	=> $page->TableCaption(),
			'Security'		=> $Allowed,
			'PageUrl'		=> $page->PageUrl(),
			'pager'			=> $Pager,
			'fieldList'		=> $FieldList,
			'orderField'	=> $orderField,
			'orderType'		=> $orderType,
			'rows'			=> $Doc->Items,
			'newRow'		=> $page->NewRow()
		)
	); 

  }

?>
