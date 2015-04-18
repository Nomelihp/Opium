// Route permettant l'upload des images
// A faire : 
// génération exif
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


var apresUpload = function (file,req,res) {
  // On déplace le fichier dans le répertoire de l'utilisateur et du chantier correspondants
  
  // Récupération du nom de l'utilisateur à partir de l'identifiant du chantier
  Besoins.findById(req.body._id, function(err, b) {
	  if (err) throw err;
	
		var bes = new Besoins(b);
		var dir1 = params.repertoire_donnees+bes.login+"/"
		var dir2 = dir1+req.body._id+"/";
		
		// Creation des repertoires correspondant au chantier si ils n'existent pas
		if (!fs.existsSync(dir1)){
			fs.mkdirSync(dir1);
		}
		if (!fs.existsSync(dir2)){
			fs.mkdirSync(dir2);
		}
		// Copie du fichier
		fs.rename(params.repertoire_donnees+"tmp/"+file.name, dir2+file.originalname, function (err) {
		  if (err) throw err;
		  console.log('renamed complete');
		});
		// Récupération des métadonnées exif de l'image
		
		// Update de la collection besoins avec la nouvelle image et ses metadonnees exif
		var listeImg = [];
		if(bes.liste_images)// il y a déjà des images dans le document
		{
			listeImg = bes.liste_images;
		}
		listeImg.push({"nom":file.originalname});
		Besoins.findByIdAndUpdate(req.body._id, { liste_images: listeImg }, function(err, b) {
		  if (err) throw err;
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
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: apresUpload	
}));

router.get('/', function(req, res){
  ;
})

.post('/', function(req, res){
	
    console.log(req.body) // form fields
    console.log(req.files) // form files
    res.status(204).end()
});



module.exports = router;
