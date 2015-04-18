function plusMoins(id) {

	var myElement = document.getElementById(id+'-button'); //trouve le bouton
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

	afficher(id); //trouve le contenu de la fenêtre

    return true;
}

/*
 * var model = require('../../../model/mongo_config');

var bar = function onPageOpen() {
    document.getElementById("id01").innerHTML = besoins.id01;
}
*/
