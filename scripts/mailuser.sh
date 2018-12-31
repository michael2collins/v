#as root
#useradd -m -s /bin/bash marktest
#usermod -aG sudo marktest
user=$1
site=$2
domain=$3
school=$4
nodeversion=$5

cd /home/$user
ln -s /home/michael2collins/Web/$site/v/scripts/mailforward.js mailforward.js
ln -s /home/michael2collins/Web/$site/v/node_modules node_modules
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
echo "|/opt/nvm/versions/node/$nodeversion/bin/node /home/$user/mailforward.js" >> .procmailrc
echo '"|IFS=' '&&exec /usr/bin/procmail -f-||exit 75 #$user"' > .forward
echo "host=$domain.villaris.us" > .env
echo "school=$school" >> .env
chown -h $user:$user *
chown -h $user:$user .*
