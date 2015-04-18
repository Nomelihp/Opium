var model = require('../../../model/mongo_config');
var myTable = "";


var whatever = function onPageOpen() {
    var myResume = document.getElementById("resumeParam");
    
    //liste des paramètres obligatoires
    var importants = ['date','nom','etat','type','liste_images'];
    
    //liste des paramètres facultatifs
    var facultatifs = ['commentaires','masque','quantite points liaison','mise a echelle','basculement','etalonnage'];
    
    var nom = besoins.nom;
    if(nom != null) {
        myTable.ajout("Nom",nom);
    } else {
        myTable.ajout("Nom","NON DÉFINI","red");
    }
    
    myTable.ajout("Projet créé le",besoins.date); //À CONVERTIR EN QUELQUE CHOSE DE LISIBLE
        
    var etat = besoins.etat;
    switch(etat) {
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
            myTable.ajout("État","Échec","red");
            break;
    }

    var commentaires = besoins.commentaires;
    if(commentaires != null) {
        myTable.ajout("Commentaires",commentaires);
    }
    
    var type = besoins.type;
    if(nom != null) {
        myTable.ajout("Type",type);
    } else {
        myTable.ajout("Type","NON DÉFINI","red");
    }
    
    var liste_images = besoins.liste_images;
    if(nom != null) {
        myTable.ajout("Type",liste_images);
    } else {
        myTable.ajout("Type","NON DÉFINI","red");
    }

}

function ajout(parametre, valeur, couleur) {
    var style;
    
    if(couleur == "undefined") {
        style = "";
    } else {
        style = "style='color: "+couleur+"'"
    }
    
    myTable += "<tr>\n\t<td>"+parametre+"</td>\n\t<td"+style+">"+valeur+"</td>\n</tr>";
}
