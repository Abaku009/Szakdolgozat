
const { insertMessage } = require("../queries/messageQuery");
const nodemailer = require("nodemailer");

const postNewMessage = async (req, res) => {
  const { vezeteknev, keresztnev, email, uzenet } = req.body;

  try {
    const newMessage = await insertMessage(vezeteknev, keresztnev, email, uzenet);

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
      subject: `Új üzenet ${vezeteknev} ${keresztnev}-tól`,
      text: `Feladó: ${vezeteknev} ${keresztnev} <${email}>\n\nÜzenet:\n${uzenet}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Üzenet sikeresen elküldve!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Hiba történt az üzenet küldésekor" });
  }
};

module.exports = { postNewMessage };

