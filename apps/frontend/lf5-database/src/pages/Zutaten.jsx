import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Zutaten() {
  const [zutaten, setZutaten] = useState([]);
  const [warenkorb, setWarenkorb] = useState({});
  const [nurUnbenutzte, setNurUnbenutzte] = useState(false);

  useEffect(() => {
    fetchZutaten();
  }, [nurUnbenutzte]);

  const fetchZutaten = async () => {
    try {
      const url = nurUnbenutzte
        ? "http://localhost:5000/api/zutaten/unbenutzt"
        : "http://localhost:5000/api/zutaten";
      const response = await axios.get(url);
      setZutaten(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Zutaten:", error);
    }
  };

  const toggleUnbenutzteZutaten = () => {
    setNurUnbenutzte(!nurUnbenutzte);
  };

  const toggleZutat = (zutatennr) => {
    setWarenkorb((prevWarenkorb) => {
      if (prevWarenkorb[zutatennr]) {
        const newWarenkorb = { ...prevWarenkorb };
        delete newWarenkorb[zutatennr];
        return newWarenkorb;
      } else {
        return { ...prevWarenkorb, [zutatennr]: 1 };
      }
    });
  };

  const increaseMenge = (zutatennr) => {
    setWarenkorb((prevWarenkorb) => ({
      ...prevWarenkorb,
      [zutatennr]: (prevWarenkorb[zutatennr] || 1) + 1,
    }));
  };

  const decreaseMenge = (zutatennr) => {
    setWarenkorb((prevWarenkorb) => ({
      ...prevWarenkorb,
      [zutatennr]: Math.max(1, (prevWarenkorb[zutatennr] || 1) - 1),
    }));
  };

  const handleMengeChange = (zutatennr, menge) => {
    const parsedMenge = parseInt(menge, 10);
    if (!isNaN(parsedMenge) && parsedMenge > 0) {
      setWarenkorb((prevWarenkorb) => ({
        ...prevWarenkorb,
        [zutatennr]: parsedMenge,
      }));
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-primary text-center mb-4">Zutaten auswählen</h1>
      <p className="text-center">Klicke auf das 🛒-Symbol, um Zutaten hinzuzufügen oder zu entfernen.</p>

      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn ${nurUnbenutzte ? "btn-danger" : "btn-primary"}`}
          onClick={toggleUnbenutzteZutaten}
        >
          {nurUnbenutzte ? "Alle Zutaten anzeigen" : "Nur unbenutzte Zutaten anzeigen"}
        </button>
      </div>

      <div className="row">
        {zutaten.length > 0 ? (
          zutaten.map((zutat) => (
            <div key={zutat.zutatennr} className="col-md-4 col-lg-3 mb-3">
              <div className={`card p-3 shadow-sm ${warenkorb[zutat.zutatennr] ? 'border-primary' : ''}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{zutat.bezeichnung}</h5>
                  <button className="btn" onClick={() => toggleZutat(zutat.zutatennr)}>
                    <i className={`bi bi-cart${warenkorb[zutat.zutatennr] ? "-check-fill text-primary" : ""}`} style={{ fontSize: "1.5rem" }}></i>
                  </button>
                </div>

                {warenkorb[zutat.zutatennr] && (
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-primary"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => decreaseMenge(zutat.zutatennr)}
                    >
                      <i className="bi bi-dash-lg"></i>
                    </button>
                    <input
                      type="number"
                      className="form-control text-center mx-2"
                      style={{
                        width: "100px",
                        height: "50px",
                        fontSize: "20px",
                        fontWeight: "bold",
                        appearance: "textfield",
                        MozAppearance: "textfield",
                      }}
                      value={warenkorb[zutat.zutatennr] || ""}
                      onChange={(e) => handleMengeChange(zutat.zutatennr, e.target.value)}
                    />
                    <button
                      className="btn btn-outline-primary"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => increaseMenge(zutat.zutatennr)}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Lädt Zutaten...</p>
        )}
      </div>
    </div>
  );
}

export default Zutaten;
