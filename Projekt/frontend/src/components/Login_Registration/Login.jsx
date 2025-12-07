import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState } from "react"

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const POSTLOGINAPI = import.meta.env.VITE_API_POST_LOGIN_URL;


    function emailChange(e) {
        setEmail(e.target.value);
    }

    function passwordChange(e) {
        setPassword(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await fetch(POSTLOGINAPI, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    emailcim: email,
                    jelszo: password
                })
            });
            const data = await res.json();
            if(!res.ok) {
                alert(data.message);
                return;
            }
            alert(data.message);
            setEmail("");
            setPassword("");
        } catch(err) {
            console.error(err);
            alert("Hiba a bejelentkezés során");
        }
    }


    return (
        <>

            <Navbar />

            <h1>Bejelentkezés</h1>

            <div className="bejelentkezes">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail cím: </label>
                    <input type="email" name="email" id="email" required placeholder="valamiemail@gmail.com" value={email} onChange={emailChange}/>
                    <label htmlFor="jelszo">Jelszó: </label>
                    <input type="password" name="jelszo" id="jelszo" required value={password} onChange={passwordChange}/>
                    <button type="submit">Bejelentkezés</button>
                </form>

            </div>

            <h4><Link to="/regisztracio">Még nincs fiókom</Link></h4>

            <Footer />

        </>
    );
}

export default Login;

