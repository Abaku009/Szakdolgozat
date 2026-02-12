import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import "../Cart/cart.css";

function Cart() {
    return (
        <>
            <Navbar />
            <h1 className="cart-header">Kosár</h1>
            <div className="cart-links">
                <Link to="/kosar/order-cart">Rendelési kosár</Link>
                <Link to="/kosar/reservation-cart">Foglalási kosár</Link>
            </div>
            <Footer />
        </>
    );
}

export default Cart;

