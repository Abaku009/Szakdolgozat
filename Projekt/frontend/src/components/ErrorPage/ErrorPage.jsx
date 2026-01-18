import { Link } from "react-router";
import "../ErrorPage/errorpage.css";

function ErrorPage() {
    return (
        <div className="error-container">
            <h1 className="error-title">404</h1>
            <p className="error-message">A keresett oldal nem található!</p>
            <p className="error-link">
                Visszatérhet a <Link to="/">kezdőlapra</Link>
            </p>
        </div>
    );
}

export default ErrorPage;

