/*
 * TableHeadFixer
 * https://github.com/90arther/jquery.tableheadfixer
 *
 * Copyright (c) 2015 90arther@gmail.com OR caiweiguo@youmi.net
 * Licensed under the MIT license.
 */


// 业务需求： 当页面往下滚动时，我们的表格会被挡住，我们需要它一直固定在顶部。
// 设计：
// 1、添加浏览器滚屏事件，实时获取已滚动屏幕的长宽
// 2、设置头部相对定位
// 3、头部th标签统一设置top属性为： 已滚动页面高度 减去 表格顶部距离页面顶部的距离
//
//
// @Options:
//      @bgColor: 背景颜色
//      @z-index: z-index值

;(function($) {

    'use strict';

    $.fn.extend({

        tableHeadFixer : function(options) {
            var th          =  this.find('thead'), //this.find('th:first').parent(),     // 获取表头th标签
                delayTimer  =  null,                // 事件节流
                defaults    =  {
                'bgColor'   : '#eee',               // 表头的背景颜色
                'z-index'   : '1'                   // 表头的z-index数
              },
              table = this;

            options = $.extend({}, defaults, options);


            // 判断是否存在th标签，如果存在，则进去下一步，否则，输出‘请按照规范写html结构’
            if(th.length === 0) {

                if(!!window.console) {
                    console.log('No se ha encontrado el elemento thead.');
                }

            } else {
            		if(window.self !== window.top){
            			$(window.top).on('scroll', function() {
                    fixHead();
                	});
            		}

                // 添加屏幕滚动事件监听器
                $(window).on('scroll', function() {
                    fixHead();
                });

                $(window).resize(function() {
                  clearTimeout(window.resizedFinished);
                  window.resizedFinished = setTimeout(function(){
                    fixHead();
                  }, 250);
                });
                
								fixHead();
            }


            function fixHead() {
              var offset      =  table.offset();
              //console.log(window.parent.jQuery(window.frameElement).offset().top, window.top.document.body.scrollTop, window.top.document.documentElement.scrollTop )
              	

                var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                if(window.self !== window.top){
                	top = Math.max(window.top.document.body.scrollTop, window.top.document.documentElement.scrollTop);
                }
                var left = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
                   topValue = (top > offset.top) ? (top - offset.top - 1) : 0;
                //console.log(table.offset())

                th.css({
                    //'position'          : 'relative',
                    //'top'               : topValue,
                    'transform'         : 'translate(0, '+ (topValue) +'px)',
                    /*'background-color'  : options.bgColor,*/
                    'z-index'           : options['z-index']
                });

            }


        }

    });

})(jQuery);
