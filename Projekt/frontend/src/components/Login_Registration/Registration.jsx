import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

function Registration() {
    return (
        <div>
            <Navbar />
            <h1>Regisztráció</h1>
            <h4><Link to="/bejelentkezes">Már van fiókom</Link></h4>
            <Footer />
        </div>
    );
}

export default Registration;

