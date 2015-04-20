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

   	// console.log(esclaves);
   })

function test_esclave_operationnel(ip) {
	// body...
	// retour un booléen qui dit si l'esclave est opérationnel
	return true;
}

function requete_esclave (ip) {
	// body...
	if (arg!='') {
		// requete sur l'esclave correspondant
	} else {
		// requete sur un esclave libre
	};
}



Jobs.find({ etat: 0 },function (err, jobs) {
	if (err) return console.error(err);

	for (var i = 0; i < jobs.length; i++) {

		var job = new Jobs(jobs[i]);

		console.log(job['id_chantier']);
		console.log("Pouff j envoie la requete a l esclave et je fais quelque chose");
		//  ----   Si le job est déjà assigné à un conteneur on lui donne ce qu'il veut 
		if (job['container']!='') {

			Esclave.find({ ip: job['container'] }, function(err, esclaves) {
			  if (err) throw err;
			  // test si l'esclave est opérationnel
			  if (test_esclave_operationnel(job['container'])) {
			  	// s'il est déjà occupé
			  	if (esclaves['operationnel']==2) {
			  		console.log("occupé");
			  		requete_esclave ('') ;

			  	}else{
			  		// A FAIRE : Envoyer la requete à l'esclave
			  		requete_esclave (job['container']) ;
			  		// A FAIRE : Passer l'esclave en occupé
			  	}

			  }else{
			  	// A FAIRE : Passer l'esclave en non opérationnel
			  	requete_esclave ('') ;
			  }

			  console.log(esclaves);
			});

		} else{
			// le job n'est pas assigné
			requete_esclave ('') ;
		};


		Esclave.find({ operationnel: 1 }, function(err, esclaves) {
		  if (err) throw err;
		  console.log(esclaves);
		});


		// Mise à jour du job concerné
		Jobs.findByIdAndUpdate(job['_id'], { etat: 1 }, function(err, user) {
		  if (err) throw err;

		  console.log("update");
		});


	}

})




Jobs.find(function (err, jobs) {
	if (err) return console.error(err);

	console.log(jobs);
})

Esclave.find(function (err, esclaves) {
	if (err) return console.error(err);

	console.log(esclaves);
})

/*
server.on('notification',function(message,data){
	// Regarder dans jobs les mises à jours pour récupérer les jobs non assigné
});
*/
