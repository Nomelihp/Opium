var model = require('../../model/mongo_config');

// Modeles mongoose
var Esclave=model.esclaves;
var Jobs=model.jobs;

// Retourne true si un esclave est opérationnel
exports.test_esclave_operationnel = function (ip) {
	// body...
	
	return true;
}

// Envoi un job à un esclave
exports.send_http = function (ip,job) {
	// body...
	// A FAIRE 
	console.log(job['commande']);
	console.log(ip);
}

// Inscrit un esclave
exports.inscription = function (IP) {
	// body...

	Esclave.find({ ip: IP }, function(err, esclaves) {
		if (esclaves.length==0) {

			var eclave = new Esclave({
			        ip:IP,
			        operationnel: 1
			      });
			eclave.save(function (err) {
			  if (err) console.log('error');
			});
		}else{
			console.log("esclave déjà inscrit !")
		};

	});

}


exports.requete_esclave=function (ip,id_job,id_esclave) {
	if (ip=='') {
		// requete sur l'esclave correspondant
		Esclave.findOne({ operationnel: 1 }, function(err, esclave) {
			Jobs.findByIdAndUpdate(id_job, { container: esclave['ip'],etat : 1 }, function(err, job) {
			  if (err) throw err;
			  console.log("update");
			  send_http (esclave['ip'],job);
			});
			
			esclave.etat=2;
			esclave.save();
			
		});

	}else{

		Jobs.findByIdAndUpdate(id_job, { etat : 1 }, function(err, job) {
		  if (err) throw err;
		  console.log("update");
		  send_http (ip,job);
		});
		// Mise à jour du esclave concerné
		Esclave.findByIdAndUpdate(id_esclave, { operationnel: 2 }, function(err, job) {
		  if (err) throw err;
		  console.log("update");
		});

	}

}


/**
 * Parcourt la liste des jobs non assignés et distribue les traitements correspondants aux esclaves appropriés
*/
exports.findJobs=function() {
	// body...

	Jobs.find({ etat: 0 },function (err, jobs) {
		if (err) return console.error(err);

		for (var i = 0; i < jobs.length; i++) {

			var job = new Jobs(jobs[i]);

			console.log(job['id_chantier']);

			//  ----   Si le job est déjà assigné à un conteneur on lui donne ce qu'il veut 
			if (job['container']!='') {

				Esclave.find({ ip: job['container'] }, function(err, esclaves) {
				  if (err) throw err;
				  // test si l'esclave est opérationnel
				  if (test_esclave_operationnel(job['container'])) {
				  	// s'il est déjà occupé
				  	if (esclaves['operationnel']==2) {
				  		console.log("occupé");
				  		requete_esclave ('',job['_id'],esclaves['_id']) ;

				  	}else{
				  		console.log("libre");
				  		requete_esclave (job['container'],job['_id'],esclaves['_id']) ;
				  		// A FAIRE : Passer l'esclave en occupé
				  	}

				  }else{
				  	// A FAIRE : Passer l'esclave en non opérationnel
				  	requete_esclave ('',job['_id'],esclaves['_id']);
				  }

				  console.log(esclaves);
				});

			} else{
				// le job n'est pas assigné
				requete_esclave ('',job['_id'],esclaves['_id']);

			};// --- endif job['container']!=''

		}// --- endfor

	}) // end find jobs

}

/**
 *Commentaire à insérer
*/
exports.receive_http = function (retour) {
	// body...
	// bool retour
	var ip=retour['ip'];
	var erreur = retour['erreur'];
	// --- update l'esclave pour le passer en opérationnel
	Esclave.find({ ip: ip },function (err, esclaves) {
			var esclave= new Esclave(esclaves[0]);
			esclave['operationnel']=1;
			esclave.save();
		});

	if (erreur) {
		//ca a fonctionné
		// --- update le job pour passer son état à finit avec succès
		Jobs.find({ container: ip },function (err, jobs) {
			var job= new Jobs(jobs[0]);
			job['etat']=2;
			job.save();
		});

		findJobs ();

	} else{
		//ca n'a pas fonctionné
		// --- update le job pour passer son état à finit avec erreur
		Jobs.find({ container: ip },function (err, jobs) {
			var job= new Jobs(jobs[0]);
			job['etat']=3;
			job.save();
		});
	};
}
