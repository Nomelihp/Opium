// Route permettant l'upload des images
// optimisation possible  moyen d'éviter une copie en utilisant changeDest de multer (en fait il faudrait passer
// le login quelque part... en session? parce que sinon nécessité d'intérogger la base)

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
  console.log("[info : Utilisateur / nouveau_chantier_upload / post / ] : image uploadee, traitements ...");
  // Récupération du nom de l'utilisateur à partir de l'identifiant du chantier
  Besoins.findById(req.body._id, function(err, b) {
	  if (err) console.log("[ERREUR : Utilisateur / nouveau_chantier_upload / post / ] : recuperation du chantier "+req.body._id+"[mongo tourne?]");
		else
		{
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
			// Copie du fichier vers son chemin définitif
			fs.rename(params.repertoire_donnees+"tmp/"+file.name, cheminFinalImg, function (err) {
				if (err)
					console.log("[ERREUR : Utilisateur / nouveau_chantier_upload / post / ] : renommage de l image "+params.repertoire_donnees+"tmp/"+file.name+" en "+cheminFinalImg+"[fichier source existant? repertoire destination cree??]");
				else
				{
					// Récupération des métadonnées exif de l'image
					exif(cheminFinalImg, function(err, donneesExif){		
						// Update de la collection besoins avec la nouvelle image et ses metadonnees exif
						//Pas d'update pour les images pour la calibration
						if(req.body.isCalib == "0"){
							var listeImg = [];
							if(bes.liste_images)// il y a déjà des images dans le document
							{
								listeImg = bes.liste_images;
							}
							var jsonImg = {"nom":file.originalname,"exif":donneesExif};
							listeImg.push(jsonImg);
							
							Besoins.findByIdAndUpdate(req.body._id,{$push: {liste_images: jsonImg}},{safe: true, upsert: true, new:true},function(err, b) {
								if (err)console.log("[ERREUR : Utilisateur / nouveau_chantier_upload / post / ] : mise a jour de la liste d images [mongo tourne??]");
								else  console.log("[info : Utilisateur / nouveau_chantier_upload / post / ] : image "+file.name+" uploadee, traitee et enregistree");
								}
							);
						}
						else console.log("[info : Utilisateur / nouveau_chantier_upload / post / ] : image "+file.name+" uploadee et traitee");
						
					})
				}
			});
	}
	});
  
  
}

// Paramétrage de l'upload via le middleware multer
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
	// on ne renvoie rien (lien difficile avec multer pour détecter l'upload vraiment fini à ce niveau)
	res.status(204).end()
});


module.exports = router;
