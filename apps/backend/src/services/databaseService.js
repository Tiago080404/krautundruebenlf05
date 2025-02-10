const express = require("express");
const port = 5000;
const { Pool, Query } = require("pg");
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
    console.log(req.query);
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
    console.log(
      "Input Werte:",
      name,
      beschreibung,
      zubereitung,
      bild_url,
      kategorie,
      zutaten
    );
    const result = await pool.query(
      "SELECT neues_rezept_anlegen($1, $2, $3, $4, $5, $6) AS rezeptnr",
      [
        name,
        beschreibung,
        zubereitung,
        bild_url,
        kategorie,
        JSON.stringify(zutaten),
      ]
    );
    if (result) {
      res.json({
        rezeptnr: result.rows[0].rezeptnr,
        message: "Rezept erfolgreich gespeichert!",
      });
    }
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

//T-Dog aufgaben:
// Auswahl aller Rezepte, die eine gewisse Zutat enthalten
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
//Berechnung der durchschnittlichen Nährwerte aller Bestellungen eines Kunden
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
//Top 5 Zutaten
app.get("/rezepte/topfive", async (req, res) => {
  try {
    const query =
      "select z.bezeichnung ,count(r.zutatennr)  as zutatenhaeufigkeit from rezeptzutat r join zutat z on r.zutatennr = z.zutatennr group by z.bezeichnung order by zutatenhaeufigkeit desc limit 5";
    const result = await pool.query(query);

    if (result) {
      res
        .status(200)
        .json({ message: "Top 5 retrieved successfully", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});
//Auswahl aller Rezepte, die eine bestimmte Kalorienmenge nicht überschreiten
app.get("/rezepte/bestimmtekalorien", async (req, res) => {
  const { kalorien } = req.query;
  console.log(kalorien);
  try {
    const value = kalorien;
    const query =
      "select r.name,r.beschreibung,r.zubereitung from rezept r join rezeptzutat r2  on r2.rezeptnr = r.rezeptnr join zutat z on z.zutatennr = r2.zutatennr group by r.name, r.beschreibung, r.zubereitung having sum(z.kalorien) <$1;";
    const result = await pool.query(query, [value]);
    if (result) {
      res
        .status(200)
        .json({ message: "Bestimmte Kalorien", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});

//Auswahl aller Rezepte, die weniger als fünf Zutaten enthalten und eine bestimmte Ernährungskategorie erfüllen
//Der ist nicht auf der Website eingebaut
app.get("/rezepte/kategorieandfive", async (req, res) => {
  try {
    console.log(req.body);
    const value = req.body.kategorienr;
    const query =
      "select r.name,r.beschreibung,r.zubereitung from rezept r join rezeptzutat r2 on r2.rezeptnr = r.rezeptnr join zutat z on z.zutatennr = r2.zutatennr join rezeptkategorie r3 on r3.rezeptnr=r.rezeptnr join kategorie k on k.kategorienr = r3.kategorienr where k.name =$1 group by  r.rezeptnr,r.name, r.beschreibung, r.zubereitung  having count(r2.rezeptnr)<20";
    const result = await pool.query(query, [value]);

    if (result) {
      res.status(200).json({ message: "Hier die Rezepte:", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});

//Alle Kunden mit Bestellungen
app.get("/rezepte/kundemitbestellung", async (req, res) => {
  try {
    const query =
      "select k.vorname, b.bestellnr  from kunde k left join bestellung b on b.kundennr = k.kundennr";
    const result = await pool.query(query);
    if (result) {
      res.status(200).json({
        message: "Kunde mit bestellungen",
        data: result.rows,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
//`sp_search_recipes_by_ingredient_and_calorie`)
app.get("/rezepte/zutatundkalorien", async (req, res) => {
  console.log(req.query.zutat);
  console.log(req.query.kalorien);
  try {
    const value1 = req.query.zutat;
    const value2 = req.query.kalorien;
    const query = "Select * from get_recipes_with_butter($1,$2)";
    const result = await pool.query(query, [value1, value2]);

    if (result) {
      res.status(200).json({ message: "Rezepte abgerufen", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});
//sp_get_average_nutrition_for_customer`
app.get("/rezepte/durchschnittlichevonkunde", async (req, res) => {
  try {
    const value = req.query.customernr;
    console.log(value);
    const query = "SELECT * From sp_kunden_ernaehrung($1)";
    const result = await pool.query(query, [value]);
    if (result) {
      res.status(200).json({ message: "success", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});

//daten abrufen für kunden
app.get("/user/wantsdata", async (req, res) => {
  try {
    const value = "2001";
    const query =
      "SELECT K.vorname,K.nachname,K.geburtsdatum,K.telefon,K.email,A.strasse,A.hausnr,A.plz,A.ort,A.typ FROM KUNDE K JOIN ADRESSE A ON A.adressennr = K.adressennr WHERE K.kundennr = $1";
    const result = await pool.query(query, [value]);
    if (result) {
      res
        .status(200)
        .json({ message: "Here is the Data from", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});

//daten löschen lassen wenn Kunde es möchte
app.delete("/delete/userdata", async (req, res) => {
  try {
    const value = "2001";
    const query =
      "DELETE KUNDE FROM KUNDE K JOIN ADRESSE A ON A.adressennr=K.adressennr where K.kundennr = $1";
    const result = await pool.query(query, [value]);

    if (result) {
      res
        .status(200)
        .json({ message: "Your data got deleted!", data: result.rows });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
