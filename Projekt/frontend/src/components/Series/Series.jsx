import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState, useEffect } from "react"
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { ReservationCartContext } from "../../context/ReservationCartContext";
import { useNavigate } from "react-router";
import "../Series/series.css";


function Series() {

    const { user } = useContext(UserContext);
    const { addToCart } = useContext(ReservationCartContext);
    const navigate = useNavigate();

    const GETSERIESAPI = import.meta.env.VITE_API_GET_SERIES_URL;
    const GETSERIESGENRESAPI = import.meta.env.VITE_API_GET_SERIES_GENRES_URL;
    const GETSERIESLANGUAGESAPI = import.meta.env.VITE_API_GET_SERIES_LANGUAGES_URL;
    const GETSERIESFORMATSAPI = import.meta.env.VITE_API_GET_SERIES_FORMATS_URL;

    const [series, setSeries] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);
    const [filtered, setFiltered] = useState({});

    const [selectedOrder, setSelectedOrder] = useState("asc");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");


    const [recommendations, setRecommendations] = useState([]);

    const GETSERIESRECOMMENDATIONSAPI = import.meta.env.VITE_API_GET_SERIES_RECOMMENDATIONS_URL;


    useEffect(() => {

        async function fetchSeriesData() {
            const [seriesRes, genresRes, languagesRes, formatsRes] = await Promise.all([
                fetch(GETSERIESAPI).then(res => res.json()),
                fetch(GETSERIESGENRESAPI).then(res => res.json()),
                fetch(GETSERIESLANGUAGESAPI).then(res => res.json()),
                fetch(GETSERIESFORMATSAPI).then(res => res.json())
            ]);

            setSeries(seriesRes);
            setGenres(genresRes.map(gen => gen.genre));
            setLanguages(languagesRes.map(lang => lang.language));
            setFormats(formatsRes.map(form => form.format));
            
        };

        fetchSeriesData();

    }, []);


    useEffect(() => {

        const filtered = series
            .filter(serie => (selectedGenre === "" || serie.categoryname === selectedGenre))
            .filter(serie => (selectedLanguage === "" || serie.languagename === selectedLanguage))
            .filter(serie => (selectedFormat === "" || serie.format === selectedFormat))

        filtered.sort((a, b) =>
            selectedOrder === "asc" ? a.price - b.price : b.price - a.price
        );

        const grouped = filtered.reduce((acc, currentSerie) => {
            if(!acc[currentSerie.categoryname]) acc[currentSerie.categoryname] = [];
            acc[currentSerie.categoryname].push(currentSerie);
            return acc;
        }, {});

        const sortedGrouped = Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b, "hu"))
            .reduce((acc, currentCategogy) => {
                acc[currentCategogy] = grouped[currentCategogy];
                return acc;
            }, {});

        setFiltered(sortedGrouped);
    }, [series, selectedFormat, selectedGenre, selectedLanguage, selectedOrder]);


    useEffect(() => {
        if(!user) {
            setRecommendations([]);
            return;
        }

        fetchRecommendations();
    }, [user]);


    function moveToCart(series) {
        if(!user) {
            alert("Kérjük jelentkezzen be!");
            navigate("/regisztracio");
            return;
        }

        addToCart({
            ...series,
            id: series.series_id,
            type: "series"
        });
    }


    async function fetchRecommendations() {
        try {
            const res = await fetch(GETSERIESRECOMMENDATIONSAPI, {
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

            <div className="series-filters">
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
                <div className="series-no-result">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="series-recommendations">
                    <h2 className="series-recommendations-header">Ajánlott sorozatok a foglalásaid alapján</h2>

                    <div className="series-recommendations-list">
                        {recommendations.map(rec => (
                            <div key={rec.series_id} className="series-recommendation-item">
                                <p><strong>Cím: </strong>{rec.title}</p>
                                <p><strong>Alkotó: </strong>{rec.creator}</p>
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
                    <h2 className="series-offer-header">Sorozat kínálat</h2>

                    <div className="SeriesList"> 
                        {Object.keys(filtered)
                            .filter(category => filtered[category].length > 0)
                            .map(category => (
                                <div key={category} className="SeriesCategory">
                                    <h2>{category}</h2>
                                    {filtered[category].map(serie => (
                                        <div key={serie.series_id} className="SeriesItem">
                                            <p><strong>Cím: </strong>{serie.title}</p>
                                            <p><strong>Alkotó: </strong> {serie.creator}</p>
                                            <p><strong>Nyelv: </strong>{serie.languagename}</p>
                                            <p><strong>Formátum: </strong>{serie.format}</p>
                                            <p><strong>Ár: </strong>{serie.price} Ft</p>
                                            <p><strong>Darabszám: </strong>{serie.stock}</p>
                                            <p><button disabled={serie.stock === 0} onClick={() => moveToCart(serie)}>Kosárba helyezés</button></p>
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

export default Series;

