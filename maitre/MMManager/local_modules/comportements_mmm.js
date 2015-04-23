var model = require('../../model/mongo_config');
var http  = require('http');
var ping  = require('ping');
var messenger = require('messenger');
var config    = require('../../config.json');

var utils 	  = require('./utils');

// Modeles mongoose
var Esclave	=	model.esclaves;
var Jobs	=	model.jobs;

var client = messenger.createSpeaker(parseInt(config.metier));

/* Inscrit un esclave
 * IP : Adresse IP de l'esclave
 * PORT : port d'écoute de l'esclave
 * res : res express à renvoyer au client
 * test OK
 * */
exports.inscription = function (IP_brute,PORT,res) {
	// On veut de l'IP v4
	var IP = utils.toIpV4(IP_brute);
	console.log("[info : MMM / inscription] : inscription de l esclave "+IP+":"+PORT);

	Esclave.find({ ip: IP }, function(err, esclaves) {
		if (err)console.log("[ERREUR : MMM / inscription] : pb lors de la verification en base de l existence de l esclave "+IP+"[mongo tourne?]");
		else if (esclaves.length==0) {

			var eclave = new Esclave({
			        ip:IP,
			        port:PORT,
			        operationnel: 1
			      });
			// Enregistrement de l'esclave
			eclave.save(function (err) {
				if (err)
				{
					console.log("[ERREUR : MMM / inscription] : pb lors de l inscription "+IP+" de l esclave "+IP+"[mongo tourne?]");
					res.status(400).end();
				}
				else
				{
					console.log("[info : MMM / inscription] : esclave "+IP+" enregistre!");
					res.status(204).end();
				}
			});
		}
		else{
			// L'esclave existe, on le repasse en operationnel
			var esclave = new model.esclaves(esclaves[0]);
			Esclave.findByIdAndUpdate(esclave.id,{operationnel:1},function(err2){
					console.log("[info : MMM / inscription] : l esclave "+IP+" est deja inscrit, mais c est pas grave, etat passe a operationnel");
					res.status(204).end();
			});
		};

	});
}

/*
	* Desinscrit un esclave
	* IP : Adresse IP de l'esclave
	* res : res express à renvoyer au client
	* test ok
*/
exports.desinscription = function(IP_brute,res){
	// On veut de l'IP v4
	var IP = utils.toIpV4(IP_brute);
	console.log("[info : MMM / desinscription] : desinscription de l esclave "+IP);

	// find the user with id 4
	Esclave.findOneAndRemove({ ip: IP }, function(err) {
			if (err)
			{
				console.log("[ERREUR : MMM / desinscription] : pb lors de la suppression de l esclave "+IP+" en base[mongo tourne?]");
				res.status(400).end();
			}
			else
			{
				// Logs à insérer
				console.log("[info : MMM / desinscription] : Desinscription esclave "+IP+" OK");
				res.status(204).end();
			}
	});
}

/*
	*Examine les esclaves inscrits et teste si ils répondent... Si ce n'est pas le cas, les désinscrit
*/
exports.examine_esclaves = function () {
  var Esclave;

  var hosts = [];
  console.log('[info : MMManager / examine_esclaves] Examen des esclaves... ');
  model.esclaves.find({},function(err,esclave){
    if (err) console.log('[ERREUR : MMManager / examine_esclaves] BD! model.esclaves.find ne marche pas [mongo tourne?]');
    for(var i=0;i<esclave.length;i++){
      Esclave = new model.esclaves(esclave[i]);
      hosts.push(Esclave.ip);
    }
    hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
      if(!isAlive){
        console.log('[info MMManager / examine_esclaves] Attention! Esclave '+Esclave._id+' mort');
        model.esclaves.findByIdAndUpdate(Esclave._id,{operationnel:'0'},function(err2){
          if(err2) console.log('[ERREUR MMManager / examine_esclaves] lors de la mise à jour du flag operationnel à 0 dans model.esclaves[mongo tourne?]');
        });
      }else{
        console.log('[info MMManager / examine_esclaves] Esclave '+Esclave.ip+' répond à mes pings il est vivant');
      }
      });
  });
  });

}


/*
 * Lance le prochain job à réaliser sur un chantier
 * test OK
 * */
var launchNextJobChantier=function(job){
	console.log("[info : MMM / launchNextJobChantier] : lancement du job suivant "+job.id+" sur le chantier "+job.id_chantier);
	var ordreSuivant = parseInt(job.ordre_execution)+1;
	// On recherche le prochain job à lancer
	Jobs.find({ id_chantier:job.id_chantier,ordre_execution:""+ordreSuivant },function (err, j) {
		if (err)console.log("[ERREUR : MMM / launchNextJobChantier] : probleme a la recuperation du job d ordre "+ordreSuivant+" sur le chantier "+job.id_chantier+"[mongo tourne?]");
		else if(j.length > 0)
		{
			attribue(new Jobs(j[0]));
		}
		else
		{
			console.log("[info : MMM / launchNextJobChantier] : plus de job sur le chantier "+job.id_chantier);
			// Notifier l'utilisateur
                        setTimeout(function(){
                          client.request('notification', {boulot:"oui"}, function(data){
                          });
                         }, 2000);
		}
	});
}


