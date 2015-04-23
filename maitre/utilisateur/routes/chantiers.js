var express = require('express');
var router = express.Router();
var params = require('../../config.json');
var modele  = require('../../model/mongo_config');
var Besoins = modele.besoins;

// JSON de correspondance entre le type de fichier demandé et le chemin relatif dans un chantier MICMAC
var tabCorrespondanceFichiers = {"position":"AperiCloud_MEP.ply","nuage":"C3DC_QuickMac.ply","calibration":"Ori-calib/AutoCal180.xml"};


/* GET home page. */
router.get('/', function(req, res, next) {

	// Demande de fichier : nécessite idChantier et typeFichier
	if (req.query.getFichier)
	{	
			console.log("[info : Utilisateur / chantiers / get / ] recuperation de fichier "+req.query.typeFichier);

			var cheminFichier = params.repertoire_donnees+params.login+"/"+req.query.idChantier+"/"+tabCorrespondanceFichiers[req.query.typeFichier];
			 res.download(cheminFichier,tabCorrespondanceFichiers[req.query.typeFichier]);
			console.log(cheminFichier);		
			// http://localhost:3000/chantiers?getFichier=toto&typeFichier=nuagePly&idChantier=55374e343f5c1ba016f875d0
			// ENOENT, stat 'C:\Users\Hippolyte\Documents\GitHub\Opium\maitre\utilisateur\img_micmac\55374e343f5c1ba016f875d0\localuser\AperiCloud_MEP.ply'
	}
	else
	{

		console.log("[info : Utilisateur / chantiers / get / ] recuperation des chantiers de l utilisateur "+params.login);
		// Récupération des chantiers de l'utilisateur
		Besoins.find({ login: params.login }, function(err, besoins) {
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

	/*res.send('../result_micmac/'+params.login+'/'+params._id+'/AperiCloud_MEP.ply');*/
	/*if (paramsbody._id){

	//../result_micmac/localuser/55361c5d72f6bcfc01dea967/AperiCloud_MEP.ply
	}*/
	
})
.post('/',function(req, res, next) {
	var params   = req.body;
	
	if ((params._id) && (params.demandeBesoin))// Demande de renvoi besoin en JSON
	{
		console.log("[info : Utilisateur / chantiers / post / ] recuperation du chantier "+params._id);
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
	else if ((params._id) && (params.suppressionChantier))// Suppression de chantier
	{
		console.log("[info : Utilisateur / chantiers / post / ] suppression du chantier "+params._id);
		
		Besoins.findOneAndRemove({ _id : params._id }, function(err) {
				if (err)
				{
					console.log("[ERREUR : Utilisateur / chantiers / post / ] Probleme recup besoin bd[mongo tourne?]");
					res.status(400).end();
				}
				else
				{
				  console.log("[info : Utilisateur / chantiers / post / ] Suppression chantier "+params._id+ " ok");
				  res.status(200).end();
				}
		});
	}
})

module.exports = router;
