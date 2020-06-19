#dryrun  verbose
#rsync -aviun --exclude=.git --exclude=node_modules  --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/ michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v
#remove older js files
#echo do content and js
#ssh -i /home/ubuntu/.ssh/id_test  michael2collins@someip.79.153.63 rm /var/www/vtest/v/app/content/* /var/www/vtest/v/app/*.js
#ssh -i /home/ubuntu/.ssh/id_test  michael2collins@someip.79.153.63 rm  /var/www/vtest/v/app/*.js
echo rsync
ssh -i /home/ubuntu/.ssh/id_test  michael2collins@someip.79.153.63 /home/michael2collins/Web/vtest/grabcode.sh

#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/app/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/app
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/apache_setup/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/apache_setup
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/bower_components/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/bower_components
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/include/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/include
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/v1/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/v1
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/vendor/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/vendor
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/libs/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/libs
#rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/scripts/ michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/scripts
#rsync -avu -O --exclude=.git --exclude=natick --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" *.php  michael2collins@someip.79.153.63:/home/michael2collins/Web/vtest/v/include
#check if server has newer files
#rsync -avun --exclude=app/css --exclude=app/index.html --exclude=app/templates --exclude=app/js --exclude=temp --exclude=.git --exclude=vendor --exclude=bower_components --exclude=.c9 --exclude=node_modules  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v/ workspace/
#rsync -avu --exclude=app/css --exclude=app/index.html --exclude=app/templates --exclude=app/js --exclude=temp --exclude=.git --exclude=vendor --exclude=bower_components --exclude=.c9 --exclude=node_modules  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v/ workspace/

