// Fichier à renommer en dropanduploadfiles.js par exemple

// a faire : gestion de l'extension


// Tableau des extensions possibles (filtrage par type mime pas vraiment possible avec raw files)
var tabExtensions =  ["JPG","JPEG","jpg","jpeg","cr2","CR2","arw","ARW","TIF","TIFF","tif","tiff"];
var nomsFichierInseres = [];
// Nombre de fichiers importés
var nbFichiers= 0;

// Ajoute un fichier à la liste du bas, indique import en cours et lance l'upload
var importeFichier = function(fichier) {
	var numFichier = nbFichiers++;
	var tabExtension = fichier.name.split(".");
	var extension 	 = tabExtension[tabExtension.length - 1];
	
	if (tabExtensions.indexOf(extension) == -1)// Mauvaise extension
	{
		$("#listeImageImporteesDiv").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\" alert-big-warning pull-right\">extension non gérée</span>"+fichier.name+"</a>");
	}
	else if (nomsFichierInseres.indexOf(fichier.name) != -1)// Nom de fichier deja pris
	{
		$("#listeImageImporteesDiv").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\" alert-big-warning pull-right\">nom de fichier existant</span>"+fichier.name+"</a>");
	}
	// Tout est ok on importe vraiment
	else
	{
		$("#listeImageImporteesDiv").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\" alert-en-cours pull-right\">import en cours</span>"+fichier.name+"</a>");
		nomsFichierInseres.push(fichier.name);
		
		var fd = new FormData();
		
		fd.append("envoiFichier", "true");// flag d'envoi de fichier
		fd.append("_id", document.forms['idchantier'].elements[0].value);// identifiant du chantier
		fd.append("fichier", fichier);
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/nouveau_chantier_upload_img', true);
		
		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				var percentComplete = (e.loaded / e.total) * 100;
				console.log(percentComplete + '% uploaded');
			}
		};
		
		xhr.onload = function() {
			if (this.status == 200) {
				/*var resp = JSON.parse(this.response);
				console.log('Server got:', resp);
				var image = document.createElement('img');
				image.src = resp.dataUrl;
				document.body.appendChild(image);
				*/
			};
		};
		
		xhr.send(fd); 
	}
}

// Gestion du drop de fichiers
var dropManagement = function(e) {
	e.preventDefault();
	this.className = 'upload-drop-zone';

	// pour chaque fichier droppé
	for(var j=0;j<e.dataTransfer.files.length;j++)
	{
			importeFichier(e.dataTransfer.files[j]);
	}
	// startUpload(e.dataTransfer.files)
}

var uploadClassDef = function($) {
        'use strict';
        
    
    // au début, il faut vider le champ input de type file multiple
    $("#js-upload-files").val("");


    // UPLOAD CLASS DEFINITION
    // ======================

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');

    var startUpload = function(files) {
        console.log(files)
    }

    uploadForm.addEventListener('submit', function(e) {
        var uploadFiles = document.getElementById('js-upload-files').files;
        e.preventDefault()
		for(var j=0;j<uploadFiles.length;j++)importeFichier(uploadFiles[j]);

        //startUpload(uploadFiles)
    })

	// Lachage de fichier dans la zone de drop
    dropZone.ondrop = dropManagement;
    
	// On se balade avec un fichier sur la zone de drop
    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    }
	// On quitte la zone de drop
    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    }

}(jQuery);
