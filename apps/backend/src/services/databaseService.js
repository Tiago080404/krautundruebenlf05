const express = require("express");
const port = 5000;
const { Pool } = require("pg");
const cors = require("cors");
const app = express();

let corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "postgres",
  database: "postgres",
});

pool.connect();

app.get("/getUserData", async (req, res) => {
  try {
    const query = "SELECT * FROM KUNDE";
    const result = await pool.query(query);
    if (result) {
      res.status(200).json({
        message: "Password successfully retrieved",
        data: result.rows,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

/// C-DOG AUFGABE 1:
app.get("/api/rezepte", async (req, res) => {
  try {
    const rezeptName = req.query.name;
    let query;
    let params = [];

    if (rezeptName) {
      // Wenn ein Name übergeben wurde, suche nach dem Rezept
      query = `
        SELECT R.REZEPTNR, R.NAME, R.BESCHREIBUNG, R.ZUBEREITUNG, R.BILD_URL
        FROM REZEPT R
        WHERE R.NAME ILIKE $1
      `;
      params.push(`%${rezeptName}%`);
    } else {
      // Wenn kein Name übergeben wurde, hole alle Rezepte
      query = `
        SELECT REZEPTNR, NAME, BESCHREIBUNG, ZUBEREITUNG, BILD_URL 
        FROM REZEPT
      `;
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Keine Rezepte gefunden" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Rezepte:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
  }
});

/// C-DOG AUFGABE 2:
app.get("/api/kategorien", async (req, res) => {
  try {
    const result = await pool.query("SELECT NAME FROM KATEGORIE");
    res.json(result.rows.map((row) => row.name));
  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.get("/api/rezepte/kategorie", async (req, res) => {
  try {
    const kategorie = req.query.kategorie;
    if (!kategorie) {
      return res.status(400).json({ error: "Kategorie ist erforderlich" });
    }

    const query = `
      SELECT R.REZEPTNR, R.NAME, R.BESCHREIBUNG, R.ZUBEREITUNG, R.BILD_URL
      FROM REZEPT R
      JOIN REZEPTKATEGORIE RK ON R.REZEPTNR = RK.REZEPTNR
      JOIN KATEGORIE K ON RK.KATEGORIENR = K.KATEGORIENR
      WHERE K.NAME = $1
    `;

    const result = await pool.query(query, [kategorie]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Keine Rezepte gefunden" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Daten:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
  }
});
app.get("/api/rezepte/zutaten", async (req, res) => {
  try {
    const rezeptId = req.query.rezeptId;
    if (!rezeptId) {
      return res.status(400).json({ error: "Rezept-ID ist erforderlich" });
    }

    const query = `
      SELECT Z.BEZEICHNUNG, RZ.MENGE, RZ.EINHEIT
      FROM REZEPTZUTAT RZ
      JOIN ZUTAT Z ON RZ.ZUTATENNR = Z.ZUTATENNR
      WHERE RZ.REZEPTNR = $1
    `;

    const result = await pool.query(query, [rezeptId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Keine Zutaten für dieses Rezept gefunden" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Zutaten:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Zutaten" });
  }
});

app.get("/api/zutaten", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT ZUTATENNR, BEZEICHNUNG FROM ZUTAT ORDER BY BEZEICHNUNG ASC"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Keine Zutaten gefunden" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Zutaten:", error);
    res.status(500).json({ error: "Fehler beim Abrufen der Zutaten" });
  }
});
/// C-DOG Aufgabe 3:
app.get("/api/zutaten/unbenutzt", async (req, res) => {
  try {
    const query = `
      SELECT Z.*
      FROM ZUTAT Z
      LEFT JOIN REZEPTZUTAT RZ ON Z.ZUTATENNR = RZ.ZUTATENNR
      WHERE RZ.ZUTATENNR IS NULL;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der unbenutzten Zutaten:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});
/// C-DOG AUFGABE 4:
app.get("/api/rezepte/wenige-zutaten", async (req, res) => {
  try {
    const query = `
      SELECT R.*
      FROM REZEPT R
      WHERE R.REZEPTNR IN (
          SELECT REZEPTNR 
          FROM REZEPTZUTAT
          GROUP BY REZEPTNR
          HAVING COUNT(*) < 5
      );
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(
      "Fehler beim Abrufen der Rezepte mit wenigen Zutaten:",
      error
    );
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.get("/api/rezepte/:id", async (req, res) => {
  try {
    const rezeptId = req.params.id;
    const query = "SELECT * FROM REZEPT WHERE REZEPTNR = $1";
    const result = await pool.query(query, [rezeptId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rezept nicht gefunden" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Fehler beim Abrufen des Rezepts:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

/// C-DOG Extra-Aufgabe
app.post("/api/rezepte/neu", async (req, res) => {
  const { name, beschreibung, zubereitung, bild_url, kategorie, zutaten } =
    req.body;

  try {
    const rezeptRes = await pool.query(
      "INSERT INTO REZEPT (NAME, BESCHREIBUNG, ZUBEREITUNG, BILD_URL) VALUES ($1, $2, $3, $4) RETURNING REZEPTNR",
      [name, beschreibung, zubereitung, bild_url]
    );
    const rezeptNr = rezeptRes.rows[0].rezeptnr;

    let kategorieRes = await pool.query(
      "SELECT KATEGORIENR FROM KATEGORIE WHERE NAME = $1",
      [kategorie]
    );

    let kategorienr;
    if (kategorieRes.rows.length === 0) {
      const neueKategorie = await pool.query(
        "INSERT INTO KATEGORIE (NAME) VALUES ($1) RETURNING KATEGORIENR",
        [kategorie]
      );
      kategorienr = neueKategorie.rows[0].kategorienr;
    } else {
      kategorienr = kategorieRes.rows[0].kategorienr;
    }
    await pool.query(
      "INSERT INTO REZEPTKATEGORIE (REZEPTNR, KATEGORIENR) VALUES ($1, $2)",
      [rezeptNr, kategorienr]
    );
    for (let z of zutaten) {
      await pool.query(
        "INSERT INTO REZEPTZUTAT (REZEPTNR, ZUTATENNR, MENGE, EINHEIT) VALUES ($1, $2, $3, $4)",
        [rezeptNr, z.zutatenNr, z.menge, z.einheit]
      );
    }

    res.json({
      rezeptnr: rezeptNr,
      message: "Rezept erfolgreich gespeichert!",
    });
  } catch (err) {
    console.error("❌ Fehler beim Speichern des Rezepts:", err);
    res.status(500).json({ error: "Fehler beim Speichern des Rezepts." });
  }
});

app.get("/api/einheiten", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT EINHEIT FROM ZUTAT WHERE EINHEIT IS NOT NULL ORDER BY EINHEIT"
    );
    res.json(result.rows.map((row) => row.einheit));
  } catch (error) {
    console.error("Fehler beim Abrufen der Einheiten:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Zusatzabfrage C-DOG
app.get("/api/adressen", async (req, res) => {
  try {
    const query = "SELECT * FROM ADRESSE ORDER BY ORT, STRASSE";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Adressen:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

/// Bestellungen C-DOG
app.get("/api/bestellungen", async (req, res) => {
  try {
    const query = `
      SELECT B.BESTELLNR, K.VORNAME, K.NACHNAME, B.BESTELLDATUM, B.RECHNUNGSBETRAG
      FROM BESTELLUNG B
      JOIN KUNDE K ON B.KUNDENNR = K.KUNDENNR
      ORDER BY B.BESTELLDATUM DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Bestellungen:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});
app.get("/api/bestellungen/:id", async (req, res) => {
  try {
    const bestellnr = req.params.id;

    // Bestellungsinformationen abrufen
    const bestellungQuery = `
      SELECT B.BESTELLNR, K.VORNAME, K.NACHNAME, B.BESTELLDATUM, B.RECHNUNGSBETRAG
      FROM BESTELLUNG B
      JOIN KUNDE K ON B.KUNDENNR = K.KUNDENNR
      WHERE B.BESTELLNR = $1
    `;
    const bestellungRes = await pool.query(bestellungQuery, [bestellnr]);

    if (bestellungRes.rows.length === 0) {
      return res.status(404).json({ error: "Bestellung nicht gefunden" });
    }

    // Zutaten der Bestellung abrufen
    const zutatenQuery = `
      SELECT Z.ZUTATENNR, Z.BEZEICHNUNG, BZ.MENGE, Z.EINHEIT
      FROM BESTELLUNGZUTAT BZ
      JOIN ZUTAT Z ON BZ.ZUTATENNR = Z.ZUTATENNR
      WHERE BZ.BESTELLNR = $1
    `;
    const zutatenRes = await pool.query(zutatenQuery, [bestellnr]);

    // Response mit Bestellungsinfos und Zutaten
    res.json({
      bestellung: bestellungRes.rows[0],
      zutaten: zutatenRes.rows,
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Bestellungsdetails:", error);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