/*
 * Reception du résultat envoyé par un esclave
 * req : Request réceptionnée par express
 * res : res d'express
 * test OK
 * */
exports.recoitResultat = function (req, res) {
	console.log("[info : MMM / recoitResultat] : reception du resultat de  "+req.connection.remoteAddress+", code retour = "+req.query.codeRetour);
	// Libération de l'esclave
	Esclave.findByIdAndUpdate(req.query.idEsclave, {operationnel:1}, function(err, e) {
		if (err)
		{
			console.log("[ERREUR : MMM / recoitResultat] : probleme lors de la liberation de l esclave "+req.connection.remoteAddress+"[mongo tourne?]");
			res.status(400).end("");// retour http pb
		}
		else
		{	// Mise à jour de l'état du job et du msg d'erreur
			Jobs.findByIdAndUpdate(req.query.idJob, {etat:""+req.query.codeRetour,erreur:req.query.msgErreur}, function(err, j) {
					var zeJob = new Jobs(j);
					if (err)
					{
						console.log("[ERREUR : MMM / recoitResultat] : probleme lors du changement d etat du job "+zeJob.id+"[mongo tourne?]");
						res.status(400).end("");// retour http pb
					}
					// On lance la prochaine commande du chantier
					else if (req.query.codeRetour == 2)
					{
						launchNextJobChantier(zeJob);
						res.status(200).end("");// retour http ok
					}
					else
					{
						console.log("[ERREUR : MMM / recoitResultat] : l esclave a renvoye un code d erreur lors de l execution de la commande "+zeJob.commande+"[diagnostic chantier mm3d?]");
						res.status(200).end("");
					}
			});
		}
	});
}


/* Envoi un job à un esclave
	 *esclave : destinataire
	 *job : job à faire
	 *test ok
*/
var envoieUnJob = function (esclave,job) {
	console.log("[info : MMM / envoieUnJob] : envoi du job "+job.id+" a l esclave "+esclave.ip);
	// On passe l'état de l'esclave à occupé
	Esclave.findByIdAndUpdate(esclave.id, {operationnel:2}, function(err, e) {
		if (err)console.log("[ERREUR : MMM / envoieUnJob] : probleme lors du changement d etat de l esclave "+esclave.ip+"[mongo tourne?]");
		else
		{
			// On envoie la requete contenant le job
			var postData = JSON.stringify({"idJob":job.id,"idChantier":job.id_chantier,"login":job.login,"commande": job.commande,"idEsclave":esclave.id});
			var options = {method: 'POST',hostname: esclave.ip,port: parseInt(esclave.port),path: '/recoitJob', agent:false,headers: {'Content-Type': 'application/json'}};
			var req = http.request(options,function(res){
					if (res.statusCode == 400)
					{
						console.log("[ERREUR : MMM / envoieUnJob]L esclave ne semble pas disponible [allume?]");
					}
					else if (res.statusCode == 204)
					{
						console.log("[info : MMM / envoieUnJob] Commmande "+job.id+" en cours d execution par l esclave "+esclave.ip);
						Jobs.findByIdAndUpdate(job.id, {etat:"1"}, function(err, e) {// Etat job => assigné
								if (err)
									console.log("[ERREUR : MMM / envoieUnJob] Pb mise à jour etat job [mongo tourne?]");
								else
									console.log("[info : MMM / envoieUnJob] Commmande "+job.id+" en cours d execution par l esclave "+esclave.ip);
						});
					}
				}
			);
			req.on('error', function(err) {
				console.log("[ERREUR : MMM / envoieUnJob] Pb lors de l envoi de la requette http a l esclave [esclave lancé?, pb reseau?]");
			});

			req.write(postData);
			req.end();
		}
	});
}

/*
	* Attribue un job à un esclave disponible
	* Job : job à attribuer
	* test ok
*/
var attribue = function(job){
	console.log("[info : MMM / attribue] : Recherche d 'un esclave pour le job "+job.id);
	// Recherche d'esclaves disponibles
	Esclave.find({ operationnel: 1 },function (err, e) {
			if (err)console.log("[ERREUR : MMM / attribue] : Pb lors de la recherche d un esclave [mongo tourne?]");
			else if (e.length > 0)
			{
				var esclave= new Esclave(e[0]);
				envoieUnJob(esclave,job);
			}
	});
}

/*
 * Parcourt les premieres commandes des nouveaux jobs et les distribue à des esclaves disponibles
 * test ok
*/
exports.launchNewFirstJobs=function() {
	console.log("[info : MMM / launchNewFirstJobs] : Lancement des nouveaux jobs d ordre 1");
	// Recherche des nouveaux jobs non assignés, tri par id
	Jobs.find({ etat: "0",ordre_execution:"1" }).sort({"_id":1}).exec(function (err, jobs) {
		if (err) console.log("[ERREUR : MMM / launchNewFirstJobs] : pb lors de la recherche de jobs a executer [mongo tourne]");
		else
		{
			// Parcours des jobs résultats
			for (var i = 0; i < jobs.length; i++)
			{
				attribue(new Jobs(jobs[i]));
			}
		}
	});
}
