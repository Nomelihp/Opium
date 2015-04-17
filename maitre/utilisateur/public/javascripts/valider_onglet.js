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
	
	//On récupère l'idChantier de la page
	
	var idChantier = $("#idChantier").val();

	
	var getinfo = ["nom", "commentaire", "type"]
	
	//Création d'un objet JSON
	var formjson = {};
	//Ajout de l'id du chantier
	if(idChantier!="-1"){
		formjson._id = idChantier;
	}
	
	// on ajoute "a" à l'Id pour qu'il corresponde à l'id du formulaire
	var idform = id+"a";
	// Récupération du formulaire
	var Form = document.forms[idform];
	// Boucle tous les éléments du formulaire i
	var el = Form.elements; 
	for (var l = 0; l < el.length; l++)
		{
		var idelement = el[l].id;
			for (var i =0; i < getinfo.length; i++){
				//Si l'id est dans la liste des input à récupérer, on l'ajoute à l'objet JSON
				if( idelement==getinfo[i] ){
				formjson[idelement] = el[l].value;
				break;
				}
			}
		}
	
	//Pour l'envoi en POST des informations au serveur
	var req = new XMLHttpRequest();	
	req.open('POST','/nouveau_chantier',true);
	
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
         if(req.status == 200){
		 //Récupération du nouvel id du chantier
          var jsonrecu = JSON.parse(req.responseText);
          idChantier = jsonrecu._id;
		  console.log(idChantier);
		  //On met l'id chantier dans la page
		  $("#idChantier").val(idChantier);
		  }
         else
          ;//dump("Erreur pendant le chargement de la page.\n");
      }
    };

	//On précise que l'information qu'on envoie est du JSON
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(formjson));
    return true;
}

// Affiche ou cache un div en fonction de sa visibilité précédente
function afficher(id) {

    if(document.getElementById(id).style.display=="block") {
        document.getElementById(id).style.display="none";
    } else {
        document.getElementById(id).style.display="block";
    }

    return true;
}

// Tourne le chevron d'un onglet
function tournerChevron(id) {

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
