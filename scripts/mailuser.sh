#as root
useradd -m -s /bin/bash marktest
usermod -aG sudo marktest
cd /home/marktest
su - marktest
ln -s /home/michael2collins/Web/vtest/v/scripts/mailforward.js mailforward.js
ln -s /home/michael2collins/Web/vtest/v/node_modules node_modules
mkdir Maildir
chmod 775 Maildir
cd Maildir
mkdir new
chmod 700 new
mkdir tmp
chmod 775 tmp
mkdir cur
chmod 700 cur
cd ..
echo ":0" > .procmailrc
echo "|/opt/nvm/versions/node/v9.3.0/bin/node /home/marktest/mailforward.js" >> .procmailrc
echo '"|IFS=' '&&exec /usr/bin/procmail -f-||exit 75 #marktest"' > .forward
echo "vdojotest.villaris.us" > .env
