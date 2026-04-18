<?php

namespace server\models;

use JsonSerializable;
use PDO;
require_once "Purchase.php";

require_once 'DatabaseObject.php';

class Wallet implements DatabaseObject, JsonSerializable
{
    protected $name;
    protected $currency;
    protected $id;
    private $errors = [];

    public static function getPurchasesByWallet($id)
    {
        $db = Database::connect();
        $sql = "SELECT * FROM `purchase` JOIN wallet ON purchase.wallet_id=wallet.id WHERE wallet.id=?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $items = $stmt->fetchAll(PDO::FETCH_CLASS, Purchase::class);
        Database::disconnect();

        return $items;
    }

    public function validate()
    {
        return $this->validateName() & $this->validateCurrency();
    }

    public function save()
    {
        if ($this->validate()) {
            if ($this->id !== null && (int)$this->id > 0) {
                $this->update();
            } else {
                $this->id = $this->create();
            }

            return true;
        }

        return false;
    }

    public function create()
    {
        $db = Database::connect();
        $sql = "INSERT INTO wallet (name, currency) VALUES (?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute([$this->name, $this->currency]);
        $lastId = $db->lastInsertId();
        Database::disconnect();

        return $lastId;
    }

    public function update()
    {
        $db = Database::connect();
        $sql = "UPDATE wallet SET name = ?, currency = ? WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$this->name, $this->currency, $this->id]);
        Database::disconnect();
    }

    public static function get($id)
    {
        $db = Database::connect();
        $sql = "SELECT * FROM wallet WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $item = $stmt->fetchObject(self::class);
        Database::disconnect();

        return $item !== false ? $item : null;
    }

    public static function getAll()
    {
        $db = Database::connect();
        $sql = "SELECT * FROM wallet ORDER BY name ASC";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_CLASS, self::class);
        Database::disconnect();

        return $items;
    }

    public static function delete($id)
    {
        $db = Database::connect();
        $sql = "DELETE FROM wallet WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        Database::disconnect();
    }

    private function validateName()
    {
        $name = trim((string)$this->name);

        if ($name === '') {
            $this->errors['name'] = 'Name ungueltig';
            return false;
        }

        if (strlen($name) > 64) {
            $this->errors['name'] = 'Name zu lang (max. 64 Zeichen)';
            return false;
        }

        $this->name = $name;
        unset($this->errors['name']);

        return true;
    }

    private function validateCurrency()
    {
        $currency = strtoupper(trim((string)$this->currency));

        if ($currency === '') {
            $this->errors['currency'] = 'Waehrung ungueltig';
            return false;
        }

        if (strlen($currency) > 10) {
            $this->errors['currency'] = 'Waehrung zu lang (max. 10 Zeichen)';
            return false;
        }

        $this->currency = $currency;
        unset($this->errors['currency']);

        return true;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => (int)$this->id,
            'name' => $this->name,
            'currency' => $this->currency,
        ];
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getCurrency()
    {
        return $this->currency;
    }

    public function setCurrency($currency)
    {
        $this->currency = $currency;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function setErrors($errors)
    {
        $this->errors = $errors;
    }
}