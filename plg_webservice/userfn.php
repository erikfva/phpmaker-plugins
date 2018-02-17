<?php
//-----------------------------------//
//***FIX: limpiando 'amp;' en los indices de $_POST
// cuando se llama el script desde file_get_content
//-----------------------------------//

if(!empty($_POST))
while ( list($key, $value) = each($_POST) ){
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
	if (@$GLOBALS["_SERVER"]["REQUEST_METHOD"] == "POST" && empty($_POST)){
	  $_POST = json_decode(trim(file_get_contents('php://input')), true);
	}	
	$opciones = isset($_GET["opciones"])?$_GET["opciones"]:( isset($_POST["opciones"])? $_POST["opciones"]:'');

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

  	if(!(strpos($opciones,"login")>-1) && !IsLoggedIn() && (@$_SESSION[EW_PROJECT_NAME . "_Username"] == "")){ //validando opciones de autologin
  			//autologin con parámetro 'session_key'
  		$sessionid = @$_POST["session_key"] .  @$_GET["session_key"];
  		if($sessionid){
  			if (session_id() != "") @session_destroy();
  			session_id($sessionid);
  			session_start();
  		}
  	}
  }

  //-------------------------//
  //***Funciones de soporte
  //-------------------------//
  function chkopt($op){
  	global $opciones;
  	return strpos(strtoupper(@$_SESSION[CurrentPage()->PageObjName."_opciones"]),strtoupper($op)) > -1 ||
  	strpos(strtoupper($opciones),strtoupper($op)) > -1;
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
  	global $Security;
  	$utf8 = (strtolower(EW_CHARSET) == "utf-8");
    if($page->PageID == 'list'){
  		$bSelectLimit = $page->UseSelectLimit;

  		// Load recordset
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

  	  { // Export one $page only
  		  $page->SetUpStartRec(); // Set up start record position

  		  // Set the last record to display
  		  if ($page->DisplayRecs <= 0) {
  			  $page->StopRec = $this->TotalRecs;
  		  } else {
  			  $page->StopRec = $page->StartRec + $page->DisplayRecs - 1;
  		  }
  	  }
  	  if ($bSelectLimit){
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
  	  }
  	  if (!$rs) {
  		  header("Content-Type:"); // Remove header
  		  header("Content-Disposition:");
  		  $page->ShowMessage();
  		  return;
  	  }
  	  $Pager = new cPrevNextPager($page->StartRec, $page->DisplayRecs, $page->TotalRecs);
  	  $res = $rs->GetRows();
  	  $rs->Close();
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

  	  $Allowed = '{"CanView":"'.$Security->CanView().'","CanEdit":"'.$Security->CanEdit().'","CanDelete":"'.$Security->CanDelete().'","CanAdd":"'.$Security->CanAdd().'","CanList":"'.$Security->CanList().'","CanAdmin":"'.$Security->CanAdmin().'","CanSearch":"'.$Security->CanSearch().'","CanReport":"'.$Security->CanReport().'"}';
  	  return "{\"TableVar\":\"".$page->TableVar."\",\"Security\":".$Allowed.",\"PageUrl\":\"".$page->PageUrl()."\",\"pager\":".json_encode($Pager).", \"fieldList\":".json_encode($FieldList).", \"orderField\":\"".$orderField."\", \"orderType\":\"".$orderType."\",\"rows\": ".json_encode($res)."}" ;
    }
    if($page->PageID == 'edit'){
  		$sFilter = $page->KeyFilter();

  		// Call Row Selecting event
  		$page->Row_Selecting($sFilter);

  		// Load SQL based on filter
  		$page->CurrentFilter = $sFilter;
  		$sSql = $page->SQL();
  		$res = FALSE;
  	global $ADODB_FETCH_MODE;
  	$auxADODB_FETCH_MODE = $ADODB_FETCH_MODE;
  	$ADODB_FETCH_MODE = ADODB_FETCH_ASSOC;
  	error_reporting(~E_STRICT);
  		$rs = ew_LoadRecordset($sSql);
  	$ADODB_FETCH_MODE = $auxADODB_FETCH_MODE;
  		if ($rs && !$rs->EOF) {
  			$res = array($rs->fields);
  			$rs->Close();
  			return json_encode($res[0]);
  		}
    }
  }

?>
