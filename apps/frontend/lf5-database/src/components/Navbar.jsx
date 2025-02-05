import {NavLink, Link} from "react-router";
function Navbar(){
    return(
    <nav className="navbar navbar-expand-lg bg-custom-orange">
        <div className="container-fluid">
        <img src="../feimages/essen-und-trinken.png" alt="Bootstrap" width="32" height="32" />
          <a className="navbar-brand" href="#">KrautUndRüben</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" to="/" style={{textDecoration: 'none'}}>Home</Link>
              <Link className="nav-link" to="/about" style={{textDecoration:'none'}} >About</Link>
              <Link className="nav-link" to="/rezepte" style={{textDecoration:'none'}} >Rezepte</Link>
              <Link className="nav-link" to="/kategorien" style={{textDecoration:'none'}} >Kategorien</Link>
              <Link className="nav-link" to="/zutaten" style={{textDecoration:'none'}} >Zutaten</Link>
             <a className="nav-link" href="#">Warenkorb</a>
              <a className="nav-link disabled">Disabled</a>
            </div>
          </div>
        </div>
      </nav>
      )
}
export default Navbar