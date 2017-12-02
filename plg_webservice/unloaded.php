<?php

if (@$GLOBALS["_SERVER"]["REQUEST_METHOD"] == "OPTIONS"){
  header('Access-Control-Allow-Origin: *'); //Permitir cross-domain
  header("Content-Type: application/json");
  exit();
}

if(chkopt("webservice")){

//verificando webservice.
  if (ob_get_length()) ob_end_clean();// Clean output buffer
  header('Access-Control-Allow-Origin: *'); //Permitir cross-domain
  header("Content-Type: application/json");
  $msg = CurrentPage()->getFailureMessage();
  if ($msg != "") {
    CurrentPage()->ClearFailureMessage();
    echo json_encode(json_decode('{"success":"0","msg":"'.$msg.'"}'));
  }
  $msg = CurrentPage()->getSuccessMessage();
  if ($msg != ""){
    echo json_encode(json_decode('{"success":"1","msg":"'.$msg.'"}'));
    CurrentPage()->ClearSuccessMessage();
  }

  if(@$_SESSION[CurrentPage()->PageObjName."_WSR"])
    echo json_encode(@$_SESSION[CurrentPage()->PageObjName."_WSR"]); //$strJSON;
  exit();
}
?>
