<?php

  global $opciones;

  $_SESSION[CurrentPage()->PageObjName."_opciones"] = !empty($opciones)? $opciones:
  (!empty($_SESSION[CurrentPage()->PageObjName."_opciones"])?$_SESSION[CurrentPage()->PageObjName."_opciones"]:"") ;
  //Reseteando opcion webservice
	if(strpos($opciones,"webservice") === false){
		$_SESSION[CurrentPage()->PageObjName."_opciones"] = str_replace("webservice","",$_SESSION[CurrentPage()->PageObjName."_opciones"]);
	}
	//Iniciando buffer Web Service Response WSR
	if(!empty($_SESSION[CurrentPage()->PageObjName."_WSR"])){
		unset($_SESSION[CurrentPage()->PageObjName."_WSR"]); // = [];
	} else {
		$_SESSION[CurrentPage()->PageObjName."_WSR"] = [];
	}

	//Completando parametros especiales de PHPMaker en llamadas por webservice.
	if(chkopt("webservice")){ //Si se ha llamado como servicio.
		global $_POST;
    //echo '{"msg":"'.CurrentPageID().'"}'; exit();
		switch(CurrentPageID()){
			case 'login' : 
				CurrentPage()->CreateToken(); 
				$_POST[EW_TOKEN_NAME] = CurrentPage()->Token;
				break;
			case "add" :
				$_POST["t"] = CurrentPage()->TableName;
				$_POST["a_add"] = "A";
				CurrentPage()->CreateToken(); 
				$_POST[EW_TOKEN_NAME] = CurrentPage()->Token;

				break;
      case "edit" :
        $_POST["t"] = CurrentPage()->TableName;
				$_POST["a_edit"] = "U";
				CurrentPage()->CreateToken(); 
				$_POST[EW_TOKEN_NAME] = CurrentPage()->Token;
				break;
			case "delete":
				$_POST["t"] = CurrentPage()->TableName;
				$_POST["a_list"] = "";
				CurrentPage()->CreateToken(); 
				$_POST[EW_TOKEN_NAME] = CurrentPage()->Token;
				break;			
		}
		//setWSR($res ? $res : ('{"success":"0","msg":"'.getMsg(113).'"}'));
	}
?>
