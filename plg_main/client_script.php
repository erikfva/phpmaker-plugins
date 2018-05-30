<?php
	global $_SESSION;
	$PageName = basename(ew_CurrentPage(), ".php");
	if(!empty($_SESSION[$PageName."_run_script"])){
		echo $_SESSION[$PageName."_run_script"];
		$_SESSION[$PageName."_run_script"] = "";
	}
	global $gbSkipHeaderFooter;
	if(@$gbSkipHeaderFooter){
		echo "</script>";
			$bc = Breadcrumb();
			if($bc) $bc->Render();
		echo "<script>";
	}
?>