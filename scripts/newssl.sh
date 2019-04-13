#need to stop port80 to let ssl listen
#service apache2 stop
cd /opt/letsencrypt
sudo -H ./letsencrypt-auto certonly  --apache --renew-by-default -d villaris.us -d mail.villaris.us -d admin.villaris.us -d events.villaris.us -d medway.villaris.us -d micha
el2collins.villaris.us -d natick.villaris.us -d vdojo.villaris.us -d vdojotest.villaris.us -d www.villaris.us
cd ..
#service apache2 start