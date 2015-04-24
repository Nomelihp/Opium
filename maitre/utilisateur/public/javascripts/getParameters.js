//Met à jour le résumé des paramètres du chantier.
function onPageOpen(besoins) {
    
    var myTable =
    "<h4>Paramètres de base</h4>\n"+

    "<div class=\"table-responsive\">\n"+
    "<table class=\"table table-striped\">\n"+
    "\t<thead>\n"+
        "\t\t<tr>\n"+
            "\t\t\t<th>Paramètre</th>\n"+
            "\t\t\t<th>Valeur</th>\n"+
        "\t\t</tr>\n"+
    "\t</thead>\n"+
    "<tbody>\n";
    var myEtalon ="";
    
    var myResume = document.getElementById("resumeParam");
    
    //ajout nom
    var nom = besoins.nom;
    myTable = (nom)? ajout(myTable,"Nom",nom) : ajout(myTable,"Nom","NON DÉFINI","red");

    //ajout commentaire
    var commentaire = besoins.commentaire;
    if(commentaire) {
        myTable = ajout(myTable,"Commentaire",commentaire);
    }

    //ajout date
    myTable = ajout(myTable,"Projet créé le",besoins.date); //À CONVERTIR EN QUELQUE CHOSE DE LISIBLE

    //ajout etat du calcul
    switch(besoins.etat) {
        default:
        case "0":
			myTable = ajout(myTable,"État","Paramétrage incomplet","red");
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
            myTable = ajout(myTable,"État","Calculs de mise en place en cours");
            break;
        case "6":
            myTable = ajout(myTable,"État","Mise en place terminée avec succès. En attente de saisie de masque.","green");
            break;
        case "7":
            myTable = ajout(myTable,"État","ÉCHEC DE LA MISE EN PLACE","red");
            break;
        case "10":
			myTable = ajout(myTable,"État","Calculs appariement dense en cours");
            break;
        case "8":
            myTable = ajout(myTable,"État","Calculs terminés avec succès","green");
            break;
        case "9":
            myTable = ajout(myTable,"État","ÉCHEC DES CALCULS","red");
            break;
    }

    //ajout commentaires
    var commentaires = besoins.commentaires;
    if(commentaires) {
        myTable = ajout(myTable,"Commentaires",commentaires);
    }

    //ajout type (Statue/Facade)
    var type = besoins.type;
    if(type) {
        myTable = ajout(myTable,"Type",capitalizeFirstLetter(type));
    } else {
        myTable = ajout(myTable,"Type","NON DÉFINI","red");
    }

    //ajout liste images, sous forme de menu déroulant
    var liste_images = besoins.liste_images;
    if(liste_images) {
        menuDeroulant = "<select size='5'>\n"; //variable où stocker le menu en attendant de le mettre dans myTable

        for(var i=0; i<liste_images.length; i++) {
            menuDeroulant += "<option>"+liste_images[i].nom+"</option>\n";
        }
        
        menuDeroulant += "</select>"
        myTable = ajout(myTable,"Images",menuDeroulant);
    } else {
        myTable = ajout(myTable,"Images","PAS D'IMAGES IMPORTÉES","red");
        myTable = ajout(myTable,"","Si vous avez importé des images, attendez quelques instants, elles vont apparaître.");
    }

    //ajout masque (2D/3D). Si pas encore défini, 3D par défaut.
       myTable = ajout(myTable,"Masque", (besoins.masque=="22D")?"Deux masques 2D":"Un masque 3D");


    //ajout nombre points liaison
    switch(besoins.nombre_points_liaison) {
        case 1:
            myTable = ajout(myTable,"Nombre de points de liaison","Faible");
            break;
        case 2:
            myTable = ajout(myTable,"Nombre de points de liaison","Moyen");
            break;
        case 3:
            myTable = ajout(myTable,"Nombre de points de liaison","Important");
            break;
        case 4:
            myTable = ajout(myTable,"Nombre de points de liaison","Maximal");
            break;
    }

    //ajout mise à l'échelle. Non par défaut.
    myTable = ajout(myTable,"Mise à l'échelle",(besoins.mise_a_echelle == "1")?"Oui":"Non");


    //ajout basculement. Non par défaut.
    myTable = ajout(myTable,"Basculement",(besoins.basculement == "1")?"Oui":"Non");

    myTable += "</tbody></table></div>";
  
    var etalonnage = (besoins.etalonnage)?besoins.etalonnage[0]:false;
    if(etalonnage) { //if exists
        
        myEtalon +=
        "<h4>Étalonnage</h4>\n"+

        "<div class=\"table-responsive\">\n"+
        "<table class=\"table table-striped\">\n"+
        "\t<thead>\n"+
            "\t\t<tr>\n"+
                "\t\t\t<th>Paramètre</th>\n"+
                "\t\t\t<th>Valeur</th>\n"+
            "\t\t</tr>\n"+
        "\t</thead>\n"+
        "<tbody>\n";

        // SI AUTO-ETALONNAGE
        if(etalonnage.auto_etalonnage == "1") {
            myEtalon +=
            "\t\t<tr>\n" +
                "\t\t\t<td>Auto-étalonnage</td>\n";

            var type_etalon = etalonnage.type_auto_etalonnage;
            switch(type_etalon) {
                case "fisheye":
                    myEtalon += "\t\t\t<td>Fish-Eye</td>\n";
                    break;
                case "fraserbasic":
                    myEtalon += "\t\t\t<td>Fraser Basic</td>\n";
                    break;
                case "standard":
                default:
                    myEtalon += "\t\t\t<td>Standard</td>\n";
                    break;
            }
            myEtalon +=
            "\t\t</tr>\n"+
            "\t\t<tr>\n"+
                "\t\t\t<td>Images</td>\n";

            if(!etalonnage.liste_images || !etalonnage.liste_images.length) {
                myEtalon +=
                    "\t\t\t<td>Toutes</td>\n";
            } else {
                menuDeroulant = "<select size='3'>\n"; //variable où stocker le menu en attendant de le mettre dans myTable
                //transformation du string en array
                liste_images = etalonnage.liste_images;
                for(var i=0; i<liste_images.length; i++) {
                    menuDeroulant += "<option>"+liste_images[i]+"</option>\n";
                }
                menuDeroulant += "</select>";

                myEtalon += "\t\t\t<td>"+menuDeroulant+"</td>\n";
            }
            myEtalon += "\t\t</tr>\n";

            //AJOUT INFO CAPTEUR
            var capteur = etalonnage.capteur;
            if(capteur) {
                capteur = capteur[0];

                var focale = etalonnage.capteur.focale_reelle;
                myEtalon +=
                "\t\t<tr>\n"+
                    "\t\t\t<td>Focale capteur</td>\n" +           
					"\t\t\t<td>"+((focale)?focale:"Auto")+"</td>\n"+
				"\t\t</tr>\n";

                var dimensions = etalonnage.capteur.dimensions;
                myEtalon +=
                "\t\t<tr>\n"+
                    "\t\t\t<td>Dimensions capteur</td>\n"+             
					"\t\t\t<td>"+((dimensions[0])?dimensions[0]+"×"+dimensions[1]:"Auto")+"</td>\n" +
				"\t\t</tr>\n";
            } else {
                myEtalon +=
                "\t\t<tr>\n"+
                    "\t\t\t<td>Focale capteur</td>\n"+
                    "\t\t\t<td>Auto</td>\n"+
                "\t\t</tr>\n"+
                "\t\t<tr>\n"+
                    "\t\t\t<td>Dimensions capteur</td>\n"+
                    "\t\t\t<td>Auto</td>\n"+
                "\t\t</tr>\n";
            }

        // SI FICHIER D'ETALONNAGE    
        } else if(etalonnage.auto_etalonnage == 0) {
            //FETCH FILE
            myEtalon+=
            "\t\t<tr>\n" +
                "\t\t\t<td>Fichier d'étalonnage</td>\n"+
                "\t\t\t<td>/path/to/file</td>\n"+
            "<\t\t</tr>\n";
        } else {
            myEtalon+=
            "\t\t<tr>\n" +
                "\t\t\t<td>Auto-étalonnage</td>\n"+
                "\t\t\t<td>Standard</td>\n"+
            "\t\t</tr>\n";
        }
        
        myEtalon +=
            "\t</tbody>\n"+
        "</table>";
    // VALEUR PAR DÉFAUT
    } else {
        myEtalon +=
        "<h5>\tÉtalonnage par défaut<h5>"
        "<table class='table table-striped table-bordered table-hover'>\n"+
            "\t<thead>\n"+
                "\t\t<tr>\n"+
                    "\t\t\t<th>Paramètre</th>\n"+
                    "\t\t\t<th>Valeur</th>\n"+
                "\t\t</tr>\n"+
            "\t</thead>\n"+
            "\t<tbody>\n" +
                "\t\t<tr>\n"+
                    "\t\t\t<td>Auto-étalonnage</td>\n"+
                    "\t\t\t<td>Standard</td>\n"+
                "\t\t</tr>\n"+ 
                "\t\t<tr>\n"+
                    "\t\t\t<td>Images</td>\n"+
                    "\t\t\t<td>Toutes</td>\n"+
                "\t\t</tr>\n"+
                "\t\t<tr>\n"+
                    "\t\t\t<td>Focale capteur</td>\n"+
                    "\t\t\t<td>Auto</td>\n"+
                "\t\t</tr>\n"+
                "\t\t<tr>\n"+
                    "\t\t\t<td>Dimensions capteur</td>\n"+
                    "\t\t\t<td>Auto</td>\n"+
                "\t\t</tr>\n"+ 
            "\t</tbody>\n"+
        "</table>"
    }

    document.getElementById('resumeParam').innerHTML = myTable+myEtalon;

    return true;
}

function ajout(myTable, parametre, valeur, couleur) {
    var style = (couleur) ? " style='color: "+couleur+";'" : "";

    myTable += "<tr>\n\t<td>"+parametre+"</td>\n\t<td"+style+">"+valeur+"</td>\n</tr>\n";
    return myTable;
}
