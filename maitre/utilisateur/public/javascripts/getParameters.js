

function onPageOpen(besoins) {
    
    var myTable =
    "<h4>Paramètres de base</h4>\n"+

    "<div class=\"table-responsive\">\n"+
    "<table class=\"table table-striped\">\n"+
    "<thead>\n"+
        "\t<tr>\n"+
            "\t\t<th>Paramètre</th>\n"+
            "\t\t<th>Valeur</th>\n"+
        "\t</tr>\n"+
    "</thead>\n"+
    "<tbody>\n";
    var myEtalon ="";
    
    var myResume = document.getElementById("resumeParam");
    
    //ajout nom
    var nom = besoins.nom;
    console.log("nom ",nom);
    if(nom != null) {
        myTable = ajout(myTable,"Nom",nom);
    } else {
        myTable = ajout(myTable,"Nom","NON DÉFINI","red");
    }

    //ajout date
    myTable = ajout(myTable,"Projet créé le",besoins.date); //À CONVERTIR EN QUELQUE CHOSE DE LISIBLE

    //ajout etat du calcul
    switch(besoins.etat) {
        case "1":
            myTable = ajout(myTable,"État","En attente de l'utilisateur","blue");
            break;
        case "2":
            myTable = ajout(myTable,"État","Calcul en cours");
            break;
        case "3":
        case "4":
        case "5":
            myTable = ajout(myTable,"État","Calculs lancés");
            break;
        case "6":
            myTable = ajout(myTable,"État","Calculs terminés avec succès","green");
            break;
        case "7":
            myTable = ajout(myTable,"État","ÉCHEC","red");
            break;
        case "8":
            myTable = ajout(myTable,"État","Saisie masque","blue");
            break;
        case "9":
            myTable = ajout(myTable,"État","ÉCHEC DE LA MISE EN PLACE","red");
            break;
    }

    //ajout commentaires
    var commentaires = besoins.commentaires;
    if(commentaires != null) {
        myTable = ajout(myTable,"Commentaires",commentaires);
    }

    //ajout type (Statue/Facade)
    var type = besoins.type;
    if(type != null) {
        myTable = ajout(myTable,"Type",type);
    } else {
        myTable = ajout(myTable,"Type","NON DÉFINI","red");
    }

    //ajout liste images, sous forme de menu déroulant
    var liste_images = besoins.liste_images;
    if(liste_images != null) {
        menuDeroulant = "<select size='3'>\n"; //variable où stocker le menu en attendant de le mettre dans myTable

        for(var i=0; i<liste_images.length; i++) {
            menuDeroulant += "<option>"+liste_images[i].nom+"</option>\n";
        }
        
        menuDeroulant += "</select>"
        myTable = ajout(myTable,"Images",menuDeroulant);
    } else {
        myTable = ajout(myTable,"Images","PAS D'IMAGES IMPORTÉES","red");
    }

    //ajout masque (2D/3D). Si pas encore défini, 3D par défaut.
    if(besoins.masque=="22D") {
        myTable = ajout(myTable,"Masque","deux masques 2D");
    } else {
        myTable = ajout(myTable,"Masque","un masque 3D");
    }

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
    if(besoins.mise_a_echelle) {
        myTable = ajout(myTable,"Mise à l'échelle","oui");
    } else {
        myTable = ajout(myTable,"Mise à l'échelle","non");
    }

    //ajout basculement. Non par défaut.
    if(besoins.basculement) {
        myTable = ajout(myTable,"Basculement","oui");
    } else {
        myTable = ajout(myTable,"Basculement","non");
    }

    myTable += "</tbody></table></div>";

    document.getElementById('resumeParam').innerHTML = myTable;
    
    var etalonnages = besoins.etalonnage;
    if(etalonnages) { //if exists

		for(var k=0; k<etalonnages.length; k++) {
			var etalonnage = etalonnages[k];
			
			if(etalonnages.length > 1) {
				var current = "etalon"+k;
				myEtalon +=
				'<div class="dropdown panel panel-info greyed-out" id="'+current+'">\n'+
					'\t<div class="panel-heading">\n'+
						'\t\t<h4>\n'+
							'\t\t\t<button class="btn btn-info btn-sm" id="'+current+'-button" type="button" aria-expanded="true" onclick="javascript:plusMoins(\"'+current+'\");">\n'+
								'\t\t\t\t<i class="fa fa-plus"></i>\n'+
							'\t\t\t</button>\n';

				var nom = etalonnage.nom;
				if(nom) {
					myEtalon += '\t\t\t'+nom+'\n';
				} else {
					myEtalon += '\t\t\tÉtalonnage '+k+'\n';
				}

				myEtalon +=
						'\t\t</h4>\n'+
					'\t</div>\n'+
					'\n'+
					'\t<div class="panel-body" id="'+current+'-body" style="display:none;">\n';	
			}
        
            myEtalon +=
            "<table class='table table-striped table-bordered table-hover'>\n"+
                "\t<thead>\n"+
                    "\t\t<tr>\n"+
                        "\t\t\t<th>Paramètre</th>\n"+
                        "\t\t\t<th>Valeur</th>\n"+
                    "\t\t</tr>\n"+
                "\t</thead>\n"+
                "\t<tbody>\n";

			// SI AUTO-ETALONNAGE
            if(etalonnage.auto_etalonnage) {
                myEtalon +=
                "\t\t<tr>\n"
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

                if(!etalonnage.liste_images || etalonnages.length < 2) {
					myEtalon +=
						"\t\t\t<td>Toutes</td>\n";
				} else {
					menuDeroulant = "<select size='3'>\n"; //variable où stocker le menu en attendant de le mettre dans myTable
					//transformation du string en array
					liste_images = etalonnage.liste_images;
					for(var i=0; i<liste_images.length; i++) {
						menuDeroulant += "<option>"+liste_images[i].nom+"</option>\n";
					}
					menuDeroulant += "</select>";

					myEtalon += "\t\t\t<td>"+menuDeroulant+"</td>\n";
				}
				myEtalon += "\t\t</tr>\n";

                //AJOUT INFO CAPTEUR
                var capteur = etalonnage.capteur;

                var focale = etalonnage.capteur.focale_reelle;
                myEtalon +=
                "\t\t<tr>\n"+
                    "\t\t\t<td>Focale capteur</td>\n";                
                
				if(focale) {
					myEtalon += "\t\t\t<td>"+focale+"</td>\n"	
				} else {
					myEtalon += "\t\t\t<td>Auto</td>\n"	
				}
				myEtalon += "\t\t</tr>\n";

				var dimensions = etalonnage.capteur.dimensions;
				myEtalon +=
                "\t\t<tr>\n"+
                    "\t\t\t<td>Dimensions capteur</td>\n";                
                
				if(focale) {
					myEtalon += "\t\t\t<td>"+dimensions[0]+"×"+dimensions[1]+"</td>\n"	
				} else {
					myEtalon += "\t\t\t<td>Auto</td>\n"	
				}
				myEtalon += "\t\t</tr>\n";
						

            // SI FICHIER D'ETALONNAGE    
            } else {
                //FETCH FILE
            }
            myEtalon +=
                "\t</tbody>\n"+
            "</table>";

            if(etalonnages.length > 1) {
				myEtalon += "</div></div>";
			}
        }

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

    document.getElementById('resumeEtalonnage').innerHTML = myEtalon;

    return true;
}

function ajout(myTable, parametre, valeur, couleur) {
    var style;
    
    if(!couleur) {
        style = "";
    } else {
        style = " style='color: "+couleur+";'";
    }
    
    myTable += "<tr>\n\t<td>"+parametre+"</td>\n\t<td"+style+">"+valeur+"</td>\n</tr>\n";
    return myTable;
}
