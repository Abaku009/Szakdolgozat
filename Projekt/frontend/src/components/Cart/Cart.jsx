import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

function Cart() {
    return (
        <div>
            <Navbar />
            <h1>Kosár</h1>
            <Link to="/kosar/order-cart">Rendelési kosár</Link>
            <br />
            <Link to="/kosar/reservation-cart">Foglalási kosár</Link>
            <br />
            <Footer />
        </div>
    );
}

export default Cart;

