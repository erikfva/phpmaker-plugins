$(function(){
	coolTemplate();
});

jQuery(document).ready(function(){
	$("#ewModalDialog,#ewModalLookupDialog,#ewAddOptDialog").on("show.bs.modal",function(){
		coolTemplate($(this));
	});

	hideEmpty();
})

jQuery(document).on('newoption',function(e,a){
	//console.log(a);

	if(a.option.is('.coolCtrl')) return;
	
	var ctrl = a.option.filter(':not(.custom)').addClass('btn alert-info').end()
	.css({'visibility':'inherit'}).addClass('coolCtrl')
	.on('click', function(event ){ 
    			if (event && event.stopPropagation){ 
    				event.stopPropagation();
    			} else 
    				window.event.cancelBubble=true;  
    			if($(this).find('input:radio').length) $(this).addClass('active')
    			else
    				$(this).toggleClass('active'); 
  }).find('input:radio,input:checkbox')
    		.on('click', function(event ){ 
    			if (event && event.stopPropagation){ 
    				event.stopPropagation();
    			} else 
    				window.event.cancelBubble=true;  
    			if ($(event.target).is('input:radio')){ $(event.target).closest('.ewItemTable').find('input:radio:not(:checked)').parent().removeClass('active')  } 
    		})
			.css({'width':'0px'});
			/*
    		setTimeout(function(){
				if(ctrl.length && ctrl[0].checked) ctrl.parent().addClass('active');
				console.log('resize input:radio');
    			if(window.resizeIFRM) resizeIFRM();
			}, 50); 
			*/
})