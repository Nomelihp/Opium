var model = require('../../../model/mongo_config');
var myTable = "";


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
    var menuDeroulant = ""; //variable où stocker le menu en attendant de le mettre dans myTable
    if(liste_images != null) {
        menuDeroulant += "<select size='3'>\n";
        //transformation du string en array
        liste_images = liste_images.replace("[","").replace("]","").split(",");

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

    if(besoins.mise_a_echelle == 1) {
        myTable.ajout("Mise à l'échelle","oui");
    } else {
        myTable.ajout("Mise à l'échelle","non");
    }

    if(besoins.basculement == 1) {
        myTable.ajout("Basculement","oui");
    } else {
        myTable.ajout("Basculement","non");
    }

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
