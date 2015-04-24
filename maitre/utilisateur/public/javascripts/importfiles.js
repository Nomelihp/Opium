// Fichier à renommer en dropanduploadfiles.js par exemple

// a faire : gestion de l'extension


// Tableau des extensions possibles (filtrage par type mime pas vraiment possible avec raw files)
var tabExtensions =  ["JPG","JPEG","jpg","jpeg","cr2","CR2","arw","ARW","TIF","TIFF","tif","tiff"];
var nomsFichierInseres = [];
// Nombre de fichiers importés
var nbFichiers= 0;
var nbFichiersCalib= 0;

// Ajoute un fichier à la liste du bas, indique import en cours et lance l'upload
var importeFichier = function(fichier) {
	var numFichier = nbFichiers++;
	var tabExtension = fichier.name.split(".");
	var extension 	 = tabExtension[tabExtension.length - 1];
	
	if (tabExtensions.indexOf(extension) == -1)// Mauvaise extension
	{
		$("#listeImageImporteesDiv").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\"badge alert-big-warning pull-right\">extension non gérée</span>"+fichier.name+"</a>");
	}
	else if (nomsFichierInseres.indexOf(fichier.name) != -1)// Nom de fichier deja pris
	{
		$("#listeImageImporteesDiv").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\"badge alert-big-warning pull-right\">nom de fichier existant</span>"+fichier.name+"</a>");
	}
	// Tout est ok on importe vraiment
	else
	{
		$("#listeImageImporteesDiv").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span id=\"etatFichier_"+numFichier+"\" class=\"badge alert-en-cours pull-right\">import en cours</span>"+fichier.name+"</a>");
		nomsFichierInseres.push(fichier.name);
		
		var fd = new FormData();
		
		fd.append("envoiFichier", "true");// flag d'envoi de fichier
		fd.append("_id", $("#idChantier").val());// identifiant du chantier
		fd.append("fichier", fichier);
		fd.append("isCalib", "0");//ce n'est pas une image pour la calibration
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/nouveau_chantier_upload_img', true);
		
		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				var percentComplete = (e.loaded / e.total) * 100;
				$("#etatFichier_"+numFichier).html(percentComplete+" %");
				if (percentComplete == 100)
				{
					$("#fichier_"+numFichier).removeClass("list-group-item-warning");
					$("#fichier_"+numFichier).addClass("list-group-item-success");
					$("#etatFichier_"+numFichier).removeClass("alert-en-cours");
					$("#etatFichier_"+numFichier).addClass("alert-success");
					$("#etatFichier_"+numFichier).html("OK");
				}
			}
		};
		xhr.onreadystatechange = function (aEvt) {
			if (xhr.readyState == 4) {
			 if(xhr.status == 200)
			  ;//dump(xhr.responseText);
			 else
			  ;//dump("Erreur pendant le chargement de la page.\n");
		  }
		};

		xhr.send(fd); 
	}
}

// Pour importer les images pour calibration
var importeFichier2 = function(fichier) {
	var numFichier = nbFichiersCalib++;
	var tabExtension = fichier.name.split(".");
	var extension 	 = tabExtension[tabExtension.length - 1];
	
	if (tabExtensions.indexOf(extension) == -1)// Mauvaise extension
	{
		$("#listeImageImporteesCalib").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\"badge alert-big-warning pull-right\">extension non gérée</span>"+fichier.name+"</a>");
	}
	else if (nomsFichierInseres.indexOf(fichier.name) != -1)// Nom de fichier deja pris
	{
		$("#listeImageImporteesCalib").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-warning\"><span class=\"badge alert-big-warning pull-right\">nom de fichier existant</span>"+fichier.name+"</a>");
	}
	// Tout est ok on importe vraiment
	else
	{
		$("#listeImageImporteesCalib").append("<a id=\"fichier_"+numFichier+"\" href=\"#\" class=\"list-group-item list-group-item-success\"><span id=\"etatFichier_"+numFichier+"\" class=\"badge alert-success pull-right\">OK</span>"+fichier.name+"</a>");
		nomsFichierInseres.push(fichier.name);
		
		var fd = new FormData();
		
		fd.append("envoiFichier", "true");// flag d'envoi de fichier
		fd.append("_id", $("#idChantier").val());// identifiant du chantier
		fd.append("fichier", fichier);
		fd.append("isCalib", "1");//c'est une image pour la calibration
		
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/nouveau_chantier_upload_img', true);
		
		//Barre de progression pour Images Calib (à faire)
		// xhr.upload.onprogress = function(e) {
			// if (e.lengthComputable) {
				// var percentComplete = (e.loaded / e.total) * 100;
				// $("#etatFichier_"+numFichier).html(percentComplete+" %");
				// if (percentComplete == 100)
				// {
					// $("#fichier_"+numFichier).removeClass("list-group-item-warning");
					// $("#fichier_"+numFichier).addClass("list-group-item-success");
					// $("#etatFichier_"+numFichier).removeClass("alert-en-cours");
					// $("#etatFichier_"+numFichier).addClass("alert-success");
					// $("#etatFichier_"+numFichier).html("OK");
				// }
			// }
		// };
		// xhr.onreadystatechange = function (aEvt) {
			// if (xhr.readyState == 4) {
			 // if(xhr.status == 200)
			  // ;//dump(xhr.responseText);
			 // else
			  // ;//dump("Erreur pendant le chargement de la page.\n");
		  // }
		// };

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
