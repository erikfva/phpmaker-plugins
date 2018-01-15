<?php
	global $EW_RELATIVE_PATH;
	ew_AddStylesheet($plgConf["plugins_path"]."plg_coolui/project.css");
	ew_AddClientScript($plgConf["plugins_path"]."plg_coolui/userfn.js");

//tableheadfixer
if(isset(CurrentPage()->PageID) && CurrentPage()->PageID == "list"){
	ew_AddClientScript($plgConf["plugins_path"]."plg_coolui/tableheadfixer/jquery.tableheadfixer.js");	
}

global $__css;
if(isset($__css)){
		echo "
		<style type=\"text/css\">
		".$__css."
		</style>
		";
}
?>
