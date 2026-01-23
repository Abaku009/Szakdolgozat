const db = require("../database/queries/adminReservationsQuery");
const nodemailer = require("nodemailer");

async function getAdminReservations(req, res) {

    try {
        const { user } = req.body;
    
        if (!user || !user.is_admin) {
            return res.status(400).json({
                message: "Nincs jogosultságod!"
            });
        }
    
        const reservations = await db.getAllUsersReservations();
        return res.json(reservations);
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Hiba az admin foglalások lekérésekor."
        });
    }
}


async function deleteAdminReservations(req, res) {
    
    try {
        const { adminUser, reservationOwner, reservation, reason } = req.body;

        if (!adminUser || !adminUser.is_admin) {
            return res.status(400).json({
                message: "Nincs jogosultságod!"
            });
        }

        await db.deleteReservations(reservation);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD
            }
        });

        const itemsText = reservation.items
            .map(item =>
                `- ${item.title} (${item.quantity} db)`
            )
            .join("\n");
        
        const emailText = `
Tisztelt ${reservationOwner.last_name} ${reservationOwner.first_name}!

Tájékoztatjuk, hogy az alábbi foglalását töröltük.

Foglalás száma: #${reservation.reservation_id}
Foglalás típusa: ${reservation.mode === "on_site" ? "Helyben" : "Online"}
Időszak: ${reservation.reserved_date_from} – ${reservation.reserved_date_to}
Időpont: ${reservation.reserved_from} – ${reservation.reserved_to}

Foglalás tartalma:
${itemsText}

Törlés oka:
${reason}

Amennyiben kérdése van, kérjük vegye fel velünk a kapcsolatot.

Üdvözlettel:
MediaHaven
        `;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: "Foglalás törölve",
            text: emailText
        });

        return res.json({ message: "Foglalás sikeresen törölve!" });

    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Hiba a foglalás mentésekor." });
    }

}


module.exports = { getAdminReservations, deleteAdminReservations };

