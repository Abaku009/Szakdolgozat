import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { ReservationCartContext } from "../../context/ReservationCartContext";
import { UserContext } from "../../context/UserContext";
import "../Reservations/onsitereservation.css";

function OnSiteReservation() {

    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const endTime = "18:00";


    const { cart, setCart } = useContext(ReservationCartContext);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);


    const POSTONSITERESERVATIONAPI = import.meta.env.VITE_API_POST_ON_SITE_RESERVATION_URL;


    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.qty;
    }, 0);


    const today = new Date().toISOString().split("T")[0];


    useEffect(() => {
        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            setStartTime(`${hours}:${minutes}`);
        }

        updateTime(); 
        const interval = setInterval(updateTime, 60000); 

        return () => clearInterval(interval); 
    }, []);



    function getMaxEndDate(start) {
        const d = new Date(start);
        d.setDate(d.getDate() + 14);

        return d.toISOString().split("T")[0];
    }


    function handleEndDateChange(e) {
        const selected = e.target.value;
        setEndDate(selected);
    }


    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await fetch(POSTONSITERESERVATIONAPI, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    termekek: cart,
                    teljesAr: totalPrice,
                    user: user,
                    mode: "on_site",
                    dateFrom: today,
                    dateTo: endDate,
                    timeFrom: startTime,
                    timeTo: endTime
                })
            });
            const data = await res.json();
            alert(data.message);
            setCart([]);
            setEndDate("");
        } catch(err) {
            console.error(err);
            alert("Hiba a foglalás feldolgozása során!");
        } finally {
            setLoading(false);
        }
    }

    
    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="empty-cart-message">
                    <h2>A foglalási kosarad üres!</h2>
                    <p>Kérjük, tegyél először valamit a foglalási kosaradba, mielőtt foglalnál.</p>
                    <h4 className="back-to-reservations">
                        <Link to="/foglalas" className="back-to-reservation-button">Vissza</Link>
                    </h4>
                </div>
                <Footer />
            </>
        );
    }


    return (

        <>

            <Navbar />

            <div className="on-site-reservation-div">

                <div className="cart-warning">
                    <p>A foglalás a kosaradban lévő termékekre vonatkozik. Megtekintheted a <Link to="/kosar/reservation-cart">foglalási kosárban</Link>.</p>
                </div>

                <h1>Helyben foglalás</h1>

                <form onSubmit={handleSubmit} className="on-site-form">
                    <label htmlFor="kezdodatum">Kezdődátum: </label>
                    <input type="date" name="kezdodatum" id="kezdodatum" value={today} disabled/>
                    <label htmlFor="vegdatum">Végdátum: </label>
                    <input type="date" name="vegdatum" id="vegdatum" required value={endDate} min={today} max={getMaxEndDate(today)} onChange={handleEndDateChange}/>
                    <label htmlFor="kezdoido">Kezdőidő: </label>
                    <input type="time" name="kezdoido" id="kezdoido" value={startTime} disabled />
                    <label htmlFor="vegido">Végidő: </label>
                    <input type="time" name="vegido" id="vegido" value={endTime} disabled />
                    <button type="submit" disabled={!endDate || loading}>Foglalás elküldése</button>
                </form>

                <h4 className="back-to-reservations">
                    <Link to="/foglalas" className="back-to-reservation-button">Vissza</Link>
                </h4>

            </div>

            <Footer />

        </>

    );

}

export default OnSiteReservation;

