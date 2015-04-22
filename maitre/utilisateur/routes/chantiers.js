var express = require('express');
var router = express.Router();
var params = require('../../config.json');
var modele  = require('../../model/mongo_config');
var Besoins = modele.besoins;

// JSON de correspondance entre le type de fichier demandé et le chemin relatif dans un chantier MICMAC
var tabCorrespondanceFichiers = {"nuagePly":"Ori-Malt-TrucMuche/AperiCloudTrucMuche.ply","fichier2":"Ori-Malt-TrucMuche/machin.xml"};


/* GET home page. */
router.get('/', function(req, res, next) {

	// Demande de fichier : nécessite idChantier et typeFichier
	if (req.query.getFichier)
	{
		console.log(req.query.typeFichier);
			var cheminFichier = params.repertoire_donnees+req.query.idChantier+"/"+params.login+"/"+tabCorrespondanceFichiers[req.query.typeFichier];
			res.render('chantiers',cheminFichier);
			console.log(cheminFichier);		
	}
	else
	{
		console.log('else');	
		// Récupération des chantiers de l'utilisateur
		Besoins.find({ login: params.login }, function(err, besoins) {
			if (err) throw err;
			
			// On cree le tableau de besoins pour la vue
			besoinsVue = [];
			for (var i=0;i<besoins.length;i++)besoinsVue.push(new Besoins(besoins[i]));
			
			res.render('chantiers', { title: 'Mes Chantiers', chantiers:besoinsVue});
		});
	}

	/*res.send('../result_micmac/'+params.login+'/'+params._id+'/AperiCloud_MEP.ply');*/
	/*if (paramsbody._id){

	//../result_micmac/localuser/55361c5d72f6bcfc01dea967/AperiCloud_MEP.ply
	}*/
	
})
.post('/',function(req, res, next) {
	var params   = req.body;
	
	if ((params._id) && (params.demandeBesoin))// Demande de renvoi besoin en JSON
	{
		// on attaque la base pour envoyer les métadonnées exif
		Besoins.findById(req.body._id, function(err, b) {
			var bes = new Besoins(b); 
			res.status(200).json(bes).end();
		})
		
	}

})

module.exports = router;
