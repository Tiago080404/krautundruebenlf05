import Navbar from "../components/Navbar"
import { useState, useEffect } from 'react';

function DashboardPage(){
    const [customerOrders,setOrders]=useState([]);
    useEffect(()=>{
        const fetchBestellungen = async()=>{
            try{    
                const response = await fetch("http://localhost:5000/rezepte/kundemitbestellung");
                const result = await response.json();
                console.log("data",result.data)
                setOrders(result.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchBestellungen()
    },[])

    return(
        <>
        <Navbar></Navbar>

        <div>
            <table className="table table-hover table-striped table-bordered mt-3">
            <caption>Liste der Kunden, die eine Bestellung aufgegeben haben</caption>
            <thead className="table-dark"> 
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Bestellnr</th>
                </tr>
                </thead>
                <tbody>
                    {customerOrders.map((element,index)=>(
                        <tr key={index}>
                            <td>{element.vorname}</td>
                            <td>{element.bestellnr}</td>
                        </tr>
                    ))}
                    <tr>
                    </tr>
                    </tbody>    
            </table>
        </div>
        



        </>
    )

}

export default DashboardPage