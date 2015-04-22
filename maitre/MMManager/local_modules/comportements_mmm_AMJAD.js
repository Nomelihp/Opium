var model = require('../../model/mongo_config');
var http  = require('http');
var ping = require('ping');

// Modeles mongoose
var Esclave	=	model.esclaves;
var Jobs	=	model.jobs;


/* Inscrit un esclave
 * IP : Adresse IP de l'esclave
 * PORT : port d'écoute de l'esclave
 * res : res http à renvoyer au client
 * test OK
 * */
exports.inscription = function (IP,PORT,res) {

	Esclave.find({ ip: IP }, function(err, esclaves) {
		if (esclaves.length==0) {

			var eclave = new Esclave({
			        ip:IP,
			        port:PORT,
			        operationnel: 1
			      });
			eclave.save(function (err) {
			  if (err) console.log('error');
			  res.status(204).end();
			});
		}else{
			console.log("esclave déjà inscrit !");
			res.status(400).end();
		};
		
	});
}


/*
	*Examine les esclaves inscrits et teste si ils répondent... Si ce n'est pas le cas, les désinscrit
*/
exports.examine_esclaves = function () {
  var Esclave;
  
  var hosts = [];
  
  model.esclaves.find({},function(err,esclave){
    if (err) console.log('[MMManager][examine_esclaves] Erreur BD! model.esclaves.find ne marche pas');
    for(var i=0;i<esclave.length;i++){
      Esclave = new model.esclaves(esclave[i]);
      hosts.push(Esclave.ip);
    }
    hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
      if(!isAlive){
        console.log('[MMManager][examine_esclaves] Attention! Esclave '+Esclave._id+' mort');
        model.esclaves.findByIdAndUpdate(Esclave._id,{operationnel:'0'},function(err2){
          if(err2) console.log('[MMManager][examine_esclaves] Erreur! lors de la mise à jour du flag operationnel à 0 dans model.esclaves');
        });
      }else{
        console.log('[MMManager][examine_esclaves] Esclave '+Esclave.ip+' répond à mes pings il est vivant');
      }
      });
  });
  });

}

var recoitResultat = function (esclave,job) {


}

/* Envoi un job à un esclave
	 *esclave : destinataire
	 *job : job à faire
	 * a tester
*/
var envoieUnJob = function (esclave,job) {
	// On passe l'état de l'esclave à occupé
	Esclave.findByIdAndUpdate(esclave.id, {operationnel:2}, function(err, e) {
		// On envoie la requete contenant le job
		var postData = JSON.stringify({"idJob":job.id,"idChantier":job.id_chantier,"login":job.login,"commande": job.commande});
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


