import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Rezepte() {
  const [rezepte, setRezepte] = useState([]); // Liste der Rezepte
  const [kategorien, setKategorien] = useState([]); // Kategorien
  const [ausgewaehlteKategorie, setAusgewaehlteKategorie] = useState(""); // Filter
  const [wenigZutaten, setWenigZutaten] = useState(false); // Toggle für <5 Zutaten
  const [suche, setSuche] = useState(""); // Suchleiste
  const navigate = useNavigate(); // Router-Navigation

  useEffect(() => {
    fetchRezepte();
    fetchKategorien();
  }, [wenigZutaten, ausgewaehlteKategorie]);

  const fetchRezepte = async () => {
    try {
      let url = "http://localhost:5000/api/rezepte";
      if (wenigZutaten) url = "http://localhost:5000/api/rezepte/wenige-zutaten";
      else if (ausgewaehlteKategorie) url = `http://localhost:5000/api/rezepte/kategorie?kategorie=${ausgewaehlteKategorie}`;

      const response = await axios.get(url);
      setRezepte(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Rezepte:", error);
      setRezepte([]);
    }
  };

  const fetchKategorien = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/kategorien");
      setKategorien(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Kategorien:", error);
    }
  };

  const handleSearch = (e) => {
    setSuche(e.target.value);
  };

  // Rezepte nach Suchbegriff filtern
  const gefilterteRezepte = rezepte.filter((rezept) =>
    rezept.name.toLowerCase().includes(suche.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <h1 className="text-primary text-center mb-4">Rezepte</h1>

      {/* Suchleiste */}
      <div className="input-group mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Rezept suchen..."
    value={suche}
    onChange={handleSearch}
  />
  {/* X-Button erscheint, wenn entweder eine Suche aktiv ist oder eine Kategorie gewählt wurde */}
  {(suche || ausgewaehlteKategorie) && (
    <button 
      className="btn btn-outline-secondary" 
      onClick={() => {
        setSuche("");                 // 🔹 Suche leeren
        setAusgewaehlteKategorie(""); // 🔹 Kategorie zurücksetzen
      }}
    >
      <i className="bi bi-x-circle-fill"></i>
    </button>
  )}
</div>


      {/* Kategorien-Filter */}
      <div className="d-flex justify-content-center mb-3">
        <select className="form-select w-50" value={ausgewaehlteKategorie} onChange={(e) => setAusgewaehlteKategorie(e.target.value)}>
          <option value="">-- Wähle eine Kategorie --</option>
          {kategorien.map((kat, index) => (
            <option key={index} value={kat}>{kat}</option>
          ))}
        </select>
      </div>

      {/* Filter für wenig Zutaten */}
      <div className="d-flex justify-content-center mb-4">
        <button className={`btn ${wenigZutaten ? "btn-danger" : "btn-primary"}`} onClick={() => setWenigZutaten(!wenigZutaten)}>
          {wenigZutaten ? "Alle Rezepte anzeigen" : "Nur Rezepte mit <5 Zutaten"}
        </button>
      </div>

      {/* Alle Rezepte anzeigen */}
      <div className="row">
        {gefilterteRezepte.length > 0 ? (
          gefilterteRezepte.map((rezept) => (
            <div key={rezept.rezeptnr} className="col-md-4 col-lg-3 mb-3">
              <div className="card p-3 shadow-sm" onClick={() => navigate(`/rezept/${rezept.rezeptnr}`)} style={{ cursor: "pointer" }}>
                <img src={rezept.bild_url} alt={rezept.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                <div className="card-body">
                  <h5 className="card-title">{rezept.name}</h5>
                  <p className="card-text">{rezept.beschreibung}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Keine passenden Rezepte gefunden...</p>
        )}
      </div>
    </div>
  );
}

export default Rezepte;
