var config 	  = require('../config.json');
var messenger = require('messenger')
var express   = require('express');
var http   	  = require('http');

/**
 * a faire
 * maitre et esclave / émission : envoi de jobs à l'esclave
 * maitre et esclave / réception : retour des résultats
 * esclave / desinscription + test_esclave_operationnel
 *
*/

var comportementsMMM = require('./local_modules/comportements_mmm');
//var testsMMM 		 = require('./local_modules/tests_mmm');

// Ecoute des notifications de boulot à faire
var server = messenger.createListener(parseInt(config.MMManager_metier));


//  ---------------- Ecoute esclaves
var app = express();

// Inscription de l'esclave aupres du maitre
app.get('/inscriptionEsclave', function(req, res) {
	comportementsMMM.inscription(req.connection.remoteAddress,req.query.port,res,function(){
				
		});
});

// Fonction de test pour l'envoi de job à l'esclave
app.get('/testEnvoiJob', function(req, res) {


	var postData = JSON.stringify({
		"idJob":"333",
		"idChantier":"55374fad83bc6ec91902ed82",
		"login":"localuser",
		"commande": "ls"
	});

	var options = {
		method: 'POST',
		hostname: '127.0.0.1',
		port: 9208,
		path: '/recoitJob',
		headers: {'Content-Type': 'application/json'}
	};

	var req = http.request(
		options,
		function(res){
			if (res.statusCode == 400)
				console.log("mettre etat job à 3");
			else if (res.statusCode == 204)
				console.log("mettre etat job à 1");
		}
	);

	req.on('error', function(err) {
	  //;console.log('problem', err);
	});

	req.write(postData);
	req.end();
		
	res.status(200).end("coucouc");

});

// Fonction de test pour l'envoi de job à l'esclave
app.get('/testLaunch', function(req, res) {
	comportementsMMM.launchNewFirstJobs () ;
	res.status(200).end("coucouc");
});


// Code retour de l'esclave
app.get('/retourEsclave', comportementsMMM.recoitResultat);



app.listen(parseInt(config.MMManager_esclave)); 

// ---------------- Réception des notifications du module métier
server.on('notification',function(message,data){
	// Regarder dans jobs les mises à jours pour récupérer les jobs non assignés
		comportementsMMM.launchNewFirstJobs () ;
	
}); // End server.on
