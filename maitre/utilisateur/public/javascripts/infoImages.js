//liste des infos à extraire du exif
var myExifKeys = ["create date","file size","image size","camera model name","focal length","f number","iso","shutter speed","aperture","exposure time"];

function launchAll() {
	var idChantier = $("#idChantier").val();
	infosChantier(idChantier,function(req){
		var mesBesoins = JSON.parse(req.responseText);
        // Pour mettre à jour l'interface...
		nomsImages(mesBesoins);
		nomsBalises(mesBesoins);
	});
    
   
}

function nomsImages(besoins) {
    var myListe = "";
	var liste_images = besoins.liste_images;
	if(liste_images){
		for(var i=0; i<liste_images.length; i++){
			myListe += "<option value='"+liste_images[i].nom+"'>"+liste_images[i].nom+"</option>";
		}
		
		document.getElementById("nomsImages").innerHTML = myListe;
		document.getElementById("menuDeroulantImages").innerHTML = '<select id="menuSelectImages" class="form-control" size="6" multiple >'+myListe+'</select>';
    }
}

function nomsBalises(besoins) {
    var myListe = "";
    console.log("exifKeys",myExifKeys);
    for(var i=0; i<myExifKeys.length; i++){
        myListe += "<option value='"+myExifKeys[i]+"'>"+myExifKeys[i]+"</option>";
    }
    
    document.getElementById("nomsBalises").innerHTML = myListe;
}

function infosImage(imagePosition) {
	var myListe = "";
	var idChantier = $("#idChantier").val();
	infosChantier(idChantier,function(req){
		var mesBesoins = JSON.parse(req.responseText);
        //Pour mettre à jour l'interface...
		var liste_images = mesBesoins.liste_images;
		//On cherche l'exif de l'image selectionnée
		for(var i=0; i<liste_images.length; i++){
			if(liste_images[i].nom == imagePosition){
				var myImage = liste_images[i]["exif"];
				for(var i=0; i<myExifKeys.length; i++){
					myListe += "<tr><td>"+myExifKeys[i]+"</td><td>"+myImage[myExifKeys[i]]+"</td></tr>";
				}
			}
		}
    document.getElementById("infosImage").innerHTML = myListe;
	});
    
}

function infosBalise(baliseName) {
	var myListe = "";
    var idChantier = $("#idChantier").val();
	infosChantier(idChantier,function(req){
		var mesBesoins = JSON.parse(req.responseText);
        //Pour mettre à jour l'interface...
		var liste_images = mesBesoins.liste_images;
		for(var i=0; i<liste_images.length; i++){
			myListe += "<tr><td>"+liste_images[i]["nom"]+"</td><td>"+liste_images[i]["exif"][baliseName]+"</td></tr>";
		}
    
    document.getElementById("infosBalise").innerHTML = myListe;
	});
    
    
    
}

