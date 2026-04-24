<?php

namespace server\models;
use DateTime;
use JsonSerializable;
use PDO;

require_once 'DatabaseObject.php';

class Purchase implements DatabaseObject, JsonSerializable
{
    private $id;
    private $date;
    private $currency;
    private $amount;
    private $price;
    private $wallet_id;
    private $isSell = false;
    private $walletCurrency = null;

    private $errors = [];

    public function validate()
    {
        return $this->validateDate()
            & $this->validateAmount()
            & $this->validatePrice()
            & $this->validateWalletId()
            & $this->validateCurrency()
            & $this->validateSellBalance();
    }

    /**
     * create or update an object
     * @return boolean true on success
     */
    public function save()
    {
        if ($this->validate()) {
            if ($this->id != null && $this->id > 0) {
                $this->update();
            } else {
                $this->id = $this->create();
            }

            return true;
        }

        return false;
    }

    /**
     * Creates a new object in the database
     * @return integer ID of the newly created object (lastInsertId)
     */
    public function create()
    {
        $db = Database::connect();
        $sql = "INSERT INTO purchase (date, amount, price, currency, wallet_id) values(?, ?, ?, ?, ?)";
        $stmt = $db->prepare($sql);
        $stmt->execute(array($this->date, $this->amount, $this->price, $this->currency, $this->wallet_id));
        $lastId = $db->lastInsertId();
        Database::disconnect();
        return $lastId;
    }

    /**
     * Saves the object to the database
     */
    public function update()
    {
        $db = Database::connect();
        $sql = "UPDATE purchase set date = ?, amount = ?, price = ?, currency = ?, wallet_id = ? WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute(array($this->date, $this->amount, $this->price, $this->currency, $this->wallet_id, $this->id));
        Database::disconnect();
    }

    /**
     * Get an object from database
     * @param integer $id
     * @return object single object or null
     */
    public static function get($id)
    {
        $db = Database::connect();
        $sql = "SELECT * FROM purchase WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute(array($id));
        $item = $stmt->fetchObject(self::class);  // ORM
        Database::disconnect();
        return $item !== false ? $item : null;
    }

    /**
     * Get an array of objects from database
     * @return array array of objects or empty array
     */
    public static function getAll()
    {
        $db = Database::connect();
        $sql = 'SELECT * FROM purchase ORDER BY date DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute();

        // fetch all datasets (rows), convert to array of Purchase-objects (ORM)
        $items = $stmt->fetchAll(PDO::FETCH_CLASS, self::class);

        Database::disconnect();

        return $items;
    }


    /**
     * Get an array of objects from database
     * @param $currency
     * @return array array of objects or empty array
     */
    public static function getAllGroupByCurrency($currency = '')
    {
        $currency = trim((string)$currency);
        $db = Database::connect();

        if ($currency === '') {
            $sql = 'SELECT currency, SUM(amount) AS amount, SUM(amount * price) AS price FROM purchase GROUP BY currency ORDER BY currency ASC';
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } else {
            $sql = 'SELECT currency, SUM(amount) AS amount, SUM(amount * price) AS price FROM purchase WHERE UPPER(currency) = UPPER(?) GROUP BY currency ORDER BY currency ASC';
            $stmt = $db->prepare($sql);
            $stmt->execute([$currency]);
        }

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Database::disconnect();

        return array_map(function ($item) {
            return [
                'currency' => $item['currency'],
                'amount' => (double)$item['amount'],
                'price' => (double)$item['price'],
            ];
        }, $items);
    }

    /**
     * Deletes the object from the database
     * @param integer $id
     */
    public static function delete($id)
    {
        $db = Database::connect();
        $sql = "DELETE FROM purchase WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute(array($id));
        Database::disconnect();
    }

    private function validateDate()
    {
        $d = DateTime::createFromFormat('Y-m-d H:i:s', $this->date);
        if ($d && $d->format('Y-m-d H:i:s') == $this->date) {
            return true;
        } else {
            $this->errors['date'] = "Ungueltiges Datum";
            return false;
        }
    }

