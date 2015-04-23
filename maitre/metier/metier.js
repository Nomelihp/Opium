var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');
var model = require('../model/mongo_config');
var noyau_metier = require('./local_modules/noyau_metier');
var js2xml = require('js2xmlparser');
var config = require('../config.json');

// Chemin vers le répertoire des données
var repertoire_donnees = json.repertoire_donnees;

// Chemin vers le répertoire de micmac
var repertoire_micmac = json.repertoire_micmac;

// Récupérer le port d'écoute depuis ../config.json
var listen_port = parseInt(json.metier);
var notif_port = parseInt(json.MMManager_metier);


var server = messenger.createListener(listen_port);
var client = messenger.createSpeaker(notif_port);

var Besoin;
// Une deuxième fois pour l'appariemet dense
var Besoin2;
console.log('avant la notif');
server.on('notification',function(message, data){
  console.log('notification reçue de l\'utilisateur');
  // Calcul des points de liaison + mise en place + calibration + AperiCloud
  model.besoins.find({ etat: '2' }, function(err, besoin) {
    if (err) console.log('[ERROR: metier[model.besoins.find({ etat: \'2\' }] probleme lors de la rcerche dans la BD des besoins avec etat:2]');
    for(var i=0; i<besoin.length; i++){
      model.besoins.findByIdAndUpdate(besoin[i]._id, { etat: '4' }, function(err, besoin) {
        if (err) console.log('Erreur lors de la mise à jour du champs etat dans esclave');
        console.log('[info: metier[model.besoins.findByIdAndUpdate(besoin[i]._id, { etat: \'4\' }]: mise à jour du champs etat:4 de besoin réussi]')

        });
      Besoin = new model.besoins(besoin[i]);
      noyau_metier.besoin2jobs(Besoin);
      console.log('[info: metier[noyau_metier.besoin2jobs]: Le besoin '+Besoin._id+' traduit en jobs avec succès]');
      setTimeout(function(){
        client.request('notification', {boulot:"oui"}, function(data){
        console.log('[info: metier[client.request]: Notification envoyée à MMManager]');
      });
    }, 2000);
    }
  });

  // remontée d'information
  var flag_reussi = 1;
  var flag_erreur = 0;
  var Besoin3;
  var Job3;
  var erreur_job


  model.besoins.find({etat:'4'},function(error2,besoin3){

  if(error2) console.log('[ERROR= metier[model.besoins.find({etat:\'4\'},...]] = Probleme lors de la recherche des besoins avec etat = 4 [Vérifiez la connexion à votre BD]');

  for (var l=0;l<besoin3.length;l++){
    Besoin3 = new model.besoins(besoin3[l]);
    model.jobs.find({id_chantier:Besoin3._id},function(error3,job2){

      if(error3) console.log('[ERROR= metier[model.jobs.find({id_chantier:Besoin3._id}]] = Probleme lors de la recherche des jobs avec id_chantier [Vérifiez la connexion à votre BD]');

        flag_reussi = 1;
        flag_erreur = 0;
        erreur_job='';

      for(var m=0;m<job2.length;m++){
        Job3 = new model.jobs(job2[m]);
        if(Job3.etat=='0' || Job3.etat=='1')
          flag_reussi = 0;
        if(Job3.etat=='3'){
          flag_erreur = 1;
          erreur_job=Job3.erreur;
          break;}

      }
    });
    if(flag_reussi == 1){
      model.besoins.findByIdAndUpdate(Besoin3._id,{etat:'6'},function(error4){
        if(error4) console.log('[ERROR= metier[model.besoins.findByIdAndUpdate(Besoin3._id,{etat=\'6\'}]] = Probleme lors de la mise à jour de l\'etat à 6 [Vérifiez la connexion à votre BD]');

        fs.exists(config.repertoire_donnees+"/"+Besoin3.login+"/"+Besoin3._id+"/Ori-MEP/Residu.xml",function(exists){
          if(!exists){
            model.besoins.findByIdAndUpdate(Besoin3._id,{residus:''},function(error5){

            });
          }
        });
      });

    }
    if(flag_erreur == 1){
      model.besoins.findByIdAndUpdate(Besoin3._id,$and[{etat:'7'},{message_erreur:erreur_job}],function(error5){
        if(error5) console.log('[ERROR= metier[model.besoins.findByIdAndUpdate(Besoin3._id,{etat=\'7\'}]] = Probleme lors de la mise à jour de l\'etat à 7 [Vérifiez la connexion à votre BD]');

      });

    }
  }

  });

  // Appariement dense
  model.besoins.find({etat:'10'}, function(err, besoin2){
    if(err) console.log('erreur dans recherche dans la BD des elements avec etat=8');
    for(var k=0;k<besoin2.length;k++){

      Besoin2 = new model.besoins(besoin2[k]);
      fs.writeFile(config.repertoire_donnees+config.login+"/"+Besoin2._id+"/AperiCloud_MEP_selectionInfo.xml",js2xml("SelectionInfo",Besoin2.masque3D.SelectionInfo),function(err){
        if(err) console.log('[ERREUR: Erreur dans l\'enregistrement du fichier masque]');
        console.log('enregistrement du fichier masque réussit !'+config.repertoire_donnees+'/'+config.login+'/'+Besoin2._id+'/AperiCloud_MEP_selectionInfo.xml');
      });

        noyau_metier.appariement_dense(Besoin2);
        setTimeout(function(){
          client.request('notification', {boulot:"oui"}, function(data){
            console.log('[info: metier.js: Notification Envoyée a l u tilsiateur pour l appriement sense]');

          });
         }, 2000);
      }
  });

});
