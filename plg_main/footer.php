<?php
global $EW_RELATIVE_PATH;
global $Page;

if($Page && $Page->PageObjName == "main_php"){
	ew_AddClientScript($plgConf["plugins_path"]."plg_main/metro/jquery.metro.js");
	ew_AddClientScript($plgConf["plugins_path"]."plg_main/main.js");
}
?>
<script type="text/javascript">
	//plg_main: Include javascript code in footer for all pages.
<?php if(CurrentPage()->PageID == 'changepwd'){ ?>
	$("#fchangepwd").attr("target","_top");
<?php } ?>
<?php if(CurrentPageID() != "list"){  ?>
	(!isCrossOrigin()) && top.$('html, body').animate({scrollTop:0,scrollLeft:0}, 'fast');
<?php } ?>	
</script>
