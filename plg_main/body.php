<?php if(comportamiento("100")){ ?>
<!--
**************************************
	 Motor de busqueda estilo Google
**************************************
!-->
<?php ew_AddClientScript($EW_RELATIVE_PATH."plg_main/busqueda/main.js"); ?>
 <div id="formulario-buscar" class="open" align="center" style="top:10px;height:50px;right:0">
	<form id="form-busqueda" name="f">
			<div class="pull-right input-group input-group-lg" style="z-index:2; margin-right:70px">
		  <input id="texto-busqueda" type="text" class="form-control" name="q" size="20" placeholder="Buscar..." title="Busqueda">
		  <span class="input-group-btn">
		  	<button class="btn btn-default" type="button" onclick="$('#texto-busqueda').val('').focus();">&times;</button>
			<button id="btnBuscar" name="btnBuscar" class="btn btn-primary goobutton" type="button"><span class="glyphicon glyphicon-search"></span></button>
		  </span>
	  </div>
   </form>
<span class="responsive dropdown-menu dropdown-submenu" id="mensaje-buscando" style="color:#4CC3EC; text-align:center; display:none">Buscando...<img src="<?php echo $EW_RELATIVE_PATH; ?>plg_main/busqueda/img/loading.gif"></span>
</div>
<?php }?>
<!--
**************************************
	Barra de men� izquierda
**************************************
!-->
<span style="z-index:3;bottom:85px;left:-10px;padding-right:5px" class="btn  btnleftmenu open close affix ui-corner-right " onclick="leftbarToggle(this);">
	<span class="glyphicon glyphicon-chevron-left"></span>
</span>
<div id="leftmenu" class="modal-content">
	<div style="width: 100%; text-align: center;">
		<a href="">
			<!--<img width="87px" src="<?php echo $EW_RELATIVE_PATH."plg_main/";?>images/logo.png">-->
		</a>
	</div>
	<br>
	<center id="slidx_button" class=" glyphicon glyphicon-list" style="color:white;font-size:24px;font-weight: lighter;cursor:pointer;width:32px;margin:5px 5px"></center>
<?php if(Security()->AllowAdd(CurrentProjectID() . 'paciente') ) {?>
<br>
<a href="#" onclick="clienteadd(); return false;" data-toggle="modal" style="margin-top:20px; display:block">
<div class="outlookbutton" style="width:90px; color:white">
<img src="<?php echo $EW_RELATIVE_PATH."plg_main/";?>images/contactosadd.png" style="width:48px" height="48" border="0">
</br>
Registrar paciente
</div>
</a>
<?php }?>
<?php if(comportamiento("112")){ ?>
<!--COMPORTAMIENTO: Adicion de citas m�dicas para paciente nuevo en la barra lateral 
<br>
<a href="javascript:citaadd()" style="display:block">
<span class="outlookbutton" style=" padding:0; width:90px; color:white">
	<img src="images/citapaciente.png" style="width:60px;height:55px" align="top" border="0">
  <span style="display:block">Cita de paciente nuevo</span>  
</span>
</a> 
-->   
<?php }?>
<?php if(comportamiento("113") &&  comportamiento("114")){ ?>
<!-- Boton de aniversarios 
<br>
<a class="fade" id="btnAniversario" herf="#" onclick="$('div.metro-pivot').data('metro-pivot').goToItemByName('aniversario'); return false;">
<span class="outlookbutton" style=" padding:0; width:90px; color:white">
	<img src="images/birthday.png" style="width:48px" height="48" border="0">
  <span class="badge hashtag">5</span>
</span>
</a>
-->
<?php }?>
	<div align="center" style="position:absolute; bottom:0px; width:100%">
		<div style="display:inline-block;margin-bottom:13px">					
			<a href="logout.php" class="close  glyphicon glyphicon-off" style="color:#FFF;font-size: 30px;"></a>
		</div>	
	</div>
</div>
<!--     
**************************************
MENU ESTILO ANDROID
**************************************
!-->
<nav id="slidx_menu">
<div id="user_info" style="display:none" class="well-sm media">
  <div class="media-left media-middle">
	  <img class="img-circle media-object" src="<?php echo $EW_RELATIVE_PATH."plg_main/";?>images/foto.jpg" alt="..." style="width:64px">
  </div>
  <div class="media-middle media-body">
	<span class="h4 media-heading"><?php echo CurrentUserInfo("nombre")?CurrentUserInfo("nombre"):(IsSysAdmin()?"Administrador":"???"); ?></span>
  </div>
</div>	
</nav>

<!--
**************************************
	Barra de men� superior
**************************************
!-->
<?php

?>
<span style="z-index:1001;right:20px;top:0px;padding-bottom:5px" class="btnTopMenu close open affix ui-corner-bottom outlookbutton" onclick="topbarToggle(this);">
	<span class="glyphicon glyphicon-chevron-up"></span>
</span>

<!--
**************************************
	Cuerpo principal
**************************************
!-->
<?php
	$__Pages = isset($__Pages)?$__Pages:array();
?>	
		
<div id="mainbody" style="margin-top:5px;">
	<div class="metro-pivot">
<?php	foreach($__Pages as $__Page){ ?>
	<div class="pivot-item">
		<h3>
			<?php if(!empty($__Page["button_imagen"])){ ?>
			<img src="<?php echo $__Page["button_imagen"];?>" align="absmiddle" style="width:48px" border="0">
			<?php } ?>
			<span style="display:none"><?php echo $__Page["nombre"];?></span>
		</h3>

		<?php if(!empty($__Page["content"])){ 
			echo ($__Page["content"]);
		} elseif(!empty($__Page["iframe_id"])) { ?>
			<iframe id="<?php echo $__Page["iframe_id"];?>" style="<?php if(!empty($__Page["iframe_style"])) echo $__Page["iframe_style"];?>" class="<?php if(!empty($__Page["iframe_class"])) echo $__Page["iframe_class"];?>" scrolling="no" src="" data-url="<?php if(!empty($__Page["iframe_url"])) echo $__Page["iframe_url"];?>" frameborder="0" marginheight="0" marginwidth="0"  ></iframe>
		<?php } ?>

	</div>
<?php	} ?>	
  </div>   
</div>