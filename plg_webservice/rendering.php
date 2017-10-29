<?php

if(chkopt("webservice")){ //Si se ha llamado como servicio.

  $err = CurrentPage()->getFailureMessage();
  if ($err != "") {
    setWSR('"success":"0","error":"'.$err.'"');
  }
  if(CurrentPageID() == "list"){
    $strJSON = toJSON(CurrentPage());
    $_SESSION[CurrentPage()->PageObjName."_WSR"] = json_decode($strJSON,TRUE);
    CurrentPage()->Page_Terminate();
  }
}
?>
