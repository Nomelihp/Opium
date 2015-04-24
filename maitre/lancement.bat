@echo off
:----  Ajout des logiciels nécessaire dans le path
set PATH=%PATH%;%CD%\softs_windows\exiftool

:--- Lancement de l'application  
mkdir C:\data\db 
echo Historique du mongo de l'application MOJITO > mongo.log
echo Date du jour de lancement: %date% >> mongo.log
echo Heure de lancement : %time% >> mongo.log
start /B ./softs_windows/mongo/mongod >> mongo.log
echo Mongo ...
timeout 15 > NUL

echo Historique de l'utilisateur de l'application MOJITO > utilisateur.log
echo Date du jour de lancement: %date% >> utilisateur.log
echo Heure de lancement : %time% >> utilisateur.log
cd utilisateur
start /B ./../softs_windows/node64/node ./bin/www >> ../utilisateur.log
cd ..
echo Utilisateur ...
timeout 5 > NUL

echo Historique du metier de l'application MOJITO > metier.log
echo Date du jour de lancement: %date% >> metier.log
echo Heure de lancement : %time% >> metier.log
cd metier
start /B ./../softs_windows/node64/node ./metier.js >> ../metier.log
cd ..
echo Metier ...
timeout 5 > NUL

echo Historique du MMManager de l'application MOJITO > MMManager.log
echo Date du jour de lancement: %date% >> MMManager.log
echo Heure de lancement : %time% >> MMManager.log
cd MMManager
start /B ./../softs_windows/node64/node ./MMManager.js >> ../MMManager.log
cd ..
echo MMManager ...
echo Application en cours ...