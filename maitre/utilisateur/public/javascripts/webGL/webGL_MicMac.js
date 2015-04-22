/*
	Le module de visualisation de ply necessite les balises suivantes dans le fichier html :

		<div id="WebGL" style="width:50%;height:400px; "> </div>

		<script src="js/three.min.js"></script>
		<script src="js/webGL_MicMac.js"></script>
		<script src="js/Projector.js"></script>
		<script src="js/PLYLoader.js"></script>
		<script src="js/Detector.js"></script>
		<script src="js/OrbitControls.js"></script>
		<script src="js/CanvasRenderer.js"></script>
	
	Pour intégrer la saisie d'un masque 3D ajouter les balises suivantes :

		<input type="radio" id="saisieMasqButton1+le nom de la div contenant le webGL" name="saisieMasqButton"  value="1"> Oui<br>
		<input type="radio" id="saisieMasqButton2+le nom de la div contenant le webGL"  name="saisieMasqButton"   value="2" checked> Non<br>
		<button id="submitMasq+le nom de la div contenant le webGL" >Masque terminé</button>
*/





var mesh;
var container, stats;
var camera, scene, renderer;
var raycaster = new THREE.Raycaster();
var saisieMasq = false;
var listMasque2D= [];
var file;
var div;

webGL_MicMac= function(fileParam,divParam) {
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
div=divParam;
file =fileParam;
init();
animate();
}

//--------------- Initialisation------

function init() {

	container = document.getElementById( div );
	// var context = container.getContext();

  // do some drawing
  
//--------------- Camera------
	camera = new THREE.PerspectiveCamera( 60, document.getElementById(div).offsetWidth / document.getElementById(div).offsetHeight, 1, 1000 );
	camera.position.z = 4;
//--------------- Déplacement dans l'interface 3D------
	controls = new THREE.OrbitControls( camera , container,container );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x72645b, 2, 100 );


// Lecture du PLY file

var loader = new THREE.PLYLoader();
loader.addEventListener( 'load', function ( event ) {

	var geometry = event.content;
	var material = new THREE.PointCloudMaterial( { vertexColors: THREE.VertexColors,size:0.1} );

	mesh = new THREE.PointCloud( geometry,material);
	mesh.position.set( geometry.vertices[0].x, geometry.vertices[0].y, geometry.vertices[0].z );
	mesh.rotation.set( 0, - Math.PI / 2, 0 );
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	scene.add( mesh );
//---------------- Contient toutes les données du ply---

/*
console.log(mesh.geometry);
*/

//-----------------
} );


loader.load( file );

// Lights

scene.add( new THREE.AmbientLight( 0x777777 ) );

addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );





// renderer

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setClearColor( scene.fog.color );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( document.getElementById(div).offsetWidth, document.getElementById(div).offsetHeight );

renderer.gammaInput = true;
renderer.gammaOutput = true;

renderer.shadowMapEnabled = true;
renderer.shadowMapCullFace = THREE.CullFaceBack;

container.appendChild( renderer.domElement );

// --- Initialisation du Saisie Masque----
if(saisieMasq){
	document.addEventListener( 'click', onDocumentMouseClick, false );
	document.removeEventListener( 'contextmenu', onDocumentRightClick, false )
	
}

try{
	document.getElementById("submitMasq"+div).addEventListener("click", envoyerJSON);
	document.getElementById("saisieMasq"+div).addEventListener("click", saisieMasque);
	document.getElementById("resetMasq"+div).addEventListener("click", resetMasq);
}catch (e){
	console.log(' Les boutons pour la saisie du masque ne sont pas disponible');
}


window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'click', onWindowResize, false );

}

function addShadowedLight( x, y, z, color, intensity ) {

	var directionalLight = new THREE.DirectionalLight( color, intensity );
	directionalLight.position.set( x, y, z )
	scene.add( directionalLight );

	directionalLight.castShadow = true;


	var d = 1;
	directionalLight.shadowCameraLeft = -d;
	directionalLight.shadowCameraRight = d;
	directionalLight.shadowCameraTop = d;
	directionalLight.shadowCameraBottom = -d;

	directionalLight.shadowCameraNear = 1;
	directionalLight.shadowCameraFar = 4;

	directionalLight.shadowMapWidth = 1024;
	directionalLight.shadowMapHeight = 1024;

	directionalLight.shadowBias = -0.005;
	directionalLight.shadowDarkness = 0.15;

}

