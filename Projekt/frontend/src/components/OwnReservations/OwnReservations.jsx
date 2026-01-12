import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "../OwnReservations/ownreservations.css";

function OwnReservations() {

    const [reservations, setReservations ] = useState([]);
    const { user } = useContext(UserContext);


    const GETOWNRESERVATIONSAPI = import.meta.env.VITE_API_GET_OWN_RESERVATIONS_URL;


    useEffect(() => {
        fetch(GETOWNRESERVATIONSAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                user: user
            })
        })
            .then(res => res.json())
            .then(data => {
                setReservations(groupReservations(data));
            });
    }, []);


    function groupReservations(rows) {
        const result = [];

        rows.forEach(row => {
            let reservation = result.find(
                reserv => reserv.reservation_id === row.reservation_id
            );

            if (!reservation) {
                reservation = {
                    reservation_id: row.reservation_id,
                    mode: row.mode,
                    reserved_date_from: row.reserved_date_from,
                    reserved_date_to: row.reserved_date_to,
                    reserved_from: row.reserved_from,
                    reserved_to: row.reserved_to,
                    items: []
                };
                result.push(reservation);
            }

            reservation.items.push({
                title: row.film_title || row.series_title,
                quantity: row.quantity
            });
        });

        return result;
    }


    return (

        <>

            <Navbar />

            <h1>Saját foglalások</h1>

            {reservations.length === 0 && (
                <p className="no-reservations">Nincs még foglalásod.</p>
            )}

            {reservations.map(reservation => (
                <div key={reservation.reservation_id} className="reservation-card">
                    <h3>
                        Foglalás #{reservation.reservation_id} (
                        {reservation.mode === "on_site"
                            ? "Helyben"
                            : "Online"}
                        )
                    </h3>

                    <p>
                        {reservation.reserved_date_from} – {reservation.reserved_date_to}
                    </p>

                    <p>
                        {reservation.reserved_from} –{" "}
                        {reservation.reserved_to}
                    </p>

                    <ul>
                        {reservation.items.map((item, index) => (
                            <li key={index}>
                                {item.title} – {item.quantity} db
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            <Footer />

        </>

    );

}

export default OwnReservations;

