<?php
global $EW_RELATIVE_PATH;
global $Page;

if($Page && $Page->PageObjName == "main_php"){
	ew_AddClientScript($plgConf["plugins_path"]."plg_main/drilldownmenu/linkes_drilldown.min.js"); //MENU ESTILO ANDROID
	ew_AddClientScript($plgConf["plugins_path"]."plg_main/drilldownmenu/slidx.js"); //MENU ESTILO ANDROID
	ew_AddClientScript($plgConf["plugins_path"]."plg_main/metro/jquery.metro.js");
	ew_AddClientScript($plgConf["plugins_path"]."plg_main/main.js");
}

if(CurrentPage()->PageID == 'changepwd'){
echo '
<script type="text/javascript">
	$("#fchangepwd").attr("target","_top");
</script>';
}
?>
