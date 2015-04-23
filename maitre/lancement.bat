@echo off
:----  Ajout des logiciels nécessaire dans le path
set PATH=%PATH%;%CD%\soft\exiftool

:--- Lancement de l'application  
mkdir C:\data\db
echo Historique du mongo de l'application MOJITO > mongo.log
echo Date du jour de lancement: %date% >> mongo.log
echo Heure de lancement : %time% >> mongo.log
start /B ./soft/mongo/mongod >> mongo.log
echo Mongo ...
timeout 10 > NUL

echo Historique de l'utilisateur de l'application MOJITO > utilisateur.log
echo Date du jour de lancement: %date% >> utilisateur.log
echo Heure de lancement : %time% >> utilisateur.log
start /B ./soft/node64/node ./utilisateur/bin/www >> utilisateur.log
echo Utilisateur ...
timeout 5 > NUL

echo Historique du metier de l'application MOJITO > metier.log
echo Date du jour de lancement: %date% >> metier.log
echo Heure de lancement : %time% >> metier.log
start /B ./soft/node64/node ./metier/metier.js >> metier.log
echo Metier ...
timeout 5 > NUL

echo Historique du MMManager de l'application MOJITO > MMManager.log
echo Date du jour de lancement: %date% >> MMManager.log
echo Heure de lancement : %time% >> MMManager.log
start /B ./soft/node64/node ./MMManager/MMManager.js >> MMManager.log
echo MMManager ...
echo Application en cours ...