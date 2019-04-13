# SlimNoCache
PHP [Slim Framework](http://www.slimframework.com/) middleware to set no-cache response headers.

The implmentation is based on SO [discussion](http://stackoverflow.com/a/13640164) on [Browser cache](http://stackoverflow.com/questions/13640109/how-to-prevent-browser-cache-for-php-site).

[![Latest Stable Version](https://poser.pugx.org/palanik/slim-no-cache/v/stable.svg)](https://packagist.org/packages/palanik/slim-no-cache)
[![License](https://poser.pugx.org/palanik/slim-no-cache/license.svg)](https://github.com/palanik/SlimNoCache/blob/master/LICENSE)

## Usage ##
### Composer Autoloader ###

#### Install with [Composer](https://packagist.org/packages/palanik/slim-no-cache) ####
1. Update your `composer.json` to require `palanik/slim-no-cache` package.
2. Run `composer install` to add palanik/SlimNoCache your vendor folder.
```json
{
  "require": {
    "palanik/slim-no-cache": "*"
  }
}
```
#### Autoloading ####
```php
<?php
require ('./vendor/autoload.php');

$app = new \Slim\Slim();

$app->add(new \SlimNoCache\SlimNoCache());
?>
```

### Custom Load ###
```php
<?php
\Slim\Slim::registerAutoLoader();

$app = new \Slim\Slim();

require ('path_to_your_middlewares/SlimNoCache.php');
$app->add(new \SlimNoCache\SlimNoCache());
?>
```

## License ##

  [MIT](LICENSE)