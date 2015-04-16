// Envoie les fichiers choisis par l'utilisateur au serveur depuis l'onglet 2
function uploadImagesOnglet2()
{


	// Pour chaque image
	//for...
	// crée une nouvelle requette XMLHttpRequest
	var objReq = new XMLHttpRequest();
	
	if(!(file.type=="image/jpeg" || file.type=="image/png" || file.type=="image/gif")){
	// le fichier n'est pas du bon type
	
	}
	else
	{
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

// Valide un onglet en envoyant les paramètres du formulaire et en affichant l'onglet suivant
function valider_onglet(id) {

    var affichages = ["on_click1","on_click2","on_click3","on_click4"];
    var boutons = ["cliquable1","cliquable2","cliquable3","cliquable4"]

	// change le style des tous les boutons et cache tous les onglets
    for(var i=0; i<4; i++) {
            document.getElementById(affichages[i]).style.display="none";
            chevronRight(boutons[i]);
    }

	// Montre l'onglet courant
    document.getElementById(id).style.display="block";
    chevronDown(id.replace("on_click","cliquable"));
	
    var req = new XMLHttpRequest();
	
	//On récupère l'idChantier de la page
	idChantier = document.forms['idchantier'].elements[0].value;
	if(idChantier==-1){
		//On donne un idChantier si y en a pas
		idChantier = 0; //A modifier, à récupérer auprès du serveur
		document.forms['idchantier'].elements[0].value = idChantier;
	}
	//alert(document.forms['idchantier'].elements[0].value);
	
	// on ajoute "1" à l'Id pour qu'il corresponde à l'id du formulaire
	var idform = id+"1";
	// Récupération du formulaire
	var form = document.forms[idform];
	// Boucle tous les éléments du formulaire i
	for (var l = 0; l < form.elements.length; l++)
		{
		// Affiche le nom ou la propriété name de l’élément l
		alert(form.elements[l].value);
		}
	
	
	
	
	//var form = document.forms('Form');
	
	//var formData = JSON.stringify($(Form).serializeArray());
	
    //var el = Form.elements;         
    //for(I = 0; I < el.length; I++) {
	//		var Value = el[I].value;
	//		}
    //}
	
	
	//Récupération des valeurs du formulaire
	var chantier = document.getElementById("chantiername").value;
	var commentaire = document.getElementById("comment").value;
	var optionstatue = document.getElementById("optionsRadios1").value;
	//Envoi en requête des valeurs du formulaire au serveur
	req.open('GET', 'nouveau_chantier?chantier=' + idChantier + '&commentaire=' + commentaire + '&optionstatue=' + optionstatue, true);
	
	//var imagefile = document.getElementById("js-upload-files").files[0];
	//alert(user);
	
    
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
         if(req.status == 200)
          ;//dump(req.responseText);
         else
          ;//dump("Erreur pendant le chargement de la page.\n");
      }
    };
    req.send();
    return true;
}

// Affiche ou cache un div en fonction de sa visibilité précédente
function afficher(id) {
    console.log("AFFICHER");

    if(document.getElementById(id).style.display=="block") {
        document.getElementById(id).style.display="none";
    } else {
        document.getElementById(id).style.display="block";
    }

    return true;
}

// Tourne le chevron d'un onglet
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
