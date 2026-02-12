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
    const [shopOpen, setShopOpen] = useState(false);


    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.qty;
    }, 0);


    const POSTONSITERESERVATIONAPI = import.meta.env.VITE_API_POST_ON_SITE_RESERVATION_URL;


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



    useEffect(() => {
        function checkShopStatus() {
            const now = new Date();
            const day = now.getDay();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const currentMinutes = hours * 60 + minutes;
            const openMinutes = 8 * 60;
            const closeMinutes = 18 * 60;

            const isWeekday = day >= 1 && day <= 5;
            const isOpenTime = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

            setShopOpen(isWeekday && isOpenTime);
        }

        checkShopStatus();
        const interval = setInterval(checkShopStatus, 60000);

        return () => clearInterval(interval);
    }, []);




    function getMaxEndDate(start) {
        const d = new Date(start);
        d.setDate(d.getDate() + 14);

        return d.toISOString().split("T")[0];
    }



    function handleEndDateChange(e) {
        const selected = e.target.value;

        if (!isWeekday(selected)) {
            alert("Csak hétköznapra lehet végdátumot választani (H–P).");
            setEndDate("");
            return;
        }

        setEndDate(selected);
    }



    function isWeekday(dateString) {
        const date = new Date(dateString);
        const day = date.getDay(); 
        return day !== 0 && day !== 6;
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




    if (!shopOpen) {
        return (
            <>
                <Navbar />
                <div className="on-site-reservation-empty-cart-message">
                    <h2>Az üzlet jelenleg zárva van</h2>
                    <p>
                        Nyitvatartás: <br />
                        Hétfő–Péntek 08:00–18:00
                    </p>
                    <h4 className="on-site-reservation-back-to-reservations">
                        <Link to="/foglalas" className="on-site-reservation-back-to-reservations-button">
                            Vissza
                        </Link>
                    </h4>
                </div>
                <Footer />
            </>
        );
    }



    
    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="on-site-reservation-empty-cart-message">
                    <h2>A foglalási kosarad üres!</h2>
                    <p>Kérjük, tegyél először valamit a foglalási kosaradba, mielőtt foglalnál.</p>
                    <h4 className="on-site-reservation-back-to-reservations">
                        <Link to="/foglalas" className="on-site-reservation-back-to-reservations-button">Vissza</Link>
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

                <div className="on-site-reservation-cart-warning">
                    <p>A foglalás a kosaradban lévő termékekre vonatkozik. Megtekintheted a <Link to="/kosar/reservation-cart">foglalási kosárban</Link>.</p>
                </div>

                <h1>Helyben foglalás</h1>

                <form onSubmit={handleSubmit} className="on-site-reservation-form">
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

                <h4 className="on-site-reservation-back-to-reservations">
                    <Link to="/foglalas" className="on-site-reservation-back-to-reservations-button">Vissza</Link>
                </h4>

            </div>

            <Footer />

        </>

    );

}

export default OnSiteReservation;

