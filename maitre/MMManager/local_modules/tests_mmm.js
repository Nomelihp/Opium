var model = require('../../model/mongo_config');

// Modeles mongoose
var Esclave=model.esclaves;
var Jobs=model.jobs;


//---- Ajoute un élement dans la table esclave
 var eclave = new Esclave({
        ip:"http://172.48.30.3:3128",
        operationnel: 2
      });
eclave.save(function (err) {
  if (err) console.log('error');
});

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

//---- Cherche et affiche tous les élements dans la table Jobs
Jobs.find(function (err, jobs) {
	if (err) return console.error(err);

   	 console.log(jobs);
   })

//---- Cherche et affiche tous les élements dans la table esclaves
Esclave.find(function (err, jobs) {
	if (err) return console.error(err);

   	 console.log(jobs);
   })
