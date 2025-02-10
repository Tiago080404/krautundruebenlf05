import { useState, useEffect } from 'react'

function HomePageDetails() {
  const [top5, setTop5] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [limitKalorien, setLimitKalorien] = useState([]);

  useEffect(() => {
    const fetchTop5Recipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/rezepte/topfive");
        const result = await response.json();
        console.log(result);
        setTop5(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTop5Recipes();
  }, []); // Nur einmal beim Mounten der Komponente

  const top5Card = top5.map((recipe, index) => {
    return (
      <div key={index} className="col-12 col-md-4 mb-4">
        <div className="card shadow-sm border-light rounded">
          <div className="card-body">
            <h5 className="card-title">{recipe.bezeichnung}</h5>
            <p className="card-text">Kommt {recipe.zutatenhaeufigkeit || 'Keine Beschreibung verfügbar.'} mal vor</p>
          </div>
        </div>
      </div>
    );
  });

  const getLimitKalorien = async () => {
    try {
      const value = inputValue;
      const response = await fetch(`http://localhost:5000/rezepte/bestimmtekalorien?kalorien=${value}`);
      const result = await response.json();
      console.log("data", result);
      setLimitKalorien(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const displayKal = limitKalorien.map((kalorien, index) => {
    return (
      <div key={index} className="col-12 col-md-4 mb-4">
        <div className="card shadow-sm border-light rounded">
          <div className="card-body">
            <h5 className="card-title">{kalorien.name}</h5>
            <p className="card-text">{kalorien.beschreibung || 'Keine Beschreibung verfügbar.'}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="container text-center my-5">
        <h1><strong>Krautundrueben</strong></h1>
        <p>Entdecke unsere Top 5 Rezepte!</p>
      </div>

      <div className="container">
        <h3>Unsere Top 5 Zutaten:</h3>
        <div className="row">
          {top5Card}
        </div>
      </div>

      <div className="container my-5">
        <div className="input-group">
          <input 
            type="number" 
            className="form-control" 
            placeholder="Kalorien limitieren" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={getLimitKalorien}
          >
            🔎 Suchen
          </button>
        </div>
      </div>

      <div className="container">
        <h3>Rezepte nach Kalorien:</h3>
        <div className="row">
          {displayKal}
        </div>
      </div>
    </>
  );
}

export default HomePageDetails;
