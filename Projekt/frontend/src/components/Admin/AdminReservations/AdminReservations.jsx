import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import "../AdminReservations/adminreservations.css";


function AdminReservations() {

    const [reservations, setReservations ] = useState([]);
    const { user } = useContext(UserContext);
    const [isDeleting, setIsDeleting] = useState(false);


    const GETADMINRESERVATIONSAPI = import.meta.env.VITE_API_ADMIN_RESERVATIONS_URL;
    const ADMINRESERVATIONSDELETEAPI = import.meta.env.VITE_API_ADMIN_RESERVATIONS_DELETE_URL;


    useEffect(() => {

        if (!user || !user.is_admin) return;

        fetch(GETADMINRESERVATIONSAPI, {
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
    }, [user]);


    function groupReservations(rows) {
        const result = [];

        rows.forEach(row => {
            let user = result.find(usr => usr.user_id === row.user_id);
            if (!user) {
                user = {
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    reservations: []
                };
                result.push(user);
            }

            if (row.reservation_id) { 
                let reservation = user.reservations.find(res => res.reservation_id === row.reservation_id);
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
                    user.reservations.push(reservation);
                }

                reservation.items.push({
                    id: row.film_id ?? row.series_id,
                    type: row.film_id ? "film" : "series", 
                    title: row.film_id ? row.film_title : row.series_title,
                    quantity: row.quantity
                });
            }
        });

        return result;

    }


    async function handleDeleteReservation(reservationOwner, reservation) {
        const reason = prompt("Add meg a törlés okát:");

        if (!reason || reason.trim() === "") {
            alert("A törlés oka kötelező.");
            return;
        }

        try {
            setIsDeleting(true);

            alert("Foglalás törlése folyamatban...");

            const res = await fetch(ADMINRESERVATIONSDELETEAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    adminUser: user,
                    reservationOwner: reservationOwner,
                    reservation,
                    reason
                })
            });

            const data = await res.json();
            alert(data.message);
            setReservations(prev =>
                prev.map(usr =>
                    usr.user_id === reservationOwner.user_id
                        ? {
                            ...usr,
                            reservations: usr.reservations.filter(
                                reserv => reserv.reservation_id !== reservation.reservation_id
                            )
                        }
                        : usr
                )
            );
        } catch(err) {
            console.error(err);
            alert("Hiba történt a törlés során.");
        } finally {
            setIsDeleting(false);
        }

    }


    return (

        <>

            <Navbar />

            <div className="admin-reservations-page">
                <h1>Admin – Felhasználók foglalásai</h1>

                {reservations.length === 0 && (
                    <p className="no_reservations">Nincsenek foglalások.</p>
                )}

                {reservations.map(user => (
                    <div key={user.user_id} className="reservations-card">
                        <h2>{user.last_name} {user.first_name} ({user.email})</h2>

                        {user.reservations.length === 0 ? (
                            <p className="no_reservations">Nincs foglalása.</p>
                        ) : (
                            user.reservations.map(reservation => (
                                <div key={reservation.reservation_id} className="reservation_card">
                                    <h3>
                                        Foglalás #{reservation.reservation_id} (
                                        {reservation.mode === "on_site" ? "Helyben" : "Online"})
                                    </h3>
                                    <p>{reservation.reserved_date_from} – {reservation.reserved_date_to}</p>
                                    <p>{reservation.reserved_from} – {reservation.reserved_to}</p>
                                    <ul>
                                        {reservation.items.map((item, index) => (
                                            <li key={index}>{item.title} – {item.quantity} db</li>
                                        ))}
                                    </ul>
                                    <button 
                                        className="deleteButton"
                                        onClick={() => handleDeleteReservation(user, reservation)}
                                        disabled={isDeleting}
                                    >
                                        Törlés
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>

            <Footer />
        </>
    );
}

export default AdminReservations;

