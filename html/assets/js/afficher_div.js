function afficher(id)
{    
    var elements = ["on_click1","on_click2","on_click3","on_click4"];
    
    for(var i=0; i<4; i++) {
        document.getElementById(elements[i]).style.display="none";
        console.log(elements[i]);
    }

    document.getElementById(id).style.display="block";

    return true;
}
