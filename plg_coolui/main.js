$(function(){
	coolTemplate();
});

jQuery(document).ready(function(){
	$("#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog").on("show.bs.modal",function(){
		coolTemplate($(this));
	});

	hideEmpty();
	if(!window.frameElement){
		//console.log('esta solo', $('body'));
		$('body').attr('style','overflow-x:auto');
	} 
})

jQuery(document).on('newoption',function(e,a){

	var opt = a.option;

	if(opt.is('.coolCtrl')) return;
	opt.filter(':not(.custom)').addClass('btn alert-info');

	opt.css({'visibility':'inherit'}).addClass('coolCtrl')
	.on('click', function(event ){ 
    			if (event && event.stopPropagation){ 
    				event.stopPropagation();
    			} else 
    				window.event.cancelBubble=true;  
    			if($(this).find('input:radio').length) $(this).addClass('active')
    			else
    				$(this).toggleClass('active'); 
	});

	opt.find('input:radio,input:checkbox').each(
	  function(index){
		var $this = $(this);
		$this.on('click', function(event ){ 
			if (event && event.stopPropagation){ 
				event.stopPropagation();
			} else 
				window.event.cancelBubble=true;  
			if ($(event.target).is('input:radio')){ $(event.target).closest('.ewItemTable').find('input:radio:not(:checked)').parent().removeClass('active')  } 
		})
		.css({'width':'0px;','visibility':'hidden'});
		setTimeout(() => {
			if ($this[0].checked)
				opt.addClass('active');
		}, 100);

	  }
	)

			/*
    		setTimeout(function(){
				if(ctrl.length && ctrl[0].checked) ctrl.parent().addClass('active');
				console.log('resize input:radio');
    			if(window.resizeIFRM) resizeIFRM();
			}, 50); 
			*/
})