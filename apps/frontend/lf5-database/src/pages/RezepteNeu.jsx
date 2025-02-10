import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

function NeuesRezept() {
  const [name, setName] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [zubereitung, setZubereitung] = useState("");
  const [bildUrl, setBildUrl] = useState("");
  const [zutaten, setZutaten] = useState([]);
  const [alleZutaten, setAlleZutaten] = useState([]);
  const [alleEinheiten, setAlleEinheiten] = useState([]);
  const [kategorie, setKategorie] = useState("");
  const [kategorien, setKategorien] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchZutaten();
    fetchEinheiten();
    fetchKategorien();
  }, []);

  const fetchZutaten = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/zutaten");
      setAlleZutaten(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Zutaten:", error);
    }
  };

  const fetchEinheiten = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/einheiten");
      setAlleEinheiten(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Einheiten:", error);
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

  const addZutat = () => {
    setZutaten([...zutaten, { zutatenNr: "", menge: 1, einheit: "" }]);
  };

  const updateZutat = (index, field, value) => {
    const updatedZutaten = [...zutaten];
    updatedZutaten[index][field] = value;
    setZutaten(updatedZutaten);
  };

  const removeZutat = (index) => {
    const updatedZutaten = zutaten.filter((_, i) => i !== index);
    setZutaten(updatedZutaten);
  };

  const resetForm = () => {
    setName("");
    setBeschreibung("");
    setZubereitung("");
    setBildUrl("");
    setKategorie("");
    setZutaten([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !beschreibung || !zubereitung || !bildUrl || !kategorie || zutaten.length === 0) {
      setError("Bitte fülle alle Felder aus.");
      return;
    }
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/rezepte/neu", {
        name,
        beschreibung,
        zubereitung,
        bild_url: bildUrl,
        kategorie,
        zutaten
      });

      alert(`Rezept erfolgreich hinzugefügt! Rezept-ID: ${response.data.rezeptnr}`);
      resetForm();
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Rezepts:", error);
      setError("Fehler beim Speichern des Rezepts.");
    }
  };

  return (
    <div>
      <Navbar />
      <h2 className="text-primary text-center">Neues Rezept hinzufügen</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
        <div className="mb-3">
          <label className="form-label">Rezeptname</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Beschreibung</label>
          <textarea className="form-control" value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Zubereitung</label>
          <textarea className="form-control" value={zubereitung} onChange={(e) => setZubereitung(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Bild-URL</label>
          <input type="text" className="form-control" value={bildUrl} onChange={(e) => setBildUrl(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Kategorie</label>
          <select className="form-select" value={kategorie} onChange={(e) => setKategorie(e.target.value)} required>
            <option value="">-- Wähle eine Kategorie --</option>
            {kategorien.map((kat, index) => (
              <option key={index} value={kat}>{kat}</option>
            ))}
          </select>
        </div>

        <h4>Zutaten:</h4>
        {zutaten.map((zutat, index) => (
          <div key={index} className="row mb-2">
            <div className="col-md-4">
              <select className="form-select" value={zutat.zutatenNr} onChange={(e) => updateZutat(index, "zutatenNr", e.target.value)}>
                <option value="">Zutat wählen</option>
                {alleZutaten.map((z) => (
                  <option key={z.zutatennr} value={z.zutatennr}>{z.bezeichnung}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" value={zutat.menge} onChange={(e) => updateZutat(index, "menge", e.target.value)} />
            </div>
            <div className="col-md-3">
              <select className="form-select" value={zutat.einheit} onChange={(e) => updateZutat(index, "einheit", e.target.value)}>
                <option value="">Einheit wählen</option>
                {alleEinheiten.map((einheit, idx) => (
                  <option key={idx} value={einheit}>{einheit}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button type="button" className="btn btn-danger" onClick={() => removeZutat(index)}>X</button>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-info my-3" onClick={addZutat}>+ Zutat hinzufügen</button>

        <button type="submit" className="btn btn-success w-100">Rezept speichern</button>
      </form>
    </div>
  );
}

export default NeuesRezept;
