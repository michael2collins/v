<?php
$username = "vdbadmin";
$password = "password";
$host = "127.0.0.1";
$database="vdb";
$port= 3306;

// display all error except deprecated and notice
error_reporting( E_ALL & ~E_DEPRECATED & ~E_NOTICE );
// turn on output buffering
ob_start();

// basic options for PDO
$dboptions = array(
    PDO::ATTR_PERSISTENT => FALSE,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
);


try {
    $connection = new PDO("mysql:host=$host;port=$port;dbname=$database", $username, $password);
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
}
try {
    $page = $connection->prepare('SHOW TABLES FROM `vdb` ');
    $page->execute();

    $rows = $page->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as $row) {
        $table = $row["Tables_in_vdb"];
//        echo $table;
        $stmt = $connection->prepare("SELECT * FROM " . $table);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
//        echo json_encode($data);
        $fp = fopen($table . '.json', 'w+');
        fwrite($fp, json_encode(utf8ize($data)));
        fclose($fp);
    }
} catch (Exception $ex) {
    printErrorMessage($ex->getMessage());
}

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}

?>