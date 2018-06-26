# phpmaker-plugins

### Instalando
- 1.- Crear una carpeta llamada "plugins" en la carpeta de su proyecto PHPMaker.
- 2.- Copie el contenido del repositorio en la carpeta "plugins".
- 3.- Realizar los siguientes ajustes a su proyecto PHPMaker:

--> Adicionar al inicio de Server Events/Global/All Pages/Global Code
```sh
	include_once "plugins/plgmngr.php";
```
--> Adicionar al inicio de Server Events/Global/All Pages/Page_Head
```sh
//incluyendo los encabezados de los "plugins"
	includePlg(); //sin parametros asume que la seccion es "header"
```
--> Adicionar al cuerpo de la funcion de Server Events/Global/All Pages/Page_Loading
```sh
	includePlg("loading");
```
--> Adicionar al cuerpo de la funcion de Server Events/Global/All Pages/Page_Rendering
```sh
	includePlg("rendering");
```
--> Adicionar al cuerpo de la funcion de Server Events/Global/All Pages/Page_Unloaded
```sh
	includePlg("unloaded");
```
--> Adicionar al inicio de Client Scripts/Global/Pages with header|footer/Client Script
```sh
<?php    
	includePlg("client_script");
?>
```
--> Adicionar al inicio de Client Scripts/Global/Pages with header|footer/StartUp Script
```sh
</script>
<?php
	includePlg("footer");
?>
<script type="text/javascript" >
```
### Uso
--> Para agregar el plugin "autosizetextarea" por ejemplo en la pagina Edit,
	adicionar en la funcion de Server Events/Table-Specific/Edit Page/Page_Load
```sh
	addPlg("plg_autosizetextarea");
```
