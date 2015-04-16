var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');

// Module de test de nouveau chantier node
router.get('/', function(req, res, next) {

  res.render('test_nouveau_chantier', { title: 'test_nouveau_chantier' });
})


module.exports = router;
