var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');
var model = require('../model/mongo_config');
var noyau_metier = require('./local_modules/noyau_metier');

// Chemin vers le répertoire des données
var repertoire_donnees = json.repertoire_donnees;

// Chemin vers le répertoire de micmac
var repertoire_micmac = json.repertoire_micmac;

// Récupérer le port d'écoute depuis ../config.json
var listen_port = parseInt(json.metier);
var notif_port = parseInt(json.MMManager_metier);

console.log(listen_port);

var server = messenger.createListener(listen_port);
var client = messenger.createSpeaker(notif_port);

var Besoin;
console.log('avant la notif');
server.on('notification',function(message, data){
  console.log('notif recue');
  model.besoins.find({ etat: '2' }, function(err, besoin) {
    if (err) throw err;
    console.log('notification reçue');
    for(var i=0; i<besoin.length; i++){
      Besoin = new model.jobs(besoin[i]);
      noyau_metier.besoin2jobs(Besoin);
      Besoin.findOneAndUpdate({_id:JSON.parse(besoin[i])._id},{etat:'3'},function(err,besoin){
        if(err) throw err;
      });
    }

  });

});
