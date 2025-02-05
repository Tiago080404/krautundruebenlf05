import Navbar from '../components/Navbar';
import { useState } from 'react';
import axios from 'axios';

function About(){
    const [inputValue, setInputValue] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [kundennr, setKundennr] = useState("");
    const [nutritData, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const getSpecialRecipe = async () => {
        try {
            const value = inputValue; 
            const response = await axios.get("http://localhost:5000/rezepte/bestimmte",{
                params:{ingredientValue:value}
            })
           console.log(response.data)
            console.log("was ich reinpacke",response.data.data)
            
            setRecipes(response.data.data)
            console.log("rezepte",recipes)
            
        } catch (err) {
            console.log("Fehler:", err);
        }
    };

    const fetchNaehrwaerte = async ()=>{
        if (!kundennr) return;
        setLoading(true);
        setError(null);

        try{
            const response = await fetch(`http://localhost:5000/rezepte/nutrition?kundennr=${kundennr}`);
            const result = await response.json()
            console.log("hallo",result)
            setData(result)
            console.log("die daten",nutritData.data)
        }catch(err){
            console.log(err)
        }
        setLoading(false);
    }
    
    return(
        <>
        <Navbar></Navbar>
    <h1>test</h1>
    <p>Wir sind Kraut und Rüben, eine Firma, die </p>
    <input type="text"placeholder='Rezept mit bestimmter Zutat' value={inputValue} onChange={(e)=>setInputValue(e.target.value)} />
    <button onClick={getSpecialRecipe}>Search</button>

        <div>
            {recipes.length>0?(
            <ul>
               {recipes.map((recipe,index)=>(
                <li key={index}>
                    <h1>{recipe.name}</h1>
                </li>
               ))}
            </ul>
    ):(
        <p>no recipes found</p>
    )}
        </div>
        <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Durchschnittliche Nährwerte</h2>
      <input
        type="number"
        placeholder="Kundennummer eingeben"
        value={kundennr}
        onChange={(e) => setKundennr(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={fetchNaehrwaerte}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Laden
      </button>
      {loading && <p className="mt-2">Lädt...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {nutritData.data && (
        <div className="mt-4 p-2 border rounded">
          <p><strong>Name:</strong> {nutritData.data.vorname} {nutritData.data.nachname}</p>
          <p><strong>Kalorien:</strong> {nutritData.data.durchscnittliche_kalorien}</p>
          <p><strong>Kohlenhydrate:</strong> {nutritData.data.durchscnittliche_kohlenhydrate}</p>
          <p><strong>Proteine:</strong> {nutritData.data.durchschnittliche_proteine}</p>
        </div>
      )}
    </div>



    </>
    )
}


export default About

