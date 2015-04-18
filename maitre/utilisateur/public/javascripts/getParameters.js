var model = require('../../../model/mongo_config');
var myTable = "";
var myEtalon ="";

var whatever = function onPageOpen() {
    var myResume = document.getElementById("resumeParam");
    
    //ajout nom
    var nom = besoins.nom;
    if(nom != null) {
        myTable.ajout("Nom",nom);
    } else {
        myTable.ajout("Nom","NON DÉFINI","red");
    }

    //ajout date
    myTable.ajout("Projet créé le",besoins.date); //À CONVERTIR EN QUELQUE CHOSE DE LISIBLE

    //ajout etat du calcul
    switch(besoins.etat) {
        case 1:
            myTable.ajout("État","En attente de l'utilisateur","blue");
            break;
        case 2:
            myTable.ajout("État","Calcul en cours");
            break;
        case 3:
            myTable.ajout("État","Non exécuté");
            break;
        case 4:
            myTable.ajout("État","Calcul terminé avec succès","green");
            break;
        case 5:
            myTable.ajout("État","ÉCHEC","red");
            break;
    }

    //ajout commentaires
    var commentaires = besoins.commentaires;
    if(commentaires != null) {
        myTable.ajout("Commentaires",commentaires);
    }

    //ajout type (Statue/Facade)
    var type = besoins.type;
    if(type != null) {
        myTable.ajout("Type",type);
    } else {
        myTable.ajout("Type","NON DÉFINI","red");
    }

    //ajout liste images, sous forme de menu déroulant
    var liste_images = besoins.liste_images;
    if(liste_images != null) {
        menuDeroulant = "<select size='3'>\n"; //variable où stocker le menu en attendant de le mettre dans myTable
        //transformation du string en array
        liste_images = JSON.parse(liste_images);

        for(var i=0; i<liste_images.length; i++) {
            menuDeroulant += "<option>"+liste_images[i]+"</option>\n";
        }
        
        menuDeroulant += "</select>"
        myTable.ajout("Images",menuDeroulant);
    } else {
        myTable.ajout("Images","PAS D'IMAGES IMPORTÉES","red");
    }

    //ajout masque (2D/3D). Si pas encore défini, 3D par défaut.
    if(besoins.masque=="22D") {
        myTable.ajout("Masque","deux masques 2D");
    } else {
        myTable.ajout("Masque","un masque 3D");
    }

    //ajout nombre points liaison
    switch(besoins.nombre_points_liaison) {
        case 1:
            myTable.ajout("Nombre de points de liaison","Faible");
            break;
        case 2:
            myTable.ajout("Nombre de points de liaison","Moyen");
            break;
        case 3:
            myTable.ajout("Nombre de points de liaison","Important");
            break;
        case 4:
            myTable.ajout("Nombre de points de liaison","Maximal");
            break;
    }

	//ajout mise à l'échelle. Non par défaut.
    if(besoins.mise_a_echelle) {
        myTable.ajout("Mise à l'échelle","oui");
    } else {
        myTable.ajout("Mise à l'échelle","non");
    }

	//ajout basculement. Non par défaut.
    if(besoins.basculement) {
        myTable.ajout("Basculement","oui");
    } else {
        myTable.ajout("Basculement","non");
    }

	document.getElementById('resumeParam').innerHTML = myTable;
	
	var etalonnage = besoins.etalonnage;
	if(etalonnage) { //if exists
		etalonnage = JSON.parse(etalonnage);
		if(etalonnage.length > 1) {

		} else {
			// SI UN SEUL ÉTALONNAGE POUR TOUTES LES IMAGES
			myEtalon +=
			"<table class='table table-striped table-bordered table-hover'>\n"+
				"\t<thead>\n"+
					"\t\t<tr>\n"+
						"\t\t\t<th>Paramètre</th>\n"+
						"\t\t\t<th>Valeur</th>\n"+
					"\t\t</tr>\n"+
				"\t</thead>\n"+
				"\t<tbody>\n" +

			if(etalonnage.auto_etalonnage) {
				myEtalon +=
				"\t\t<tr>\n"
					"\t\t\t<td>Auto-étalonnage</td>\n"

				var type_etalon = etalonnage.type_auto_etalonnage;
				switch(type_etalon) {
					case "fisheye":
						myEtalon += "\t\t\t<td>Fish-Eye</td>\n"
						break;
					case "fraserbasic":
						myEtalon += "\t\t\t<td>Fraser Basic</td>\n"
						break;
					case "standard":
					case default:
						myEtalon += "\t\t\t<td>Standard</td>\n"
						break;
				}

				myEtalon +=
				"\t\t</tr>\n"+
				"\t\t<tr>\n"+
					"\t\t\t<td>Images</td>\n"+
					"\t\t\t<td>Toutes</td>\n"+
				"\t\t</tr>\n"+

				//AJOUT INFO CAPTEUR
			    
					
			} else {
				//FETCH FILE
			}	
					"\t\t</tr>\n"+ 


			myEtalon +=
					"\t\t<tr>\n"+
						"\t\t\t<td>Images</td>\n"+
						"\t\t\t<td>Toutes</td>\n"+
					"\t\t</tr>\n"+ 
				"\t</tbody>\n"+
			"</table>"
		}
	} else {
		myEtalon +=
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
			"\t</tbody>\n"+
		"</table>"
	}

	document.getElementById('resumeEtalonnage').innerHTML = myEtalon;

	return true;
}

function ajout(parametre, valeur, couleur) {
    var style;
    
    if(couleur == "undefined") {
        style = "";
    } else {
        style = "style='color: "+couleur+"'"
    }
    
    myTable += "<tr>\n\t<td>"+parametre+"</td>\n\t<td"+style+">"+valeur+"</td>\n</tr>\n";
}
