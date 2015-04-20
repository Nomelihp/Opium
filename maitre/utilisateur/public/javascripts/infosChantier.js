/* Récupère les informations de chantier auprès du serveur et exécute un callback une fois les infos recues
idChantier : Identifiant du chantier
* callback : fonction à exécuter une fois les infos recues
*/
var infosChantier = function(idChantier,callback){
	// Demande au serveur le besoin en json correspondant à l'id
	var req = new XMLHttpRequest();    
	req.open('POST','/chantiers',true);
	
	req.onreadystatechange = function (aEvt) {
	  if (req.readyState == 4) {
		 if(req.status == 200)
		 {
			  callback(req);
		 }
	  }
	};
	// On envoie l'id chantier et la demande de besoin
	req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	req.send(JSON.stringify({"_id":idChantier,"demandeBesoin":"oui"}));
}
