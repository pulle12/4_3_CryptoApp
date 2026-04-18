<?php

namespace server\controllers;

use server\models\Wallet;
require_once __DIR__ . '/../models/Wallet.php';

class WalletRESTController extends RESTController
{
    public function handleRequest($arg1 = null, $arg2 = null)
    {
        switch ($this->method) {
            case 'GET':
                $this->handleGETRequest($arg1, $arg2);
                break;
            case 'POST':
                $this->handlePOSTRequest($arg1, $arg2);
                break;
            case 'PUT':
                $this->handlePUTRequest();
                break;
            case 'DELETE':
                $this->handleDELETERequest();
                break;
            default:
                $this->response('Method Not Allowed', 405);
                break;
        }
    }

    private function handleGETRequest($arg1 = null, $arg2 = null)
    {
        // GET http://localhost/php43_angabe/server/api/wallet
        if ($arg1 === null || $arg1 === '') {
            $this->response(Wallet::getAll());
            return;
        }

        // GET http://localhost/php43_angabe/server/api/wallet/2
        // GET http://localhost/php43_angabe/server/api/wallet/2/purchase
        if (ctype_digit($arg1)) {
            if(!empty($arg2) && $arg2 === 'purchase') {
                $this->response(Wallet::getPurchasesByWallet((int)$arg1));
            } else {
                $model = Wallet::get((int)$arg1);
                if ($model === null) {
                    $this->response('Not Found', 404);
                    return;
                }
                $this->response($model);
            }
        } else {
            $this->response('Bad Request', 400);
        }
    }

}