var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');

 //  Nécessaire pour notifier le module métier
var messenger = require('messenger');

// Nécessaire pour la notification du module métier
var module_metier = messenger.createSpeaker(params.metier);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('OK');
  console.log(req.query);	

  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
});


// Notifie le module métier qu'il y a du boulot : A PLACER A LA DERNIERE VALIDATION DE L'UTILISATEUR
/*module_metier.request('notification', {boulot:"oui"}, function(data){
    console.log(data);
  });
*/

module.exports = router;
