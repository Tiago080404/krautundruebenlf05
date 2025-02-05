import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import About from './pages/About.jsx';
import Rezepte from './pages/rezepte.jsx';
import Zutaten from './pages/Zutaten.jsx';
import KategorienSelector from './pages/KategorienSelector.jsx';
import RezeptDetail from './pages/RezeptDetail.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/styles/custom.scss"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path='about' element={<About />}/>
      <Route path='rezepte' element={<Rezepte />}/>
      <Route path='kategorien' element={<KategorienSelector />}/>
      <Route path='Zutaten' element={<Zutaten />}/>
      <Route path="/rezept/:id" element={<RezeptDetail />} />

      
    </Routes>
  </BrowserRouter>
)
