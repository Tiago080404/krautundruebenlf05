import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Adressen() {
  const [adressen, setAdressen] = useState([]);
  const [filter, setFilter] = useState("Alle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdressen();
  }, [filter]);

  const fetchAdressen = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/adressen");
      let gefilterteAdressen = response.data;

      if (filter !== "Alle") {
        gefilterteAdressen = gefilterteAdressen.filter(adresse => adresse.typ === filter);
      }

      setAdressen(gefilterteAdressen);
    } catch (error) {
      console.error("Fehler beim Abrufen der Adressen:", error);
      setError("Fehler beim Laden der Adressen.");
    }
  };

  return (
    <div className="container mt-5">
      <Navbar />
      <h2 className="text-primary text-center">Adressen</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {/* Filter-Dropdown */}
      <div className="d-flex justify-content-center mb-3">
        <select 
          className="form-select w-50" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Alle">Alle Adressen</option>
          <option value="Kunde">Nur Kunden</option>
          <option value="Lieferant">Nur Lieferanten</option>
        </select>
      </div>

      {/* Adressentabelle */}
      {adressen.length > 0 ? (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Straße</th>
              <th>Hausnr.</th>
              <th>PLZ</th>
              <th>Ort</th>
              <th>Typ</th>
            </tr>
          </thead>
          <tbody>
            {adressen.map((adresse, index) => (
              <tr key={index}>
                <td>{adresse.strasse}</td>
                <td>{adresse.hausnr}</td>
                <td>{adresse.plz}</td>
                <td>{adresse.ort}</td>
                <td>
                  <span className={`badge ${adresse.typ === "Kunde" ? "bg-success" : "bg-warning"}`}>
                    {adresse.typ}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-3">Keine Adressen gefunden.</p>
      )}
    </div>
  );
}

export default Adressen;
