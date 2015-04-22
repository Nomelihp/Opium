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
        myListe += "<option value=''>Sélectionnez une image</option>";
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
    myListe += "<option value=''>Sélectionnez une balise</option>";
    for(var i=0; i<myExifKeys.length; i++){
        myListe += "<option value='"+myExifKeys[i]+"'>"+myExifKeys[i]+"</option>";
    }
    
    document.getElementById("nomsBalises").innerHTML = myListe;
}

function infosImage(imageName) {
    var myListe = "";
    var idChantier = $("#idChantier").val();
    infosChantier(idChantier,function(req){
        var mesBesoins = JSON.parse(req.responseText);
        //Pour mettre à jour l'interface...
        var liste_images = mesBesoins.liste_images;
        //On cherche l'exif de l'image selectionnée
        var i=0;
        while(i<liste_images.length && liste_images[i].nom != imageName) {
            i++;
        }
        var myImage = liste_images[i]["exif"];
        for(var i=0; i<myExifKeys.length; i++){
            if(typeof myImage[myExifKeys[i]] != "undefined"){
                myListe += "<tr><td>"+capitalizeFirstLetter(myExifKeys[i])+"</td><td>"+capitalizeFirstLetter(myImage[myExifKeys[i]])+"</td></tr>";
            }
        }
        if(myListe) {
            document.getElementById("infosImage").innerHTML = myListe;
        } else {
            document.getElementById("infosImage").innerHTML = "Aucune information disponible sur cette image.";
        }
    });
    
}

function infosBalise(baliseName) {
    var myListe = "";
    var idChantier = $("#idChantier").val();
    infosChantier(idChantier,function(req){
        var mesBesoins = JSON.parse(req.responseText);
        var info = false;
        //Pour mettre à jour l'interface...
        var liste_images = mesBesoins.liste_images;
        for(var i=0; i<liste_images.length; i++){
            if(typeof liste_images[i]["exif"][baliseName] != "undefined") { //si l'information est présente
                myListe += "<tr><td>"+liste_images[i]["nom"]+"</td><td>"+liste_images[i]["exif"][baliseName]+"</td></tr>";
                info = true; //au moins une des images contient l'info voulue
            } else {
                myListe += "<tr><td>"+liste_images[i]["nom"]+"</td><td>Inconnu</td></tr>";
            }
            
        }
        if(info) {
            document.getElementById("infosBalise").innerHTML = myListe;
        } else {
            document.getElementById("infosBalise").innerHTML = "Aucune des images importées ne contient cette information.";
        }
    });
}
