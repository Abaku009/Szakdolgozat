process.env.DOTENV_CONFIG_QUIET = "true";
require("dotenv").config();


const db = require("./database/queries/loginQuery");
const bcrypt = require("bcrypt");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;


const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    } 
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(
    new LocalStrategy({
        usernameField: "emailcim",
        passwordField: "jelszo"
    }, async (emailcim, jelszo, done) => {
        try {
            const { rows } = await db.getUserEmail(emailcim);
            const user = rows[0];

            if(!user) {
                return done(null, false, { message: "Hibás email cím!" });
            }
            const match = await bcrypt.compare(jelszo, user.hashed_password);
            if(!match) {
                return done(null, false, { message: "Hibás jelszó! "});
            }

            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);


passport.serializeUser((user, done) => {
    done(null, user.user_id)
});


passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await db.getUserID(id);
        const user = rows[0];

        done(null, user);
    } catch(err) {
        done(err);
    }
});


const messageRouter = require("./routes/messageRouter");
const musicRouter = require("./routes/musicRouter");
const filmRouter = require("./routes/filmRouter");
const seriesRouter = require("./routes/seriesRouter");
const registrationRouter = require("./routes/registrationRouter");
const loginRouter = require("./routes/loginRouter");
const currentUserRouter = require("./routes/currentUserRouter");
const logoutRouter = require("./routes/logoutRouter");
const profilRouter = require("./routes/profilRouter");
const musicOrderRouter = require("./routes/musicOrderRouter");
const onSiteReservationRouter = require("./routes/onSiteReservationRouter");
const onlineReservationRouter = require("./routes/onlineReservationRouter");
const ownReservationsRouter = require("./routes/ownReservationsRouter");
const adminReservationsRouter = require("./routes/adminReservationsRouter");
const adminProfilesRouter = require("./routes/adminProfilesRouter");
const adminMusicRouter = require("./routes/adminMusicRouter");
const adminFilmsRouter = require("./routes/adminFilmsRouter");
const adminSeriesRouter = require("./routes/adminSeriesRouter");
const orderCartRecommendationRouter = require("./routes/orderCartRecommendationRouter");


app.use("/api/message", messageRouter);
app.use("/api/music", musicRouter);
app.use("/api/films", filmRouter);
app.use("/api/series", seriesRouter);
app.use("/api/registration", registrationRouter);
app.use("/api/login", loginRouter);
app.use("/api/current_user", currentUserRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/profil", profilRouter);
app.use("/api/music_order", musicOrderRouter);
app.use("/api/on_site_reservation", onSiteReservationRouter);
app.use("/api/online_reservation", onlineReservationRouter);
app.use("/api/own_reservations", ownReservationsRouter);
app.use("/api/admin_reservations", adminReservationsRouter);
app.use("/api/admin_profiles", adminProfilesRouter);
app.use("/api/admin_music", adminMusicRouter);
app.use("/api/admin_films", adminFilmsRouter);
app.use("/api/admin_series", adminSeriesRouter);
app.use("/api/order_cart_recommendations", orderCartRecommendationRouter);


app.listen(port, () => {
    console.log("Server is running on port " + port);
});

