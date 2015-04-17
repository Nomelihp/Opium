function plusMoins(nomPanel) {

	var myElement = document.getElementById(nomPanel+"-button"); //trouve le bouton
	var myParentDiv = myElement.parentNode.parentNode;

	//if div is greyed out, pushing the button has no effect
	if(myParentDiv.className.indexOf("greyed-out") != -1) {
		return true;
	}

    //if icon is +, set it to -, and if -, set it to +
    if (myElement.innerHTML.indexOf("plus") > -1)  {
        myElement.innerHTML = myElement.innerHTML.replace("plus","minus");
    } else {
        myElement.innerHTML = myElement.innerHTML.replace("minus","plus");
    }

	afficher(nomPanel+"-body"); //trouve le contenu de la fenêtre

    return true;
}

// enlève l'attribut disabled du bouton "id", et greyed-out de la div parente
function ungrey(id) {
	var element = document.getElementById(id);
	var parentDiv = element.parentNode.parentNode.parentNode;

	element.disabled = "";
	parentDiv.className = parentDiv.className.replace(" greyed-out","");
    
    return true;
}

//change la couleur du panel "id" pour le passer à orange
function toDanger(id) {
    var element = document.getElementById(id);
    var button = element.children[0].children[0].children[0];
    
    element.className = element.className.replace("success","danger");
    button.className = button.className.replace("success","danger");
    
    return true;
}

//change la couleur du panel "id" pour le passer à rouge
function toWarning(id) {
    var element = document.getElementById(id);
    var button = element.children[0].children[0].children[0];
    
    element.className = element.className.replace("success","warning");
    button.className = button.className.replace("success","warning");
    
    return true;
}


/*
 * var model = require('../../../model/mongo_config');

var bar = function onPageOpen() {
    document.getElementById("id01").innerHTML = besoins.id01;
}
*/
