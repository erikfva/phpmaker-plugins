# phpmaker-plugins
--> Adicionar al inicio de Server Events/Global/All Pages/Page_Head
```sh
//Agregando los plugins para todas las páginas
	addPlg("plg_main,plg_coolui","all");
//incluyendo los encabezados de los "plugins"
	includePlg(); //sin parametros asume que la seccion es "header"
```	
--> Adicionar al inicio de Server Events/Global/All Pages/Global Code
```sh
	include_once "plgmngr.php";
```
--> Adicionar al inicio de Client Scripts/Global/Pages with header|footer/StartUp Script
```sh
</script> 
<?php
	includePlg("footer");
?>
<script type="text/javascript" >
```
--> Para agregar el plugin "autosizetextarea" por ejemplo en la pagina Edit, 
	adicionar en la funcion de Server Events/Table-Specific/Edit Page/Page_Render	
```sh
	addPlg("plg_autosizetextarea");
```
