
function coolRadioCheckBtn(container ){

	if (typeof container == 'undefined') var container = $('body');

	var itemlist = container.find('.ewItemList').addClass('btn-group').attr('data-toggle','buttons');

		itemlist.each(function(){
			var item = $(this);
			var Ctrls = item.find('.radio-inline:not(.coolCtrl),.checkbox-inline:not(.coolCtrl)'); //,.checkbox:not(.coolCtrl)

			if(Ctrls.find('input.yes-no:radio').length == 2){
				var input_radio = Ctrls.find('input.yes-no:radio');
				$('<input id="autoplay-checkbox" type="checkbox" />').prop('checked', input_radio.filter(':checked').val() == 1)
				.on('click',function(){
					input_radio.filter('[value=' + (this.checked?'1':'0')+ ']').prop('checked',true);
				})
				.insertAfter(this)
				.wrap( '<span class="yt-uix-checkbox-on-off "></span>' )
				.after('<label for="autoplay-checkbox" id="autoplay-checkbox-label"><span class="checked">&nbsp;</span><span class="unchecked"></span><span class="toggle">&nbsp;</span></label>');

				$(this).addClass('yes-no');
				Ctrls.addClass('coolCtrl');
				item.css({'visibility':'inherit','opacity':'1'});
			} else {

				$('<span class=" text-danger btn btn-xs fa fa-ban fa-2x">&nbsp;</span>')
				.insertBefore(item)
				.on('click',function(){
					item.find('.radio-inline,.checkbox-inline')
					.removeClass('active')
					.find('input:checkbox,input:radio')
					.each(function(index){ this.checked = false });
				});
				Ctrls.each(function(){
					var args = {"option": $(this)};
					//console.log(args);
					$(document).trigger("newoption", [args]); // Fire "newoption" event for radio/checkbox list
				});
				item.css({'visibility':'inherit','opacity':'1'});

			}
		}) 
}

function coolTemplate(container){  
 
	if (typeof container == 'undefined') var container = window.$('body');

//Personalizando botones de opciones

//container.find('.ewRowLink.ewEdit,.ewAddEdit.ewGridEdit,.ewAction.ewMultiUpdate,.ewAction.ewEdit').removeClass('btn-default').addClass('btn-info');
container.find('.ewGridLink.ewGridDelete, .ewRowLink.ewDelete, .ewAction.ewMultiDelete, .ewGridLink.ewInlineCancel, .ewAction.ewGridCancel').removeClass('btn-default').addClass('text-danger');
container.find('.ewAddOptBtn').removeClass('btn-default').addClass('btn-primary');
container.find('.ewShowAll').removeClass('btn-default').addClass('btn-warning').css({'visibility':'inherit','opacity':'1'});
container.find('.ewExportLink.ewPrint').attr('target','_blank');

	if(typeof $.fn.tableHeadFixer === 'function' ){ //If table-fixed-header load?
   	container.find('.ewTable:not(.hidden)').find('thead').addClass('well').end().tableHeadFixer()
 	}

coolRadioCheckBtn(container);

//Mostrando botones personalizados
container.find('.ewAddOptBtn, .btn-primary,.ewAddEdit.ewAdd, .ewGridLink.ewInlineUpdate, .ewAddEdit.ewGridAdd, .ewAction.ewGridSave,.ewAction.ewGridInsert, .ewDetailAdd')
//.removeClass('btn-default').addClass('goobutton')
.css({'visibility':'inherit','opacity':'1'});


return true;
}

function hideEmpty(){
	$('.hide-empty').each(function(){  
		if($(this).text().trim() != '')
			 $(this).css('display','table-cell')
	}) 
}