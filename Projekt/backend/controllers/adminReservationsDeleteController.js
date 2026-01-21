const db = require("../database/queries/adminReservationsDeleteQuery");
const nodemailer = require("nodemailer");

async function deleteAdminReservations(req, res) {
    
    try {
        const { user, reservation, reason } = req.body;

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
Tisztelt ${user.last_name} ${user.first_name}!

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

module.exports = { deleteAdminReservations };

