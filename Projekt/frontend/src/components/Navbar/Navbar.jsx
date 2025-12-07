import { Link } from "react-router";
import "../Navbar/navbar.css";

function Navbar() {
    return (
        <div className="Navbar">
            <div className="Links">
                <Link to="/">
                    Kezdőlap
                </Link>{" "}
                <Link to="/zenek">
                    Zenék
                </Link>{" "}
                <Link to="/filmek">
                    Filmek
                </Link>{" "}
                <Link to="/sorozatok">
                    Sorozatok
                </Link>{" "}
                <Link to="/kosar">
                    Kosár
                </Link>{" "}
                <Link to="/kapcsolat">
                    Kapcsolat
                </Link>{" "}
                <Link to="/regisztracio">
                    Bejelentkezés/Regisztráció
                </Link>
            </div>
        </div>
    );
}

export default Navbar;



