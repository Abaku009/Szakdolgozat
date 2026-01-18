import { Link } from "react-router";
import "../Navbar/navbar.css";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";

function Navbar() {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const GETLOGOUTAPI = import.meta.env.VITE_API_GET_LOGOUT_URL;

    function handleCartClick(e) {
        e.preventDefault();
        if(!user) {
            alert("Kérjük jelentkezzen be!");
            navigate("/regisztracio");
        } else {
            navigate("/kosar");
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
        <div className="Navbar">
            <div className="Links">
                {user?.is_admin ? (
                    <>
                        <Link to="/">Kezdőlap</Link>{" "}
                        <Link to="/admin_zenek">Admin Zenék</Link>{" "}
                        <Link to="/admin_filmek">Admin Filmek</Link>{" "}
                        <Link to="/admin_sorozatok">Admin Sorozatok</Link>{" "}
                        <Link to="/admin_profilok">Admin Profilok</Link>{" "}
                        <Link to="/admin_foglalasok">Admin Foglalások</Link>{" "}
                        <Link onClick={logOut}>Kijelentkezés</Link>
                    </>
                ) : (
                    <>
                        <Link to="/">Kezdőlap</Link>{" "}
                        <Link to="/zenek">Zenék</Link>{" "}
                        <Link to="/filmek">Filmek</Link>{" "}
                        <Link to="/sorozatok">Sorozatok</Link>{" "}
                        {user && (
                            <>
                                <Link to="/foglalas">Foglalás</Link>{" "}
                                <Link to="/sajatFoglalasok">Saját foglalások</Link>{" "}
                            </>
                        )}
                        <Link to="/kosar" onClick={handleCartClick}>Kosár</Link>{" "}
                        <Link to="/kapcsolat">Kapcsolat</Link>{" "}
                        {user ? (
                            <Link to="/profil">Profil</Link>
                        ) : (
                            <Link to="/regisztracio">Bejelentkezés/Regisztráció</Link>
                        )}
                    </>
                )}
            </div>
        </div> 
    );
}

export default Navbar;

