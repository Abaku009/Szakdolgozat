import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState } from "react"
import "../Login_Registration/registration.css";

function Registration() {

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [loading, setLoading] = useState(false);

    const POSTREGISTRATIONAPI = import.meta.env.VITE_API_POST_REGISTRATION_URL;

    function lastNameChange(e) {
        setLastName(e.target.value);
    }
    
    function firstNameChange(e) {
        setFirstName(e.target.value);
    }

    function emailChange(e) {
        setEmail(e.target.value);
    }

    function passwordChange(e) {
        setPassword(e.target.value);
    }

    function passwordAgainChange(e) {
        setPasswordAgain(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== passwordAgain) {
            alert("A két jelszó nem egyezik!");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(POSTREGISTRATIONAPI, {
                mode: "cors",
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vezeteknev: lastName,
                    keresztnev: firstName,
                    email: email,
                    jelszo: password
                })
            });
            const data = await res.json();
            alert(data.message);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setPasswordAgain("");
        } catch(err) {
            console.error(err);
            alert("Hiba történt a regisztráció során");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />

            <h1 className="reg">Regisztráció</h1>

            <div className="regisztracio">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="vezeteknev">Vezetéknév: </label>
                    <input type="text" name="vezeteknev" id="vezeteknev" required placeholder="Kocsis" value={lastName} onChange={lastNameChange}/>
                    <label htmlFor="keresztnev">Keresztnév: </label>
                    <input type="text" name="keresztnev" id="keresztnev" required placeholder="András" value={firstName} onChange={firstNameChange}/>
                    <label htmlFor="email">E-mail cím: </label>
                    <input type="email" name="email" id="email" required placeholder="valamiemail@gmail.com" value={email} onChange={emailChange}/>
                    <label htmlFor="jelszo">Jelszó: </label>
                    <input type="password" name="jelszo" id="jelszo" required value={password} onChange={passwordChange}/>
                    <label htmlFor="jelszoujra">Jelszó megerősítése: </label>
                    <input type="password" name="jelszoujra" id="jelszoujra" required value={passwordAgain} onChange={passwordAgainChange}/>
                    <button type="submit" disabled={loading}>{loading ? "Feldolgozás..." : "Fiók létrehozása"}</button>
                </form>
            </div>

            <h4 className="link"><Link to="/bejelentkezes" className="link-button">Már van fiókom</Link></h4>

            <Footer />
        </>
    );
}

export default Registration;

