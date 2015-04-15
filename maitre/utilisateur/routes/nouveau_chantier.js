var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');

 //  Nécessaire pour notifier le module métier
var messenger = require('messenger');

// Nécessaire pour la notification du module métier
var module_metier = messenger.createSpeaker(params.metier);

// Renvoi de l'interface pour la saisie d'un nouveau chantier
router.get('/', function(req, res, next) {

	//On récupère les informations envoyées dans le fromulaire par valider_onglet.js
	/*var chantier = req.query.chantier;
	console.log(chantier);
	var commentaire = req.query.commentaire;
	console.log(commentaire);
	var optionstatue = req.query.optionstatue;
	console.log(optionstatue);
	*/
	

  // vue nouveau chantier
  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
})
// Réception des éléments du formulaire
.post('/',function(req, res, next) {

	// parametres envoyés par le client sous forme de JSON
	var params =req.body;
	
	// chantier existant : on met à jour le document correspondant
	if (params.idChantier)
	{
		console.log(params.idChantier);
	}
	// Nouveau chantier
	else
	{
		
		// on renvoie le numéro assigné au chantier
		res.send({idChantier:0});
	}
	//next();
	// parser req.body pour tester idChantier dans les parametres ou pas
	
	
	
	//next(new Error('not implemented'));
})


// Notifie le module métier qu'il y a du boulot : A PLACER A LA DERNIERE VALIDATION DE L'UTILISATEUR
/*module_metier.request('notification', {boulot:"oui"}, function(data){
    console.log(data);
  });
*/

module.exports = router;
