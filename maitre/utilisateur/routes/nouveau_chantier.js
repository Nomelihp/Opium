var express = require('express');
var router = express.Router();

// Nécessaire pour notifier le module métier
var messenger = require('messenger');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('OK');
  console.log(req.query.test);	

  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
});

// Notifie le module métier qu'il y a du boulot
client = messenger.createSpeaker(9205);
client.request('nouveaux chantiers a traiter', {boulot:"oui"}, function(data){
    console.log(data);
  });
// Fin notification

module.exports = router;
