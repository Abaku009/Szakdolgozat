const db = require("../database/queries/adminReservationsQuery");

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

module.exports = { getAdminReservations };

