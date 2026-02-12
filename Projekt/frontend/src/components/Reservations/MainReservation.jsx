import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "../Reservations/mainreservation.css";

function MainReservation() {
    return (
        <>
            <Navbar />
            <h1 className="main-reservations-header">Foglalás</h1>
            <div className="main-reservations">
                <Link to="/foglalas/helybenFoglalas" className="main-reservations-on-site-reservation">Helyben foglalok</Link>
                <Link to="/foglalas/onlineFoglalas" className="main-reservations-online-reservation">Online foglalok</Link>
            </div>
            <Footer />
        </>
    )
}

export default MainReservation;

