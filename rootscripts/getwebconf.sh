#check if server has newer files
rsync -avu -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@45.79.153.63:/etc/apache2/sites-available/ workspace/sites-available/

