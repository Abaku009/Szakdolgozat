import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function OnSiteReservation() {
    return (
        <>
            <Navbar />
            <h1>Helyben foglalás</h1>
            <Link to="/foglalas" className="visszaFoglalashoz">Vissza</Link>
            <Footer />
        </>
    )
}

export default OnSiteReservation;

