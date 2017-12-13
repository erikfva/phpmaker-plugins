<?php
	global $EW_RELATIVE_PATH;
	ew_AddStylesheet($plgConf["plugins_path"]."plg_coolui/project.css");
	ew_AddClientScript($plgConf["plugins_path"]."plg_coolui/userfn.js");
global $__css;
if(isset($__css)){
		echo "
		<style type=\"text/css\">
		".$__css."
		</style>
		";
}
?>
