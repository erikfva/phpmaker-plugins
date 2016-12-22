/*
 * Linkes iPod Style Drilldown Menu - jQuery Plugin
 * Simple drilldown menu creator for your websites
 *
 * Examples and documentation at: http://davelinke.tumblr.com/post/32806848769/ipod-style-drilldown-menu-jquery-plugin
 *
 * Copyright (c) 2012 David Linke
 *
 * Version: 1.0 (09/28/2012)
 * Requires: jQuery v1.4.4+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 (function($) {
	$.fn.linkesDrillDown = function(ar) {
		var a = $.extend({
			easeHeight: true
		}, ar);
		$.fn.linkesDrillDown.sdd = function(o,ico){
			var islast = o.hasClass('l_drillDown');
			if(!islast){
				o.addClass('active');
				$.fn.linkesDrillDown.sdd(o.parent().closest('ul'),false);
			} else {
				var ad = o.find('.active');
				var wtm = (o.width()*ad.length*-1)+'px';
				o.animate({left:wtm},'fast');
			}
			if(ico){
				var t = o.siblings('a');
				var oo = o.parent();
				//lets try creating the crumbs in here
				var bcd = t.closest('.l_drillDownWrapper').find('.l_ddbc');
				if(!o.parent().parent().hasClass('l_drillDown')){
					var blText = '&laquo '+t.parent().parent().siblings('a').text();
					var blClass = "goUp";
				} else {
					var blText = '&laquo Inicio';
					var blClass = "goHome";
				}
				var hf = function(){
					var w = t.closest('.l_drillDownWrapper');	
					var didiv=w.find('.displayed');
					var th = w.find('.l_drillDown').outerHeight();
					if(didiv.length>0) th = (w.find('.displayed').outerHeight()+w.find('.l_ddbc').outerHeight());
					w.animate(
						{
							height:th
						},'fast',function(){
							$(window).trigger('resize');
						}
					);
				};
				var bl = $(document.createElement('a')).html(blText).addClass(blClass).attr('href','javascript:;').click(function(){
					var sw = $(this).closest('.l_drillDownWrapper');
					var dd = sw.find('.displayed');
					var ad = sw.find('active');
					var sp = dd.parent().parent();
					var na = sp.siblings('a');
					if(!sp.hasClass('l_drillDown')){
						na.trigger('click');
					} else {
						dd.removeClass('displayed');
						ad.removeClass('active');
						sw.find('.l_drillDown').animate({left:0},'fast');
						//$(this).parent().empty().slideUp('fast',function(){hf()});
						$(this).parent().empty().slideUp('fast');
						hf();
					}
				});
				bcd.empty().append(bl).append(' &middot; '+t.text()).slideDown(50,function(){hf()});
			}
		};
		var ad=this;
		ad.each(function(){
			var ld=$(this);
			ld.addClass('l_drillDown');
			ld.wrap('<div class="l_drillDownWrapper" />');
			ld.before('<div class="l_ddbc" />');
			ld.find('a[href="#"]').attr('href','javascript:;');
			ld.find('a').each(function(){
				if(($(this).attr('href')=='javascript:;')&&($(this).siblings('ul').length>0)) $(this).parent().addClass('hasSubs');
			});
			ld.find('a').click(function(){
				if($(this).attr('href')=='javascript:;'){
					var t=$(this);
					var c = t.closest('.l_drillDown');
					var co = (t.closest('ul').position().left - c.position().left)*-1;
					var bcd = t.closest('.l_drillDownWrapper').find('.l_ddbc');
					c.find('ul').removeClass('active').removeClass('displayed');
					var u=t.siblings('ul');
					u.addClass('displayed');
					$.fn.linkesDrillDown.sdd(u,true);
				}
			});
		});
	};
})(jQuery);