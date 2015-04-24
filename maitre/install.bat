@echo off
title INSTALL MAITRE


set cheminDonnees=%CD%/utilisateur/img_micmac/


set /p VarQuestion= Voulez-vous installer plusieurs esclaves {O/N} ? 
if %VarQuestion%== O ( 
	set /p cheminDonnees= Chemin vers le repertoire partagé  ? 
	)

set cheminDonnees=%cheminDonnees:\=/%

echo { > %CD%\config.json
 echo "utilisateur":"9204", >> %CD%\config.json
 echo "metier":"9205", >> %CD%\config.json
 echo "MMManager_metier":"9206",>> %CD%\config.json
 echo "MMManager_esclave":"9207", >> %CD%\config.json
 echo "mongodb_port":"27017",>> %CD%\config.json
 echo "mongodb_db_name":"opium", >> %CD%\config.json
 echo "mongodb_ip":"127.0.0.1", >> %CD%\config.json
 echo "repertoire_donnees":"%cheminDonnees%", >> %CD%\config.json
 echo "repertoire_micmac":"", >> %CD%\config.json
 echo "repertoire_mongodb":"", >> %CD%\config.json 
 echo "login":"localuser" >> %CD%\config.json
 echo } >> %CD%\config.json
echo Merci, vous pouvez lancer "lancement.bat"
