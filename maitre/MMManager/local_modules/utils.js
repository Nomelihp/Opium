/*
	 * Renvoie une adresse ip v4 à partir d'une adresse ip v4 ou 6
	 * ip : adresse ip 4 ou 6
*/
exports.toIpV4 = function(ip){
	var tabExplode = ip.split(":");
	if (tabExplode.length == 1)return ip;
	else return tabExplode[tabExplode.length -1];
}
