import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState, useEffect} from "react"
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { ReservationCartContext } from "../../context/ReservationCartContext";
import { useNavigate } from "react-router";
import "../Films/films.css";

function Films() {

    const { user } = useContext(UserContext);
    const { addToCart } = useContext(ReservationCartContext);
    const navigate = useNavigate();

    const GETFILMSAPI = import.meta.env.VITE_API_GET_FILMS_URL;
    const GETFILMSGENRESAPI = import.meta.env.VITE_API_GET_FILMS_GENRES_URL;
    const GETFILMSLANGUAGESAPI = import.meta.env.VITE_API_GET_FILMS_LANGUAGES_URL;
    const GETFILMSFORMATSAPI = import.meta.env.VITE_API_GET_FILMS_FORMATS_URL;

    const [films, setFilms] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);
    const [filtered, setFiltered] = useState({});

    const [selectedOrder, setSelectedOrder] = useState("asc");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");


    const [recommendations, setRecommendations] = useState([]);

    const GETFILMRECOMMENDATIONSAPI = import.meta.env.VITE_API_GET_FILM_RECOMMENDATIONS_URL;


    useEffect(() => {
        async function fetchFilmsData() {
            const [filmsRes, genresRes, languagesRes, formatsRes ] = await Promise.all([
                fetch(GETFILMSAPI).then(res => res.json()),
                fetch(GETFILMSGENRESAPI).then(res => res.json()),
                fetch(GETFILMSLANGUAGESAPI).then(res => res.json()),
                fetch(GETFILMSFORMATSAPI).then(res => res.json())
            ]);

            setFilms(filmsRes);
            setGenres(genresRes.map(gen => gen.genre));
            setLanguages(languagesRes.map(lang => lang.language));
            setFormats(formatsRes.map(form => form.format));
    
        };
           
        fetchFilmsData();

    }, []);

    useEffect(() => {
        const filtered = films
            .filter(film => (selectedGenre === "" || selectedGenre === film.categoryname))
            .filter(film => (selectedLanguage === "" || selectedLanguage === film.languagename))
            .filter(film => (selectedFormat === "" || selectedFormat === film.format))

        filtered.sort((a, b) =>
            selectedOrder === "asc" ? a.price - b.price : b.price - a.price
        );

        const grouped = filtered.reduce((acc, currentFilm) => {
            if(!acc[currentFilm.categoryname]) acc[currentFilm.categoryname] = [];
            acc[currentFilm.categoryname].push(currentFilm);
            return acc;
        }, {})

        const sortedGrouped = Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b, "hu"))
            .reduce((acc, currentCategogy) => {
                acc[currentCategogy] = grouped[currentCategogy];
                return acc;
            }, {});

        setFiltered(sortedGrouped);
    }, [selectedOrder, selectedGenre, selectedLanguage, selectedFormat, films]);


    useEffect(() => {
        if(!user) {
            setRecommendations([]);
            return;
        }

        fetchRecommendations();
    }, [user]);


    function moveToCart(movie) {
        if(!user) {
            alert("Kérjük jelentkezzen be!");
            navigate("/regisztracio");
            return;
        }

        addToCart({
            ...movie,
            id: movie.film_id,
            type: "film"
        });
    }


    async function fetchRecommendations() {
        try {
            const res = await fetch(GETFILMRECOMMENDATIONSAPI, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    userID: user.user_id
                })
            });
            const data = await res.json();
            setRecommendations(data);
        } catch(err) {
            console.error(err);
            alert("Hiba az ajánlások lekérése során!");
        }
    }


    return (

        <>

            <Navbar />

            <div className="film-filters">
                <select onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Minden műfaj</option>
                    {genres.map(gen => <option key={gen} value={gen}>{gen}</option>)}
                </select>

                <select onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">Minden nyelv</option>
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>

                <select onChange={e => setSelectedFormat(e.target.value)}>
                    <option value="">Minden formátum</option>
                    {formats.map(form => <option key={form} value={form}>{form}</option>)}
                </select>

                <select onChange={e => setSelectedOrder(e.target.value)}>
                    <option value="asc">Ár növekvő</option>
                    <option value="desc">Ár csökkenő</option>
                </select>

            </div>

            {Object.keys(filtered).length === 0 && (
                <div className="film-no-result">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="film-recommendations">
                    <h2 className="film-recommendations-header">Ajánlott filmek a foglalásaid alapján</h2>

                    <div className="film-recommendations-list">
                        {recommendations.map(rec => (
                            <div key={rec.film_id} className="film-recommendation-item">
                                <p><strong>Cím: </strong>{rec.title}</p>
                                <p><strong>Rendező: </strong>{rec.director}</p>
                                <p><strong>Nyelv: </strong>{rec.languagename}</p>
                                <p><strong>Formátum: </strong>{rec.format}</p>
                                <p><strong>Ár: </strong>{rec.price} Ft</p>
                                <p><strong>Darabszám: </strong>{rec.stock}</p>
                                <p><button disabled={rec.stock === 0} onClick={() => moveToCart(rec)}>Kosárba helyezés</button></p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(filtered).length > 0 && (
                <>
                    <h2 className="film-offer-header">Film kínálat</h2>

                    <div className="FilmList">
                        {Object.keys(filtered)
                            .filter(category => filtered[category].length > 0)
                            .map(category => (
                                <div key={category} className="FilmCategory">
                                    <h2>{category}</h2>
                                    {filtered[category].map(film => (
                                        <div key={film.film_id} className="FilmItem">
                                            <p><strong>Cím: </strong>{film.title}</p>
                                            <p><strong>Rendező: </strong> {film.director}</p>
                                            <p><strong>Nyelv: </strong>{film.languagename}</p>
                                            <p><strong>Formátum: </strong>{film.format}</p>
                                            <p><strong>Ár: </strong>{film.price} Ft</p>
                                            <p><strong>Darabszám: </strong>{film.stock}</p>
                                            <p><button disabled={film.stock === 0} onClick={() => moveToCart(film)}>Kosárba helyezés</button></p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                </>
            )}


            <Footer />
        
        </>

    );
    
}

export default Films;

