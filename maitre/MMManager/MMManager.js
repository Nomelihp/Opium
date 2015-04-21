var port = require('../config.json');
var messenger = require('messenger')

/**
 * a faire
 * function test_esclave_operationnel
 * function send_http
 * */

var comportementsMMM = require('./local_modules/comportements_mmm');
//var testsMMM 		 = require('./local_modules/tests_mmm');

// Ecoute des notifications de boulot à faire
var server = messenger.createListener(parseInt(port.MMManager));

comportementsMMM.findJobs();

server.on('notification',function(message,data){
	// Regarder dans jobs les mises à jours pour récupérer les jobs non assignés
		comportementsMMM.findJobs () ;
	
}); //end server.on
