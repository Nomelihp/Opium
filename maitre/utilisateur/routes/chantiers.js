var express = require('express');
var router = express.Router();
var params = require('../../config.json');

var modele  = require('../../model/mongo_config');
var Besoins = modele.besoins;


/* GET home page. */
router.get('/', function(req, res, next) {
	// Récupération des chantiers de l'utilisateur
	Besoins.find({ login: params.login }, function(err, besoins) {
		if (err) throw err;
		
		// On cree le tableau de besoins pour la vue
		besoinsVue = [];
		for (var i=0;i<besoins.length;i++)besoinsVue.push(new Besoins(besoins[i]));
		
		res.render('chantiers', { title: 'Mes Chantiers', chantiers:besoinsVue});
	});
	
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
