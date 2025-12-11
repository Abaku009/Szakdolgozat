import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

function ReservationCart() {
    return (
        <div className="reservation-cart">
            <Navbar />
            <h1 className="reserve-cart-h1">Foglalási kosár</h1>
            <div className="back-to-cart"><Link to="/kosar">Vissza</Link></div>
            <Footer />
        </div>
    );
}

export default ReservationCart;

