@echo off
title INSTALL ESCLAVE

set cheminMicMac=%CD%\softs_windows\micmac\bin
set /p VarQuestion= MicMac est-il installe sur cet ordinateur {O/N} ? 
if %VarQuestion%== O ( 
	set /p VarQuestion= Voulez-vous utiliser le MicMac datant du 23 avril 2015 de ce paquet  {O/N} ?
	if %VarQuestion%== N (
		set /p cheminMicMac= Quel est le chemin absolu vers le dossier bin de MicMac  {exemple c:/chemin/MicMac/bin/} ?
 	)
)
cd ..
set cheminDonnees=%CD%/maitre/utilisateur/img_micmac/
cd esclave
set IPmaitre=127.0.0.1
set /p VarQuestion= Voulez-vous installer plusieurs esclaves {O/N} ? 
if %VarQuestion%== O ( 
	set /p cheminDonnees= Chemin vers le repertoire partagé  ? 
	set /p IPmaitre= Quelle est l'adresse IP de l'ordinateur maitre  {ex: 135.65.65.3} ?
	)


set cheminMicMac=%cheminMicMac:\=/%
set cheminDonnees=%cheminDonnees:\=/%

echo { > %CD%\config_esclave.json
 echo "maitre_ip":"%IPmaitre%", >> %CD%\config_esclave.json
 echo "maitre_port":"9207", >> %CD%\config_esclave.json
 echo "esclave_port":"9208", >> %CD%\config_esclave.json
 echo "repertoire_micmac":"%cheminMicMac%", >> %CD%\config_esclave.json
 echo "img_micmac_esclave":"%cheminDonnees%" >> %CD%\config_esclave.json
 echo } >> %CD%\config_esclave.json
echo Merci, vous pouvez lancer "lancement.bat"
