var model = require('../../model/mongo_config');
var config = require('../../config.json');

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
  var commande = config.repertoire_micmac+"/mm3d Tapioca All "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/"+jsonBesoin.blocs[0].liste_images.join(" "+config.)+" "+quantite_points_liaison.toString()+" "+"@ExitOnBrkp";

  // Persister dans la BD

  // Commande mise en place
  commande = config.repertoire_micmac+"/mm3d Tapas FraserBasic "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/"+jsonBesoin.blocs[0].liste_images.join(" "+config.repertoire_donnees+"/"+jsonBesoin.login+"/"+jsonBesoin.nom+"/")+" Out=MEP"+





}
