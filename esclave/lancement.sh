echo "Historique de l'esclave de l'application MOJITO" > esclave.log
echo "Heure du lancement : $(date)" >> esclave.log
nohup ./softs_windows/node64/node ./esclave.js >> esclave.log &
echo "Esclave lancé"
