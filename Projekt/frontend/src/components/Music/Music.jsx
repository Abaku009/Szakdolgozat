import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer"
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router";
import "../Music/music.css";


function Music() {

    const { user } = useContext(UserContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const GETMUSICAPI = import.meta.env.VITE_API_GET_MUSIC_URL;
    const GETMUSICGENRESAPI = import.meta.env.VITE_API_GET_MUSIC_GENRES_URL;
    const GETMUSICLANGUAGESAPI = import.meta.env.VITE_API_GET_MUSIC_LANGUAGES_URL;
    const GETMUSICFORMATSAPI = import.meta.env.VITE_API_GET_MUSIC_FORMATS_URL;

    const [music, setMusic] = useState([]);
    const [filteredMusic, setFilteredMusic] = useState({});
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); 


    useEffect(() => {
        const fetchMusicData = async () => {
            const [musicRes, genresRes, languagesRes, formatsRes] = await Promise.all([
                fetch(GETMUSICAPI).then(res => res.json()),
                fetch(GETMUSICGENRESAPI).then(res => res.json()),
                fetch(GETMUSICLANGUAGESAPI).then(res => res.json()),
                fetch(GETMUSICFORMATSAPI).then(res => res.json())
            ]);

            setMusic(musicRes);
            setGenres(genresRes.map(genr => genr.genre));
            setLanguages(languagesRes.map(lang => lang.language));
            setFormats(formatsRes.map(form => form.format));
        };

        fetchMusicData();
    }, []);


    useEffect(() => {
        const filtered = music
            .filter(mus => (selectedGenre === "" || mus.categoryname === selectedGenre))
            .filter(mus => (selectedLanguage === "" || mus.languagename === selectedLanguage))
            .filter(mus => (selectedFormat === "" || mus.format === selectedFormat))
            .sort((a, b) =>
                sortOrder === "asc" ? a.price - b.price : b.price - a.price
            );

        const grouped = filtered.reduce((acc, currentmusic) => {
            if (!acc[currentmusic.categoryname]) acc[currentmusic.categoryname] = [];
            acc[currentmusic.categoryname].push(currentmusic);
            return acc;
        }, {});

        setFilteredMusic(grouped);
    }, [music, selectedGenre, selectedLanguage, selectedFormat, sortOrder]);



    function moveToCart(music) {
        if(!user) {
            alert("Kérjük jelentkezzen be!");
            navigate("/regisztracio");
            return;
        } 

        addToCart(music);
    }



    return (
        <>

            <Navbar/>
            
            <div className="filters">
                <select onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Minden műfaj</option>
                    {genres.map(genr => <option key={genr} value={genr}>{genr}</option>)}
                </select>

                <select onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">Minden nyelv</option>
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>

                <select onChange={e => setSelectedFormat(e.target.value)}>
                    <option value="">Minden formátum</option>
                    {formats.map(form => <option key={form} value={form}>{form}</option>)}
                </select>

                <select onChange={e => setSortOrder(e.target.value)}>
                    <option value="asc">Ár növekvő</option>
                    <option value="desc">Ár csökkenő</option>
                </select>
            </div>

            {Object.keys(filteredMusic).length === 0 && (
                <div className="no-results">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            <div className="musicList">
                {Object.keys(filteredMusic).map(category => (
                    <div key={category} className="musicCategory">
                        <h2>{category}</h2>
                        {filteredMusic[category].map(mus => (
                            <div key={mus.music_id} className="musicItem">
                                <p><strong>Cím:</strong> {mus.title}</p>
                                <p><strong>Előadó:</strong> {mus.performer}</p>
                                <p><strong>Nyelv:</strong> {mus.languagename}</p>
                                <p><strong>Formátum:</strong> {mus.format}</p>
                                <p><strong>Ár:</strong> {mus.price} Ft</p>
                                <p><strong>Darabszám:</strong> {mus.stock}</p>
                                <p><button disabled={mus.stock === 0} onClick={() => moveToCart(mus)}>Kosárba helyezés</button></p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <Footer />

        </>
    );
}

export default Music;

