
var nbEtalonnage = 0;

// Callback pour le drag image
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Callback pour le drop image

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

var gestionCameras = function(fichier) {
	var dragZone 	  = document.getElementById('drag-zone-etalonnage');
	var nbEtalonnages = document.getElementById('nbEtalonnages');
	
	var drag_zone_etalonnage1 = document.getElementById('nbEtalonnages');

}(jQuery);
