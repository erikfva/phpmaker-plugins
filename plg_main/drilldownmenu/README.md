#Slidx#

Slidx en un simple menú deslizable.

* [Info](#info)  
* [Primeros Pasos](#primeros-pasos)  
* [Estilos CSS](#estilos-css)  
* [Configuración](#configuraci%C3%B3n)  
* [Bugs y Soporte](#bugs-y-soporte) 
* [Créditos](#cr%C3%A9ditos)  

###Info
* Versión 3.0
* Necesita jQuery
* [Demo](http://ivarcia.github.io/jquery-slidx/)
* [Descarga](https://raw.githubusercontent.com/ivarcia/jquery-slidx/master/slidx.js) ([.min](https://raw.githubusercontent.com/ivarcia/jquery-slidx/master/slidx.min.js))
* [Soporte](https://plus.google.com/communities/104938291205143609131/stream/8879dc2d-fed4-43a4-ba36-eca77af7d9db)
* [Licencia MIT](http://opensource.org/licenses/MIT)  

###Primeros Pasos###
1. Asegúrate de que tienes **jQuery** en tu página web.
2. Añade el script **Slidx** a tu página web.  
`<script type="text/javascript" src="js/slidx.js"></script>`
3. Añade el **id** `slidx_button` al elemento que va a abrir el menú.
4. Añade el **id** `slidx_menu` al elemento que contenga el menú.
5. Añade los estilos que quieras al menú
6. Puedes cambiar la configuración por defecto en el archivo `slidx.js`  

Ejemplo:
```HTML
<button id="slidx_button">Menú</button>

<nav id="slidx_menu">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
</nav>
```

###Estilos CSS###
Añade en tu hoja de estilos el id `#slidx_menu` y dale los estilos que quieras. A continuación hay algunas recomendaciones:

* Es aconsejable que añadas un color de fondo al menú para mejorar su aspecto.  
```CSS
#slidx_menu {  
  background-color: grey;  
}
```
* Es importante que añadas `display: block` a los elementos que hay dentro del menú (sean `<li>`, `<a>`, etc.) para que aparezcan uno debajo de otro.

* Puedes jugar con el `padding` superior e inferior, así como con los bordes, para mejorar el aspecto de tu menú.
```CSS
#slidx_menu a {
  display: block;
  padding: 20px 0px;
  border-bottom: 1px solid black;
}
```

###Configuración###
A continuación se explican las configuraciones por defecto que se pueden modificar en el archivo `slidx.js`.  
* `var button = '#slidx_button'` Elemento en el que **pulsamos** para abrir y cerrar el menú.  
* `var menu = '#slidx_menu'` Elemento que contiene el **menú** responsive.  
* `var mode = 'click'` Escribe **'click'** o **'hover'** si quieres que se abra en menú al pulsar el botón o al pasar por encima de él.  
* `var side = 'right'` Indica de que **lado** está el menú (**'right'** o **'left'**).  
* `var buttonMove = 'yes'` Indica si quieres que también se mueva el botón cuando abres el menú en modo 'click' ('yes' o 'no')
* `var shadow = 'yes'` Indica si se crea una **sombra** en el resto de la página cuando se abre el menú (**'yes'** o **'no'**).  
* `var opacity = 0.6` **Opacidad** de la sombra que se crea en el resto de la página cuando se abre el menú (0=transparente, 1=opaco).  
* `var size = 250` **Ancho** del menú (en píxeles).  
* `var speed = 0.5` **Velocidad** de apertura y cierre (en segundos).  
* `var normalTime = 0` Tiempo que tarda el menú en abrirse/cerrarse cuando pulsamos el botón (en ms. recomendable dejar en 0).  
* `var menuTime = 300` Tiempo que tarda el menú en cerrarse cuando pulsamos un elemento dentro del menu (en ms.).  
* `var menuTop = 0` Espaciado entre la parte superior del menú y la parte superior de la pantalla (en px. por defecto = 0)  
* `var menuBottom = 0` Espaciado entre la parte inferior del menú y la parte inferior de la pantalla (en px. por defecto = 0)  
* `var zIndexMenu = 98` z-index del menú (el botón lleva 1 número menos al número que introduzcas, y la sombra, 2 menos.)  

> Es importante **no cambiar los estilos CSS** que se introducen desde el propio *script* ya que son los mínimos imprescindibles para que funcione correctamente.

###Bugs y Soporte
Puedes avisar de cualquier *bug* o error en la sección *[issues](https://github.com/ivarcia/jquery-slidx/issues)* del repositorio de GitHub, o consultar dudas en la [comunidad de Google+](https://plus.google.com/communities/104938291205143609131/stream/8879dc2d-fed4-43a4-ba36-eca77af7d9db).

###Créditos
Autor: Iván Barcia  
> [Website](http://ivanbarcia.eu)  
> [Google+](https://plus.google.com/+IvanBarcia)  
> [Twitter](https://twitter.com/ivarcia)  
> [Github](https://github.com/ivarcia/)
