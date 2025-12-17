import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useContext } from "react"
import { ReservationCartContext } from "../../context/ReservationCartContext";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import "../Cart/reservationcart.css";



function ReservationCart() {

    const { cart, setCart, increaseQty, decreaseQty, removeItem } = useContext(ReservationCartContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce((sum, currentItem) => {
        return sum + currentItem.price * currentItem.qty;
    }, 0);


    function handleClick() {
        navigate("/foglalas")
    }



    return (

        <>


            <Navbar />

            <h1 className="reserve-cart-h1">Foglalási kosár</h1>

            {cart.length > 0 ? (
                cart.map(item => (
                    <div key={`${item.type}-${item.id}`} className="reserveCartItem">
                        <p><strong>Cím: </strong>{item.title}</p>
                        <p><strong>Nyelv: </strong>{item.languagename}</p>
                        <p><strong>Formátum: </strong>{item.format}</p>
                        <p><strong>Ár: </strong>{item.price * item.qty} Ft</p>

                        <div className="quantityButtons">
                            <button onClick={() => decreaseQty(item.id, item.type)} disabled={item.qty === 1}>-</button>
                            {item.qty}
                            <button onClick={() => increaseQty(item.id, item.type)} disabled={item.qty === item.stock}>+</button>
                        </div>

                        <button className="removeFromCart" onClick={() => removeItem(item.id, item.type)}>Törlés</button>
                    </div>
                ))
            ) : (
                <div className="noResult">
                    <p>A kosár jelenleg üres.</p>
                </div>
            )}

            <div className="cartOsszegzes">
                <h4 className="visszaKosarhoz">
                    <Link to="/kosar" className="visszaKosarhozGomb">Vissza</Link>
                </h4>

                {cart.length > 0 && (
                    <p className="teljesAr">Összesen fizetendő: {totalPrice} Ft</p>
                )}
            </div>

            {cart.length > 0 && (
                <button className="foglalasElkuldes" onClick={handleClick}>Foglalás</button>
            )}

            <Footer />

        </>
        
    );

}

export default ReservationCart;

