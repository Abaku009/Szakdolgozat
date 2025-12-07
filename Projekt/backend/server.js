require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

const messageRouter = require("./routes/messageRouter");
const musicRouter = require("./routes/musicRouter");
const filmRouter = require("./routes/filmRouter");
const seriesRouter = require("./routes/seriesRouter");
const registrationRouter = require("./routes/registrationRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api/message", messageRouter);
app.use("/api/music", musicRouter);
app.use("/api/films", filmRouter);
app.use("/api/series", seriesRouter);
app.use("/api/registration", registrationRouter);



app.listen(port, () => {
    console.log("Server is running on port " + port);
});


