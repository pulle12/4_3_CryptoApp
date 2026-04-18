<?php

namespace server\controllers;

use server\models\Wallet;
use server\models\WalletDetail;

require_once('RESTController.php');
require_once('models/Wallet.php');
require_once('models/WalletDetail.php');

class WalletRESTController extends RESTController
{
    public function handleRequest($arg1 = null, $arg2 = null)
    {
        switch ($this->method) {
            case 'GET':
                $this->handleGETRequest($arg1, $arg2);
                break;
            case 'POST':
                $this->handlePOSTRequest();
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
        if ($arg1 === null || $arg1 === '') {
            $this->response(WalletDetail::getAll());
            return;
        }

        if ($arg1 === 'purchase' && $arg2 !== null) {
            $this->response(Wallet::getPurchasesByWallet($arg2));
            return;
        }

        if (ctype_digit((string)$arg1)) {
            $wallet = Wallet::get((int)$arg1);
            if ($wallet === null) {
                $this->response('Not Found', 404);
                return;
            }

            $this->response($wallet);
            return;
        }

        $this->response('Not Found', 404);
    }

    private function handlePOSTRequest()
    {
        $model = new Wallet();
        $model->setName($this->getDataOrNull('name'));
        $model->setCurrency($this->getDataOrNull('currency'));

        if ($model->save()) {
            $this->response('OK', 201);
        } else {
            $this->response($model->getErrors(), 400);
        }
    }

    private function handlePUTRequest()
    {
        if ($this->verb == null && sizeof($this->args) == 1 && ctype_digit((string)$this->args[0])) {
            $wallet = Wallet::get((int)$this->args[0]);
            if ($wallet === null) {
                $this->response('Not Found', 404);
                return;
            }

            $wallet->setName($this->getDataOrNull('name'));
            $wallet->setCurrency($this->getDataOrNull('currency'));

            if ($wallet->save()) {
                $this->response('OK');
            } else {
                $this->response($wallet->getErrors(), 400);
            }
            return;
        }

        $this->response('Not Found', 404);
    }

    private function handleDELETERequest()
    {
        if ($this->verb == null && sizeof($this->args) == 1 && ctype_digit((string)$this->args[0])) {
            $wallet = Wallet::get((int)$this->args[0]);
            if ($wallet === null) {
                $this->response('Not Found', 404);
                return;
            }

            Wallet::delete((int)$this->args[0]);
            $this->response('OK', 200);
            return;
        }

        $this->response('Not Found', 404);
    }
}

