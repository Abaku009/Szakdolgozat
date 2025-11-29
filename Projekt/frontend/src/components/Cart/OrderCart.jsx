import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

function OrderCart() {
    return (
        <div>
            <Navbar />
            <h1>Rendelési kosár</h1>
            <div><Link to="/kosar">Vissza</Link></div>
            <Footer />
        </div>
    );
}

export default OrderCart;

