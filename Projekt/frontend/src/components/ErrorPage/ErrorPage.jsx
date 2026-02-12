import { Link } from "react-router";
import "../ErrorPage/errorpage.css";

function ErrorPage() {
    return (
        <div className="errorpage-container">
            <h1 className="errorpage-title">404</h1>
            <p className="errorpage-message">A keresett oldal nem található!</p>
            <p className="errorpage-link">
                Visszatérhet a <Link to="/">kezdőlapra</Link>
            </p>
        </div>
    );
}

export default ErrorPage;

