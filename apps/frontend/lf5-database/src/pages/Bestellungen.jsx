import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Bestellungen() {
  const [bestellungen, setBestellungen] = useState([]);
  const [error, setError] = useState("");
  const [sortColumn, setSortColumn] = useState("bestellnr");
  const [sortOrder, setSortOrder] = useState("asc");
  const [details, setDetails] = useState(null); // Speichert die angeklickte Bestellung

  useEffect(() => {
    fetchBestellungen();
  }, []);

  const fetchBestellungen = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bestellungen");
      if (Array.isArray(response.data) && response.data.length > 0) {
        setBestellungen(response.data);
      } else {
        setError("Keine Bestellungen gefunden.");
      }
    } catch (error) {
      console.error("❌ Fehler beim Abrufen der Bestellungen:", error);
      setError("Fehler beim Laden der Bestellungen.");
    }
  };

  const fetchBestellDetails = async (bestellnr) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bestellungen/${bestellnr}`);
      setDetails(response.data);
    } catch (error) {
      console.error("❌ Fehler beim Abrufen der Bestellungsdetails:", error);
    }
  };

  const sortData = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedData = [...bestellungen].sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (column === "bestelldatum") {
        valueA = new Date(a.bestelldatum);
        valueB = new Date(b.bestelldatum);
      }

      return newSortOrder === "asc" ? (valueA < valueB ? -1 : 1) : (valueA > valueB ? -1 : 1);
    });

    setBestellungen(sortedData);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return "";
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="container mt-5">
      <Navbar />
      <h2 className="text-primary text-center">Bestellungen</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      {bestellungen.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th onClick={() => sortData("bestellnr")} style={{ cursor: "pointer" }}>
                  # {getSortIcon("bestellnr")}
                </th>
                <th onClick={() => sortData("vorname")} style={{ cursor: "pointer" }}>
                  Kunde {getSortIcon("vorname")}
                </th>
                <th onClick={() => sortData("bestelldatum")} style={{ cursor: "pointer" }}>
                  Bestelldatum {getSortIcon("bestelldatum")}
                </th>
                <th onClick={() => sortData("rechnungsbetrag")} style={{ cursor: "pointer" }}>
                  Rechnungsbetrag {getSortIcon("rechnungsbetrag")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bestellungen.map((bestellung, index) => (
                <tr key={index} onClick={() => fetchBestellDetails(bestellung.bestellnr)} style={{ cursor: "pointer" }}>
                  <td>{bestellung.bestellnr ?? "N/A"}</td>
                  <td>{bestellung.vorname} {bestellung.nachname}</td>
                  <td>
                    {bestellung.bestelldatum
                      ? new Date(bestellung.bestelldatum).toLocaleDateString("de-DE", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "Unbekannt"}
                  </td>
                  <td>{bestellung.rechnungsbetrag ? `${bestellung.rechnungsbetrag} €` : "0.00 €"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-3">Keine Bestellungen gefunden.</p>
      )}

      {/* Detailansicht */}
      {details && (
        <div className="card mt-4">
          <div className="card-header bg-dark text-white">
            <h5>Details zur Bestellung #{details.bestellung.bestellnr}</h5>
          </div>
          <div className="card-body">
            <p><strong>Kunde:</strong> {details.bestellung.vorname} {details.bestellung.nachname}</p>
            <p><strong>Bestelldatum:</strong> {new Date(details.bestellung.bestelldatum).toLocaleDateString("de-DE")}</p>
            <p><strong>Rechnungsbetrag:</strong> {details.bestellung.rechnungsbetrag} €</p>

            <h5>Zutaten:</h5>
            <ul className="list-group">
              {details.zutaten.map((zutat, index) => (
                <li key={index} className="list-group-item">
                  {zutat.zutatennr}: {zutat.bezeichnung} - {zutat.menge} {zutat.einheit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bestellungen;
