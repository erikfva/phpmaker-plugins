	/*
	years = 10, cantidad de de años a mostrar.
	curyear = [año actual], año seleccionado.
	col = 2, columnas en la lista de años.
	poscuryear = 'center', posicion del curyear en la lista ['center','first', 'last'].
	*/

    var TPGlobal = {
      hourTemplate: '<span data-max-value="23" data-time-component="hours" class="timepicker-hour well-small close btn-inverse"></span>',
      minuteTemplate: '<span data-max-value="59" data-time-component="minutes" class="well-small close btn-inverse timepicker-minute"></span>',
      secondTemplate: '<span data-max-value="59" data-time-component="seconds" class="timepicker-second well-small close btn-inverse"></span>'
    };
    TPGlobal.getTemplate = function(is12Hours, showSeconds) {
      return (
      '<div class="timepicker-picker">' +
        '<table align="center" class="table-condensed"' +
          (is12Hours ? ' data-hour-format="12"' : '') +
          '>' +
          '<tr>' +
            '<td><span class="btn " data-time-control="timepicker-hour"><i class="glyphicon glyphicon-chevron-up"></i></span></td>' +
            '<td class="separator"></td>' +
            '<td><span class="btn " data-time-control="timepicker-minute"><i class="glyphicon glyphicon-chevron-up"></i></span></td>' +
            (showSeconds ?
            '<td class="separator"></td>' +
            '<td><span class="btn " data-time-control="timepicker-second"><i class="glyphicon glyphicon-chevron-up"></i></span></td>': '')+
            (is12Hours ? '<td class="separator"></td>' : '') +
          '</tr>' +
          '<tr>' +
            '<td>' + TPGlobal.hourTemplate + '</td> ' +
            '<td class="separator">:</td>' +
            '<td>' + TPGlobal.minuteTemplate + '</td> ' +
            (showSeconds ?
            '<td class="separator">:</td>' +
            '<td>' + TPGlobal.secondTemplate + '</td>' : '') +
            (is12Hours ?
            '<td class="separator"></td>' +
            '<td>' +
            '<button type="button" class="btn btn-primary" data-action="togglePeriod"></button>' +
            '</td>' : '') +
          '</tr>' +
          '<tr>' +
            '<td><span class="btn " data-time-control="timepicker-hour"><i class="glyphicon glyphicon-chevron-down"></i></span></td>' +
            '<td class="separator"></td>' +
            '<td><span class="btn " data-time-control="timepicker-minute"><i class="glyphicon glyphicon-chevron-down"></i></span></td>' +
            (showSeconds ?
            '<td class="separator"></td>' +
            '<td><span class="btn " data-time-control="timepicker-second"><i class="glyphicon glyphicon-chevron-down"></i></span></td>': '') +
            (is12Hours ? '<td class="separator"></td>' : '') +
          '</tr>' +
        '</table>' +
      '</div>' +
      '<div class="timepicker-hours select-list" data-time-control="timepicker-hour">' +
        '<table align="center" class="table-condensed dropdown-menu dropdown-submenu">' +
        '</table>'+
      '</div>'+
      '<div class="timepicker-minutes select-list" data-time-control="timepicker-minute">' +
        '<table align="center" class="table-condensed dropdown-menu dropdown-submenu">' +
        '</table>'+
      '</div>'+
      (showSeconds ?
      '<div class="timepicker-seconds select-list" data-time-control="timepicker-second">' +
        '<table align="center" class="table-condensed dropdown-menu dropdown-submenu">' +
        '</table>'+
      '</div>': '')
      );
    }		
    	
	function htmlYears(editor){
		var yini, yfin;
		thisyear = new Date().getFullYear();
		id = editor.attr('id');
		opciones = editor.data('opciones');
		yini = opciones.poscuryear == 'first'?opciones.curyear:(opciones.poscuryear == 'last'?opciones.curyear - opciones.years:opciones.curyear - Math.round( opciones.years / 2));	
		yfin = yini + opciones.years;
		html = '';
		curcol = 1;
		for(i=yini;i<=yfin;i++){
			html += curcol==1?'<div class="clearfix ">':'';
			html += '<span class="btn-date' + (i == opciones.curyear?' btn-date-selected ' + opciones.csBtnSelected:'') + (i%10 == 0?' label label-info':'') + '" value="' + String(i) + '">' + String(i) + '</span>';
			if(curcol==opciones.col){html += '</div>'; curcol=1;} else {curcol++;}
		}
		if(thisyear<yini || thisyear>yfin){
			html = '<center class="clearfix "><span class="btn-date label label-warning" value="' + String(thisyear) + '">'+ String(thisyear) +'</span></h3>' +html;
		}
		return html;

	}
	function htmlDayTitle(op){
		var Days = new Array('Dom','Lu','Ma','Mi','Ju','Vi','Sa');
		var opt = {'month':new Date().getMonth(),'year':new Date().getFullYear()};
		$.extend(opt,op);
		
		var dateObj = new Date(opt.year, opt.month, 0);
		dateObj.setDate(1);

		var firstDay = dateObj.getDay();
			
		return $.map(Days,function(val,i){ var pos = (i+firstDay)<7?(i+firstDay):(i+firstDay)-7; return '<span style="display:inline-block;margin:0px" class="small lead ' + (pos==0?'text-danger':'') + '">' + Days[pos] + '</span>'; }); 
	}
	function htmlDay(op){
		var Days = new Array(35);
		var opt = $.extend({},op || {}, {'month':new Date().getMonth(),'year':new Date().getFullYear()});
		var lastDay = new Date(opt.year, opt.month, 0).getDate();
		return '<div align="center" class="dia alert-block clearfix">' + $.map( Days, function( val, i ) { return ( (i+7)%7 == 0?'<div class="clearfix ">':'') + '<span class="btn-date btn-day' + (i>lastDay ?' invisible':'') + '" value="' + (i+1<10?'0':'') + (i+1) + '">' + (i+1<10?'0':'') + (i+1) + '</span>' + ((i+1)%7 == 0?'</div>':'') }).join('') + '</div>'; 
	}	
	function htmlMonth(){
		var months = new Array('ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC');
		return '<div align="center" class="mes alert-block clearfix">' + $.map( months, function( val, i ) { return ( (i+4)%4 == 0?'<div class="clearfix ">':'') + '<span class="btn-date" value="' + (i+1<10?'0'+(i+1):i+1) + '">' + val + '</span>' + ((i+1)%4 == 0?'</div>':'') }).join('') + '</div>'; 
	}
	
	function recalcDay(panel){
		var curDate = new Date(panel.find('input[id*="yearedit"]').val(), panel.find('.mes .btn-date-selected ').attr('value'), 0);
		var lastDay = curDate.getDate();
		panel.find('.btn-day').filter(':lt(' + lastDay + ')').removeClass('invisible').end().filter(':gt(' + (lastDay-1) + ')').addClass('invisible');				
    panel.find('.nombre-dia').empty().append(htmlDayTitle({'month':curDate.getMonth()+1,'year':curDate.getFullYear()})).find('span').width(panel.width()/7 );
	}
	
	function yearEdit(options){
		var opciones = {years : 10,curyear : new Date().getFullYear(),col : 2,poscuryear : 'center',editoryear : null,
			onchngyear:$.noop,ondrawyear:$.noop,csBtn:'csBtn'}
		$.extend(opciones, options);
		if(opciones.editoryear == null) return;
		
		opciones.editoryear.on('focus',function(){
			$(this).data('oldvalue',$(this).val());	
		}).on('focusout',function(){
			if($(this).val() != $(this).data('oldvalue')){
    			var panel = $(this).closest('.panel-datetime');
					var edit = panel.data('edit-datetime');
    			edit.val(getDate(panel, opciones.separator) );
					opciones.onchngyear.call(this);
					opciones.onchng.call(this,edit,panel);
			}
		});
		
		opciones.editoryear.addClass('form-control').attr('id', typeof opciones.editoryear.attr('id') !== 'undefined'?opciones.editoryear.attr('id'): 'yearedit_' + String(Math.floor( Math.random()*99999 )))
		.data('opciones',$.extend(opciones,{years:parseInt(opciones.years),curyear:parseInt(opciones.curyear),col:parseInt(opciones.col)}))
		.attr('size','4');
		var id = opciones.editoryear.attr('id');

  	var intervalyear;
  	var btn = $('<button type="button" id="btn_' + id + '" class="btn btn-info glyphicon glyphicon-search"></button>');
    	opciones.editoryear.wrap('<div class="input-group input-group-lg"></div>')
    	.before('<span class="input-group-btn"><button type="button" class="btn btn-info btn-down btn-picker glyphicon glyphicon-minus"></button></span>')
    	.after($('<span class="input-group-btn"></span>').append('<button type="button" class="btn btn-info btn-picker glyphicon glyphicon-plus"></button>').append(btn))
    	.parent().find('.btn-picker').on('click',function(){ opciones.editoryear.val(parseInt(opciones.editoryear.val())+($(this).is('.btn-down')?-1:1)) })
    	.on('mousedown taphold',function(e) {
				var $this = $(this)
    		intervalyear = setInterval(function() { $this.trigger('click')},200); // 500ms between each frame
			}).on('mouseleave mouseup touchend',function(e) {
    		clearInterval(intervalyear);
    		var $this = $(this);
    		if(e.type == 'mouseup' || e.buttons)
    		setTimeout(function(){
    			var panel = $this.closest('.panel-datetime');
					var edit = panel.data('edit-datetime');
    			edit.val(getDate(panel, opciones.separator) );
					opciones.onchngyear.call($this[0]);
					opciones.onchng.call($this[0],edit,panel);
    		}, 200);
			});	

			opciones.editoryear.val(opciones.curyear).on('keyup', function () {this.value = this.value.replace(/[^0-9\.]/g,'') });
			
			$('<div class="hide clearfix dropdown-menu dropdown-submenu pull-left" align="center" id="radio_' + id + '"></div').insertAfter($('#'+id).parent());
			btn.click(function(){
				var edit = $('#'+id);//$(this).parent().parent().find('input[id*="yearedit"]');
				var panel = $('#radio_'+id);//$(this).next();
				var opciones = edit.data('opciones');
				if(panel.is('.show')){
					panel.toggleClass('show hide');
					setTimeout(function(){opciones.ondrawyear.call(this,panel) }, 200);
					return;
				}
				$(window).data('curscroll',top.$(top.document).scrollTop());				
				$.extend(opciones, {curyear:edit.val()});			
				panel.empty().append( htmlYears(opciones.editoryear) ).find('.btn-date').addClass(' btn-group-vertical ' + opciones.csBtn).css({width:'40px',padding:'3px 7px',cursor:'pointer'})
				.on('click', function(){ 
					edit.val($(this).attr('value'));
					$.extend(edit.data('opciones'), {curyear:edit.val(),poscuryear:'center'}); 
					top.$(top.document).scrollTop( $(window).data('curscroll') );	
					opciones.onchngyear.call(this);					
					panel.toggleClass('show hide');					
					opciones.ondrawyear.call(this,panel);
					return false;
				});
				panel.toggleClass('show hide');
				setTimeout(function(){edit.data('opciones').ondrawyear.call(this,panel) }, 200); 
				return false;
			}); 				
	}
	
		
