var model = require('../../model/mongo_config');
var http  = require('http');

// Modeles mongoose
var Esclave	=	model.esclaves;
var Jobs	=	model.jobs;


Jobs.findByIdAndUpdate("5537de43d28cdac54f0fc2ed", {etat:"2"}, function(err, j) {
	console.log(j);
	console.log(new Jobs(j[0]));
})
