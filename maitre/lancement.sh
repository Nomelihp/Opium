# Lancement de l'application  
echo "Historique du mongo de l'application MOJITO" > mongo.log
echo "Date du lancement: $(date)" >> mongo.log
echo $(nohup mongod &) >> mongo.log
echo Mongo ...
sleep 15

echo "Historique de l'utilisateur de l'application MOJITO" > utilisateur.log
echo "Date du lancement: $(date)" >> utilisateur.log
cd utilisateur
echo $(nohup ./bin/www &) >> ../utilisateur.log
cd ..
echo Utilisateur ...
sleep 5

echo "Historique du metier de l'application MOJITO" > metier.log
echo "Date du lancement: $(date)" >> metier.log
cd metier
echo $(nohup ./metier.js &) >> ../metier.log
cd ..
echo Metier ...
sleep 5

echo "Historique du MMManager de l'application MOJITO" > MMManager.log
echo "Date du lancement: $(date)" >> MMManager.log
cd MMManager
echo $(nohup ./MMManager.js &) >> ../MMManager.log
cd ..
echo MMManager ...

echo Application lancée avec succès ...