function onWindowResize() {

	camera.aspect = document.getElementById(div).offsetWidth/ document.getElementById(div).offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( document.getElementById(div).offsetWidth, document.getElementById(div).offsetHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();

	controls.update();
}

function render() {

	var timer = Date.now() * 0.0005;

	renderer.render( scene, camera );

}


//----- Fonction pour supprimer un point du saisie masque avec le click droit
function onDocumentRightClick( event ) {

	event.preventDefault();
	
	if (listMasque2D.length>0){
		if (listMasque2D.length>1){

			scene.children.pop();

		} 
		scene.children.pop();
		listMasque2D.pop();
	}
	
}


//----- Fonction pour ajouter un point du saisie masque avec le click gauche
function onDocumentMouseClick( event ) {
	
	var rectBox=document.getElementById(div).getBoundingClientRect();
	if(event.clientX<rectBox.right 
		&& event.clientX>rectBox.left 
		&& event.clientY<rectBox.bottom 
		&& event.clientY>rectBox.top){

		event.preventDefault();

		var mouse = new THREE.Vector2();
		mouse.x =  ((event.clientX -rectBox.left)/ rectBox.width )* 2 - 1 ;
		mouse.y =   -((event.clientY -rectBox.top)/ rectBox.height ) * 2 + 1;
	
		raycaster.setFromCamera( mouse, camera );
		var mouseclick=new THREE.Vector3(raycaster.ray.origin.x+raycaster.ray.direction.x*5,raycaster.ray.origin.y+raycaster.ray.direction.y*5,raycaster.ray.origin.z+raycaster.ray.direction.z*5);

	

	
		if (listMasque2D.length!=0){
			var geometry = new THREE.Geometry();
			var material = new THREE.LineBasicMaterial({color: 0x0000ff});
			geometry.vertices.push(scene.children[scene.children.length-1].position,mouseclick);
			var line = new THREE.Line( geometry, material );
			scene.add( line );
		}
		

		listMasque2D.push(new THREE.Vector2(event.clientX -rectBox.left,event.clientY -rectBox.top));
		var sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.1, 26, 18 ), new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true, wireframe:true } ) );
	    sphere.position.set(mouseclick.x,mouseclick.y,mouseclick.z);
	    scene.add( sphere );

  
}

}
// Intégration du chantier au besoin côté serveur
function envoyerJSON(){    
	
	var rectBox=document.getElementById(div).getBoundingClientRect();
	

	if (listMasque2D.length<3) { 
		alert("Vous devez selectionner un minimum de 3 points")
	} else{
		

var text = '{ "_id":"'+$("#idChantier").val()+'"';
		text +=  ',"masque3D":{"SelectionInfo" : { "Item" : ';

		text = text+ '{"ModelViewMatrix": "';
		text= text+camera.matrix.elements[0];
		for (var i = 1; i < 16; i++) {
			text= text+' '+camera.matrix.elements[i];
		};

		text= text+'", "ProjMatrix" : "';
		text= text+camera.projectionMatrix.elements[0];
		for (var i = 1; i < 16; i++) {
			text= text+' '+camera.projectionMatrix.elements[i];
		};

		text= text+'", "glViewport" : "';
		text= text+0+" "+0+" "+rectBox.width+" "+rectBox.height+'", ';

		text= text + '"Pt" : [';
		text= text+' "'+listMasque2D[0].x+' '+listMasque2D[0].y+'"';
		for (var i = 1; i < listMasque2D.length; i++) {
			text= text+' ,"'+listMasque2D[i].x+' '+listMasque2D[i].y+'"';
		};
		text= text+'],"Mode" : "1"}}}}';


		
		

		
		var req = new XMLHttpRequest();    
		req.open('POST','/nouveau_chantier',true);
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		req.onreadystatechange = function (aEvt) {
		if (req.readyState == 4) {
			 if(req.status == 200)
			 {
				  alert("masque mis à jour");
			 }
		  }
		};
		req.send(text); 
			


		
		
		
		
		/*var form = document.createElement("form");
    	var	input = document.createElement("input");

		form.action = "test.html";
		form.method = "post"

		input.name = "masqXml";
		input.value = text;
		form.appendChild(input);

		document.body.appendChild(form);
		form.submit();*/


	}
};

//----- Activer Désactiver la saisie du Masque

function saisieMasque(){
	
		saisieMasq=true;
		controls.enabled = false;
		document.addEventListener( 'click', onDocumentMouseClick, false );
		document.addEventListener( 'contextmenu', onDocumentRightClick, false );
		
	


}
function resetMasq(){
	

		while (listMasque2D.length>0){
			if (listMasque2D.length>1){

				scene.children.pop();

			} 
			scene.children.pop();
			listMasque2D.pop();
		}


		saisieMasq=false;
		controls.enabled = true;
		document.removeEventListener( 'click', onDocumentMouseClick, false );
		document.removeEventListener( 'contextmenu', onDocumentRightClick, false );
		
	


}
