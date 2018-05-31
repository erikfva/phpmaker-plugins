</script>

<!-- *** SELECT COLUMNS TO EXPORT *** -->
<!-- Button trigger modal -->
<?php
 	$item = &CurrentPage()->ExportOptions->Add("selColumns");
	$item->Body = '
	<a class="btn btn-info ewExportLink" data-toggle="modal" role="button" aria-haspopup="true" aria-expanded="false" data-target="#frmColumns">
		<span data-phrase="ExportToWord" class="glyphicon glyphicon-cog ewIcon" data-caption="Exportar a Word"></span>
	</a>
	';
?>
<!-- Modal -->
<div class="ewModalDialog modal fade" id="frmColumns" tabindex="-1" role="dialog" aria-labelledby="frmColumnsLabel">
	<div class="modal-dialog" role="document">
		<div class="modal-content">

			<form name="f<?php echo CurrentPage()->TableName; ?>cols" id="f<?php echo CurrentPage()->TableName; ?>cols" class="form-inline ewForm ewColsForm" method="get" action="<?php echo ew_CurrentPage() ?>">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<h4 class="modal-title" id="myModalLabel">Seleccione columnas para exportar</h4>
			</div>
			<div class="modal-body">
				<input type="hidden" id="hide_export" name="hide_export" value="<?php echo @CurrentPage()->hide_export?implode(",", CurrentPage()->hide_export):""; ?>" />
			<?php
				foreach (CurrentPage()->fields as $FldVar => $field) {
					if( (@$field->Selectable && $field->Selectable) || is_null(@$field->Selectable) ){
			?>
				<label class="checkbox-inline">
					<input type="checkbox" class="chk_export" id="fld_export_<?php echo $FldVar;?>" <?php if(  !in_array($FldVar, @CurrentPage()->hide_export?CurrentPage()->hide_export:Array())  ) echo "checked";?> class="ewMultiSelect" value="<?php echo $FldVar;?>"> 
					<?php echo $field->FldCaption(); ?>
				</label>
			<?php } } ?>
				<h4>Opciones</h4>
				<div class="row">
					<label class="checkbox-inline">
						<input name="export_page" type="radio" class="ewMultiSelect" value="current" <?php if(!CurrentPage()->ExportAll) echo "checked";?>> 
						Exportar página actual
					</label>				
					<label class="checkbox-inline">
						<input name="export_page" type="radio" class="ewMultiSelect" value="all" <?php if(CurrentPage()->ExportAll) echo "checked";?>> 
						Exportar Todas las páginas
					</label>
					
				</div>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
				<button type="submit" class="btn btn-primary">Aceptar</button>
			</div>
			
			</form>	  

		</div>
	</div>
</div>
<!-- Event add/remove column name from list -->
<script type="text/javascript">
	$('.chk_export').on('click',function(e){
		var hide_export = $('#hide_export').val('');
		$('.chk_export').each(function(i,e){
			if(!this.checked)
				hide_export[0].value += (hide_export[0].value?',':'') + this.value;
		})		
	})