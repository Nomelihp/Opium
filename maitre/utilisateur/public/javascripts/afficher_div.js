////////////////// A ecrire by Philemon, signé Régis ////////////////////
function uploadFichiers()
{
	// crée une nouvelle requette XMLHttpRequest
	var objReq = new XMLHttpRequest();
	if(!objReq.upload){
		// la fonction upload n'est pas disponible dans le navigateur.
		// On ne peut pas envoyer de fichier avec XMLHttpRequest, il faut prévoir une alternative
		
	}else if(file.size>document.getElementById("MAX_FILE_SIZE").value){
		// vérifie le poids du fichier avant de l'envoyer
		
	}else if(!(file.type=="image/jpeg" || file.type=="image/png" || file.type=="image/gif")){
		// le fichier n'est pas du bon type
		
	}else{
		// tout est ok, on peut envoyer le fichier
		// on commence par créer un objet formData dans lequel
		// on va ajouter les données que l'on souhaite envoyer
		var formData = new FormData();
		formData.append("img", file);
		// crée une fonction pour afficher la progression de la requête
		objReq.upload.onprogress = function(evt){
		}
		// onreadystatechange est appelé à chaque changement d'état de la requête
		objReq.onreadystatechange=function(){
		}
		// ouvre une requete post, avec l'adresse du formulaire
		objReq.open("POST", document.getElementById("uploadForm").action, true);
		// on envoie l'objet formData
		objReq.send(formData);
	}
}
////////////////////////////////////////////////////////////////////////

function afficher_cacher(id) {

    var affichages = ["on_click1","on_click2","on_click3","on_click4"];
    var boutons = ["cliquable1","cliquable2","cliquable3","cliquable4"]


    for(var i=0; i<4; i++) {
            document.getElementById(affichages[i]).style.display="none";
            chevronRight(boutons[i]);
    }

    document.getElementById(id).style.display="block";
    chevronDown(id.replace("on_click","cliquable"));
    var req = new XMLHttpRequest();
    req.open('GET', 'nouveau_chantier', true);
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
         if(req.status == 200)
          dump(req.responseText);
         else
          dump("Erreur pendant le chargement de la page.\n");
      }
    };
    req.send(null);
    return true;
}

function afficher(id) {
    console.log("AFFICHER");

    if(document.getElementById(id).style.display=="block") {
        document.getElementById(id).style.display="none";
    } else {
        document.getElementById(id).style.display="block";
    }

    return true;
}

function tournerChevron(id) {
    console.log("TOURNER_CHEVRON");

    //if the chevron is right, set it to down, and if down, set it to right
    if (document.getElementById(id).innerHTML.indexOf("right") > -1)  {
        chevronDown(id);
    } else {
        chevronRight(id);
    }

    return true;
}

function chevronRight(id) {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("down","right");
    return true;
}

function chevronDown(id) {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("right","down");
    return true;
}

function plusMoins(id) {

    //if icon is +, set it to -, and if -, set it to +
    if (document.getElementById(id).innerHTML.indexOf("plus") > -1)  {
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("plus","minus");
    } else {
        document.getElementById(id).innerHTML = document.getElementById(id).innerHTML.replace("minus","plus");
    }

    return true;
}
