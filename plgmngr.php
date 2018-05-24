<?php
	global $plgConf;
	$plgConf = array(
		"plugins_path"			=> "plugins/",
		"include"				=> array(),
		"plg_main"				=> array("header" => "plg_main/header.php",
										"footer"=>"plg_main/footer.php",
										"client_script" => "plg_main/client_script.php"),
		"plg_selectcol"			=> array("loading" => "plg_selectcol/loading.php",
										"client_script" => "plg_selectcol/client_script.php"),										
		"plg_metro"				=> array("header" => "plg_main/header_metro.php"),
		"plg_coolui"			=> array("userfn" => "plg_coolui/userfn.php" ,
										"header" => "plg_coolui/header.php",
										"footer"=>"plg_coolui/footer.php"),
		"plg_uidatetime"		=> array("header" => "plg_uidatetime/header.php",
										"footer"=>"plg_uidatetime/footer.php"),
		"plg_autosizetextarea"	=> array("header" => "plg_autosizetextarea/header.php",
										"footer"=>"plg_autosizetextarea/footer.php"),
		"plg_webservice"		=> array("header" => "plg_webservice/header.php",
										"loading"=>"plg_webservice/loading.php",
										"rendering" => "plg_webservice/rendering.php",
										"unloaded" => "plg_webservice/unloaded.php",
										"userfn" => "plg_webservice/userfn.php")
									);

function addPlg($plgName, $page=""){
	global $plgConf;
	if(empty($page)) $page = CurrentPage()->PageObjName;
	$plgConf["include"][$page]= (!empty($plgConf["include"][$page])? $plgConf["include"][CurrentPage()->PageObjName]	. "," : "").$plgName;
}

function includePlg($posicion="header",$page=""){
	global $plgConf;
	$plgNames = !empty($plgConf["include"]["all"])? $plgConf["include"]["all"] : ""; //plugins para todas las paginas "all"
	if(empty($page)) $page = CurrentPage()->PageObjName;
	$plgNames.= (!empty($plgNames)?",":"") . (!empty($plgConf["include"][$page])? $plgConf["include"][$page] : "");
	$plgList = explode(",",$plgNames);
 //var_dump($plgList,$posicion);
	foreach ($plgList as $plg) {
		if (!empty($plgConf[$plg]) && !empty($plgConf[$plg][$posicion])) {
			//echo "incluyendo:".$plgConf[$plg][$posicion];
			include_once $plgConf["plugins_path"].$plgConf[$plg][$posicion];
		}
	}
}

//Agregando los plugins para todas las páginas
addPlg("plg_main,plg_coolui,plg_webservice","all");

//incluyendo las funciones de usuario de cada plugin (para todas las p�ginas)
foreach ($plgConf as $plg) {
	if (!empty($plg["userfn"])) {
		include_once $plgConf["plugins_path"].$plg["userfn"];
	}
}
