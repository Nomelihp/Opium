:----  Ajout des logiciels nécessaire dans le path
set PATH=%PATH%;%CD%\exiftool

:--- Lancement de l'application  

start /B ./soft/mongo/mongod
start /B ./soft/node64/node ./utilisateur/bin/www
start /B ./soft/node64/node ./metier/metier.js
start /B ./soft/node64/node ./MMManager/MMManager.js