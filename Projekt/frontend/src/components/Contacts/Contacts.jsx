import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState } from "react"

function Contacts() {

    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const [Text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const POSTMESSAGEAPI = import.meta.env.VITE_API_POST_MESSAGE_URL;

    function firstNameChange(e) {
        setFirstName(e.target.value);
    }

    function lastNameChange(e) {
        setLastName(e.target.value);
    }

    function emailChange(e) {
        setEmail(e.target.value);
    }

    function textChange(e) {
        setText(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(POSTMESSAGEAPI, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vezeteknev: LastName,
                    keresztnev: FirstName,
                    email: Email,
                    uzenet: Text
                })
            });
            const data = await res.json();
            alert(data.message);
            setFirstName("");
            setLastName("");
            setEmail("");
            setText("");
        } catch (err) {
            console.error(err);
            alert("Hiba történt az üzenet küldésekor");
        } finally {
            setLoading(false);
        }
    }



    return (
        <div>
            <Navbar />
            <h1>Kapcsolat</h1>
            <div className="container">
                <div className="kapcsolat">
                    <p>E-mail: mediahaven.contact@gmail.com</p>
                    <p>Telefonszám: +36 20 123 4567</p>
                    <p>Cím: 9700 Szombathely, Fő tér 42. </p>
                    <table id="nyitvatartas">
                        <thead>
                            <tr>
                                <th colSpan={2}>Nyitvatartás</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hétfő</td>
                                <td>8:00 - 18:00</td>
                            </tr>
                            <tr>
                                <td>Kedd</td>
                                <td>8:00 - 18:00</td>
                            </tr>
                            <tr>
                                <td>Szerda</td>
                                <td>8:00 - 18:00</td>
                            </tr>
                            <tr>
                                <td>Csütörtök</td>
                                <td>8:00 - 18:00</td>
                            </tr>
                            <tr>
                                <td>Péntek</td>
                                <td>8:00 - 18:00</td>
                            </tr>
                            <tr>
                                <td>Szombat</td>
                                <td>Zárva</td>
                            </tr>
                            <tr>
                                <td>Vasárnap</td>
                                <td>Zárva</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="irjnekunk">
                    <form onSubmit={handleSubmit}>
                        <h2>Visszajelzés küldése</h2>
                        <label htmlFor="vezeteknev">Vezetéknév: </label>
                        <input type="text" name="vezeteknev" id="vezeteknev" required placeholder="Kocsis" value={LastName} onChange={lastNameChange}/>
                        <label htmlFor="keresztnev">Keresztnév: </label>
                        <input type="text" name="keresztnev" id="keresztnev" required placeholder="András" value={FirstName} onChange={firstNameChange}/>
                        <label htmlFor="email">E-mail cím: </label>
                        <input type="email" name="email" id="email" required placeholder="valamiemail@gmail.com" value={Email} onChange={emailChange}/>
                        <label htmlFor="uzenet">Üzenet: </label>
                        <textarea name="uzenet" id="uzenet" placeholder="Írj nekünk!" value={Text} maxLength={300} rows={4} cols={40} onChange={textChange}></textarea>
                        <button type="submit" disabled={loading}>Küldés</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Contacts;

