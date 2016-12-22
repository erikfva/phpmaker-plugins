//--------------INFO----------------//
// Desarrollador: Iván Barcia
// Sitio Web: http://ivanbarcia.eu
// Hecho en: Galicia, España

// Nombre: Slidx
// Versión: 3.0
// Sitio Web: https://github.com/ivarcia/codelab-slidx
//----------------------------------//


$(document).ready(function () {

    //------------------------------  CONFIGURACIÓN  -------------------------------//
    var button = '#slidx_button'; //Elemento en el que pulsamos para abrir y cerrar el menú.
    var menu = '#slidx_menu'; //Elemento que contiene el menú responsive.
    var mode = 'click' //Escribe 'click' o 'hover' si quieres que se abra en menú al pulsar el botón o al pasar por encima de él.
    var side = 'left' //Indica de que lado está el menú ('right' o 'left')
    var buttonMove = 'no' //Indica si quieres que también se mueva el botón cuando abres el menú en modo 'click' ('yes' o 'no')
    var shadow = 'yes' //Indica si se crea una sombra en el resto de la página, cuando se abre el menú ('yes' o 'no')
    var opacity = 0.6; //Opacidad de la sombra que se crea en el resto de la página con el menú abierto. (0=transparente 1=opaco)
    var size = 300; //Ancho del menú.
    var speed = 0.5; //Velocidad de apertura y cierre (en s.)
    var normalTime = 0; //Tiempo que tarda el menú en abrirse/cerrarse cuando pulsamos el botón (en ms. recomendable dejar en 0).
    var menuTime = 300; //Tiempo que tarda el menú en cerrarse cuando pulsamos un elemento dentro del menu (en ms.).
    var menuTop = 0; //Espaciado entre la parte superior del menú y la parte superior de la pantalla (en px. por defecto = 0)
    var menuBottom = 0; //Espaciado entre la parte inferior del menú y la parte inferior de la pantalla (en px. por defecto = 0)
    var zIndexMenu = 98; //z-index del menú (el botón lleva 1 número menos al número que introduzcas, y la sombra, 2 menos.)

    //Otras variables. (No toques esto, si no sabes lo que haces)
    var slidxOpen = "slidx_open";
    var slidxShadow = "slidx_shadow";
    var slidxShadowID = '#' + slidxShadow;
    var zIndexButton = zIndexMenu - 1;
    var zIndexShadow = zIndexMenu - 2;
    var speedM = speed * 1000;
    //------------------------------  ESTILOS CSS  -------------------------------//
    //Añadimos los estilos básicos por defecto al botón.
    if (buttonMove == 'yes') {
        $(button).css({
            'position': 'fixed',
            'top': '0px',
            'transition': speed + 's',
            'z-index': zIndexButton,
        });

        if (side == 'right') {
            $(button).css({
                'right': '0px',
            })
        }

        if (side !== 'right') {
            $(button).css({
                'left': '0px',
            })
        }
    }

    //Añadimos los  estilos básicos por defecto al menú.
    $(menu).css({
        'position': 'fixed',
        'top': menuTop + 'px',
        'bottom': menuBottom + 'px',
        'width': size + 'px',
        'max-width': '100%',
        'overflow-y': 'auto',
        'transition': speed + 's',
        'z-index': zIndexMenu,
    });

    //Si es derecho
    if (side == 'right') {
        $(menu).css({
            'right': '-' + size + 'px',
        })
    }

    //Si es izquierdo
    if (side !== 'right') {
        $(menu).css({
            'left': '-' + size + 'px',
        })
    }

    //------------------------------  FUNCIONES  -------------------------------//
    //Ésta es la función que abre el menú.
    function open() {
				$(menu).find('.goHome').trigger('click');
        if (side == 'right') {

            $(menu).animate({
                right: '0',
            }, normalTime);

            if (buttonMove == 'yes') {
                $(button).animate({
                    right: size,
                }, normalTime);
            }

        }

        if (side !== 'right') {

            $(menu).animate({
                left: '0',
            }, normalTime);

            if (buttonMove == 'yes') {
                $(button).animate({
                    left: size,
                }, normalTime);
            }
        }

        $(menu).addClass(slidxOpen);

        if (shadow == 'yes') {
            $("<div>", {
                id: slidxShadow, //atributo directo, igual que si fuéramos con attr(“id”)
                css: //propiedad de jQuery
                {
                    'position': 'fixed',
                    'top': '0px',
                    'width': '100%',
                    'height': '100%',
                    'background-color': '#000000',
                    'opacity': '0',
                    'z-index': zIndexShadow,
                },
            }).appendTo('html');

            $(slidxShadowID).fadeTo(speedM, opacity);
        }
    };

    //Ésta es la función que cierra el menú. (Hay dos versiones en función del tiempo de cierre)
    function close(delayTime) {
        if (side == 'right') {
            $(menu).animate({
                right: '-' + size,
            }, delayTime)

            if (buttonMove == 'yes') {
                $(button).animate({
                    right: 0,
                }, delayTime);
            }
        }

        if (side !== 'right') {
            $(menu).animate({
                left: '-' + size ,
            }, delayTime)

            if (buttonMove == 'yes') {
                $(button).animate({
                    left: 0,
                }, delayTime);
            }
        }

        $(menu).removeClass(slidxOpen);
        $(slidxShadowID).fadeOut(speedM);

        setTimeout(function () {
            $(slidxShadowID).remove();
        }, speedM);
    };

    //------------------------------  ACTIVADORES  -------------------------------//
    //--------------- Modo CLICK ---------------//
    if (mode == 'click') {
        // Al pulsar el button abrimos el menú si está cerrado, o lo cerramos si está abierto.
        $(button).click(function (event) {
            //No realiza la acción por defecto del botón
			
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
            if (!$(menu).hasClass(slidxOpen)) {
                open();
            } else {
                close(normalTime);
            }
        });

        //Al pulsar en un elemento del menú, también se cierra el menu.
        //Fíjate que el tiempo de cierre que introduzco es mayor que cuando lo cierro con el boton directamente, simplemente porque queda mejor visualmente
        $(menu).click(function (event) {

			if(!(  $(event.target).closest('li').is('.hasSubs') || $(event.target).is('.goHome') ))
            	close(menuTime);
        });
    }

    $(document).on('click', slidxShadowID, function () {
        close(normalTime);
    });


    //--------------- Modo HOVER ---------------//
    if (mode == 'hover') {
        // Al pasar el ratón por encima del botón abrimos el menú si está cerrado, o lo cerramos si está abierto.
        $(button).mouseover(function () {
            if (!$(menu).hasClass(slidxOpen)) {
                open();
            } else {
                close(normalTime);
            }
        });

        //Al sacar el ratón del menú, se cierra en menú.
        $(menu).mouseleave(function () {
            close(normalTime);
        });

        //Al pulsar en un elemento del menú, también se cierra el menu.
        //fíjate que el tiempo de cierre que introduzco es mayor que cuando lo cierro con el boton directamente, simplemente porque queda mejor visualmente
        $(menu).click(function () {
            close(menuTime);
        });
    };
});
