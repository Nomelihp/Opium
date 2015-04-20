var http = require('http');
var comportements = require('./local_modules/comportements_esclave');

/**
* L'esclave doit tout d'abord s'inscrire auprès du maitre
*/
comportements.inscription();
