@echo off
:--- Lancement de l'application  
echo Historique de l'esclave de l'application MOJITO > esclave.log
echo Date du jour de lancement: %date% >> esclave.log
echo Heure de lancement : %time% >> esclave.log
start /B ./soft/node64/node ./esclave.js >> esclave.log
echo Esclave en cours ...