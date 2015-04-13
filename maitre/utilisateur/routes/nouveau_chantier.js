var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('OK');
  console.log(req.query.test);	

  res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
});

module.exports = router;