function curDateTime(dtseparator){
	var dt=new Date();
	var separator = typeof dtseparator !== 'undefined'?dtseparator:'/';
	var d = new Array( (dt.getDate()<10?'0':'') + String(dt.getDate()),(dt.getMonth()<10?'0':'') + String(dt.getMonth()+1),String(dt.getFullYear()));
	return (d.join(separator) + ' ' + dt.toLocaleTimeString());
}	
	function setDate(panel,dt,dtseparator){

			dtseparator = typeof dtseparator !== 'undefined'?dtseparator:'/';
      			var curdate = (dt!=''?dt:curDateTime()).split(dtseparator);
      			var withTime = curdate[2].indexOf(' ')!=-1;

      			curday = (parseInt(curdate[0])<10?'0':'') + String(parseInt(curdate[0]));
      			curmonth = curdate[1];
      			curyear = withTime?curdate[2].split(' ')[0]:curdate[2];
      			if(withTime){
      				curtime = curdate[2].split(' ')[1].split(':');
      				curhour = curtime[0];
      				curmin = curtime[1];
      				cursecond = curtime[2];
      				panel.find('[data-time-component=hours]').text(curhour);
      				panel.find('[data-time-component=minutes]').text(curmin);
      				panel.find('[data-time-component=seconds]').text(cursecond);      				
      			}	
      			panel.find('.dia .btn-date-selected,.mes .btn-date-selected').removeClass('btn-date-selected').end()
      			.find('.dia .btn-date[value="' + curday + '"],.mes .btn-date[value="' + curmonth + '"]').addClass('btn-date-selected ' + panel.data('edit-datetime').data('opciones').csBtnSelected);		
      			panel.find('input[id*="yearedit"]').val(curyear);
      			recalcDay(panel);
	}
	
	function getDate(panel,dtseparator){
		dtseparator = typeof dtseparator !== 'undefined'?dtseparator:panel.data('edit-datetime').data('opciones').separator;
		var withTime = panel.data('edit-datetime').data('opciones').withTime;
		return panel.find('.dia .btn-date-selected').attr('value') + dtseparator + panel.find('.mes .btn-date-selected').attr('value') + dtseparator + panel.find('input[id*="yearedit"]').val()+
		(withTime?' '+panel.find('[data-time-component=hours]').text()+':'+panel.find('[data-time-component=minutes]').text()+':'+panel.find('[data-time-component=seconds]').text():'');
	}		
	
	function callOnDraw(el){
		var panel=$(el).closest('.panel-datetime');panel.data('edit-datetime').data('opciones').ondraw.call(el,panel); 
	}
	
	function dateEdit(e,options){
		var opciones = {separator:'/',onchng:$.noop,ondraw:$.noop,csBtn:'csBtn',csBtnSelected:'btn-primary',withTime:false};
		if(typeof options !== 'undefined') $.extend(opciones,options);
				
		var edit = (e.is('input')?e:$('<input type="hidden" value="">').appendTo(e)).data('opciones',opciones);
		var	panel = $('<div class="panel-datetime hide clearfix alert-info modal-content modal-body pull-left well-small" style="position:absolute;width:315px;z-index:10;overflow: hidden;"/>').insertAfter(edit);
		var btn = e.is('[type=text]')?edit.addClass('form-control ' + opciones.withTime?'input-medium':'input-small').wrap('<div class="input-group"></div>')
  		.after('<span class="input-group-btn"><button class="btn-calendar btn btn-default glyphicon glyphicon-calendar" type="button"></button></span>').next().find('button'):
  		$('<button type="button" class="btn btn-info btn-calendar" ' + (e.is('[type=text]')?'style="margin-left:-20px"':'') + '>' +
        	'<span class="icon-calendar icon-white""></span>' +
      	'</button>').insertAfter(edit);
	
    
  		btn.click(function(){ 
  			//var panel = $(this).next();
  			//var edit = panel.data('edit-datetime');
  			if(!$(this).is('.btn-warning')){
  				$('.glyphicon-calendar.btn-warning').toggleClass('btn-info btn-warning');
  				$('.panel-datetime.show').toggleClass('show hide');
  			}

  			$(this).toggleClass('btn-info btn-warning');
				panel.css({'left': $(this).offset().left + $(this).width() - panel.width() + 'px' });
  			panel.toggleClass('show hide');
  			if(panel.position().left<0) panel.css({'left':'0px'});	
      		if(panel.is('.show')){
      			panel.show();
      			setDate(panel, edit.val(), edit.data('opciones').separator);
      		}else{
      			panel.hide();
      		}
      		
      		edit.data('opciones').ondraw.call(this,panel);	
      					
  			if (window.frameElement && window.innerHeight < 2*panel.height()) {
  				$(parent.document).find('iframe').each(function() {
						if (this.contentWindow.document == window.document) {
							$(this).css({ height: 2*panel.height() + 'px'});
						}
					});
  			}
  			return false;
  		});
  		edit.data('panel-datetime',panel).data('btn-calendar',btn);     	
		panel.append('<div align="center" class="nombre-dia alert-block clearfix"></div>');
		panel.append($(htmlDay()+'<hr style="margin:0px">').find('.btn-date').css({width:'20px',padding:'3px 10px',margin:'2px'}).filter('.btn-day').css('width','initial').end().end())
		.append($(htmlMonth()+'<hr style="margin:0px">').find('.btn-date').css({width:'60px',padding:'10px 3px',margin:'3px'}).end());
			
		panel.data('edit-datetime',edit);		
		
		var inputyear = $('<input type="text">').appendTo(panel).wrap('<div align="center" class="alert-block year"></div>');
		opciones.editoryear = inputyear;
		
		
		if(typeof opciones.onchngyear == 'undefined'){
							
			opciones.onchngyear = function(){
				recalcDay(panel); //volver a calcular los dias del mes
				edit.val(getDate(panel,opciones.separator));
			}
		}else{
			var fnchgyear = opciones.onchngyear;
			var chnTimer = 0;
			opciones.onchngyear = function(){
				recalcDay(panel); //volver a calcular los dias del mes
				edit.val(getDate(panel,opciones.separator));
				clearTimeout(chnTimer);
				chnTimer = setTimeout(fnchgyear(this,panel), 800);
			}			
		}
		
		opciones.ondrawyear = function(){
			opciones.ondraw(this, panel);
		}
		yearEdit(opciones);
	  
	  $(TPGlobal.getTemplate(false, true)).appendTo(panel)
		.wrapAll('<h1 class="clearfix" align="center" style="display:none"></h1>')
	  .parent().before('<span class="btn pull-right alert-block glyphicon glyphicon-time" style="margin-top: 10px;' + (opciones.withTime?'':'display:none') + '" onclick="$(this).toggleClass(' + '\'' + opciones.csBtnSelected + ' ' + opciones.csBtn + ' close\'' + ').next().toggle(0,function(){callOnDraw(this)})" ></span>')
	  .find('[data-time-component]')
	  	.on('click',function(){
				$('.timepicker-picker, .timepicker-' + $(this).data('time-component')).toggle(0,function(){callOnDraw(this)});
			})
		.end()
		.find('.select-list>.table-condensed').each(function(){
				$(this).append('<tr><td>'+($(this).parent().is('.timepicker-hours')?fillHour():fillMinute())+'</td></tr>').show().parent().hide()
			}).find('.btn-date, .btn-close')
			.on('click',function(){ 
				var panel_select_list = $(this).closest('.select-list').add('.timepicker-picker').toggle(0,function(){callOnDraw(this)});
				if($(this).text()!='')
					$('.' + panel_select_list.not('.timepicker-picker').data('time-control')).text($(this).text());
			}).end()
		.end();		
	  	
		var interval;
			
		panel.find('.btn-date').addClass(' btn-group-vertical ' + opciones.csBtn).css('cursor','pointer').click( function(){			
				var panel = $(this).closest('.panel-datetime');
				var edit = panel.data('edit-datetime');
				var opciones = edit.data('opciones');
			
				$(this).parent().parent().find('.btn-date-selected').removeClass('btn-date-selected ' + opciones.csBtnSelected);
				$(this).addClass('btn-date-selected ' + opciones.csBtnSelected);
				edit.val(getDate(panel, opciones.separator) );
				if(!$(this).is('.btn-day') && !$(this).is('.btn-sm')){
     			recalcDay(panel);
				}
				opciones.onchng.call(this,edit,panel);
		}).end()
		.find('span[data-time-control]').click(function(){
    			var control = $(this).closest('.table-condensed').find('.' + $(this).data('time-control'));
    			if($(this).find('.glyphicon-chevron-up').length){
    				if(parseInt(control.text())<parseInt(control.data('max-value'))) control.text(parseInt(control.text())+1);
    			}else{
    				if(parseInt(control.text())==0) return false;
    				if(parseInt(control.text())>0) control.text(parseInt(control.text())-1);
    			}	
    			if(parseInt(control.text())<10) control.text('0' + control.text()); //corregir formato de 2 digitos
    			edit.val(getDate(panel,opciones.separator));		
			return false
		}).on('mousedown taphold',function(e) {
			var $this = $(this)
    	interval = setInterval(function() {
    		$this.trigger('click');	
	
    	},200); // 500ms between each frame
		}).on('mouseup mouseleave touchend',function(e) {
    	clearInterval(interval);
		});	
		setDate(panel,edit.val(),opciones.separator);
	}
	
	function fillHour(){
		var Hours = new Array(25);
		return '<div><button type="button" style="position:absolute;right:0px;bottom:0px" class="btn-close btn-link btn-xs"><span class="glyphicon glyphicon-remove"></span></button>' + $.map( Hours, function( val, i ) { return ( (i+5)%5 == 0?'<div class="clearfix ">':'') + '<span class="btn-date btn-sm' + (i==24?' invisible':'') + '" value="' + (i+1<10?'0'+(i+1):i+1) + '">' + (i<10?'0'+i:i) + '</span>' + ((i+1)%5 == 0?'</div>':'') }).join('') + '</div>'; 
	}
	function fillMinute(){
		var Minutes = new Array(12);
		return '<div><button type="button" style="position:absolute;right:0px" class="btn-close btn-link btn-xs"><span class="glyphicon glyphicon-remove"></span></button>' + $.map( Minutes, function( val, i ) { return ( (i+4)%4 == 0?'<div class="clearfix ">':'') + '<span class="btn-date btn-sm' + (i>11?' invisible':'') + '" value="' + (i*5<10?'0'+(i*5):i*5) + '">' + (i*5<10?'0'+(i*5):i*5) + '</span>' + ((i+1)%4 == 0?'</div>':'') }).join('') + '</div>'; 
	}