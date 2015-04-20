// Contient les informations exif des images importées
var infosExif = null;

// Récupère les informations exif des images du chantier auprès du serveur
function recupereExif()
{
        var req = new XMLHttpRequest();    
        req.open('POST','/nouveau_chantier',true);
        
        req.onreadystatechange = function (aEvt) {
          if (req.readyState == 4) {
             if(req.status == 200)
             {
                  infosExif = JSON.parse(req.responseText);
             }
          }
        };
        // On envoie l'id chantier et la demande d'exif
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify({"_id":$("#idChantier").val(),"demandeExif":"oui"}));
}

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
    
    //Onglet courrant(celui à valider), initialisé au premier onglet au premier appel
    var ongletCourant = $("#ongletCourant").val();
    
    // Si on valide l'onglet 2, on récupère les métadonnées des images importées
    if (ongletCourant == "on_click2")recupereExif();
    else
    {
    
        //On récupère l'idChantier de la page
        var idChantier = $("#idChantier").val();
        console.log(idChantier);
        
        var getinfo = ["nom", "commentaire"]
        var getinfochecked = ["typestatus", "typefacade"]
        //Tableau associatif "onglet courrant" : ["id des formulaires à valider"]
        var tabass = {"on_click1" : ["on_click1a"], "on_click2" : ["js-upload-form"], "on_click3" : ["etalonnageForm", "parametresForm"], "on_click4" : []}
        
        //Pas de formulaire à valider dans l'onglet 4: on passe toutes les étapes
        if(ongletCourant != "on_click4"){
        
        //Création d'un objet JSON
        var formjson = {};
        //Ajout de l'id du chantier
        if(idChantier!="-1"){
            formjson._id = idChantier;
        }
		else{
		//On renvoit la date de création du chantier
			var date1 = new Date();
			var date2 = date1.getDate() + "-" + date1.getMonth() + "-" + date1.getFullYear()
			formjson.date = date2;
		//On met l'état "En attente de l'utilisateur"
			formjson.etat = "1";
		}
        
        // on parcourt les formulaires présents dans l'onglet courant, en regardant la table d'association tabass
        for (var j = 0; j < tabass[ongletCourant].length; j++){
        var idform = (tabass[ongletCourant])[j];
        console.log(idform);
        // Récupération du formulaire
        var Form = document.forms[idform];
        // Boucle tous les éléments du formulaire i
        var el = Form.elements;
        //Formulaire special pour l'etalonnage
        if(idform=="etalonnageForm"){
            var etaljson = {};
            etaljson.id = "1" //A VOIR CE QU'IL FAUT METTRE
            for (var l = 0; l < el.length; l++){
                console.log("boucle");
                var idelement = el[l].id;
                //Nouveau JSON pour cet etalonnage
                if(idelement=="calibrationname"){etaljson.nom = el[l].value;}
                if(idelement=="auto_etalonnage"){
                    if(el[l].checked){
                        etaljson.auto_etalonnage="1";
                    }
                    else{
                        etaljson.auto_etalonnage="0";
                        //ALLER CHERCHER LE NOM DU FICHIER DE CALIBRATION
                        break;
                    }
                }
                if(idelement=="standard" && el[l].checked){etaljson.type_auto_etalonnage="standard"}
                if(idelement=="fisheye" && el[l].checked){etaljson.type_auto_etalonnage="fisheye"}
                if(idelement=="fraserbasic" && el[l].checked){etaljson.type_auto_etalonnage="fraserbasic"}
                //VOIR POUR LA LISTE D'IMAGES
                if(idelement=="infoCapteurCb" && el[l].checked){
                    var capteurjson={};
                    capteurjson.focale_reelle = document.getElementById("focale_reelle").value;
                    var dim1 = document.getElementById("dim_1").value;
                    var dim2 = document.getElementById("dim_2").value;
					dimens = [];
					dimens.push(dim1);
					dimens.push(dim2);
                    capteurjson.dimensions = dimens;
                    etaljson.capteur = capteurjson;
                }
            }
		tabEtalonnage = [];
		tabEtalonnage.push(etaljson)
        formjson.etalonnage = tabEtalonnage;
        }
        else{
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
                //Pour les checkbox
                for (var i =0; i < getinfochecked.length; i++){
                    //Si l'id est dans la liste des input à récupérer, on l'ajoute à l'objet JSON
                    if( idelement==getinfochecked[i] ){
                        if (el[l].checked){
                            formjson[idelement] = el[l].value;}
                    break;
                    }
                }
				if ( idelement=="mask2D"){
					if (el[l].checked){formjson.masque = "22D";}
					else{formjson.masque = "3D";}
				}
                if ( idelement=="mise_a_echelle" || idelement=="basculement" ){
                    if( el[l].checked){formjson[idelement] = "1"}
                    else{formjson[idelement] = "0"}
                }
                if ( idelement=="quantite_points_liaison" ){
                    formjson[idelement] = el[l].options[el[l].selectedIndex].value;
                }
            }
        }
        }
        // N'envoie pas de requete si il y a juste l'id dans le tableau
        if (Object.keys(formjson).length > 1)
        {
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
                  if($("#idChantier").val() == "-1")$("#idChantier").val(idChantier);
                  }
                 else
                  ;//dump("Erreur pendant le chargement de la page.\n");
              }
            };

            //On précise que l'information qu'on envoie est du JSON
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.send(JSON.stringify(formjson));
            }
        }
    }
    //Changement d'onglet
    $("#ongletCourant").val(id);
    return true;
}

function lancer_calcul() {
	
	
	if(document.getElementById("nom").value == ""){
		alert("Entrez un nom de chantier");
	}
	else{
		if(infosExif){
		console.log(infosExif);
		//LENGTH MARCHE PAS CAR INFOEXIF EST UN STRING
		console.log(infosExif.length);
			if(infosExif.length < 2){alert("Importez au moins deux images");}
			else{
				alert("Validation(à faire)");
				//On change de page et on change d'état
/* 				var req = new XMLHttpRequest();    
				req.open('POST','/nouveau_chantier',true);
				//On précise que l'information qu'on envoie est du JSON
				req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				req.send(JSON.stringify(formjson));
				} */
				}
			}
		else{alert("Importez au moins deux images");}
	}
}

// Affiche ou cache un div en fonction de sa visibilité précédente
function afficher(id) {

    var element = document.getElementById(id);

    if(element.style.display=="block") {
        element.style.display="none";
    } else {
        element.style.display="block";
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
    var element = document.getElementById(id);
    
    element.innerHTML = element.innerHTML.replace("down","right");
    return true;
}

function chevronDown(id) {
    var element = document.getElementById(id);
    
    element.innerHTML = element.innerHTML.replace("right","down");
    return true;
}
