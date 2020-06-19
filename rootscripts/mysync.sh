#dryrun  verbose
#rsync -aviun --exclude=.git --exclude=node_modules  --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/ michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v
rsync -avu -O --exclude=.git --exclude=natick  --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/ michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v
rsync -avu -O --exclude=.git --exclude=natick  --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" *.php michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v/include
#check if server has newer files
#rsync -avun --exclude=app/css --exclude=app/index.html --exclude=app/templates --exclude=app/js --exclude=temp --exclude=.git --exclude=vendor --exclude=bower_components --exclude=.c9 --exclude=node_modules  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v/ workspace/
#rsync -avu --exclude=app/css --exclude=app/index.html --exclude=app/templates --exclude=app/js --exclude=temp --exclude=.git --exclude=vendor --exclude=bower_components --exclude=.c9 --exclude=node_modules  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test"  michael2collins@someip.79.153.63:/home/michael2collins/Web/v/v/ workspace/

