var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('chantiers', { title: 'Mes Chantiers' });
});

module.exports = router;
