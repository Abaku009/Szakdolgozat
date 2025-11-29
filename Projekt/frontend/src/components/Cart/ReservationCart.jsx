import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

function ReservationCart() {
    return (
        <div>
            <Navbar />
            <h1>Foglalási kosár</h1>
            <div><Link to="/kosar">Vissza</Link></div>
            <Footer />
        </div>
    );
}

export default ReservationCart;

