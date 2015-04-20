var port = require('../config.json');
var messenger = require('messenger')
var model = require('../model/mongo_config');

var listen_port = parseInt(port.MMManager);

var server = messenger.createListener(listen_port);


var Esclave=model.esclaves;
var Jobs=model.jobs;

//---- Ajoute un élement dans la table esclave
/* var eclave = new Esclave({
        ip:"http://172.48.30.3:3128",
        operationnel: 2
      });
eclave.save(function (err) {
  if (err) console.log('error');
});*/



//---	Ajouter des jobs pour test----------
/*
var job = new Jobs(
 {
    
    id_chantier: "270",
    container: "http://172.30.30.2:8060",
    commande: "Tapioca All *.JPG ...",
    etat: 0,
    erreur: "la mise en place bla bla bla"
  });

job.save(function (err) { if (err) console.log('error');});


var job = new Jobs(
 {
    
    id_chantier: "271",
    container: "http://172.30.30.2:8060",
    commande: "Tapas toto *.JPG ...",
    etat: 0 ,
    erreur: "la mise en place bla bla bla"
  });

job.save(function (err) { if (err) console.log('error');});
*/
//---- Cherche tous les élements dans la table Jobs
Jobs.find(function (err, jobs) {
	if (err) return console.error(err);



	//Suppression de tous les objets

  	/*for (var i = 0; i < jobs.length; i++) {
  		jobs[i].remove(function(err) {
    		if (err) throw err;
    		console.log('User successfully deleted!');
  		});
   	}*/

   	 console.log(jobs);
   })

Esclave.find(function (err, jobs) {
	if (err) return console.error(err);



	//Suppression de tous les objets

  	/*for (var i = 0; i < jobs.length; i++) {
  		jobs[i].remove(function(err) {
    		if (err) throw err;
    		console.log('User successfully deleted!');
  		});
   	}*/

   	 console.log(jobs);
   })

function test_esclave_operationnel(ip) {
	// body...
	// retour un booléen qui dit si l'esclave est opérationnel
	console.log("test reussi");
	return true;
}

function send_http (ip,job) {
	// body...
	// A FAIRE 
	console.log(ip);

}

function receive_http (retour) {
	// body...
	// bool retour
	if (retour) {
		//ca a fonctionné
	} else{
		//ca a pas fonctionné
	};
}



function requete_esclave (ip,id_job,id_esclave) {
	// body...
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



server.on('notification',function(message,data){
	// Regarder dans jobs les mises à jours pour récupérer les jobs non assigné


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
}); //end server.on

