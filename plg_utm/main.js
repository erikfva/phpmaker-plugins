function validateDD(lon, lat){
    var longitud = parseFloat (lon);
    if (isNaN (longitud) || (lon < -180.0) || (180.0 <= lon) ) {
        alert ("Por favor ingrese una longitud valida.");
        return false;
    }
    var latitud = parseFloat (lat);	
    if (isNaN (latitud) || (lat < -90.0) || (90.0 < lat)) {
        alert ("Por favor ingrese una latitud valida.");
        return false;
    }
    return true;		
}
function validateXY(x, y){
    var x = parseFloat (x);
    if (isNaN (x) ) {
        alert ("Por favor ingrese una valor de X válido.");
        return false;
    }
    var y = parseFloat (y);	
    if (isNaN (y)) {
        alert ("Por favor ingrese una valor de Y válido.");
        return false;
    }
    return true;		
}
function Lat2UTM(){
    var lon = parseFloat(document.getElementById("lontxt").value);
    var lat = parseFloat(document.getElementById("lattxt").value);
    if (validateDD(lon, lat)){
        var xy = new Array(2);
        var zona = Math.floor ((lon + 180.0) / 6) + 1;
        zona = LatLonToUTMXY (DegToRad (lat), DegToRad (lon), zona, xy);
        //console.log(xy, zona);
        //para coordenadas metricas utilizar 3 decimales
        document.getElementById("xtxt").value = parseFloat(xy[0]).toFixed(3); 
        document.getElementById("ytxt").value = parseFloat(xy[1]).toFixed(3);

        var chkb = document.querySelector('input[id=zona' + zona + ']');

        if(chkb){
            $(chkb).prop('checked', true).click();
        } 
        else alert ("No se ha encontrado el componente visual para la zona " + zona);

    }
}
function UTM2Lat(){

    var x = parseFloat(document.getElementById("xtxt").value);
    var y = parseFloat(document.getElementById("ytxt").value);
    var chkb = jQuery( 'input[name=zona]:checked' )[0]; //document.querySelector('input[name=zona][checked]');
    var zona = parseFloat(0);

    if(chkb) zona = parseFloat(chkb.value);
    if(isNaN(zona) || zona==0 ){
        alert ("El valor de la zona UTM no es válido.");
        return false;
    }

    if (validateXY(x, y)){
        var latlon = new Array(2);
        //console.log(zona);
        UTMXYToLatLon (x, y, zona, true , latlon);	
        document.getElementById("lontxt").value = parseFloat(RadToDeg(latlon[1])).toFixed(8);
        document.getElementById("lattxt").value = parseFloat(RadToDeg(latlon[0])).toFixed(8);							
    }
}

function calcUTMCoord(op){
    var dlg = $('#calc-coord-dialog');
    dlg.data('onsave',op.onsave || null);
    dlg.data('lonel',op.lonel || null);
    dlg.data('latel',op.latel || null);
    dlg.modal('show');
}

function buildUTMDialog(){
    $('body').append($('#tpl-calc-coord').html());
    var dlg = $('#calc-coord-dialog').on('show.bs.modal', function(){
        if(dlg.data('lonel')){ //longitud element
            dlg.find('#lontxt').val( parseFloat($(dlg.data('lonel')).val()).toFixed(8) )
        }
        if(dlg.data('latel')){ //latitud element
            dlg.find('#lattxt').val( parseFloat($(dlg.data('latel')).val()).toFixed(8) )			
        }			
        
    });
    dlg.find('.modal-footer button').on('click', function(event) {
        var $button = $(event.target); // The clicked button
        dlg.one('hidden.bs.modal', function() {
            // Fire if the button element
            if($button.hasClass('btn-primary')){
                if(typeof dlg.data('onsave')== 'function'){
                    dlg.data('onsave')(dlg);
                }
                if(dlg.data('lonel')){
                    $(dlg.data('lonel')).val( dlg.find('#lontxt').val()  )
                }
                if(dlg.data('latel')){
                    $(dlg.data('latel')).val( dlg.find('#lattxt').val()  )
                }
            }
            dlg.data('onsave', null)
            .data('lonel', null)
            .data('latel', null);				

        });
    });
}