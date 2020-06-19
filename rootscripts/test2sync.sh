echo do content and js
ssh -p 44444 -i /home/ubuntu/.ssh/id_test michael2collins@someip2.116.63.22 rm  /var/www/vtest/v/app/*.js
echo rsync
rsync -avu -O --exclude=.git --exclude=natick.zip --exclude=natick --exclude=dist  --exclude=build --exclude=temp --exclude=node_modules --exclude=.c9  -e "ssh -p 44444 -i /home/ubuntu/.ssh/id_test" workspace/ michael2collins@someip2.116.63.22:/home/michael2collins/Web/vtest/v

