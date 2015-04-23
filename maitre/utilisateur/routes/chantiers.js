var express 	= require('express');
var router 		= express.Router();
var config 		= require('../../config.json');
var modele  	= require('../../model/mongo_config');
var specialRmDir= require("./local_modules/rmdir_recursif.js");

var Besoins = modele.besoins;


// JSON de correspondance entre le type de fichier demandé et le chemin relatif dans un chantier MICMAC
var tabCorrespondanceFichiers = {"position":"AperiCloud_MEP.ply","nuage":"C3DC_QuickMac.ply","calibration":"Calibration.zip","liaison":"PointLiaison.zip","orientation":"Orientation.zip"};


/* GET home page. */
router.get('/', function(req, res, next) {

	// Demande de fichier : nécessite idChantier et typeFichier
	if (req.query.getFichier)
	{	
		// Code a executer
		console.log("[info : Utilisateur / chantiers / get / ] recuperation de fichier "+req.query.typeFichier);
		var cheminFichier = params.repertoire_donnees+params.login+"/"+req.query.idChantier+"/"+tabCorrespondanceFichiers[req.query.typeFichier];
		res.download(cheminFichier,tabCorrespondanceFichiers[req.query.typeFichier]);
	}
	else
	{
		console.log("[info : Utilisateur / chantiers / get / ] recuperation des chantiers de l utilisateur "+config.login);
		// Récupération des chantiers de l'utilisateur
		Besoins.find({ login: config.login }, function(err, besoins) {
			if (err)console.log("[ERREUR : Utilisateur / chantiers / get / ] pb recup chantiers bd [mongo tourne?]");
			else
			{
				console.log("[info : Utilisateur / chantiers / get / ] envoi des chantiers");
				// On cree le tableau de besoins pour la vue
				besoinsVue = [];
				for (var i=0;i<besoins.length;i++)besoinsVue.push(new Besoins(besoins[i]));
				
				res.render('chantiers', { title: 'Mes Chantiers', chantiers:besoinsVue});
			}
		});
	}
	
})
.post('/',function(req, res, next) {
	
	if ((req.body._id) && (req.body.demandeBesoin))// Demande de renvoi besoin en JSON
	{
		console.log("[info : Utilisateur / chantiers / post / ] recuperation du chantier "+req.body._id);
		// on attaque la base pour envoyer les métadonnées exif
		Besoins.findById(req.body._id, function(err, b) {
			if (err)
			{
				console.log("[ERREUR : Utilisateur / chantiers / post / ] Probleme recup besoin bd[mongo tourne?]");
				res.status(400).json({}).end();
			}
			else
			{
				var bes = new Besoins(b); 
				res.status(200).json(bes).end();
			}
		})
		
	}
	else if ((req.body._id) && (req.body.suppressionChantier))// Suppression de chantier
	{
		console.log("[info : Utilisateur / chantiers / post / ] suppression du chantier "+req.body._id);
		
		Besoins.findOneAndRemove({ _id : req.body._id }, function(err) {
				if (err)
				{
					console.log("[ERREUR : Utilisateur / chantiers / post / ] Probleme recup besoin bd[mongo tourne?]");
					res.status(400).end();
				}
				else
				{
					console.log("[info : Utilisateur / chantiers / post / ] Suppression chantier "+req.body._id+ " en base ok");
					var dir = config.repertoire_donnees+config.login+"/"+req.body._id;
					specialRmDir.deleteFolderRecursive(dir);
					res.status(204).end();
				}
		});
	}
})

module.exports = router;
