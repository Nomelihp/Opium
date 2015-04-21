var model = require('../../model/mongo_config');
var config = require('../../config.json');
var model = require('../../model/mongo_config');
var dbOperations = require('./dbOperations');

exports.besoin2jobs = function(jsonBesoin){

  // On ne fait les calculs que pour les produits que l'utilisateur
  // veut récupéré

  // On récupère la liste des images
  var liste_images=[];
  liste_images = dbOperations.toListeImages(jsonBesoin);

  // On récupère la liste des images pour l'etalonnage
  var liste_images_etalonnage;
  liste_images_etalonnage = dbOperations.toListeImages(jsonBesoin);

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

  console.log(jsonBesoin.etalonnage.length);

  for(var i = 0; i < jsonBesoin.etalonnage.length ;i++){
    if(jsonBesoin.etalonnage[i].auto_etalonnage == "1"){
      if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "standard"){
        if(liste_images_etalonnage.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp");
        }else if(dbOperations.inArray(jsonBesoin.etalonnage.liste_images[0],liste_images)){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }else{
          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }


      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fisheye"){
        if(liste_images_etalonnage.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp");
        }else if(dbOperations.inArray(liste_images_etalonnage[0],liste_images)){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }else{
          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FishEyeBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FishEyeBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");
        }

      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fraserbasic"){
        if(liste_images_etalonnage.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp");
        }else if(dbOperations.inArray(liste_images_etalonnage[0],liste_images)){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }else{
          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images_etalonnage.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");
        }
      }
    }
    // Fichier de calibration
    /** ATTENTION ICI IL FAUT QU'UN DOSSIER SOIT CREER DANS UTILISATEUR **/
    else{
      commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
      commandes.push(config.repertoire_micmac+"mm3d Tapas "+jsonBesoin.type_auto_etalonage+" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");
    }

    // Commande pour le calcul d'un nuage de points
    commandes.push(config.repertoire_micmac+"mm3d AperiCloud "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin._id+"/"+liste_images.join(" "+config.repertoire_donnees+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" MEP");


  }
  // Persister dans la BD
  var job;
  for(var i=0 ; i<commandes.length; i++){
    job = new model.jobs(dbOperations.toJSON(jsonBesoin._id, commandes[i], 0, ''));
    job.save(function(err, job){
      if(err) throw err;

    });
  }
}

exports.appariement = function(jsonBesoin){



}
