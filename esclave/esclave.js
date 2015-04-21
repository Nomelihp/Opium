var express    	  = require('express');
var comportements = require('./local_modules/comportements_esclave');
var config		  = require('./config_esclave');
var ip 			  = require('ip');

var app 		  = express();

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

// Réquête de demande de job lancée par le maitre
app.post('/recoitJob', function(req, res) {
	// On vérifie que la requête a bien été initiée par le maitre
	if (req.connection.remoteAddress == config.maitre_ip)
	{
		console.log("coucou");
		console.log(req);	
	}
	res.status(204).end();
	
});

app.listen(parseInt(config.esclave_port)); 
