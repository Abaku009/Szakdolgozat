import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function MainReservation() {
    return (
        <>
            <Navbar />
            <div className="main-reservations">
                <h1 className="main-reservations-header">Foglalás</h1>
                <h4><Link to="/foglalas/helybenFoglalas" className="on-site-reservation">Helyben foglalok</Link></h4>
                <h4><Link to="/foglalas/onlineFoglalas" className="online-reservation">Online foglalok</Link></h4>
            </div>
            <Footer />
        </>
    )
}

export default MainReservation;

