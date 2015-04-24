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
//génère la liste des noms des images, et l'insère dans 1) le menu déroulant de sélection pour la calibration et 2) dans le menu déroulant de visualisation des exifs
function nomsImages(besoins) {
    var myListe = "";
    var liste_images = besoins.liste_images;
    if(liste_images){
        myListe += "<option value=''>Sélectionnez une image</option>"; //Option par défaut
        for(var i=0; i<liste_images.length; i++){
            myListe += "<option value='"+liste_images[i].nom+"'>"+liste_images[i].nom+"</option>";
        }
        
        document.getElementById("nomsImages").innerHTML = myListe;
        document.getElementById("menuDeroulantImages").innerHTML = '<select id="menuSelectImages" class="form-control" size="6" multiple >'+myListe+'</select>';
    }
}

function nomsBalises(besoins) {
    var myListe = "";
    myListe += "<option value=''>Sélectionnez une balise</option>";
    for(var i=0; i<myExifKeys.length; i++){
        myListe += "<option value='"+myExifKeys[i]+"'>"+myExifKeys[i]+"</option>";
    }
    
    document.getElementById("nomsBalises").innerHTML = myListe;
}

//génère la liste des informations exif sur l'image, et le place dans le tableau infosImage
function infosImage(imageName) {
    var myListe = ""; //la liste des infos, màj au fur et à mesure
    var idChantier = $("#idChantier").val();
    infosChantier(idChantier,function(req){
        var mesBesoins = JSON.parse(req.responseText);
        var liste_images = mesBesoins.liste_images;
        //On cherche l'image selectionnée
        var i=0;
        while(i<liste_images.length && liste_images[i].nom != imageName) {
            i++;
        }
        var myImage = liste_images[i]["exif"]; //les infos exifs de l'image
        for(var i=0; i<myExifKeys.length; i++){
            if(typeof myImage[myExifKeys[i]] != "undefined"){ //si l'info existe
                myListe += "<tr><td>"+capitalizeFirstLetter(myExifKeys[i])+"</td><td>"+capitalizeFirstLetter(myImage[myExifKeys[i]])+"</td></tr>";
            }
        }
        if(myListe) { //si on a au moins une info
            document.getElementById("infosImage").innerHTML = myListe;
        } else {
            document.getElementById("infosImage").innerHTML = "Aucune information disponible sur cette image.";
        }
    });
    
}

function infosBalise(baliseName) {
    var myListe = ""; //la liste des infos, màj au fur et à mesure
    var idChantier = $("#idChantier").val();
    infosChantier(idChantier,function(req){
        var mesBesoins = JSON.parse(req.responseText);
        var info = false;
        var liste_images = mesBesoins.liste_images; //on récupère la liste d'images
        for(var i=0; i<liste_images.length; i++){
            if(typeof liste_images[i]["exif"][baliseName] != "undefined") { //si l'information est présente
                myListe += "<tr><td>"+liste_images[i]["nom"]+"</td><td>"+liste_images[i]["exif"][baliseName]+"</td></tr>";
                info = true; //au moins une des images contient l'info voulue
            } else {
                myListe += "<tr><td>"+liste_images[i]["nom"]+"</td><td>Inconnu</td></tr>";
            }
            
        }
        if(info) { //si au moins une des images contenait l'info
            document.getElementById("infosBalise").innerHTML = myListe;
        } else {
            document.getElementById("infosBalise").innerHTML = "Aucune des images importées ne contient cette information.";
        }
    });
}
