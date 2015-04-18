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

  // Génération de la commande des points de liaison
  var commande = config.repertoire_micmac+"/mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp";

  // Auto-etalonnage
  var type_auto_etalonage;
  for(var i = 0; i < jsonBesoin.etalonnage.legnth ;i++){
    if(jsonBesoin.etalonnage[i].auto_etalonnage == "1"){
      if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "standard"){
        if(jsonBesoin.etalonnage[i].liste_images.length == 0){

          commande = config.repertoire_micmac+"/mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp";

          commande = config.repertoire_micmac+"/mm3d Tapas RadialStd "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp";
        }else{

          commande = config.repertoire_micmac+"/mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp";

          commande = config.repertoire_micmac+"/mm3d Tapas RadialStd "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.etalonnage[i].liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=Calib "+"@ExitOnBrkp";

          commande = config.repertoire_micmac+"/mm3d Tapas RadialStd "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib "+"@ExitOnBrkp";

        }


      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fisheye"){

        commande = config.repertoire_micmac+"/mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp";

        commande = config.repertoire_micmac+"/mm3d Tapas Fish-Eye "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp";

      }else if(jsonBesoin.etalonnage[i].type_auto_etalonnage == "fraserbasic"){

        commande = config.repertoire_micmac+"/mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp";

        commande = config.repertoire_micmac+"/mm3d Tapas FraserBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp";

      }
    }
    // Fichier de calibration
    /** ATTENTION ICI IL FAUT QU'UN DOSSIER SOIT CREER DANS UTILISATEUR **/
    else{
      commande = config.repertoire_micmac+"/mm3d Tapas "+jsonBesoin.type_auto_etalonage+" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" InCal=Calib "+"@ExitOnBrkp";
    }



  }
  // Persister dans la BD
  model.jobs.save(dbOperations.toJSON(jsonBesoin._id, commande, 0, ''),function(err, job){
    if(err) throw err;


  });

  // Commande mise en place
  commande = config.repertoire_micmac+"/mm3d Tapas FraserBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP "+"@ExitOnBrkp";

  // Persister la mise en place dans la BD
  model.jobs.save(dbOperations.toJSON(jsonBesoin._id,commande,0,''),function(err,job){
    if(err) throw err;

  });

  // Commande pour le calcul d'un nuage de points
  commande = config.repertoire_micmac+"/mm3d AperiCloud "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin._id+"/"+jsonBesoin.liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" MEP";

  // Persister dans la BD
  model.jobs.save(dbOperations.toJSON(jsonBesoin._id,commande,0,''),function(err,job){
    if(err) throw err;

  });


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
