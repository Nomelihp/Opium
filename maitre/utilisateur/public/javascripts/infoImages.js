var myExif = JSON.parse(besoins.liste_images); //PAS LE BON PATH VERS EXIFS.
//liste des infos à extraire du exif
var myExifKeys = ["create date","file size","image size","camera model name","focal length","f number","iso","shutter speed","aperture","exposure time","sharpness","saturation","contrast","white balance","color space","orientation"];


var menuImages = function nomsImages() {
    
    var myListe = "";
    for(var i=0; i<myExif.length; i++){
        myListe += "<option value='"+i+"'>"+myExif[i]["nom"]+"</option>";
    }
    
    document.getElementById("nomsImages").innerHTML = myListe;
}

var menuBalises = function nomsBalises() {
    var myListe = "";
    for(var i=0; i<myExifKeys.length; i++){
        myListe += "<option value='"+myExifKeys[i]+"'>"+myExifKeys[i]+"</option>";
    }
    
    document.getElementById("nomsBalises").innerHTML = myListe;
}

function infosImage(imagePosition) {
    var myImage = myExif[i]["exif"];
    
    for(var i=0; i<myExifKeys.length; i++){
        myListe += "<tr><td>"+myExifKeys[i]+"</td><td>"+myImage[myExifKeys[i]]+"</td></tr>";
    }
    
    document.getElementById("infoImages").innerHTML = myListe;
}

function infosBalise(baliseName) {
    
    for(var i=0; i<myExif.length; i++){
        myListe += "<tr><td>"+myExif[i]["name"]+"</td><td>"+myExif[i]["exif"][baliseName]+"</td></tr>";
    }
    
    document.getElementById("infoImages").innerHTML = myListe;
}

