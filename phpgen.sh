rm -rf source/client/payment/template
mkdir  source/client/payment/template
php2html ./source/client/payment/table-basic-paymenttracking.php > ./source/client/payment/template/table-basic-paymenttracking.html
php2html ./source/client/payment/userpay.php > ./source/client/payment/template/userpay.html

rm -rf source/client/admin/template
mkdir  source/client/admin/template
#https://stackoverflow.com/questions/48402621/how-to-switch-between-php-5-6-7-2-on-cloude v8.16.0
nvm use v8.16.0

php2html ./source/client/admin/stripe_onboard.php     > ./source/client/admin/template/stripe_onboard.html
php2html ./source/client/admin/table-basic-class.php    > ./source/client/admin/template/table-basic-class.html
php2html ./source/client/admin/table-basic-classrank.php  > ./source/client/admin/template/table-basic-classrank.html
php2html ./source/client/admin/table-basic-htmltemplate.php  > ./source/client/admin/template/table-basic-htmltemplate.html
php2html ./source/client/admin/table-basic-ranks.php     > ./source/client/admin/template/table-basic-ranks.html
php2html ./source/client/admin/table-basic-testtype.php> ./source/client/admin/template/table-basic-testtype.html
php2html ./source/client/admin/table-basic-basic.php  > ./source/client/admin/template/table-basic-basic.html
php2html ./source/client/admin/table-basic-classpgm.php  > ./source/client/admin/template/table-basic-classpgm.html
php2html ./source/client/admin/table-basic-classtest.php  > ./source/client/admin/template/table-basic-classtest.html
php2html ./source/client/admin/table-basic-program.php       > ./source/client/admin/template/table-basic-program.html
php2html ./source/client/admin/table-basic-schedule.php> ./source/client/admin/template/table-basic-schedule.html
php2html ./source/client/admin/table-quickpick.php> ./source/client/admin/template/table-quickpick.html
php2html ./source/client/admin/table-basic-schoolcom.php> ./source/client/admin/template/table-basic-schoolcom.html
php2html ./source/client/admin/table-payer.php> ./source/client/admin/template/table-basic-payer.html
