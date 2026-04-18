<?php

use server\controllers\PurchaseRESTController;
use server\controllers\RESTController;
use server\controllers\WalletRESTController;

require_once('controllers/RESTController.php');

// entry point for the rest api
// e.g. GET http://localhost/php41/api.php?r=purchase/25
// or with url_rewrite GET http://localhost/php41/api/purchase/25
// select route: purchase/25 -> controller=purchase, action=GET, id=25
$route = isset($_GET['r']) ? explode('/', trim($_GET['r'], '/')) : ['purchase'];
$controller = sizeof($route) > 0 ? $route[0] : 'purchase';
$arg1 = $route[1] ?? null; // "currency"
$arg2 = $route[2] ?? null; // z.B. "BTC"

if ($controller == 'purchase') {
    require_once('controllers/PurchaseRESTController.php');

    try {
        (new PurchaseRESTController())->handleRequest($arg1,$arg2);
    } catch(Exception $e) {
        RESTController::responseHelper($e->getMessage(), $e->getCode());
    }
} else if ($controller == 'wallet') {
    require_once('controllers/WalletRESTController.php');

    try {
        (new WalletRESTController())->handleRequest($arg1, $arg2);
    } catch (Exception $e) {
        RESTController::responseHelper($e->getMessage(), $e->getCode());
    }
} else {
    RESTController::responseHelper('REST-Controller "' . $controller . '" not found', '404');
}
