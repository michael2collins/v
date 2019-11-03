sudo a2dismod php5
sudo a2dismod php7.2
sudo a2enmod php7.2
sudo service apache2 restart
sudo update-alternatives --config php-cgi
