<?php
require_once 'models/Database.php';
require_once 'controllers/RESTController.php';

try {
    RESTController::checkApiKey();
} catch (Exception $e) {
    http_response_code(401);
    echo "Unauthorized: " . $e->getMessage();
    exit;
}

?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <title>Wetterstation</title>

    <link rel="shortcut icon" href="css/favicon.ico" type="image/x-icon">
    <link rel="icon" href="css/favicon.ico" type="image/x-icon">

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/index.css" rel="stylesheet">

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="js/leaflet.js"></script>

    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/Chart.js"></script>
    <script src="js/home/weather.js"></script>
    <script src="js/home/index.js"></script>

</head>
<body>
