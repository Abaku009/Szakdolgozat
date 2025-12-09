import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "../Cart/ordercart.css";




function OrderCart() {

    const { cart, increaseQty, decreaseQty, removeItem } = useContext(CartContext);

    return (

        <>

            <Navbar />

            <h1 className="orderCart">Rendelési kosár</h1>

            {cart.length > 0 ? (
                cart.map(music => (
                    <div key={music.music_id} className="orderCartItem">
                        <p><strong>Cím:</strong> {music.title}</p>
                        <p><strong>Előadó:</strong> {music.performer}</p>
                        <p><strong>Nyelv:</strong> {music.languagename}</p>
                        <p><strong>Formátum:</strong> {music.format}</p>
                        <p><strong>Ár:</strong> {music.price * music.qty} Ft</p>

                        <div className="quantityControls">
                            <button onClick={() => decreaseQty(music.music_id)} disabled={music.qty === 1}>-</button>
                            {music.qty}
                            <button onClick={() => increaseQty(music.music_id)} disabled={music.qty === music.stock}>+</button>
                        </div>

                        <button className="removeItem" onClick={() => removeItem(music.music_id)}>Törlés</button>
                    </div>
                ))
            ) : (
                <div className="no-results">
                    <p>A kosár jelenleg üres.</p>
                </div>
                
            )}

            <div><Link to="/kosar">Vissza</Link></div>

            <Footer />

        </>

    );
}

export default OrderCart;

