import { Link } from "react-router";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState, useEffect} from "react"
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import "../Films/films.css";

function Films() {

    const { user } = useContext(UserContext);
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
        .sort((a, b) => 
            selectedOrder === "asc" ? a.price - b.price : b.price - a.price
        );

        const grouped = filtered.reduce((acc, currentFilm) => {
            if(!acc[currentFilm.categoryname]) acc[currentFilm.categoryname] = [];
            acc[currentFilm.categoryname].push(currentFilm);
            return acc;
        }, {})

        setFiltered(grouped);

    }, [selectedOrder, selectedGenre, selectedLanguage, selectedFormat, films]);


    function moveToCart() {
        if(!user) {
            alert("Kérjük jelentkezzen be!");
            navigate("/regisztracio");
        }
    }



    return (

        <>

            <Navbar />

            <div className="filters">
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
                <div className="no-result">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            <div className="filmList">
                {Object.keys(filtered).map(category => (
                    <div key={category} className="filmCategory">
                        <h2>{category}</h2>
                        {filtered[category].map(film => (
                            <div key={film.film_id} className="filmItem">
                                <p><strong>Cím: </strong>{film.title}</p>
                                <p><strong>Nyelv: </strong>{film.languagename}</p>
                                <p><strong>Formátum: </strong>{film.format}</p>
                                <p><strong>Ár: </strong>{film.price}</p>
                                <p><strong>Darabszám: </strong>{film.stock}</p>
                                <p><button disabled={film.stcok === 0} onClick={moveToCart}>Kosárba helyezés</button></p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Footer />
        
        </>

    );
}

export default Films;

