<?php
	global $EW_RELATIVE_PATH;
	ew_AddStylesheet($EW_RELATIVE_PATH."plg_coolui/project.css"); 
	ew_AddClientScript($EW_RELATIVE_PATH."plg_coolui/userfn.js");
global $__css;
if(isset($__css)){                                
		echo "
		<style type=\"text/css\">
		".$__css."
		</style>
		";
}
?>