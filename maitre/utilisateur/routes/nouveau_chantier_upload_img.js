// Route permettant l'upload des images

var express = require('express');
var router  = express.Router();
var params 	= require('../../config.json');
var modele  = require('../../model/mongo_config');

var express = require('express');
var multer  = require('multer');

// Paramétrage de l'upload via multer
router.use(multer({ dest: params.repertoire_donnees+"tmp/",
	// on renomme le fichier
	rename:function(fieldname, filename, req, res){
		/*
		var promise = people.find({ _id: { $in: someArrayOfIds }).exec();
		promise.then(function(arrayOfPeople) {
		  // array of people ... do what you want here...
		});
		*/
		var promise = modele.besoins.find({ _id: req.body._id }).exec();
		promise.then(function(besoins){
			console.log("yououh je suis la : "+besoins.id);
		});
		/*modele.besoins.find({ _id: req.body._id }, function(err, besoins) {
		  if (err) throw err;

		  // delete him
		  
		});
		*/
		
		
		console.log("RENOMME FICHIER fieldname = "+fieldname);
		console.log("RENOMME FICHIER filename = "+filename);
		console.log("RENOMME FICHIER req = "+req.body._id);
		console.log("RENOMME FICHIER res = "+res);
		return req.body._id+filename;
	},
	onFileUploadStart: function (file) {
	  console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  done=true;
	}
}));

router.get('/', function(req, res){
  ;
})

.post('/', function(req, res){
	
    console.log(req.body) // form fields
    console.log(req.files) // form files
    res.status(204).end()
});



module.exports = router;
