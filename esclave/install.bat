@echo off
title INSTALL ESCLAVE
set chemin=%CD:\=/%
set cheminMicMac=%chemin%\soft\micmac\bin
set /p VarQuestion= MicMac est-il installe sur cet ordinateur {O/N} ? 
if %VarQuestion%== O ( 
	set /p VarQuestion= Voulez-vous utiliser le MicMac datant du 3 avril 2015 de ce paquet  {O/N} ?
	if %VarQuestion%== N (
		set /p cheminMicMac= Quel est le chemin absolu vers le dossier bin de MicMac  {exemple c:/chemin/MicMac/bin/} ?
 	)
)


set cheminMicMac=%cheminMicMac:\=/%
set /p IPmaitre= Quelle est l'adresse IP du l'ordinateur maitre  {ex: 135.65.65.3, 127.0.0.1 si le maitre est sur le meme ordinateur} ?
echo { > %CD%\config_esclave.json
 echo "maitre_ip":"%IPmaitre%", >> %CD%\config_esclave.json
 echo "maitre_port":"9207", >> %CD%\config_esclave.json
 echo "esclave_port":"9208", >> %CD%\config_esclave.json
 echo "repertoire_micmac":"%cheminMicMac%", >> %CD%\config_esclave.json
 echo "img_micmac_esclave":"%chemin%/img_micmac" >> %CD%\config_esclave.json
 echo } >> %CD%\config_esclave.json
echo Merci, vous pouvez lancer "lancement.bat"