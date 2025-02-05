import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Kategorien() {
  const [kategorien, setKategorien] = useState([]); // Ernährungskategorien
  const [ausgewaehlteKategorie, setAusgewaehlteKategorie] = useState(""); // Gewählte Kategorie
  const [rezepte, setRezepte] = useState([]); // Rezepte für eine Kategorie
  const [gewaehltesRezept, setGewaeltesRezept] = useState(null); // Das aktuell angezeigte Rezept
  const [error, setError] = useState("");

  // **Ernährungskategorien aus der Datenbank abrufen**
  useEffect(() => {
    const fetchKategorien = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/kategorien");
        setKategorien(response.data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Kategorien:", error);
      }
    };
    fetchKategorien();
  }, []);

  // **Rezepte nach Ernährungskategorie abrufen**
  useEffect(() => {
    if (ausgewaehlteKategorie) {
      fetchRezepteByKategorie(ausgewaehlteKategorie);
    }
  }, [ausgewaehlteKategorie]);

  const fetchRezepteByKategorie = async (kategorie) => {
    try {
      setError("");
      const response = await axios.get(`http://localhost:5000/api/rezepte/kategorie`, {
        params: { kategorie }
      });

      if (response.data.length === 0) {
        setError("Keine Rezepte in dieser Kategorie gefunden.");
        setRezepte([]);
      } else {
        setRezepte(response.data);
      }
    } catch (error) {
      console.error("Fehler bei der API-Anfrage:", error);
      setError("Fehler beim Abrufen der Daten.");
      setRezepte([]);
    }
  };

  // **Zutaten eines Rezepts abrufen, wenn darauf geklickt wird**
  const fetchZutaten = async (rezept) => {
    try {
      // Speichert das Rezept inklusive Zubereitung
      setGewaeltesRezept({
        ...rezept,
        zutaten: [] // Zutaten werden gleich geladen
      });

      const response = await axios.get(`http://localhost:5000/api/rezepte/zutaten`, {
        params: { rezeptId: rezept.rezeptnr }
      });

      if (response.data.length === 0) {
        setError("Keine Zutaten für dieses Rezept gefunden.");
      } else {
        setError("");
        setGewaeltesRezept(prevRezept => ({
          ...prevRezept,
          zutaten: response.data // Zutaten ins Rezept speichern
        }));
      }
    } catch (error) {
      console.error("Fehler bei der API-Anfrage:", error);
      setError("Fehler beim Abrufen der Zutaten.");
    }
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <h1 className="text-primary">Kategorien</h1>
      <p>Wähle eine Ernährungskategorie und klicke auf ein Rezept, um die Details zu sehen.</p>

      {/* Dropdown für Ernährungskategorien */}
      <select 
        className="form-select mb-3"
        value={ausgewaehlteKategorie}
        onChange={(e) => setAusgewaehlteKategorie(e.target.value)}
      >
        <option value="">-- Wähle eine Kategorie --</option>
        {kategorien.length > 0 ? (
          kategorien.map((kat, index) => (
            <option key={index} value={kat}>{kat}</option>
          ))
        ) : (
          <option disabled>Lädt Kategorien...</option>
        )}
      </select>

      {/* Fehlermeldung anzeigen */}
      {error && <p className="text-danger">{error}</p>}

      {/* Gefundene Rezepte für die ausgewählte Kategorie */}
      <div className="row">
        {rezepte.map((rezept) => (
          <div key={rezept.rezeptnr} className="col-md-4 mb-3">
            <div className="card" onClick={() => fetchZutaten(rezept)} style={{ cursor: "pointer" }}>
              <img 
                src={rezept.bild_url} 
                alt={rezept.name} 
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
{gewaehltesRezept && (
  <p style={{ fontSize: "10px", color: "gray" }}>
    Bildquelle: {gewaehltesRezept.bild_url}
  </p>
)}

              <div className="card-body">
                <h5 className="card-title">{rezept.name}</h5>
                <p className="card-text">{rezept.beschreibung}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailansicht des ausgewählten Rezepts */}
      {gewaehltesRezept && (
        <div className="mt-4">
          <h2 className="text-success">{gewaehltesRezept.name}</h2>

          {/* Rezeptbild */}
          {gewaehltesRezept.bild_url && (
            <div className="mb-3 text-center">
              <img 
                src={gewaehltesRezept.bild_url} 
                alt={gewaehltesRezept.name} 
                className="img-fluid rounded mb-2"
                style={{ width: "300px", height: "auto", objectFit: "cover" }}
              />
<p style={{ fontSize: "10px", color: "gray" }}>
  Bildquelle: {gewaehltesRezept.bild_url}
</p>

            </div>
          )}

          {/* Zubereitung anzeigen */}
          <h4>Zubereitung:</h4>
          <p>{gewaehltesRezept.zubereitung || "Keine Zubereitung verfügbar."}</p>

          {/* Zutaten-Tabelle */}
          <h4>Zutaten:</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Zutat</th>
                <th>Menge</th>
                <th>Einheit</th>
              </tr>
            </thead>
            <tbody>
              {gewaehltesRezept.zutaten && gewaehltesRezept.zutaten.length > 0 ? (
                gewaehltesRezept.zutaten.map((zutat, index) => (
                  <tr key={index}>
                    <td>{zutat.bezeichnung}</td>
                    <td>{zutat.menge}</td>
                    <td>{zutat.einheit}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">Lädt Zutaten...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Kategorien;
