import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState, useContext } from "react"
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import "../Login_Registration/login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const POSTLOGINAPI = import.meta.env.VITE_API_POST_LOGIN_URL;

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();


    function emailChange(e) {
        setEmail(e.target.value);
    }

    function passwordChange(e) {
        setPassword(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

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
            setUser(data.user);
            navigate("/");
            alert(data.message);
            alert("Üdvözlünk a MediaHaven-ben " + data.user.last_name + " " + data.user.first_name + "!");
            setEmail("");
            setPassword("");
        } catch(err) {
            console.error(err);
            alert("Hiba a bejelentkezés során");
        } finally {
            setLoading(false);
        }
    }


    return (
        <>

            <Navbar />

            <h1 className="login">Bejelentkezés</h1>

            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail cím: </label>
                    <input type="email" name="email" id="email" required placeholder="valamiemail@gmail.com" value={email} onChange={emailChange}/>
                    <label htmlFor="jelszo">Jelszó: </label>
                    <input type="password" name="jelszo" id="jelszo" required value={password} onChange={passwordChange}/>
                    <button type="submit" disabled={loading}>{loading ? "Feldolgozás..." : "Bejelentkezés"}</button>
                </form>

            </div>

            <h4 className="LoginLinkButton"><Link to="/regisztracio" className="login-link-button">Még nincs fiókom</Link></h4>

            <Footer />

        </>
    );
}

export default Login;

