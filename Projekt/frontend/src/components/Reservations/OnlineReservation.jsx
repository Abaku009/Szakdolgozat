import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useState } from "react";
import { useContext } from "react";
import { ReservationCartContext } from "../../context/ReservationCartContext";
import { UserContext } from "../../context/UserContext";
import "../Reservations/onlinereservation.css";


function OnlineReservation() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const endTime = "18:00";


    const { cart, setCart } = useContext(ReservationCartContext);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);


    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.qty;
    }, 0);


    const POSTONLINERESERVATIONAPI = import.meta.env.VITE_API_POST_ONLINE_RESERVATION_URL;


    const today = new Date().toISOString().split("T")[0];



    function getMaxEndDate(start) {
        const d = new Date(start);
        d.setDate(d.getDate() + 14);

        return d.toISOString().split("T")[0];
    }



    function handleStartDateChange(e) {
        const selected = e.target.value;

        if (!isWeekday(selected)) {
            alert("Csak hétköznapra (hétfő–péntek) lehet foglalni!");
            setStartDate("");
            return;
        }

        setStartDate(selected);
    }



    function handleEndDateChange(e) {
        const selected = e.target.value;

        if (!isWeekday(selected)) {
            alert("Csak hétköznapra (hétfő–péntek) lehet foglalni!");
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



    function handleTimeChange(e) {
        const time = e.target.value;

        if (time < "08:00") {
            alert("Foglalás kezdete csak 08:00 és 17:00 között lehetséges!")
            setStartTime("08:00");
            return;
        } 

        if (time > "17:00") {
            alert("Foglalás kezdete csak 08:00 és 17:00 között lehetséges!")
            setStartTime("17:00");
            return;
        } 

        setStartTime(e.target.value);
    }



    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const res = await fetch(POSTONLINERESERVATIONAPI, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    termekek: cart,
                    teljesAr: totalPrice,
                    user: user,
                    mode: "online",
                    dateFrom: startDate,
                    dateTo: endDate,
                    timeFrom: startTime,
                    timeTo: endTime
                })
            });
            const data = await res.json();
            alert(data.message);
            setCart([]);
            setStartDate("");
            setEndDate("");
            setStartTime("");
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
                <div className="online-reservation-empty-cart-message">
                    <h2>A foglalási kosarad üres!</h2>
                    <p>Kérjük, tegyél először valamit a foglalási kosaradba, mielőtt foglalnál.</p>
                    <h4 className="online-reservation-back-to-reservations-header">
                        <Link to="/foglalas" className="online-reservation-back-to-reservations-button">Vissza</Link>
                    </h4>
                </div>
                <Footer />
            </>
        );
    }



    return (

        <>

            <Navbar />

            <div className="online-reservation-div">

                <div className="online-reservation-cart-warning-message">
                    <p>A foglalás a kosaradban lévő termékekre vonatkozik. Megtekintheted a <Link to="/kosar/reservation-cart">foglalási kosárban</Link>.</p>
                </div>

                <h1>Online foglalás</h1>

                <form onSubmit={handleSubmit} className="online-reservation-form">
                    <label htmlFor="kezdodatum">Kezdődátum: </label>
                    <input type="date" name="kezdodatum" id="kezdodatum" required value={startDate} min={today} onChange={handleStartDateChange}/>
                    <label htmlFor="vegdatum">Végdátum: </label>
                    <input type="date" name="vegdatum" id="vegdatum" required disabled={!startDate} value={endDate} min={startDate} max={startDate ? getMaxEndDate(startDate) : ""} onChange={handleEndDateChange}/>
                    <label htmlFor="kezdoido">Kezdőidő: </label>
                    <input type="time" name="kezdoido" id="kezdoido" required value={startTime} onChange={handleTimeChange} min="08:00" max="17:00"/>
                    <label htmlFor="vegido">Végidő: </label>
                    <input type="time" name="vegido" id="vegido" value={endTime} disabled />
                    <button type="submit" disabled={!startDate || !endDate || !startTime || loading}>Foglalás elküldése</button>
                </form>

                <h4 className="online-reservation-back-to-reservations-header">
                    <Link to="/foglalas" className="online-reservation-back-to-reservations-button">Vissza</Link>
                </h4>

            </div>

            <Footer />

        </>

    );

}

export default OnlineReservation;

