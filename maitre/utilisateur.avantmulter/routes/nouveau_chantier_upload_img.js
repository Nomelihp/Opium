var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');
var modele  = require('../../model/mongo_config');

var express = require('express');
var multer  = require('multer');

var app = express()
app.use(multer({ dest: './uploads/'}))

router.get('/', function(req, res){
  res.send('hello world');
})

.post('/', function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files
    res.status(204).end()
});



module.exports = router;
