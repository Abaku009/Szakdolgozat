const db = require("../database/queries/reservationsQuery");
const nodemailer = require("nodemailer");

async function postReservations(req, res) {
    
    const { termekek, teljesAr, user, mode, dateFrom, dateTo, timeFrom, timeTo } = req.body;

    try {
        const reservationId = await db.insertReservations(user.user_id, termekek, mode, dateFrom, dateTo, timeFrom, timeTo);

        const reservationItemsText = termekek
            .map(item => 
                `- ${item.title} (${item.qty} db) - ${item.price * item.qty} Ft`
            )
            .join("\n");
         
        const emailText = `
Kedves ${user.last_name} ${user.first_name}!

Köszönjük foglalását! A foglalás adatai:

Foglalási azonosító: ${reservationId}

Tételek:
${reservationItemsText}

Foglalási intervallum: 
Mettől: ${dateFrom} ${timeFrom}
Meddig: ${dateTo} ${timeTo}

-----------------------------
Összesen fizetendő: ${teljesAr} Ft
-----------------------------

Megjegyzés: 
Ha nem megy el érte időben, akkor a foglalás törlődik!
Ha nem hozza vissza időben, akkor naponta késedelmi díjat fizet!

Üdvözlettel,
MediaHaven
        `;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD,
            },
        });
        
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: "Foglalás visszaigazolása",
            text: emailText,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ message: "A foglalás sikeresen rögzítve, e-mail elküldve!" });

    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Hiba a foglalás mentésekor." });
    }

}

module.exports = { postReservations };

