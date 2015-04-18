// Route permettant l'upload des images
// A faire : 
// maj bd
// creation du tableau image quand pas encore dimage
// renvoi exif

var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');
var modele  = require('../../model/mongo_config');
var Besoins = modele.besoins;

var express = require('express');
var multer  = require('multer');
var fs 		= require('fs');	

// Extraction des métadonnées exif
var exif 	= require('exif2');	


var apresUpload = function (file,req,res) {
  // On déplace le fichier dans le répertoire de l'utilisateur et du chantier correspondants
  
  // Récupération du nom de l'utilisateur à partir de l'identifiant du chantier
  Besoins.findById(req.body._id, function(err, b) {
	  if (err) throw err;
	
		var bes = new Besoins(b);
		var dir1 = params.repertoire_donnees+bes.login+"/"
		var dir2 = dir1+req.body._id+"/";
		var cheminFinalImg = dir2+file.originalname;
		
		// Creation des repertoires correspondant au chantier si ils n'existent pas
		if (!fs.existsSync(dir1)){
			fs.mkdirSync(dir1);
		}
		if (!fs.existsSync(dir2)){
			fs.mkdirSync(dir2);
		}
		// Copie du fichier
		fs.rename(params.repertoire_donnees+"tmp/"+file.name, cheminFinalImg, function (err) {
			if (err) throw err;
			// Récupération des métadonnées exif de l'image
			exif(cheminFinalImg, function(err, donneesExif){
				
				// Update de la collection besoins avec la nouvelle image et ses metadonnees exif
				var listeImg = [];
				if(bes.liste_images)// il y a déjà des images dans le document
				{
					listeImg = bes.liste_images;
				}
				listeImg.push({"nom":file.originalname,"exif":donneesExif});
				
				Besoins.findByIdAndUpdate(req.body._id, { liste_images: listeImg }, function(err, b) {
					if (err) throw err;
				});
			})
		});
	});
  done=true;
}

// Paramétrage de l'upload via multer
router.use(multer({ dest: params.repertoire_donnees+"tmp/",
	// on renomme le fichier
	rename:function(fieldname, filename, req, res){
		// on renomme le fichier avec la date du moment
		return filename.replace(/\W+/g, '-')+"_"+ Date.now();
	},
	onFileUploadComplete: apresUpload	
}));

router.get('/', function(req, res){
  ;
})

.post('/', function(req, res){
	
    res.status(204).end()
});



module.exports = router;
