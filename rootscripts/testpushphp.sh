cd environment
#grunt build
#need to add less to gulp
#rm -rf app/content
rm app/*.js*
#rm app/template/*.html*
#gulp clean && gulp build && gulp cleanphp && gulp final && gulp special1 && gulp special2
./phpgen.sh
yarn build-d
#yarn build
cp -R build/* app
#cp -R source/client/admin/*.php app/templates/admin
#cp -R source/client/admin/stripe-onboard.php app/templates/admin
#cp -R source/client/payment/*.php app/templates/payment
#rsync --recursive --include= source/client/payment/*.php app/templates/payment/
#cp -R source/client/includes/*.php app/templates/includes
cd ..
./test2sync.sh
