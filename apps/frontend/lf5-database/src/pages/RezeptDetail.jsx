import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function RezeptDetail() {
  const { id } = useParams();
  const [rezept, setRezept] = useState(null);
  const [zutaten, setZutaten] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRezeptDetails();
    fetchZutaten();
  }, []);

  const fetchRezeptDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rezepte/${id}`);
      setRezept(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen des Rezepts:", error);
      setError("Rezept nicht gefunden.");
    }
  };

  const fetchZutaten = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rezepte/zutaten?rezeptId=${id}`);
      setZutaten(
        response.data.map((zutat) => ({
          ...zutat,
          menge: Math.round(zutat.menge) // 🔹 Mengen zu ganzen Zahlen runden
        }))
      );
    } catch (error) {
      console.error("Fehler beim Abrufen der Zutaten:", error);
    }
  };

  const handleMengenChange = (index, factor) => {
    setZutaten((prevZutaten) =>
      prevZutaten.map((z, i) =>
        i === index
          ? { ...z, menge: Math.max(1, Math.round(z.menge * factor)) }
          : z
      )
    );
  };

  return (
    <div className="container mt-5 text-center">
      <Navbar />
      {error && <p className="text-danger mt-3">{error}</p>}

      {rezept && (
        <div className="card shadow-lg p-4 rounded border-0 bg-light w-75 mx-auto">
          <h1 className="text-primary mb-3">{rezept.name}</h1>

          {/* 🔥 Bild jetzt perfekt zentriert */}
          <div className="d-flex flex-column align-items-center">
            <img
              src={rezept.bild_url}
              alt={rezept.name}
              className="img-fluid rounded shadow-sm mb-2"
              style={{ maxWidth: "450px", borderRadius: "15px" }}
            />
            {/* 🔥 Bildquelle anzeigen */}
            {rezept.bild_url && (
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Bildquelle: <a href={rezept.bild_url} target="_blank" rel="noopener noreferrer">Originalbild</a>
              </p>
            )}
          </div>

          <p className="lead">{rezept.beschreibung}</p>

          <h4 className="mt-4 text-success">🥣 Zubereitung</h4>
          <p className="bg-white p-3 rounded shadow-sm">{rezept.zubereitung}</p>

          <h4 className="mt-4 text-info">🛒 Zutaten</h4>
          <div className="table-responsive">
            <table className="table table-hover table-bordered bg-white">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">Zutat</th>
                  <th className="text-center">Menge</th>
                  <th className="text-center">Aktion</th>
                  <th className="text-center">Warenkorb</th>
                </tr>
              </thead>
              <tbody>
                {zutaten.map((zutat, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{zutat.bezeichnung}</td>
                    <td className="text-center">{zutat.menge} {zutat.einheit}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger mx-1"
                        onClick={() => handleMengenChange(index, 0.5)}
                        title="Menge halbieren"
                      >
                        <i className="bi bi-dash-circle"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success mx-1"
                        onClick={() => handleMengenChange(index, 2)}
                        title="Menge verdoppeln"
                      >
                        <i className="bi bi-plus-circle"></i>
                      </button>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-warning text-dark">
                        <i className="bi bi-cart-plus-fill"></i> In den Warenkorb
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default RezeptDetail;
