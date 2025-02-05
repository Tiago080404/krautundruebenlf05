import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

function Rezepte() {
  const [rezepte, setRezepte] = useState([]);
  const [kategorien, setKategorien] = useState([]);
  const [ausgewaehlteKategorie, setAusgewaehlteKategorie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchKategorien();
  }, []);

  useEffect(() => {
    if (ausgewaehlteKategorie) {
      fetchRezepteByKategorie(ausgewaehlteKategorie);
    }
  }, [ausgewaehlteKategorie]);

  const fetchKategorien = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/kategorien");
      setKategorien(response.data || []);
    } catch (error) {
      console.error("Fehler beim Abrufen der Kategorien:", error);
      setError("Kategorien konnten nicht geladen werden.");
    }
  };

  const fetchRezepteByKategorie = async (kategorie) => {
    try {
      setError("");
      const response = await axios.get("http://localhost:5000/api/rezepte/kategorie", {
        params: { kategorie }
      });

      setRezepte(response.data.length ? response.data : []);
      if (!response.data.length) {
        setError("Keine Rezepte in dieser Kategorie gefunden.");
      }
    } catch (error) {
      console.error("Fehler bei der API-Anfrage:", error);
      setError("Fehler beim Abrufen der Daten.");
    }
  };

  const selectKategorie = (kategorie) => {
    setAusgewaehlteKategorie(prev => (prev === kategorie ? null : kategorie));
  };

  return (
    <div className="container mt-4">
      <Navbar />
      <h1 className="text-primary text-center mb-4">Ernährungskategorien</h1>

      {/* Kategorie-Buttons */}
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        {kategorien.length ? (
          kategorien.map((kat) => {
            const isSelected = ausgewaehlteKategorie === kat;
            return (
              <motion.button
                key={kat}
                onClick={() => selectKategorie(kat)}
                layout
                initial={false}
                animate={{
                  background: isSelected 
                    ? "linear-gradient(145deg, #ffb347, #ffcc33)"
                    : "linear-gradient(145deg, #f0f0f0, #d9d9d9)",
                  color: isSelected ? "#2a1711" : "#222",
                  boxShadow: isSelected 
                    ? "0px 4px 10px rgba(255, 184, 77, 0.4)"
                    : "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                whileHover={{
                  background: isSelected 
                    ? "linear-gradient(145deg, #ffaa00, #ffcc66)"
                    : "linear-gradient(145deg, #e0e0e0, #cfcfcf)",
                }}
                whileTap={{
                  scale: 0.95,
                }}
                transition={{
                  ...transitionProps,
                  background: { duration: 0.2 },
                }}
                className="btn rounded-pill px-4 py-2 position-relative border-0 fw-bold"
                style={{ 
                  minWidth: "140px", 
                  overflow: "hidden",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <motion.div
                  className="d-flex align-items-center justify-content-center"
                  animate={{
                    width: isSelected ? "auto" : "100%",
                    paddingRight: isSelected ? "1.5rem" : "0",
                  }}
                  transition={{
                    ease: [0.175, 0.885, 0.32, 1.275],
                    duration: 0.3,
                  }}
                >
                  <span>{kat}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={transitionProps}
                        className="position-absolute end-0 me-2"
                      >
                        <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: "1rem", height: "1rem" }}>
                          <Check className="text-warning" size={12} strokeWidth={1.5} />
                        </div>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            );
          })
        ) : (
          <p className="text-secondary">Keine Kategorien gefunden.</p>
        )}
      </div>

      {/* Fehlermeldungen */}
      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Rezepte-Anzeige */}
      <div className="row mt-4">
        {rezepte.length ? (
          rezepte.map((rezept) => (
            <div key={rezept.rezeptnr} className="col-md-4 mb-3">
              <div className="card shadow border-0" style={{ cursor: "pointer", borderRadius: "10px" }}>
                <img
                  src={rezept.bild_url}
                  alt={rezept.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{rezept.name}</h5>
                  <p className="card-text text-muted">{rezept.beschreibung}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          !error && <p className="text-muted text-center">Wähle eine Kategorie, um Rezepte anzuzeigen.</p>
        )}
      </div>
    </div>
  );
}

export default Rezepte;
