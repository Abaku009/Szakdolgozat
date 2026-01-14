import { Link } from "react-router";
import "../Navbar/navbar.css";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";

function Navbar() {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    function handleCartClick(e) {
        e.preventDefault();
        if(!user) {
            alert("Kérjük jelentkezzen be!");
            navigate("/regisztracio");
        } else {
            navigate("/kosar");
        }
    }

    return (
        <div className="Navbar">
            <div className="Links">
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
            </div>
        </div>
    );
}

export default Navbar;

