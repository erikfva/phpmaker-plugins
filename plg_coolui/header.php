<?php
	global $EW_RELATIVE_PATH;
	ew_AddStylesheet($plgConf["plugins_path"]."plg_coolui/project.css");
	ew_AddClientScript($plgConf["plugins_path"]."plg_coolui/userfn.js");

//tableheadfixer
if(isset(CurrentPage()->PageID) && CurrentPage()->PageID == "list"){
	if(file_exists($plgConf["plugins_path"]."plg_coolui/tableheadfixer/jquery.tableheadfixer.js"))
		ew_AddClientScript($plgConf["plugins_path"]."plg_coolui/tableheadfixer/jquery.tableheadfixer.js");	
}


global $__cssUrl;
global $__scriptUrl;
if(isset($__cssUrl)){
	foreach ($__cssUrl as $url) {
		ew_AddStylesheet($url);
	}
}

if(isset($__scriptUrl)){
	foreach ($__scriptUrl as $url) {
		ew_AddClientScript($url);
	}
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
