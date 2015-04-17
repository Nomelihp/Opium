// grise tous les enfants de la div "id" ou de l'élément elem et désactive les boutons et formulaires, sauf ceux de la classe 'classe'
function grise(id, elem, classe) {
    var children;
    
    if(id == null) {
        children = elem.children;
    } else {
        children = document.getElementById(id).children;
    }

    for(var i=0; i<children.length; i++) {
        if(children[i].className.indexOf(classe) == -1) { // si la classes n'est pas "classe"
            children[i].disabled = 'disabled';
        }
        grise(null, children[i], classe);
    }
}

// dégrise tous les enfants de la div "id" ou de l'élément elem et résactive les boutons et formulaires, sauf ceux de la classe "classe"
function degrise(id, elem, classe, isInfoCapteur) {
   
    var children;
    
    if(id == null) {
        children = elem.children;
    } else {
        children = document.getElementById(id).children;
    }
    
    for(var i=0; i<children.length; i++) {
        if(children[i].className.indexOf(classe) == -1) { // si la classes n'est pas "classe"
            children[i].disabled = '';
            degrise(null, children[i], classe, isInfoCapteur);
        }
    }
    
    if(!isInfoCapteur) {
        informationCapteur("infoCapteurCb");
    }
}

// Si "information sur le capteur" est coché, dégrise le contenu. Grise sinon.
function informationCapteur(id) {
    
    if(document.getElementById(id).checked == true){
        degrise("infoCapteur", null, "NO_CLASS_NAME", true);
    } else {
        grise("infoCapteur", null, 'root3');
    }
}
