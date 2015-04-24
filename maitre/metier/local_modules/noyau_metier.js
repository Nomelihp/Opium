var model = require('../../model/mongo_config');
var config = require('../../config.json');
var model = require('../../model/mongo_config');
var dbOperations = require('./dbOperations');
var fs = require('fs');

exports.besoin2jobs = function(jsonBesoin){

  // On ne fait les calculs que pour les produits que l'utilisateur
  // veut récupéré

  // On récupère la liste des images
  var liste_images=[];
  liste_images = dbOperations.toListeImages(jsonBesoin);

  // On récupère la liste des images pour l'etalonnage
  var liste_images_etalonnage;
  liste_images_etalonnage = dbOperations.toListeImagesEtalonnage(jsonBesoin);

  // Dans tous les cas le calcul des images de liaison est obligatoire
  var id_chantier = jsonBesoin.id_chantier;

  // Quantité des points de liaison
  var quantite_points_liaison;
  if(jsonBesoin.quantite_points_liaison == "1"){
    quantite_points_liaison = Math.round(parseInt(jsonBesoin.liste_images[0].exif["exif image width"])/5) ;
  }else if(jsonBesoin.quantite_points_liaison == "2"){
    quantite_points_liaison = Math.round(parseInt(jsonBesoin.liste_images[0].exif["exif image width"])/3);
  }else if(jsonBesoin.quantite_points_liaison == "3"){
    quantite_points_liaison = Math.round(parseInt(jsonBesoin.liste_images[0].exif["exif image width"])/2);
  }else{
    quantite_points_liaison = -1;
  }
  // Auto-etalonnage
  var type_auto_etalonage;
  // Tableau des commandes
  var commandes=[];

  for(var i = 0; i < jsonBesoin.etalonnage.length ;i++){
    if(jsonBesoin.etalonnage[i].auto_etalonnage == "1"){
      if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "standard"){
        if(liste_images_etalonnage.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd \'"+liste_images.join("|")+"\' Out=MEP "+"@ExitOnBrkp");
        }else if(dbOperations.inArray(liste_images_etalonnage[0],liste_images)){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd \'"+liste_images_etalonnage.join("|")+"\' Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }else{
          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images_etalonnage.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd \'"+liste_images_etalonnage.join("|")+"\' Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }


      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fisheye"){
        if(liste_images_etalonnage.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic \'"+liste_images.join("|")+"\' Out=MEP "+"@ExitOnBrkp");
        }else if(dbOperations.inArray(liste_images_etalonnage[0],liste_images)){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic \'"+liste_images_etalonnage.join("|")+"\' Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }else{
          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images_etalonnage.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FishEyeBasic \'"+liste_images_etalonnage.join("|")+"\' Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FishEyeBasic \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");
        }

      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fraserbasic"){
        if(liste_images_etalonnage.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic \'"+liste_images.join("|")+"\' Out=MEP "+"@ExitOnBrkp");
        }else if(dbOperations.inArray(liste_images_etalonnage[0],liste_images)){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic \'"+liste_images_etalonnage.join("|")+"\' Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }else{
          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images_etalonnage.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic \'"+liste_images_etalonnage.join("|")+"\' Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");
        }
      }
    }
    // Fichier de calibration
    /** ATTENTION ICI IL FAUT QU'UN DOSSIER SOIT CREER DANS UTILISATEUR **/
    else{
      commandes.push(config.repertoire_micmac+"mm3d Tapioca All RadialStd \'"+liste_images.join("|")+"\' "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
      commandes.push(config.repertoire_micmac+"mm3d Tapas "+jsonBesoin.type_auto_etalonage+" \'"+liste_images.join("|")+"\' InCal=Calib Out=MEP "+"@ExitOnBrkp");
    }

    // Commande pour le calcul d'un nuage de points
    commandes.push(config.repertoire_micmac+"mm3d AperiCloud \'"+liste_images.join("|")+"\' MEP");


  }
  // Persister dans la BD
  var job;
  for(var i=0 ; i<commandes.length; i++){
    job = new model.jobs(dbOperations.toJSON(jsonBesoin._id, commandes[i], 0, '',config.login,(i+1).toString()));
    job.save(function(err, job){
      if(err) throw console.log('Erreur lors de l\'enregistrement des jobs Verifiez les paramètres de votre BD');
      console.log('Enregistrement de jobs dans la BD réussi !')

    });
  }

}

exports.appariement_dense=function(jsonBesoin){
  var liste_images=[];
  var job2;
  var commandes_appariement = [];
  var taille_nuage;
  liste_images=dbOperations.toListeImages(jsonBesoin);
  if(jsonBesoin.taille_nuage=='1'){
    taille_nuage = "QuickMac";
  }else if(jsonBesoin.taille_nuage=='2'){
    taille_nuage = "MicMac"
  }else{
    taille_nuage = "BigMac";
  }

  commandes_appariement.push(config.repertoire_micmac+"mm3d PIMs "+taille_nuage+" \'"+liste_images.join('|')+"\' MEP Masq3D=AperiCloud_MEP_selectionInfo.xml @ExitOnBrkp");
  commandes_appariement.push(config.repertoire_micmac+"mm3d Pims2Ply "+taille_nuage+" @ExitOnBrkp");
  // Commande pour générer le fichier du masque à partir du JSON
  for(var k=0;k<commandes_appariement.length;k++){
    job2 = new model.jobs(dbOperations.toJSON(jsonBesoin._id,commandes_appariement[k],0,'',config.login,(k+1).toString()));
    job2.save(function(err,job2){
      if(err) throw console.log('Erreur lors de l\'enregistrement de la commande d\'appariement dans la BD. Verifiez que le serveur de la BD est allumé et que les pramètres d\'accès sont bons');
      console.log('Enregistrement du job de l\'appariement dense dans la DB réussit !')
    });
  }
}
