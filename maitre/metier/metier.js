var messenger = require('messenger');
var fs = require('fs');
var json = require('../config.json');
var model = require('../model/mongo_config');
var noyau_metier = require('./local_modules/noyau_metier');
var js2xml = require('js2xmlparser');

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
    if (err) console.log('probleme lors de la rcerche dans la BD des besoins avec etat=2');
    for(var i=0; i<besoin.length; i++){
      model.besoins.findByIdAndUpdate(besoin[i]._id, { etat: '4' }, function(err, besoin) {
        if (err) console.log('Erreur lors de la mise à jour du champs etat dans esclave');

        });
      Besoin = new model.besoins(besoin[i]);
      noyau_metier.besoin2jobs(Besoin);
      setTimeout(function(){
        client.request('notification', {boulot:"oui"}, function(data){
      });
    }, 2000);
    }
  });
  // Appariement dense
  model.besoins.find({etat:'8'}, function(err, besoin2){
    if(err) console.log('erreur dans recherche dans la BD des elements avec etat=8');
    for(var k=0;k<besoin2.length;k++){

      Besoin2 = new model.besoins(besoin2[i]);
      fs.writeFile(config.repertoire_donnees+"/"+config.login+"/"+Besoin2._id+"/AperiCloud_MEP_selectionInfo.xml",js2xml("SelectionInfo",Besoin2.masque3D.SelectionInfo),function(err){
        if(err) console.log('Erreur dans l\'enregistrement du fichier masque');
        console.log('enregistrement du fichier maque réussit !');
      });
      }
      //noyau_metier.appariement_dense(Besoin2);
      setTimeout(function(){
        client.request('notification', {boulot:"oui"}, function(data){
          
      });
    }, 2000);
    
  });
  // remontée d'information
  var flag_reussi = 1;
  var flag_erreur = 0;
  var Besoin3;
  var Job3;

  model.besoins.find({etat:'4'},function(error2,besoin3){
  
  if(error2) console.log('[ERROR= metier[model.besoins.find({etat:\'4\'},...]] = Probleme lors de la recherche des besoins avec etat = 4 [Vérifiez la connexion à votre BD]');

  for (var l=0;l<besoin3.length;l++){
    Besoin3 = new model.besoins(besoin3[l]);
    model.jobs.find({id_chantier:Besoin3._id},function(error3,job2){
      
      if(error3) console.log('[ERROR= metier[model.jobs.find({id_chantier:Besoin3._id}]] = Probleme lors de la recherche des jobs avec id_chantier [Vérifiez la connexion à votre BD]');
        
        var flag_reussi = 1;
        var flag_erreur = 0;

      for(var m=0;m<job2.length;m++){
        Job3 = new model.jobs(job2[m]);
        if(Job3.etat=='0' || Job3.etat=='1')
          flag_reussi = 0;
        if(Job3.etat=='3'){
          flag_ereeur = 1;
          break;}

      }
    });
    if(flag_reussi == 1){
      model.besoins.findByIdAndUpdate(Besoin3._id,{etat:'6'},function(error4){
        if(error4) console.log('[ERROR= metier[model.besoins.findByIdAndUpdate(Besoin3._id,{etat=\'6\'}]] = Probleme lors de la mise à jour de l\'etat à 6 [Vérifiez la connexion à votre BD]');
      });

    }
    if(flag_erreur == 1){
      model.besoins.findByIdAndUpdate(Besoin3._id,{etat:'7'},function(error5){
        if(error5) console.log('[ERROR= metier[model.besoins.findByIdAndUpdate(Besoin3._id,{etat=\'7\'}]] = Probleme lors de la mise à jour de l\'etat à 7 [Vérifiez la connexion à votre BD]');

      });

    }
  }

  });


});
