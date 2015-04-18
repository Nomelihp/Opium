var model = require('../../model/mongo_config');
var config = require('../../config.json');
var model = require('../../model/mongo_config');
var dbOperations = require('./dbOperations');

exports.besoin2jobs = function(jsonBesoin){

  // On ne fait les calculs que pour les produits que l'utilisateur
  // veut récupéré

  // Dans tous les cas le calcul des images de liaison est obligatoire
  var id_chantier = json.Besoin.id_chantier;

  // Quantité des points de liaison
  var quantite_points_liaison;
  if(jsonBesoin.quantite_points_liaison == "1"){
    quantite_points_liaison = 500 ;
  }else if(jsonBesoin.quantite_points_liaison == "2"){
    quantite_points_liaison = 1000;
  }else if(jsonBesoin.quantite_points_liaison == "3"){
    quantite_points_liaison = 1500;
  }else{
    quantite_points_liaison = 2000;
  }
  // Auto-etalonnage
  var type_auto_etalonage;
  // Tableau des commandes
  var commandes=[];

  for(var i = 0; i < jsonBesoin.etalonnage.legnth ;i++){
    if(jsonBesoin.etalonnage[i].auto_etalonnage == "1"){
      if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "standard"){
        if(jsonBesoin.etalonnage[i].liste_images.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp");
        }else{

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.etalonnage[i].liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas RadialStd "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }


      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fisheye"){
        if(jsonBesoin.etalonnage[i].liste_images.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp");
        }else{

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.etalonnage[i].liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FihEyeBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }
      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fraserbasic"){
        if(jsonBesoin.etalonnage[i].liste_images.length == 0){

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp");
        }else{

          commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.etalonnage[i].liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp");

          commandes.push(config.repertoire_micmac+"mm3d Tapas FraserBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");

        }
      }
    }
    // Fichier de calibration
    /** ATTENTION ICI IL FAUT QU'UN DOSSIER SOIT CREER DANS UTILISATEUR **/
    else{
      commandes.push(config.repertoire_micmac+"mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp");
      commandes.push(config.repertoire_micmac+"mm3d Tapas "+jsonBesoin.type_auto_etalonage+" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib Out=MEP "+"@ExitOnBrkp");
    }

    // Commande pour le calcul d'un nuage de points
    commande = config.repertoire_micmac+"mm3d AperiCloud "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" MEP";


  }
  // Persister dans la BD
  for(var i=0 ; i<commandes.length; i++){
    model.jobs.save(dbOperations.toJSON(jsonBesoin._id, commandes[i], 0, ''),function(err, job){
      if(err) throw err;

    });
  }
}

exports.appariement = function(jsonBesoin){


}

chantier
{
  _id: "1",
  login: "blabla",
  nom: "bla",
  date: "455656"
  etat: 1:En attente de l'utilisateur, 2:Calcul en cours, 3:Non exécuté, 4:Calcul terminé avec succès, 5:Echec,
  commentaires: "lablablabla"
  type: "statue" OU "façade",
  liste_images: ["rien.JPG","nimportekoi.RAW"]
  masque: "22D" OU "3D"
  quantite_points_liaison: 1: Faible, 2:Moyen, 3:Important, 4:Maximale,
  mise_a_echelle: 0:Non, 1:Oui,
  basculement: 0:Non, 1:Oui

  etalonnage:[
          {
            id: "1",
            nom= "",
            auto_etalonage: 0: Non, 1: Oui,
            type_auto_etalonnage: "standard", "fisheye", "fraserbasic",
            liste_images: ["rien.JPG","nimportekoi.RAW"]
            capteur:{
                      focale_reelle: 33,
                      dimensions: [15,199],
                    }
          }
          ,
          {
            //Un autre bloc semblable à celui d'en haut
          }

        ]
}
