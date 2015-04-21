var model = require('../../model/mongo_config');

// Modeles mongoose
var Esclave	=	model.esclaves;
var Jobs	=	model.jobs;

// Retourne true si un esclave est opérationnel
exports.test_esclave_operationnel = function (url) {
	// body...
	
	return true;
}

// Envoi un job à un esclave
exports.send_http = function (url,job) {
	// body...
	// A FAIRE 
	console.log(job['commande']);
	console.log(url);
}

// Inscrit un esclave
exports.inscription = function (URL) {

	Esclave.find({ url: URL }, function(err, esclaves) {
		if (esclaves.length==0) {

			var eclave = new Esclave({
			        url:URL,
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


exports.requete_esclave=function (tJob,id_esclave) {
	if (tJob['container']=='') {
		// requete sur l'esclave correspondant
		Esclave.findOne({ operationnel: 1 }, function(err, esclave) {
			Jobs.findByIdAndUpdate(tJob['_id'], { container: esclave['url'],etat : 1 }, function(err, job) {

			  if (err) throw err;
			  console.log("update");
			  send_http (esclave['url'],job);
			});
			
			esclave.etat=2;
			esclave.save();
			//--- on assigne les jobs du meme chantier à un esclave
			Jobs.find({ id_chantier: tJob['id_chantier'] },function (err, jobs) {
				for (var i = 0; i < jobs.length; i++) {
					var newjob= new Jobs(jobs[i]);
					Jobs.findByIdAndUpdate(newjob['_id'], { container: esclave['url'] }, function(err, job) {
					  if (err) throw err;
					});
				};
				

			});


		});

	}else{

		

		Jobs.findByIdAndUpdate(tJob['_id'], { etat : 1 }, function(err, job) {
		  if (err) throw err;
		  console.log("update");
		  send_http (url,job);
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

		var list_chantiers=[];
		for (var i = 0; i < jobs.length; i++) {

			var job = new Jobs(jobs[i]);

			console.log(job['id_chantier']);

			// ----   test si on vient d'assigner le job d'un même chantier
			var inListChantiers=false;
			for (var i = 0; i < list_chantiers.length; i++) {
				if(list_chantiers[i]==job['id_chantier']) inListChantiers=true;
			};
			if (!inListChantiers) {
				//  ----   Si le job est déjà assigné à un conteneur on lui donne ce qu'il veut 
				if (job['container']!='') {

					Esclave.find({ url: job['container'] }, function(err, esclaves) {
					  if (err) throw err;
					  // test si l'esclave est opérationnel
					  if (test_esclave_operationnel(job['container'])) {
					  	// s'il est déjà occupé
					  	if (esclaves['operationnel']!=2) {
					  		console.log("libre");
					  		requete_esclave (job,esclaves['_id']) ;

					  	}

					  }else{
					  	// A FAIRE : Passer l'esclave en non opérationnel
					  	requete_esclave (job,esclaves['_id']);
					  }

					  console.log(esclaves);
					});

				} else{
					// le job n'est pas assigné
					requete_esclave (job,esclaves['_id']);

				};// --- endif job['container']!=''

			}; // end if inlistchantiers
>>>>>>> 91fddb2522db3a4659399b919d9c345e17ffe130
		}// --- endfor

	}) // end find jobs

}

/**
 *Commentaire à insérer
*/
exports.receive_http = function (retour) {
	// body...
	// bool retour
	var url=retour['url'];
	var erreur = retour['erreur'];
	// --- update l'esclave pour le passer en opérationnel
	Esclave.find({ url: url },function (err, esclaves) {
			var esclave= new Esclave(esclaves[0]);
			esclave['operationnel']=1;
			esclave.save();
		});

	if (erreur) {
		//ca a fonctionné
		// --- update le job pour passer son état à finit avec succès
		Jobs.find({ container: url },function (err, jobs) {
			var job= new Jobs(jobs[0]);
			job['etat']=2;
			job.save();
		});

		findJobs ();

	} else{
		//ca n'a pas fonctionné
		// --- update le job pour passer son état à finit avec erreur
		Jobs.find({ container: url },function (err, jobs) {
			var job= new Jobs(jobs[0]);
			job['etat']=3;
			job.save();
		});
	};
}
