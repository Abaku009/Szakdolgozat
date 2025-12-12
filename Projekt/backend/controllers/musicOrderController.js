const { insertMusicOrder } = require("../database/queries/musicOrderQuery");
const nodemailer = require("nodemailer");

async function postMusicOrder(req, res) {

    const { music, user, teljesAr } = req.body;

    try {
        const orderId = await insertMusicOrder(user.user_id, music);

        const orderItemsText = music
            .map(item => 
                `- ${item.title} (${item.qty} db) - ${item.price * item.qty} Ft`
            )
            .join("\n");

        const emailText = `
Kedves ${user.last_name} ${user.first_name}!

Köszönjük rendelését! A rendelés adatai:

Rendelési azonosító: ${orderId}

Tételek:
${orderItemsText}

-----------------------------
Összesen fizetendő: ${teljesAr} Ft
-----------------------------

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
            subject: "Rendelés visszaigazolása",
            text: emailText,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ message: "A rendelés sikeresen rögzítve, e-mail elküldve!" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Hiba a rendelés mentésekor." });
    }
    
}

module.exports = { postMusicOrder };

