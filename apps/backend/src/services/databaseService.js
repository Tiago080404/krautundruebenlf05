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

//T-Dog aufgaben:
app.get("/rezepte/bestimmte", async (req, res) => {
  //const value = req.query.ingredientValue;

  //console.log("Angefragte Zutat:", value);
  try {
    const value = req.query.ingredientValue;

    const query =
      "select r.rezeptnr, r.name,r.beschreibung,r.zubereitung from rezept r join rezeptzutat r2 on r.rezeptnr = r2.rezeptnr join zutat on zutat.zutatennr = r2.zutatennr where zutat.bezeichnung = $1";
    const result = await pool.query(query, [value]);
    if (result) {
      res.status(200).json({ message: "works", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/rezepte/nutrition", async (req, res) => {
  const { kundennr } = req.query;
  console.log(req.query);
  try {
    const query = `
      SELECT 
        b.kundennr, k.nachname, k.vorname,
        AVG(z.kalorien * b2.menge) AS durchscnittliche_kalorien,
        AVG(z.kohlenhydrate * b2.menge) AS durchscnittliche_kohlenhydrate,
        AVG(z.protein * b2.menge) AS durchschnittliche_proteine
      FROM bestellung b
      JOIN bestellungzutat b2 ON b.bestellnr = b2.bestellnr
      JOIN zutat z ON z.zutatennr = b2.zutatennr
      JOIN kunde k ON b.kundennr = k.kundennr
      WHERE k.kundennr = $1
      GROUP BY b.kundennr, k.nachname, k.vorname;
    `;
    const result = await pool.query(query, [kundennr]);
    if (result) {
      res.status(200).json({ message: "works:", data: result.rows[0] });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
