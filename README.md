# CryptoApp - Angabe - php43

Dies ist die Angabe zur Aufgabe "CryptoApp".

Aufbauend auf den Grundlagen des Datenbankzugriffs und Object-Relational-Mapping (ORM) werden hier das Model-View-Controller (MVC) Pattern und AJAX behandelt.

http://localhost/php43_angabe/server/api/purchase

Teampartner: Pius Rauch (Pisus7)

## Schritte zum parallelen Arbeiten
In einem Ordner (ohne den konkreten Projektordner zu erstellen):
```
git clone https://github.com/pulle12/4_3_CryptoApp.git
git checkout -b <branch-name>
# (etwas im Code machen)
git push -u origin <branch-name>
# Merge Pull Request auf GitHub erstellen
git switch main
git branch -D <branch-name>
git branch -D --remote origin/<branch-name>
```

## Aufgabenverteilung

Frontend (HTML, CSS, JS, vue.js): Pius

Backend (PHP, MySQL, JS): Paul

## Architektur
Die CryptoApp verwendet ein klares MVC-Prinzip.
Das Frontend (Vue.js, HTML, CSS, JavaScript) stellt die UI und Interaktion bereit.
Das Backend (PHP) liefert eine REST-API fuer Wallets und Purchases.
Die Datenhaltung erfolgt in MySQL.

Ziel der Aufteilung:
1. Klare Trennung von Darstellung, Logik und Daten.
2. Einfachere Wartung und Erweiterung.
3. Unabhaengige Entwicklung von Frontend und Backend.

## Struktur
Das Projekt ist in drei Hauptbereiche aufgeteilt:
1. Frontend: Seiten, Komponenten, Styling und Client-Logik.
2. Backend: API-Einstieg, Controller und Datenmodelle.
3. Datenbank: SQL-Definitionen fuer Tabellen, Integrität und Startdaten.

Kurz gesagt:
Das Frontend ruft API-Endpunkte auf, die Controller verarbeiten die Requests,
Modelle validieren und speichern Daten, und MySQL sichert die Persistenz.

## DB-Erklärung
Im Unterschied zu einer normalen, einfachen SQL-Datei (nur Tabellen + Basisdaten)
enthält diese Version zusaetzliche Integrität- und Qualitätsregeln.

Wichtigste Unterschiede:
1. Foreign Key zwischen purchase und wallet.
2. CHECK-Constraints fuer gueltige Werte.
3. Indizes fuer haeufige Abfragen.
4. Datenbereinigung/Normalisierung fuer bestehende Datensaetze.

Vorteile:
1. Hoehere Datenkonsistenz und weniger fehlerhafte Eintraege.
2. Verhindert verwaiste Datensaetze.
3. Fruehes Abfangen ungueltiger Eingaben auf Datenbankebene.
4. Bessere Performance bei Filter- und Listenabfragen.
5. Stabileres Zusammenspiel von API-Validierung und Datenbankregeln.

## Hinweis zu AI-Nutzung
In diesem Projekt wurden KI-Tools als Unterstützung bei Formulierung, Analyse und Refactoring verwendet.

Konkret eingesetzt für:
1. Formulierung und sprachliche Verbesserung einzelner README-Abschnitte.
2. Analyse von Validierungs- und API-Lücken (Frontend/Backend).
3. Vorschläge für SQL-Härtung (Foreign Key, CHECK-Constraints, Indizes, Datenbereinigung).

Nicht automatisiert übernommen:
1. Fachliche Entscheidungen und Endauswahl der Umsetzung.
2. Anpassung an Projektanforderungen und bestehende Codebasis.
3. Technische Verifikation durch manuelle Tests und Syntaxchecks.

Die Verantwortung für Inhalt, Korrektheit und Abgabe liegt vollständig beim Projektteam.