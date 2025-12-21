import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { ReservationCartContext } from "../../context/ReservationCartContext";
import "../Reservations/onlinereservation.css";

function OnlineReservation() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const endTime = "18:00";

    const { cart } = useContext(ReservationCartContext);


    const today = new Date().toISOString().split("T")[0];


    function getMaxEndDate(start) {
        const d = new Date(start);
        d.setDate(d.getDate() + 14);

        return d.toISOString().split("T")[0];
    }


    function handleStartDateChange(e) {
        const selected = e.target.value;
        setStartDate(selected);

        if (!endDate || endDate < selected || endDate > getMaxEndDate(selected)) {
            setEndDate(selected);
        }
    }


    function handleTimeChange(e) {
        const time = e.target.value;
        if (time < "08:00") e.target.value = "08:00";
        if (time > "17:00") e.target.value = "17:00";
        setStartTime(e.target.value);
    }


    function handleSubmit(e) {
        e.preventDefault();
    }

    
    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="empty-cart-message">
                    <h2>A foglalási kosarad üres!</h2>
                    <p>Kérjük, tegyél először valamit a foglalási kosaradba, mielőtt foglalnál.</p>
                    <h4 className="back-to-reservations-header">
                        <Link to="/foglalas" className="back-to-reservations-button">Vissza</Link>
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

                <div className="cart-warning-message">
                    <p>A foglalás a kosaradban lévő termékekre vonatkozik. Megtekintheted a <Link to="/kosar/reservation-cart">foglalási kosárban</Link>.</p>
                </div>

                <h1>Online foglalás</h1>

                <form onSubmit={handleSubmit} className="online-form">
                    <label htmlFor="kezdodatum">Kezdődátum: </label>
                    <input type="date" name="kezdodatum" id="kezdodatum" required value={startDate} min={today} onChange={handleStartDateChange}/>
                    <label htmlFor="vegdatum">Végdátum: </label>
                    <input type="date" name="vegdatum" id="vegdatum" required disabled={!startDate} value={endDate} min={startDate} max={startDate ? getMaxEndDate(startDate) : ""} onChange={e => setEndDate(e.target.value)}/>
                    <label htmlFor="kezdoido">Kezdőidő: </label>
                    <input type="time" name="kezdoido" id="kezdoido" required value={startTime} onChange={handleTimeChange}/>
                    <label htmlFor="vegido">Végidő: </label>
                    <input type="time" name="vegido" id="vegido" value={endTime} disabled />
                    <button type="submit" disabled={!startDate || !endDate || !startTime}>Foglalás elküldése</button>
                </form>

                <h4 className="back-to-reservations-header">
                    <Link to="/foglalas" className="back-to-reservations-button">Vissza</Link>
                </h4>

            </div>

            <Footer />

        </>

    );

}

export default OnlineReservation;

