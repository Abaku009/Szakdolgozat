import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"

function Login() {
    return (
        <div>
            <Navbar />
            <h1>Bejelentkezés</h1>
            <h4><Link to="/regisztracio">Még nincs fiókom</Link></h4>
            <Footer />
        </div>
    );
}

export default Login;

