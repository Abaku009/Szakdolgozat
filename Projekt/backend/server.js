require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

const messageRouter = require("./routes/messageRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api/message", messageRouter);

app.listen(port, () => {
    console.log("Server is running on port " + port);
});


