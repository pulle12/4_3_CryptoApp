-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Erstellungszeit: 12. Feb 2021 um 08:03
-- Server-Version: 8.0.16
-- PHP-Version: 7.0.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `php43_angabe`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `purchase`
--

CREATE TABLE `purchase` (
                            `id` int(11) NOT NULL,
                            `date` datetime NOT NULL,
                            `amount` double NOT NULL,
                            `price` double NOT NULL,
                            `currency` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Daten für Tabelle `purchase`
--

INSERT INTO `purchase` (`id`, `date`, `amount`, `price`, `currency`) VALUES
(1, '2021-02-01 09:07:19', 0.01, 25000, 'BTC'),
(2, '2021-01-25 19:07:19', 0.01, 20000, 'BTC'),
(16, '2021-02-11 18:01:40', 0.2, 1482.35, 'ETH'),
(17, '2021-02-11 18:11:13', 0.2, 1476.76, 'ETH'),
(18, '2021-02-12 07:58:36', 0.03, 39161.95, 'BTC'),
(19, '2021-02-12 08:00:12', 0.6, 1461.01, 'ETH');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `purchase`
--
ALTER TABLE `purchase`
    ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `purchase`
--
ALTER TABLE `purchase`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
