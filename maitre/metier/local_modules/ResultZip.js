var fs = require('fs');
var archiver = require('archiver');
var nomPointLiaison = "PointLiaison.zip"; //Nom du zip des points de liaison
var nomCalibration = "Calibration.zip"; //Nom du zip de la Calibration
var nomOrientation = "Orientation.zip"; //Nom du zip de l'Orientation


/**
* Fonction qui génère les zip à partir des réultats
* Elle prend en paramètres le chemin vers le cahtniers
*/
exports.zipFiles = function (chemin_du_chantier,typeFichier) {



	switch(typeFichier) { 
			//---------------Points de liaison------------
        case "liaison":
        	var outputPointLiaison = fs.createWriteStream(chemin_du_chantier + '/' + nomPointLiaison);//__dirname est l'emplacement du module courant
        	var archive1 = archiver('zip');
        	archive1.pipe(outputPointLiaison);
        	archive1.bulk([
        	    { src: [ '**/*' ], cwd: chemin_du_chantier + '/' + 'Homol', expand: true }
        	]);
        	archive1.finalize();
   			break;

   			//-----------------Calibration--------------
        case "calibration":
        	console.log("[info : Utilisateur / chantiers / get / zipFiles ] zip des fichiers "+nomCalibration);
			var outputCalibration = fs.createWriteStream(chemin_du_chantier + '/' + nomCalibration);//__dirname est l'emplacement du module courant
			var archive2 = archiver('zip');
			archive2.pipe(outputCalibration);
			var listAutoCal = fs.readdirSync(chemin_du_chantier + '/Ori-MEP')
		
			var stingtofind = "AutoCal"
			for (i = 0; i < listAutoCal.length; i++){
				if (listAutoCal[i].indexOf(stingtofind) > -1){
					var file = chemin_du_chantier + '/Ori-MEP/' + listAutoCal[i] ;

					archive2.append(fs.createReadStream(file), { name: listAutoCal[i] })
				}
			}
			archive2.finalize();
			break;
			//----------------Orientation-----------------
        case "orientation":
			var outputOrientation = fs.createWriteStream(chemin_du_chantier + '/' + nomOrientation);//__dirname est l'emplacement du module courant
			var archive3 = archiver('zip');
			archive3.pipe(outputOrientation);
			var listOrientation = fs.readdirSync(chemin_du_chantier+ '/Ori-MEP')
			var stingtofind2 = "Orientation"
			for (i = 0; i < listOrientation.length; i++){
				if (listOrientation[i].indexOf(stingtofind2) > -1){
					var file = chemin_du_chantier + '/Ori-MEP/' + listOrientation[i] ;
					archive3.append(fs.createReadStream(file), { name: listOrientation[i] })
				}
			}
			archive3.finalize();
			break;
	}
	
}
