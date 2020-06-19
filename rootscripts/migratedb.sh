#check if server has newer files
#rsync -avu  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@45.79.153.63:/var/www/vdbtestbackups/database-2019-01-01.sql.zip dbfromvdbtest/
rsync -avu  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@45.79.153.63:/home/michael2collins/scripts/vdbtest.sql dbfromvdbtest/

