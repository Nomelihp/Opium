var config_json=load('config.js');

var mongodb_db_name = config_json.mongodb_db_name;
var mongodb_port = parseInt(config_json.mongodb_port);
var mongodb_ip = parseInt(config_json.mongodb_ip);

db = db.getSiblingDB(mongodb_db_name);

db.createCollection("besoins");
db.createCollection("jobs");
db.createCollection("esclaves");
