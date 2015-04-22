var http = require('http');
var ip 	 = require('ip');
var sys  = require('sys');
var exec = require('child_process').exec;
var config_esclave = require('../config_esclave')

// Indiquent l'état d'inscription et l'activité en cours de l'esclave
var ACTIVITE_ESCLAVE = "DETENDU";// "DETENDU" ou "AFOND"
var INSCRIT 	 	 = false;

// Inscription auprès du maitre
exports.inscription = function(resExpress,callbackAffichage){
	// envoi d'une requete http auprès du maitre
	http.get("http://"+config_esclave.maitre_ip+":"+config_esclave.maitre_port+"/inscriptionEsclave?port="+config_esclave.esclave_port,function callback(response){
		  response.setEncoding('utf8');
		  callbackAffichage(resExpress,response);
	})	
}

// Renvoie un code retour au maitre
retourJob = function(idJob,codeRetour){
	http.get("http://"+config_esclave.maitre_ip+":"+config_esclave.maitre_port+"/retourEsclave?idJob="+idJob+"&codeRetour="+codeRetour,function (response){
		;
	});
}

// Lance un job à partir d'une requete
exports.lanceJob = function (req, res){
	if (ACTIVITE_ESCLAVE == "DETENDU")
	{
		ACTIVITE_ESCLAVE = "AFOND";
		
		// Lancement de la commande recue depuis le repertoire du chantier
		exec("cd "+config_esclave.img_micmac_esclave+"/"+req.body.login+"/"+req.body.idChantier+"/;"+req.body.commande, function (error, stdout, stderr) {
			
			ACTIVITE_ESCLAVE = "DETENDU";
			// Correspond à un exit != 0
			if (error != null) {
				retourJob(req.body.idJob,3); // code retour : fini avec erreur
				//LOGS A INSERER
			}
			else retourJob(req.body.idJob,2); // code retour : fini avec succes
			
		});
		res.status(204).end();// retour requete http ok (le code de retour de resultat sera envoyé plus tard)
	}
	else res.status(400).end();// retour requete http pb
}



// Renvoie un contenu html pour l'adminsitration de l'esclave
exports.pageHTML = function(res,msg){
	
	res.setHeader('Content-Type', 'text/html');
	
	var string = "";
	
	string += "<html><head><title>Esclave Mojito</title></head><body>";
	string += "<table width=\"50%\" border=\"1\"><tr><td>esclave</td><td>"+ip.address()+":"+config_esclave.esclave_port+"</td>";
	string += "<tr><td colspan=\"2\" align=\"right\"><strong>"+msg+"</strong></td></tr>"
	if (INSCRIT)
		string  += "<tr><td>inscription</td><td>inscrit auprès de </td>";
	else string += "<tr><td>inscription</td><td>non inscrit</td>";
	string += "<tr><td>activité</td><td>"+ACTIVITE_ESCLAVE+"</td>";
	string += "<tr><td>actions</td><td><a href=\"/inscription\">inscription</a></td>";
	string += "</body></html>"
	
	res.end(string);
}
