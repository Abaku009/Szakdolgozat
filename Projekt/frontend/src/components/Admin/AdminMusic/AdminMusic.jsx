import Navbar from "../../Navbar/Navbar"
import Footer from "../../Footer/Footer"
import { useState, useEffect } from "react";
import "../AdminMusic/adminmusic.css";
import AdminMusicEditForm from "./AdminMusicEditForm";


function AdminMusic() {


    const GETMUSICAPI = import.meta.env.VITE_API_GET_MUSIC_URL;
    const GETMUSICGENRESAPI = import.meta.env.VITE_API_GET_MUSIC_GENRES_URL;
    const GETMUSICLANGUAGESAPI = import.meta.env.VITE_API_GET_MUSIC_LANGUAGES_URL;
    const GETMUSICFORMATSAPI = import.meta.env.VITE_API_GET_MUSIC_FORMATS_URL;

    const ADMINMUSICAPI = import.meta.env.VITE_API_ADMIN_MUSIC_URL;

    const [music, setMusic] = useState([]);
    const [filteredMusic, setFilteredMusic] = useState({});
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); 

    const [isDeleting, setIsDeleting] = useState(false);
    const [editingMusic, setEditingMusic] = useState(null);


    useEffect(() => {
        const fetchMusicData = async () => {
            const [musicRes, genresRes, languagesRes, formatsRes] = await Promise.all([
                fetch(`${GETMUSICAPI}?showInactive=true`).then(res => res.json()),
                fetch(GETMUSICGENRESAPI).then(res => res.json()),
                fetch(GETMUSICLANGUAGESAPI).then(res => res.json()),
                fetch(GETMUSICFORMATSAPI).then(res => res.json())
            ]);

            setMusic(musicRes);
            setGenres(genresRes);
            setLanguages(languagesRes);
            setFormats(formatsRes.map(form => form.format));
        };

        fetchMusicData();
    }, []);


    useEffect(() => {
        const filtered = music
            .filter(mus => (selectedGenre === "" || mus.music_category_id === Number(selectedGenre)))
            .filter(mus => (selectedLanguage === "" || mus.music_language_id === Number(selectedLanguage)))
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


    const handleDelete = async (musicID) => {
        const confirmDelete = window.confirm("Adott zene törlése?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINMUSICAPI}/${musicID}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Hiba a törlés során!");
            } else {
                alert(data.message);
                setMusic((prev) => prev.filter((mus) => mus.music_id !== musicID));
            }
        } catch(err) {
            console.error(err);
            alert("Hiba a törlés során!");
        } finally {
            setIsDeleting(false);
        }
    };


    const handleDeactivate = async (musicID) => {
        const confirmDelete = window.confirm("Adott zene deaktiválása?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINMUSICAPI}/${musicID}/deactivate`, {
                method: "PATCH",
            });
            const data = await res.json();
            alert(data.message);
            setMusic((prev) => prev.map(mus => mus.music_id === musicID ? { ...mus, is_active: false } : mus));
        } catch(err) {
            console.error(err);
            alert("Hiba a deaktiválás során!");
        } finally {
            setIsDeleting(false);
        }
    };


    const handleRestore = async (musicID) => {
        const confirmDelete = window.confirm("Adott zene visszaállítása?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINMUSICAPI}/${musicID}/restore`, {
                method: "PATCH",
            });
            const data = await res.json();
            alert(data.message);
            setMusic((prev) => prev.map(mus => mus.music_id === musicID ? { ...mus, is_active: true } : mus));
        } catch(err) {
            console.error(err);
            alert("Hiba a visszaállítás során!");
        } finally {
            setIsDeleting(false);
        }
    };


    return (
        <>

            <Navbar/>
            
            <div className="filters">
                <select onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Minden műfaj</option>
                    {genres.map(genr => <option key={genr.music_category_id} value={genr.music_category_id}>{genr.genre}</option>)}
                </select>

                <select onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">Minden nyelv</option>
                    {languages.map(lang => <option key={lang.music_language_id} value={lang.music_language_id}>{lang.language}</option>)}
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
                                {mus.is_active ? (
                                    <>
                                        <button onClick={() => handleDeactivate(mus.music_id)} className="delete-Button" disabled={isDeleting}>
                                            Deaktiválás
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleRestore(mus.music_id)} className="delete-Button" disabled={isDeleting}>
                                            Visszaállítás
                                        </button>
                                    </>
                                )}
                                <button className="delete-Button" onClick={() => handleDelete(mus.music_id)} disabled={isDeleting}>Törlés</button>
                                <button onClick={() => setEditingMusic(mus)}>Szerkesztés</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {editingMusic && (
                <AdminMusicEditForm
                    music={editingMusic}
                    languages={languages}
                    genres={genres}
                    onClose={() => setEditingMusic(null)}
                    onUpdate={() => {
                        setEditingMusic(null);
                        fetch(`${GETMUSICAPI}?showInactive=true`)
                        .then((res) => res.json())
                        .then((data) => setMusic(data));
                    }}
                />
            )}

            <Footer />

        </>
    );
}

export default AdminMusic;

