var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');
var model = require('../model/mongo_config');
var noyau_metier = require('./local_modules/noyau_metier');

// Chemin vers le répertoire des données
var repertoire_donnees = json.repertoire_donnees;

// Chemin vers le répertoire de micmac
var repertoire_micmac = json.repertoire_micmac;

// Fonction pour récupérer le document de "jobs" qui correspond au nom d'un chantier donnné
function getJobsDocument( nom_chantier ){
  return  model.besoins.find({ nom: nom_chantier });
}

// Fonction pour traduire les champs de jobs en JSON
function toJSON(id_chantier, commande, etat, erreur){
  var jsonString = "{'id_chantier':"+id_chantier+",'commande':"+commande+",'etat':"+etat+",'erreur':"+erreur+"}";
  return JSON.parse(jsonString);
}

// Fonction pour enregistrer le job dans la BD et changer le flag du besoin à 1
function setJobDocument(jsonJob){
  var job = new model.jobs(jsonJob);
  job.save(function(err,job){
    if(err) throw err;
    // Trouver et mettre à jour le flag de besoins (besoin prise en compte)
    model.besoins.findOneAndUpdate({id: job.id_chantier},{flag_PrisenCompte: 1},function(err,besoin){
      if(err) throw err;
    });
  });
}

//

// Récupérer le port d'écoute depuis ../config.json
var listen_port = json.metier;
var notif_port = json.MMManager;

console.log(listen_port);

var server = messenger.createListener(listen_port);

server.on('notification',function(message, data){

});
