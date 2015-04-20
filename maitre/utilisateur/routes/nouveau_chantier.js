var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');
var modele  = require('../../model/mongo_config');
var Besoins = modele.besoins;

// ------------  Pré-requis pour notification métier   ------------  
var messenger = require('messenger');
var module_metier = messenger.createSpeaker(params.metier);


//  --------------------------------------------------------------- 


// ------------  Renvoi de l'interface pour la saisie d'un nouveau chantier   ------------  
router.get('/', function(req, res, next) {

  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
})
// ------------  Réception des éléments du formulaire    ------------  
.post('/',function(req, res, next) {
	// parametres envoyés par le client sous forme de JSON
	var params   = req.body;
	params.login = "localuser";
	// chantier existant : on met à jour le document correspondant
	if (params._id)
	{
		// Cas d'une demande d'Exif
		if (params.demandeExif)
		{

			// on attaque la base pour envoyer les métadonnées exif
			Besoins.findById(req.body._id, function(err, b) {
				var bes = new Besoins(b); 
				if(bes.liste_images)
					res.status(200).send(bes.liste_images)	
				else res.status(200).send("")	
			})

		}
		// Cas d'une mise à jour de chantier
		else
		{
			var id = params._id;
			delete params._id;// on enleve l'id pour ne pas l'insérer dans les champs à updater
			//Besoins.findByIdAndUpdate("ObjectId(\""+params._id+"\")", params, function(err, besoin) {
			Besoins.findByIdAndUpdate(id, params, function(err, besoin) {
			if (err) throw err;
			  // LOGS  A INSERER
			});

			res.send("{}");
		}
	}
	// Nouveau chantier
	else
	{
		var besoin = new Besoins(params);
		besoin.save(function(err, doc, num){
			// LOGS  A INSERER
		});
		console.log(besoin.id);
		
		// on renvoie le numéro assigné au chantier
		res.type('json');  
		res.status(200).json({_id:besoin.id}).end()
	}
	//next();
	
	//next(new Error('not implemented'));
})


//  --------------------------------------------------------------- 

// Notifie le module métier qu'il y a du boulot : A PLACER A LA DERNIERE VALIDATION DE L'UTILISATEUR
/*module_metier.request('notification', {boulot:"oui"}, function(data){
    console.log(data);
  });
*/

module.exports = router;
