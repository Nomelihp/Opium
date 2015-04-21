var config 	  = require('../config.json');
var messenger = require('messenger')
var express   = require('express');

/**
 * a faire
 * function test_esclave_operationnel
 * function send_http
 * */

var comportementsMMM = require('./local_modules/comportements_mmm');
//var testsMMM 		 = require('./local_modules/tests_mmm');

// Ecoute des notifications de boulot à faire
var server = messenger.createListener(parseInt(config.MMManager_metier));


//  ---------------- Ecoute esclaves
var app = express();

// Inscription de l'esclave aupres du maitre
app.get('/inscriptionEsclave', function(req, res) {
	comportementsMMM.inscription("http://"+req.connection.remoteAddress+":"+req.query.port);
});

app.listen(parseInt(config.MMManager_esclave)); 

// ---------------- Réception des notifications du module métier
server.on('notification',function(message,data){
	// Regarder dans jobs les mises à jours pour récupérer les jobs non assignés
		comportementsMMM.findJobs () ;
	
}); // End server.on
