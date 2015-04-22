var model = require('../../model/mongo_config');
var http  = require('http');

// Modeles mongoose
var Esclave	=	model.esclaves;
var Jobs	=	model.jobs;


/* Inscrit un esclave
 * IP : Adresse IP de l'esclave
 * PORT : port d'écoute de l'esclave
 * res : res express à renvoyer au client
 * test OK
 * */
exports.inscription = function (IP_brute,PORT,res) {
	
	// On veut de l'IP v4
	var IP = (IP_brute === '::' ? '::ffff:' : '') + '127.0.0.1';
	
	Esclave.find({ ip: IP }, function(err, esclaves) {
		if (esclaves.length==0) {

			var eclave = new Esclave({
			        ip:IP,
			        port:PORT,
			        operationnel: 1
			      });
			eclave.save(function (err) {
			  if (err)
			  {
				  console.log('error');
					res.status(400).end();
			  }
			  res.status(204).end();
			});
		}else{
			console.log("esclave déjà inscrit !");
			res.status(400).end();
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
	var IP = (IP_brute === '::' ? '::ffff:' : '') + '127.0.0.1';
	
	// find the user with id 4
	Esclave.findOneAndRemove({ ip: IP }, function(err) {
		  if (err)res.status(400).end();
		  // Logs à insérer
		  console.log("Desinscription esclave "+IP+" OK");
		  res.status(204).end();
	});
}

/*
	*Examine les esclaves inscrits et teste si ils répondent... Si ce n'est pas le cas, les désinscrit
*/
var examine_esclaves = function () {
		return true;
}


/*
 * Lance le prochain job à réaliser sur un chantier
 * test OK
 * */
var launchNextJobChantier=function(job){
	var ordreSuivant = parseInt(job.ordre_execution)+1;
	console.log("ordre suivant = "+ordreSuivant);
	// On recherche le prochain job à lancer
	Jobs.find({ id_chantier:job.id_chantier,ordre_execution:""+ordreSuivant },function (err, j) {
		
		if(j.length > 0)
		{
			console.log("attribution du suivant ...");
			attribue(new Jobs(j[0]));
		}
		else
		{
				;// Logs à insérer
				// Chantier terminé
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
	console.log("L esclave "+req.connection.remoteAddress+" me renvoie "+req.query.codeRetour);
	// Libération de l'esclave
	Esclave.findByIdAndUpdate(req.query.idEsclave, {operationnel:1}, function(err, e) {
		if (err)
		{
			// Logs à insérer
			res.status(400).end("");// retour http pb
		}
		else
		{	// Mise à jour de l'état du job
			Jobs.findByIdAndUpdate(req.query.idJob, {etat:""+req.query.codeRetour}, function(err, j) {
					var zeJob = new Jobs(j);
					if (err)
					{
						// Logs à insérer
						res.status(400).end("");// retour http pb
					}
					// On lance la prochaine commande du chantier
					else
					{
						console.log("Lancement du job suivant "+req.query.idJob+" "+zeJob.id);
						launchNextJobChantier(zeJob);
						res.status(200).end("");// retour http ok
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
	// On passe l'état de l'esclave à occupé
	Esclave.findByIdAndUpdate(esclave.id, {operationnel:2}, function(err, e) {
		// On envoie la requete contenant le job
		var postData = JSON.stringify({"idJob":job.id,"idChantier":job.id_chantier,"login":job.login,"commande": job.commande,"idEsclave":esclave.id});
		var options = {method: 'POST',hostname: esclave.ip,port: parseInt(esclave.port),path: '/recoitJob',headers: {'Content-Type': 'application/json'}};
		var req = http.request(options,function(res){
				if (res.statusCode == 400)
				{
					Jobs.findByIdAndUpdate(job.id, {etat:"3"}, function(err, e) {// Etat job => fini avec erreur
						// Logs à insérer
						console.log("Probleme lors de l'affectation du job "+job.id+" à "+esclave.ip);
					});
				}
				else if (res.statusCode == 204)
				{
					Jobs.findByIdAndUpdate(job.id, {etat:"1"}, function(err, e) {// Etat job => assigné
							// Logs à insérer
							console.log("Job "+job.id+" assigné à "+esclave.ip);
					});
				}
			}
		);
		req.on('error', function(err) {
		  //;console.log('problem', err);
		});

		req.write(postData);
		req.end();
	});
}

/*
	* Attribue un job à un esclave disponible
	* Job : job à attribuer
	* test ok
*/
var attribue = function(job){

	// Recherche d'esclaves disponibles
	Esclave.find({ operationnel: 1 },function (err, e) {
			if (e.length > 0)
			{
				if (err) return console.error(err); // Logs à INSERER

				var esclave= new Esclave(e[0]);
				console.log("envoi du job "+job.id+" a "+esclave.ip);
				envoieUnJob(esclave,job);
			}
	});
}

/*
 * Parcourt les premieres commandes des nouveaux jobs et les distribue à des esclaves disponibles
 * test ok
*/
exports.launchNewFirstJobs=function() {
	// Recherche des nouveaux jobs non assignés, tri par id
	Jobs.find({ etat: "0",ordre_execution:"1" }).sort({"_id":1}).exec(function (err, jobs) {
		if (err) return console.error(err); // LOGS A INSERER

		// Parcours des jobs résultats
		for (var i = 0; i < jobs.length; i++)
		{
			console.log("Attribution job "+i+" ...");
			attribue(new Jobs(jobs[i]));
		} 
	});
}


