rm -rf source/client/payment/template
mkdir  source/client/payment/template
php2html ./source/client/payment/table-basic-paymenttracking.php > ./source/client/payment/template/table-basic-paymenttracking.html

rm -rf source/client/admin/template
mkdir  source/client/admin/template

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
