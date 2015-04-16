// Fichier à renommer en dropanduploadfiles.js par exemple
// Gestion du choix de fichier image à uploader par l'utilisateur

var dropManagement = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';

		e.dataTransfer.files.forEach(function(element, index, array) {
			console.log("a[" + index + "] = " + element);
		});
		
        // startUpload(e.dataTransfer.files)
    }

var uploadClassDef = function($) {
    'use strict';

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

        startUpload(uploadFiles)
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
