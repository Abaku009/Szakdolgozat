import { Link } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { ReservationCartContext } from "../../context/ReservationCartContext";

function OnSiteReservation() {

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const endTime = "18:00";

    const { cart } = useContext(ReservationCartContext);


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


    function handleStartDateChange(e) {
        const selected = e.target.value;
        setStartDate(selected);

        if (!endDate || endDate < selected || endDate > getMaxEndDate(selected)) {
            setEndDate(selected);
        }
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
                </div>
                <Footer />
            </>
        );
    }


    return (

        <>

            <Navbar />

            <div className="on-site-reservation">

                <div className="cart-warning">
                    <p>A foglalás a kosaradban lévő termékekre vonatkozik. Megtekintheted a <Link to="/kosar/reservation-cart">foglalási kosárban</Link>.</p>
                </div>

                <h1>Helyben foglalás</h1>

                <form onSubmit={handleSubmit} className="on-site-form">
                    <label htmlFor="kezdodatum">Kezdődátum: </label>
                    <input type="date" name="kezdodatum" id="kezdodatum" required value={startDate} min={today} onChange={handleStartDateChange}/>
                    <label htmlFor="vegdatum">Végdátum: </label>
                    <input type="date" name="vegdatum" id="vegdatum" required disabled={!startDate} value={endDate} min={startDate} max={startDate ? getMaxEndDate(startDate) : ""} onChange={e => setEndDate(e.target.value)}/>
                    <label htmlFor="kezdoido">Kezdőidő: </label>
                    <input type="time" name="kezdoido" id="kezdoido" value={startTime} disabled />
                    <label htmlFor="vegido">Végidő: </label>
                    <input type="time" name="vegido" id="vegido" value={endTime} disabled />
                    <button type="submit" disabled={!startDate || !endDate}>Foglalás elküldése</button>
                </form>

                <Link to="/foglalas" className="visszaFoglalashoz">Vissza</Link>

            </div>

            <Footer />

        </>

    );

}

export default OnSiteReservation;

