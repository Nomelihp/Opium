var express    	  = require('express');
var bodyParser 	  = require('body-parser');

var comportements = require('./local_modules/comportements_esclave');
var config		  = require('./config_esclave');
var ip 			  = require('ip');

var app 		  = express();


// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  next()
})


app.get('/', function(req, res) {
    comportements.pageHTML(res,"");
});

// Inscription de l'esclave aupres du maitre (requete lancée depuis l'esclave)
app.get('/inscription', function(req, res) {
	
	comportements.inscription(res,function(resExpress,responseHttpGet){
			if (responseHttpGet.statusCode == 204) comportements.pageHTML(resExpress,"inscription ok");
			else if (responseHttpGet.statusCode == 400) comportements.pageHTML(resExpress,"pb d'inscription (déjà inscrit??)");
	}); 
});

// Desinscription de l'esclave aupres du maitre
app.get('/desinscription', function(req, res) {
	
	comportements.desinscription(res,function(resExpress,responseHttpGet){
			if (responseHttpGet.statusCode == 204) comportements.pageHTML(resExpress,"desinscription ok");
			else if (responseHttpGet.statusCode == 400) comportements.pageHTML(resExpress,"pb... l esclave etait il bien inscrit???");
	}); 
});

// Réquête de demande de job lancée par le maitre
app.post('/recoitJob', function(req, res) {
	// On veut de l'IP v4
	var IP = (req.connection.remoteAddress === '::' ? '::ffff:' : '') + '127.0.0.1';
	
	// On vérifie que la requête a bien été initiée par le maitre
	if (IP == config.maitre_ip)
	{
		comportements.lanceJob(req, res);
	}
	else res.status(400).end();// retour requete http pb
	
});

app.listen(parseInt(config.esclave_port)); 
