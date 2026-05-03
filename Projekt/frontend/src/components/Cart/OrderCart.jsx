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



    if(cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="order-cart-empty-cart-message">
                    <h2>A rendelési kosarad üres!</h2>
                    <h4 className="order-cart-back-to-cart-header">
                        <Link to="/kosar" className="order-cart-back-to-cart-button">Vissza</Link>
                    </h4>
                </div>
                <Footer />
            </>
        );
    }



    return (

        <>

            <Navbar />

            {cart.length > 0 && (
                <>
                    <h1 className="OrderCartHeader">Rendelési kosár</h1>

                    <div className="OrderCartList order-cart-music-grid">
                        {cart.map(music => (
                            <div key={music.music_id} className="OrderCartItem">

                                <div className="info-group">
                                    <p className="title-text">{music.title}</p>
                                    <p className="performer-text">{music.performer}</p>
                                    <p style={{fontSize: '0.7rem', color: '#aaa'}}>{music.format} | {music.languagename}</p>
                                </div>

                                <div className="action-group">
                                    <p className="price-tag">{music.price * music.qty} Ft</p>

                                    <div className="OrderCartQuantityControls">
                                        <button onClick={() => decreaseQty(music.music_id)} disabled={music.qty === 1}>-</button>
                                            {music.qty}
                                        <button onClick={() => increaseQty(music.music_id)} disabled={music.qty === music.stock}>+</button>
                                    </div>

                                    <button className="OrderCartRemoveItem" onClick={() => removeItem(music.music_id)}>Törlés</button>
                                </div>
                            </div>
                        ))}
                    </div>  
                </>             
            )}

            <div className="OrderCartHeaderRow">
                <h4 className="order-cart-back-to-cart">
                    <Link to="/kosar" className="order-cart-back-to-cart-button">Vissza</Link>
                </h4>

                {cart.length > 0 && (
                    <p className="OrderCartTotalPrice">Összesen fizetendő: {totalPrice} Ft</p>
                )}
            </div>

            {cart.length > 0 && (
                <button className="OrderCartRendelesLeadas" onClick={handleOrder} disabled={loading}>Rendelés elküldése</button>
            )}

            {recommendations.length > 0 && (
                <div className="order-cart-recommendations">
                    <h2 className="order-cart-recommendations-header">Ajánlott zenék a kosarad alapján</h2>

                    <div className="order-cart-recommendations-list order-cart-music-grid">
                        {recommendations.map(rec => (
                            <div key={rec.music_id} className="order-cart-recommendation-item">

                                <div className="info-group">
                                    <p className="title-text">{rec.title}</p>
                                    <p className="performer-text">{rec.performer}</p>
                                    <p style={{fontSize: '0.7rem', color: '#aaa'}}>{rec.format} | {rec.languagename}</p>
                                </div>

                                <div className="action-group">
                                    <p className="price-tag">{rec.price} Ft</p>
                                    <p className="stock-text">Készleten: {rec.stock}</p>
                                    <button
                                        disabled={rec.stock === 0}
                                        onClick={() => addToCart(rec)}
                                    >
                                        Kosárba helyezés
                                    </button>
                                </div>
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