    private function validateAmount()
    {
        if (!is_numeric($this->amount) || $this->amount == 0) {
            $this->errors['amount'] = $this->isSell ? "Menge fuer Verkauf ungueltig" : "Menge ungueltig";
            return false;
        }

        if ($this->isSell) {
            if ($this->amount > 0) {
                $this->amount = -abs($this->amount);
            }
        } else {
            if ($this->amount <= 0) {
                $this->errors['amount'] = "Menge ungueltig";
                return false;
            }
        }

        unset($this->errors['amount']);
        return true;
    }

    private function validatePrice()
    {
        if (!is_numeric($this->price) || $this->price <= 0) {
            $this->errors['price'] = "Preis ungueltig";
            return false;
        } else {
            unset($this->errors['price']);
            return true;
        }
    }

    private function validateCurrency()
    {
        $currency = strtoupper(trim((string)$this->currency));

        if ($currency === '') {
            $this->errors['currency'] = "Waehrung ungueltig";
            return false;
        } else if (strlen($currency) > 32) {
            $this->errors['currency'] = "Waehrung zu lang (max. 32 Zeichen)";
            return false;
        }

        $this->currency = $currency;

        if ($this->walletCurrency !== null && strtoupper((string)$this->walletCurrency) !== $currency) {
            $this->errors['currency'] = "Waehrung passt nicht zur Wallet";
            return false;
        }

        unset($this->errors['currency']);
        return true;
    }

    private function validateWalletId()
    {
        if (!is_numeric($this->wallet_id) || (int)$this->wallet_id <= 0) {
            $this->errors['wallet_id'] = "Wallet ungueltig";
            return false;
        }

        $this->wallet_id = (int)$this->wallet_id;

        $db = Database::connect();
        $sql = "SELECT currency FROM wallet WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$this->wallet_id]);
        $wallet = $stmt->fetch(PDO::FETCH_ASSOC);
        Database::disconnect();

        if ($wallet === false) {
            $this->errors['wallet_id'] = "Wallet nicht gefunden";
            return false;
        }

        $this->walletCurrency = strtoupper(trim((string)$wallet['currency']));
        unset($this->errors['wallet_id']);

        return true;
    }

    private function validateSellBalance()
    {
        if (!$this->isSell) {
            unset($this->errors['amount']);
            return true;
        }

        if (!is_numeric($this->wallet_id) || !is_numeric($this->amount) || trim((string)$this->currency) === '') {
            return false;
        }

        $db = Database::connect();
        if ($this->id != null && (int)$this->id > 0) {
            $sql = "SELECT COALESCE(SUM(amount), 0) AS balance FROM purchase WHERE wallet_id = ? AND UPPER(currency) = UPPER(?) AND id <> ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([(int)$this->wallet_id, (string)$this->currency, (int)$this->id]);
        } else {
            $sql = "SELECT COALESCE(SUM(amount), 0) AS balance FROM purchase WHERE wallet_id = ? AND UPPER(currency) = UPPER(?)";
            $stmt = $db->prepare($sql);
            $stmt->execute([(int)$this->wallet_id, (string)$this->currency]);
        }

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        Database::disconnect();

        $balance = $row ? (double)$row['balance'] : 0.0;
        $resultingBalance = $balance + (double)$this->amount;

        if ($resultingBalance < -0.00000001) {
            $this->errors['amount'] = "Nicht genug Bestand fuer Verkauf";
            return false;
        }

        unset($this->errors['amount']);
        return true;
    }

    /**
     * define attributes which are part of the json output
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            "id" => intval($this->id),
            "date" => $this->date,
            "currency" => $this->currency,
            "amount" => doubleval($this->amount),
            "price" => doubleval($this->price),
            "wallet_id" => intval($this->wallet_id),
        ];
    }

    public function setIsSell($isSell)
    {
        $this->isSell = (bool)$isSell;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * @return mixed
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * @param mixed $currency
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;
    }

    /**
     * @return mixed
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @param mixed $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    /**
     * @return mixed
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param mixed $price
     */
    public function setPrice($price)
    {
        $this->price = $price;
    }

    public function getWalletId()
    {
        return $this->wallet_id;
    }

    public function setWalletId($wallet_id)
    {
        $this->wallet_id = $wallet_id;
    }

    /**
     * @return array
     */
    public function getErrors()
    {
        return $this->errors;
    }

    /**
     * @param array $errors
     */
    public function setErrors($errors)
    {
        $this->errors = $errors;
    }

}
