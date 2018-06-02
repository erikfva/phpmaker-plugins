/*
 * TableHeadFixer
 * https://github.com/90arther/jquery.tableheadfixer
 *
 * Copyright (c) 2015 90arther@gmail.com OR caiweiguo@youmi.net
 * Licensed under the MIT license.
 */

;(function($) {

    'use strict';

    $.fn.extend({

        tableHeadFixer : function(options) {
            var th          =  this.find('thead'), 
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
                $(options.container || window).on('scroll', function() {
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

                var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
                if(window.self !== window.top){
                	top = Math.max(window.top.document.body.scrollTop, window.top.document.documentElement.scrollTop) - 1;
                }
                var left = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
                   topValue = (top > offset.top) ? (top - offset.top) : 0;
                if(typeof options.beforeTransform == 'function' ){
                    topValue = options.beforeTransform(topValue);
                }
                th.css({
                    //'position'          : 'relative',
                    //'top'               : topValue,
                    'transform'         : 'translate(0, '+ (topValue) +'px)',
                    'box-shadow' : topValue > 0? '0 12px 15px 0 rgba(0,0,0,.24), 0 17px 50px 0 rgba(0,0,0,.19)' : 'none',
                    /*'background-color'  : options.bgColor,*/
                    'z-index'           : options['z-index']
                });

            }


        }

    });

})(jQuery);
