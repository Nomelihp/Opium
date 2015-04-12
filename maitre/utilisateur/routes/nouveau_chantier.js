var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
});

module.exports = router;
