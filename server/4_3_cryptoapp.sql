-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Apr 2026 um 14:16
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `4_3_cryptoapp`
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
  `currency` varchar(64) NOT NULL,
  `wallet_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `purchase`
--

INSERT INTO `purchase` (`id`, `date`, `amount`, `price`, `currency`, `wallet_id`) VALUES
(1, '2021-02-01 09:07:19', 0.01, 25000, 'BTC', 1),
(2, '2021-01-25 19:07:19', 0.01, 20000, 'BTC', 0),
(16, '2021-02-11 18:01:40', 0.2, 1482.35, 'ETH', 0),
(17, '2021-02-11 18:11:13', 0.2, 1476.76, 'ETH', 0),
(18, '2021-02-12 07:58:36', 0.03, 39161.95, 'BTC', 0),
(19, '2021-02-12 08:00:12', 0.6, 1461.01, 'ETH', 0),
(20, '2021-02-12 08:00:12', 0.6, 146.7, 'ETH', 0),
(21, '2026-04-14 14:55:55', 0.02, 63039.45, 'BTC', 0),
(22, '2026-04-14 14:55:59', 0.02, 63039.45, 'BTC', 0),
(23, '2026-04-14 14:56:00', 0.02, 63039.45, 'BTC', 0),
(24, '2026-04-14 14:56:01', 0.02, 63039.45, 'BTC', 0),
(25, '2026-04-14 14:57:42', 0.02, 63039.45, 'BTC', 0),
(26, '2026-04-17 09:41:26', 0.02, 63666.55, 'BTC', 0),
(27, '2026-04-17 09:41:37', 0.02, 63666.55, 'BTC', 0),
(28, '2026-04-17 09:41:37', 0.02, 63666.55, 'BTC', 0),
(29, '2026-04-17 09:53:42', 0.02, 63665.39, 'BTC', 0),
(30, '2026-04-17 10:04:51', -0.02, 63692.15, 'BTC', 0),
(31, '2026-04-17 10:04:54', -0.02, 63692.15, 'BTC', 0),
(32, '2026-04-17 10:04:54', -0.02, 63692.15, 'BTC', 0),
(33, '2026-04-17 10:04:58', -0.02, 1980.9, 'ETH', 0),
(34, '2026-04-17 10:05:02', -0.02, 63692.15, 'BTC', 0),
(35, '2026-04-17 10:05:11', -0.02, 63692.15, 'BTC', 0),
(36, '2026-04-17 10:06:10', 0.02, 63738.49, 'BTC', 0),
(37, '2026-04-17 10:06:11', 0.02, 63738.49, 'BTC', 0),
(38, '2026-04-17 10:06:12', -0.02, 63738.49, 'BTC', 0),
(39, '2026-04-17 10:07:08', -0.02, 63734.99, 'BTC', 0),
(40, '2026-04-17 10:07:09', 0.02, 63734.99, 'BTC', 0),
(41, '2026-04-17 10:07:09', 0.02, 63734.99, 'BTC', 0),
(42, '2026-04-17 10:08:10', 1, 0.2177, 'ADA', 0),
(43, '2026-04-17 10:08:13', -0.02, 0.2177, 'ADA', 0),
(44, '2026-04-17 10:08:14', -0.02, 0.2177, 'ADA', 0),
(45, '2026-04-17 10:08:14', -0.02, 0.2177, 'ADA', 0),
(46, '2026-04-17 10:23:51', 0.02, 0.2176, 'ADA', 0),
(47, '2026-04-17 10:23:52', -0.02, 0.2176, 'ADA', 0),
(48, '2026-04-17 10:23:52', -0.02, 0.2176, 'ADA', 0),
(49, '2026-04-18 13:07:29', 0.02, 0.2143, 'ADA', 0),
(50, '2026-04-18 13:07:29', 0.02, 0.2143, 'ADA', 0),
(51, '2026-04-18 13:07:31', -0.02, 0.2143, 'ADA', 0),
(52, '2026-04-18 13:07:31', -0.02, 0.2143, 'ADA', 0),
(53, '2026-04-18 14:04:29', 0.02, 0.2137, 'ADA', 0),
(54, '2026-04-18 14:04:30', -0.02, 0.2137, 'ADA', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `wallet`
--

CREATE TABLE `wallet` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `currency` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `wallet`
--

INSERT INTO `wallet` (`id`, `name`, `currency`) VALUES
(1, 'Test-Wallet', 'BTC');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT für Tabelle `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
