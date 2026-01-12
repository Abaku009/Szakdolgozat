const db = require("../database/queries/ownReservationsQuery")

async function getOwnReservations(req, res) {

    try {
        const { user } = req.body;

        if (!user || !user.user_id) {
            return res.status(400).json({
                message: "Felhasználó hiányzik"
            });
        }

        const reservations = await db.getOwnReservations(user.user_id);
        return res.json(reservations);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Hiba a saját foglalások lekérésekor."
        });
    }
    
}

module.exports = { getOwnReservations };

