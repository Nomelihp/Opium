var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');

 //  Nécessaire pour notifier le module métier
var messenger = require('messenger');

// Nécessaire pour la notification du module métier
var module_metier = messenger.createSpeaker(params.metier);

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var chantier = req.query.chantier;
	console.log(chantier);
	var commentaire = req.query.commentaire;
	console.log(commentaire);
	var optionstatue = req.query.optionstatue;
	console.log(optionstatue);
	
  console.log('OK')	
  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
});

//router.post('/', function(req, res, next) {
//	console.log('POST');
//	res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
//}


// Notifie le module métier qu'il y a du boulot : A PLACER A LA DERNIERE VALIDATION DE L'UTILISATEUR
/*module_metier.request('notification', {boulot:"oui"}, function(data){
    console.log(data);
  });
*/

module.exports = router;
