var express = require('express');
var router  = express.Router();
var params     = require('../../config.json');
var modele  = require('../../model/mongo_config');
var Besoins = modele.besoins;

// ------------  Pré-requis pour notification métier   ------------
var messenger = require('messenger');
var module_metier = messenger.createSpeaker(parseInt(params.metier));


//  ---------------------------------------------------------------

// A partir des paramètres envoyés par le client, notifie le module métier si il y a du boulot
var notificationMetier = function(params){
    if (params.etat)// On vérifie qu'il y a bien un état dans les données envoyées
    {
        if (params.etat == 2) // On vérifie qu'il s'agit du code correspondant à la saisie terminée dans l'interface nouveau_chantier
        {
            setTimeout(function(){
                module_metier.request('notification', {boulot:"oui"}, function(data){
            });
        }, 2000);
        }
    }
}

// ------------  Renvoi de l'interface pour la saisie d'un nouveau chantier   ------------
router.get('/', function(req, res, next) {
	console.log("[info : Utilisateur / nouveau_chantier / get / ]");
	res.render('nouveau_chantier', { title: 'Nouveau Chantier' });
})
// ------------  Réception des éléments du formulaire    ------------
.post('/',function(req, res, next) {
    // parametres envoyés par le client sous forme de JSON
    var params   = req.body;
    params.login = "localuser";
    // chantier existant : on met à jour le document correspondant
    if (params._id)
    {
        // Cas d'une demande d'Exif
        if (params.demandeExif)
        {
			console.log("[info : Utilisateur / nouveau_chantier / post / ] : recup exif chantier "+req.body._id);
            // on attaque la base pour envoyer les métadonnées exif
            Besoins.findById(req.body._id, function(err, b) {
                if (err)
                {
					console.log("[ERREUR : Utilisateur / nouveau_chantier / post / ] : recup besoin [mongo tourne?]");
					res.status(500).send("");
                }
                else
                {
					var bes = new Besoins(b);
					if(bes.liste_images)
						res.status(200).send(bes.liste_images);
					else res.status(200).send("");
				}
            })

        }
        // Cas d'une mise à jour de chantier
        else
        {
			console.log("[info : Utilisateur / nouveau_chantier / post / ] : mise à jour du chantier "+req.body._id);
            var id = params._id;
            delete params._id;// on enleve l'id pour ne pas l'insérer dans les champs à updater

            Besoins.findByIdAndUpdate(id, params, function(err, besoin) {
				if (err) console.log("[ERREUR : Utilisateur / nouveau_chantier / post / ] : mise a jour chantier [mongo tourne?]");
            });

            notificationMetier(params);

            res.send("{}");
        }
    }
    // Nouveau chantier
    else
    {
		console.log("[info : Utilisateur / nouveau_chantier / post / ] : nouveau chantier");
        var besoin = new Besoins(params);
        besoin.save(function(err, doc, num){
            if (err) console.log("[ERREUR : Utilisateur / nouveau_chantier / post / ] : creation du nouveau chantier [mongo tourne?]");
        });


        // on renvoie le numéro assigné au chantier
        res.type('json');
        res.status(200).json({_id:besoin.id}).end()
    }
    //next();

    //next(new Error('not implemented'));
})

//  ---------------------------------------------------------------

// Notifie le module métier qu'il y a du boulot : A PLACER A LA DERNIERE VALIDATION DE L'UTILISATEUR
/*
*/

module.exports = router;
