<?php

namespace server\models;

use PDO;

require_once 'Database.php';

class WalletDetail extends Wallet
{
    private $amount;
    private $price;

    public static function getAll()
    {
        $db = Database::connect();
        $sql = "SELECT w.id, w.name, w.currency,
                       COALESCE(SUM(p.amount), 0) AS amount,
                       COALESCE(SUM(p.amount * p.price), 0) AS price
                FROM wallet w
                LEFT JOIN purchase p ON CAST(p.currency AS CHAR) = CAST(w.currency AS CHAR) COLLATE utf8mb4_unicode_ci
                GROUP BY w.id, w.name, w.currency
                ORDER BY w.name ASC";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_CLASS, self::class);
        Database::disconnect();

        return $items;
    }

    public static function get($id)
    {
        $db = Database::connect();
        $sql = "SELECT w.id, w.name, w.currency,
                       COALESCE(SUM(p.amount), 0) AS amount,
                       COALESCE(SUM(p.amount * p.price), 0) AS price
                FROM wallet w
                LEFT JOIN purchase p ON CAST(p.currency AS CHAR) = CAST(w.currency AS CHAR) COLLATE utf8mb4_unicode_ci
                WHERE w.id = ?
                GROUP BY w.id, w.name, w.currency";
        $stmt = $db->prepare($sql);
        $stmt->execute([$id]);
        $item = $stmt->fetchObject(self::class);
        Database::disconnect();

        return $item !== false ? $item : null;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => (int)$this->getId(),
            'name' => $this->getName(),
            'currency' => $this->getCurrency(),
            'amount' => (double)$this->amount,
            'price' => (double)$this->price,
        ];
    }

    public function getAmount()
    {
        return $this->amount;
    }

    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function setPrice($price)
    {
        $this->price = $price;
    }
}