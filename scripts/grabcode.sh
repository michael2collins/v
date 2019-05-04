rm -rf /home/michael2collins/Web/vtest/v
mkdir /home/michael2collins/Web/vtest/v
cd /home/michael2collins/Web/vtest/v
svn export https://github.com/michael2collins/v/trunk/apache_setup
svn export https://github.com/michael2collins/v/trunk/app
svn export https://github.com/michael2collins/v/trunk/include
svn export https://github.com/michael2collins/v/trunk/bower_components
svn export https://github.com/michael2collins/v/trunk/libs
svn export https://github.com/michael2collins/v/trunk/scripts
svn export https://github.com/michael2collins/v/trunk/v1
svn export https://github.com/michael2collins/v/trunk/vendor

cp /home/michael2collins/Configtest.php.vtest /home/michael2collins/Web/vtest/v/include/Configtest.php

echo "<?php" > /home/michael2collins/Web/vtest/v/v1/mode.php
echo "\$mode = 'test'" >> /home/michael2collins/Web/vtest/v/v1/mode.php
echo "?>" >> /home/michael2collins/Web/vtest/v/v1/mode.php

mv /home/michael2collins/Web/vtest/v/app/vendor/jquery.cardswipe/dist2 /home/michael2collins/Web/vtest/v/app/vendor/jquery.cardswipe/dist