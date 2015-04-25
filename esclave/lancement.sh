echo "Historique de l'esclave de l'application MOJITO" > esclave.log
echo "Heure du lancement : $(date)" >> esclave.log
nohup echo ./softs_windows/node64/node ./esclave.js & >> esclave.log 2>&1
echo "Esclave lancé"
