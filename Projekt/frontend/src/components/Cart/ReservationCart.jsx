import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useContext, useEffect, useState } from "react"
import { ReservationCartContext } from "../../context/ReservationCartContext";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import "../Cart/reservationcart.css";



function ReservationCart() {

    const { cart, setCart, increaseQty, decreaseQty, removeItem, addToCart } = useContext(ReservationCartContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();


    const [recommendations, setRecommendations] = useState([]);


    const GETRESERVATIONCARTRECOMMENDATIONSAPI = import.meta.env.VITE_API_GET_RESERVATION_CART_RECOMMENDATIONS_URL;


    const totalPrice = cart.reduce((sum, currentItem) => {
        return sum + currentItem.price * currentItem.qty;
    }, 0);


    useEffect(() => {
        if(cart.length === 0 || !user) {
            setRecommendations([]);
            return;
        }

        fetchRecommendations();
    }, [user, cart]);


    async function fetchRecommendations() {
        try {
            const res = await fetch(GETRESERVATIONCARTRECOMMENDATIONSAPI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    cartIDs: cart.map(item => ({
                        id: item.id,
                        type: item.type
                    }))
                })
            });

            const data = await res.json();
            setRecommendations(data);
        } catch(err) {
            console.error(err);
            alert("Hiba történt az ajánlások lekérésekor!");
        }
    }


    function handleClick() {
        navigate("/foglalas")
    }


    return (

        <>


            <Navbar />

            <h1 className="reservation-cart-header">Foglalási kosár</h1>

            {cart.length > 0 ? (
                cart.map(item => (
                    <div key={`${item.type}-${item.id}`} className="ReservationCartItem">
                        <p><strong>Cím: </strong>{item.title}</p>
                        {item.director ? (
                            <p><strong>Rendező: </strong>{item.director}</p>
                        ) : (
                            <p><strong>Alkotó: </strong>{item.creator}</p>
                        )}
                        <p><strong>Nyelv: </strong>{item.languagename}</p>
                        <p><strong>Formátum: </strong>{item.format}</p>
                        <p><strong>Ár: </strong>{item.price * item.qty} Ft</p>

                        <div className="ReservationCartQuantityButtons">
                            <button onClick={() => decreaseQty(item.id, item.type)} disabled={item.qty === 1}>-</button>
                            {item.qty}
                            <button onClick={() => increaseQty(item.id, item.type)} disabled={item.qty === item.stock}>+</button>
                        </div>

                        <button className="ReservationCartRemoveFromCart" onClick={() => removeItem(item.id, item.type)}>Törlés</button>
                    </div>
                ))
            ) : (
                <div className="ReservationCartNoResult">
                    <p>A kosár jelenleg üres.</p>
                </div>
            )}

            <div className="ReservationCartOsszegzes">
                <h4 className="ReservationCartVisszaKosarhoz">
                    <Link to="/kosar" className="ReservationCartVisszaKosarhozGomb">Vissza</Link>
                </h4>

                {cart.length > 0 && (
                    <p className="ReservationCartTeljesAr">Összesen fizetendő: {totalPrice} Ft</p>
                )}
            </div>

            {cart.length > 0 && (
                <button className="ReservationCartFoglalasElkuldes" onClick={handleClick}>Foglalás</button>
            )}

            {recommendations.length > 0 && (
                <div className="reservation-cart-recommendations">
                    <h2 className="reservation-cart-recommendations-header">Ajánlott termékek a kosarad alapján</h2>

                    <div className="reservation-cart-recommendations-list">
                        {recommendations.map(rec => (
                            <div key={`${rec.type}-${rec.id}`} className="reservation-cart-recommendation-item">
                                <p><strong>Cím: </strong>{rec.title}</p>
                                {rec.director ? (
                                    <p><strong>Rendező: </strong>{rec.director}</p>
                                ) : (
                                    <p><strong>Alkotó: </strong>{rec.creator}</p>
                                )}
                                <p><strong>Nyelv: </strong>{rec.languagename}</p>
                                <p><strong>Formátum: </strong>{rec.format}</p>
                                <p><strong>Ár: </strong>{rec.price} Ft</p>
                                <p><strong>Darabszám: </strong>{rec.stock}</p>
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

export default ReservationCart;

