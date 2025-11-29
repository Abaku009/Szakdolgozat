import { Link } from "react-router";

function ErrorPage() {
    return (
        <>
            <div>
                A keresett oldal nem található!
            </div>
            <div>
                Visszatérhet a kezdőlapra: <Link to="/">Kezdőlap</Link>
            </div>
        
        </>
        
    );
}

export default ErrorPage;

