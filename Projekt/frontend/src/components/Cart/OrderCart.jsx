import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { UserContext } from "../../context/UserContext";
import { useState } from "react";
import "../Cart/ordercart.css";




function OrderCart() {

    const { cart, setCart, increaseQty, decreaseQty, removeItem, addToCart } = useContext(CartContext);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);


    const [ recommendations, setRecommendations ] = useState([]);


    const POSTMUSICORDERAPI = import.meta.env.VITE_API_POST_MUSIC_ORDER_URL;
    const GETORDERCARTRECOMMENDATIONSAPI = import.meta.env.VITE_API_GET_ORDER_CART_RECOMMENDATIONS_URL;

    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.qty;
    }, 0);


    useEffect(() => {
        if(cart.length === 0 || !user) {
            setRecommendations([]);
            return;
        }

        fetchRecommendations();
    }, [cart, user]);


    async function fetchRecommendations() {
        try {
            const res = await fetch(GETORDERCARTRECOMMENDATIONSAPI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    cartMusicIDs: cart.map(item => item.music_id)
                })
            });

            const data = await res.json();
            setRecommendations(data);
        } catch (err) {
            console.error(err);
            alert("Hiba az ajánlások lekérése során!");
        }
    }


    async function handleOrder() {

        setLoading(true);
        
        try {

            const res = await fetch(POSTMUSICORDERAPI, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    music: cart,
                    teljesAr: totalPrice,
                    user: user
                })
            });
            const data = await res.json();
            alert(data.message);
            setCart([]);
        } catch(err) {
            console.error(err);
            alert("Hiba a rendelés feldolgozása során!");
        } finally {
            setLoading(false);
        }

    }

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

            <div className="cartHeaderRow">
                <h4 className="back-toCart">
                    <Link to="/kosar" className="back-toCartButton">Vissza</Link>
                </h4>

                {cart.length > 0 && (
                    <p className="totalPrice">Összesen fizetendő: {totalPrice} Ft</p>
                )}
            </div>

            {cart.length > 0 && (
                <button className="rendelesLeadas" onClick={handleOrder} disabled={loading}>Rendelés elküldése</button>
            )}

            {recommendations.length > 0 && (
                <div className="order-cart-recommendations">
                    <h2 className="recommendations">Ajánlott zenék a kosarad alapján</h2>

                    <div className="order-cart-recommendations-list">
                        {recommendations.map(rec => (
                            <div key={rec.music_id} className="order-cart-recommendation-item">
                                <p><strong>Cím:</strong> {rec.title}</p>
                                <p><strong>Előadó:</strong> {rec.performer}</p>
                                <p><strong>Nyelv:</strong> {rec.languagename}</p>
                                <p><strong>Formátum:</strong> {rec.format}</p>
                                <p><strong>Ár:</strong> {rec.price} Ft</p>
                                <p><strong>Darabszám:</strong> {rec.stock}</p>
                                <p><button disabled={rec.stock === 0} onClick={() => addToCart(rec)}>Kosárba helyezés</button></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Footer />

        </>

    );
    
}

export default OrderCart;

