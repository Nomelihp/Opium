var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');
var model = require('../model/mongo_config');

// Récupérer le chemin vers le répertoire des données
var repertoire_donnees = json.repertoire_donnees;

// Fonction pour récupérer le document de "jobs" qui correspond au nom d'un chantier donnné

var mod = model.besoins();

//function getJobsDocument( nom_chantier ){
//  return  model.besoins.find({ nom: nom_chantier });
//}


console.log(getJobsDocument('amjad'));

// Récupérer le port d'écoute depuis ../config.json
var listen_port = json.metier;
var notif_port = json.MMManager;

console.log(listen_port);

// Fonctions de traduction


var server = messenger.createListener(listen_port);

server.on('notification',function(message, data){
	
});
