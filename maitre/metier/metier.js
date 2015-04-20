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
var listen_port = json.metier;
var notif_port = json.MMManager;

console.log(listen_port);

var server = messenger.createListener(listen_port);
var client = messenger.createSpeaker(notif_port);

var Besoin = new model.besoins();

server.on('notification',function(message, data){
  Besoin.find({ etat: '2' }, function(err, besoin) {
    if (err) throw err;
    for(var i=0; i<besoin.length; i++){
      noyau_metier.besoin2jobs(JSON.parse(besoin[i]));
      Besoin.findOneAndUpdate({_id:JSON.parse(besoin[i])._id},{etat:'3'},function(err,besoin){
        if(err) throw err;
      });
    }

    setInterval(function(){
      client.request('notification',function(data){


      });
    }, 1000);

  });

});
