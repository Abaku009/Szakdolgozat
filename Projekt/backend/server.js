require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

const messageRouter = require("./routes/messageRouter");
const musicRouter = require("./routes/musicRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api/message", messageRouter);
app.use("/api/music", musicRouter);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});


