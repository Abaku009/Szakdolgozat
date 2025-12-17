import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function OnlineReservation() {
    return (
        <>
            <Navbar />
            <h1>Online foglalás</h1>
            <Link to="/foglalas" className="visszaFoglalashozGomb">Vissza</Link>
            <Footer />
        </>
    )
}

export default OnlineReservation;

