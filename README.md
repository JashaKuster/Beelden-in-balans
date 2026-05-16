# Beelden in Balans

Minimalistische website om beelden te tonen met een overzicht op de hoofdpagina en een klikbare pop-up galerij.

## Starten

1. Zorg dat Node.js is geïnstalleerd.
2. Start de server:

```bash
node /home/runner/work/Beelden-in-balans/Beelden-in-balans/server.js
```

3. Open daarna:

```text
http://localhost:3000
```

## Beelden toevoegen of verwijderen

De website leest automatisch alle mappen in:

```text
/home/runner/work/Beelden-in-balans/Beelden-in-balans/beelden/
```

- **Per beeld:** maak een eigen map (bijv. `beelden/dansend-figuur/`)
- **Foto's:** zet `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` of `.svg` bestanden in die map
- **Verwijderen:** verwijder een map of haal foto's eruit

Na verversen van de pagina zie je direct de bijgewerkte lijst.

## Voorbeeldstructuur

```text
beelden/
  bronzen-vorm/
    01.jpg
    02.jpg
  stille-balans/
    aanzicht.png
```
