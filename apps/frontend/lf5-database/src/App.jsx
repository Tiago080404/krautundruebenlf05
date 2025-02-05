import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import "../src/styles/custom.scss"
function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchUserData = async () => {
      try {
        const result = await fetch("http://localhost:5000/getUserData", {
          method: "GET",
        });
        const data = await result.json();
        console.log("Antwort vom Server:", data);

        if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]); 
          console.error("Expected an array but got:", data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

const recipesCard = users.map((user,index)=>{
  console
  return (
    <div key={index}>
      <h1 >{user.vorname}</h1>
      <p>{user.telefon}</p>
    </div>
  )
})


  return (
    <>
      <Navbar />
      <div className="card">
        {recipesCard}
        {/* Render the list of users */}
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user.vorname}</li> 
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
