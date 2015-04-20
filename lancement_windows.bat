:----  Ajout des logiciels nécessaire dans le path
:REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path /d "%PATH%;C:\Users\Hippolyte\Documents\cours_IT3\opium_install_windows_64\windows\mongo\mongoexe" /f
set PATH=%PATH%;%CD%\soft_windows\mongo;%CD%\soft_windows\node64;%CD%\soft_windows\micmac\binaire-aux;%CD%\soft_windows\micmac\bin

:--- Lancement de l'application  


