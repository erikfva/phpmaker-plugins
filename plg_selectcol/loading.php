<?php

global $hide_export;
$hide_export = @$_SESSION[CurrentPage()->PageObjName."_hide_export"];
$this->hide_export = @$_GET["hide_export"]? explode(",", $_GET["hide_export"]) : $hide_export;
$_SESSION[CurrentPage()->PageObjName."_hide_export"] = $this->hide_export;

?>
