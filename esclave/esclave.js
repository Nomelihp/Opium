var express    	  = require('express');
var comportements = require('./local_modules/comportements_esclave');
var config		  = require('./config_esclave')
var ip 			  = require('ip');

var app 		  = express();

app.get('/', function(req, res) {
    comportements.pageHTML(res,"");
});

// Inscription de l'esclave aupres du maitre
app.get('/inscription', function(req, res) {
	comportements.inscription();
    comportements.pageHTML(res,"inscription ok");
});


app.listen(parseInt(config.esclave_port)); 
