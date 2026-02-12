import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "../Profil/profil.css";

function Profil() {

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordAgain, setNewPasswordAgain] = useState("");

    const GETLOGOUTAPI = import.meta.env.VITE_API_GET_LOGOUT_URL;
    const POSTPROFILAPI = import.meta.env.VITE_API_POST_PROFIL_URL;
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    if (!user) {
        return null; 
    }


    function newPasswordChange(e) {
        setNewPassword(e.target.value);
    }

    function newPasswordAgainChange(e) {
        setNewPasswordAgain(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(newPassword !== newPasswordAgain) {
            alert("A két jelszó nem egyezik!");
            return;
        }

        try {
            const res = await fetch(POSTPROFILAPI, {
                mode: "cors",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ujJelszo: newPassword,
                    id: user.user_id
                })
            });
            const data = await res.json();
            alert(data.message);
            setNewPassword("");
            setNewPasswordAgain("");
        } catch(err) {
            console.error(err);
            alert("Hiba a módosítás során!");
        }

    }

    
    async function logOut() {

        try {
            const res = await fetch(GETLOGOUTAPI, { credentials: "include" });
            const data = await res.json();
            alert(data.message);
            setUser(null);
            navigate("/");
        } catch(err) {
            console.log(err);
        }
    }

    return (

        <>
            <Navbar/>

            <h1>Profil</h1>

            <div className="profil"> 

                <div className="profil-adatok">
                    <h3>Személyes adatok</h3>
                    <h4>Név: {user.last_name + " " + user.first_name}</h4>
                    <h4>E-mail cím: {user.email}</h4>
                    <h4>Regisztráció dátuma: {new Date(user.created_at).toLocaleDateString("hu-HU")}</h4>
                </div>

                <div className="profil-jelszomodositas">
                    <h3>Jelszó módosítása</h3>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="ujjelszo">Új jelszó: </label>
                        <input type="password" name="ujjelszo" id="ujjelszo" required value={newPassword} onChange={newPasswordChange}/>
                        <label htmlFor="ujjelszomegerosites">Új jelszó megerősítés: </label>
                        <input type="password" name="ujjelszomegerosites" id="ujjelszomegerosites" required value={newPasswordAgain} onChange={newPasswordAgainChange}/>
                        <button type="submit">Mentés</button>
                    </form>
                </div>

                <div className="profil-kijelentkezes">
                    <button onClick={logOut}>Kijelentkezés</button>
                </div>
                
            </div>

            <Footer/>
        </>

    );

}

export default Profil;

