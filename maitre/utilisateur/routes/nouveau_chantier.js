var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');
var modele  = require('../../model/mongo_config');


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

		//modele.besoins.findByIdAndUpdate("ObjectId(\""+params._id+"\")", params, function(err, besoin) {
		modele.besoins.findByIdAndUpdate(params._id, params, function(err, besoin) {
		if (err) throw err;
		  // LOGS  A INSERER
		});

		res.send("{}");
	}
	// Nouveau chantier
	else
	{
		var besoin = new modele.besoins(params);
		besoin.save(function(err, doc, num){
			// LOGS  A INSERER
		});
		console.log(besoin.id);
		
		// on renvoie le numéro assigné au chantier
		res.send({_id:besoin.id});
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
