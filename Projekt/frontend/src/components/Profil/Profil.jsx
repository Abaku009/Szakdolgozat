import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Profil() {

    const GETLOGOUTAPI = import.meta.env.VITE_API_GET_LOGOUT_URL;
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

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

            <div className="profil"> 
                <button onClick={logOut}>Kijelentkezés</button>
            </div>

            <Footer/>
        </>

    );

}

export default Profil;

