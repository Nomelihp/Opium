var express = require('express');
var router = express.Router();

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

module.exports = router;
