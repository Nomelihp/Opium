function setParameters(besoins) {
	//si on crée un nouveau chantier
	if(!besoins){
		return false;
	}
	
	$("#idChantier").val(besoins._id);
	
	if(besoins.nom)	$("#nom").val(besoins.nom);
	if(commentaire) $("#commentaire").val(besoins.commentaire);
	//DATE ?
	//ETAT ?
	var type = besoins.type;
	switch(type) {
		case "statue":
			$("#statue").prop("checked", true);
			break;
		case "facade":
			$("#facade").prop("checked", true);
			break;
	}
	
	if(masque) $("#masque").val(besoins.masque);
}
