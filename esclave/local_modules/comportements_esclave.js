var http = require('http');
var ip 	 = require('ip');
var sys  = require('sys');
var exec = require('child_process').exec;
var config_esclave = require('../config_esclave')

// Indiquent l'état d'inscription et l'activité en cours de l'esclave
var ACTIVITE_ESCLAVE = "DETENDU";// "DETENDU" ou "AFOND"
var INSCRIT 	 	 = false;

/* Inscrit l esclave aupres du maitre
 * resExpress : resultat http via express
 * callbackAffichage : fonction d affichage a appeler
 * test OK
 * */
exports.inscription = function(resExpress,callbackAffichage){
	console.log("[info : esclave / inscription] : inscription de l esclave aupres du maitre "+config_esclave.maitre_ip+":"+config_esclave.maitre_port);
	// envoi d'une requete http auprès du maitre
	http.get({host:config_esclave.maitre_ip, port:config_esclave.maitre_port, path:"/inscriptionEsclave?port="+config_esclave.esclave_port, agent:false},function callback(response){
		  response.setEncoding('utf8');
		  
		  if (response.statusCode == 204)INSCRIT=true;
		  callbackAffichage(resExpress,response);// Vue

	}).on('error', function(e) {
		  console.log("[ERREUR : esclave / inscription] Pb lors de l envoi de la requette http d inscription au maitre [maitre lancé?, pb reseau?]");
		});	
}

/* Desinscrit l esclave aupres du maitre
 * resExpress : resultat http via express
 * callbackAffichage : fonction d affichage a appeler
 * test OK
 * */
exports.desinscription = function(resExpress,callbackAffichage){
	console.log("[info : esclave / desinscription] : desinscription de l esclave aupres du maitre "+config_esclave.maitre_ip+":"+config_esclave.maitre_port);
	// envoi d'une requete http auprès du maitre
	http.get({host:config_esclave.maitre_ip, port:config_esclave.maitre_port, path:"/desinscriptionEsclave", agent:false},function callback(response){
		  response.setEncoding('utf8');
		  if (response.statusCode == 204)INSCRIT=false;
		  callbackAffichage(resExpress,response); // Vue
		  console.log("desincrit!!!!");
	}).on('error', function(e) {
		  console.log("[ERREUR : esclave / desinscription] Pb lors de l envoi de la requette http de desincription au maitre [maitre lancé?, pb reseau?]");
		});	
}

/* Renvoie un code retour d execution de job et le message d erreur au maitre
	*idEsclave identifiant de l esclave
	*idJob identifiant du job
	*codeRetour code de retour à envoyer au maitre
	*msgErreur flux de message d erreur a envoyer (non envoyé sur cette version)
	*test OK
*/
retourJob = function(idEsclave,idJob,codeRetour,msgErreur){
	http.get({host:config_esclave.maitre_ip, port:config_esclave.maitre_port, path:"/retourEsclave?idJob="+idJob+"&codeRetour="+codeRetour+"&idEsclave="+idEsclave, agent:false},function (response){
		if (response.statusCode == 200)
			console.log("[info : esclave / retourJob] Le maitre a bien recu le retour de commande");
		else
			console.log("[ERREUR : esclave / retourJob] Le maitre semble avoir eu un soucis dans la reception du retour de job [regarder logs du maitre]");
	}).on('error', function(e) {
		  console.log("[ERREUR : esclave / retourJob] Pb lors de l envoi de la requette http de retour de job au maitre [maitre lancé?, pb reseau?]");
		});	
}

/* Lance un job à partir d une requete
	*req Requete http via express
	*res Resultat http via express
	*test OK
*/
exports.lanceJob = function (req, res){
	console.log("[info : esclave / lanceJob] : lancement du job "+req.body.idJob);
	
	if (ACTIVITE_ESCLAVE == "DETENDU")
	{
		ACTIVITE_ESCLAVE = "AFOND";
		console.log("[info : esclave / lanceJob] : commande = "+"cd "+config_esclave.img_micmac_esclave+"/"+req.body.login+"/"+req.body.idChantier+"/;"+req.body.commande);
		// Lancement de la commande recue depuis le repertoire du chantier
		exec("cd "+config_esclave.img_micmac_esclave+"/"+req.body.login+"/"+req.body.idChantier+"/;"+req.body.commande, function (error, stdout, stderr) {
			
			ACTIVITE_ESCLAVE = "DETENDU";
			// Correspond à un exit != 0
			if (error != null) {
				console.log("[ERREUR : esclave / lanceJob] : pb commande sur job "+req.body.idJob+"["+req.body.commande+" ok??]");
				retourJob(req.body.idEsclave,req.body.idJob,3,stderr); // code retour : fini avec erreur
			}
			else
			{
				console.log("[info : esclave / lanceJob] : commande ok ("+req.body.commande+")");
				retourJob(req.body.idEsclave,req.body.idJob,2,stderr); // code retour : fini avec succes
			}
			
		});
		res.status(204).end();// retour requete http ok (le code de retour de resultat sera envoyé plus tard)
	}
	else res.status(400).end();// retour requete http pb
}



/*
	*  Renvoie un contenu html pour l'adminsitration de l'esclave
	* res resultat http via express
	* msg message à insérer a la page
*/
exports.pageHTML = function(res,msg){
	
	res.setHeader('Content-Type', 'text/html');
	
	var string = "";
	
	string += "<html><head><title>Esclave Mojito</title></head><body>";
	string += "<table width=\"50%\" border=\"1\"><tr><td>esclave</td><td>"+ip.address()+":"+config_esclave.esclave_port+"</td>";
	string += "<tr><td colspan=\"2\" align=\"right\"><strong>"+msg+"</strong></td></tr>"
	if (INSCRIT)
		string  += "<tr><td>inscription</td><td>inscrit auprès de "+config_esclave.maitre_ip+":"+config_esclave.maitre_port+"</td>";
	else string += "<tr><td>inscription</td><td>non inscrit</td>";
	string += "<tr><td>activité</td><td>"+ACTIVITE_ESCLAVE+"</td>";
	string += "<tr><td>actions</td><td><a href=\"/inscription\">inscription</a></td>";
	string += "<tr><td></td><td><a href=\"/desinscription\">desinscription</a></td>";
	string += "</body></html>"
	
	res.status(200).end(string);
}
