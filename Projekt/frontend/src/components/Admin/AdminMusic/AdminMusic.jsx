import Navbar from "../../Navbar/Navbar"
import Footer from "../../Footer/Footer"
import { useState, useEffect } from "react";
import "../AdminMusic/adminmusic.css";
import AdminMusicEditForm from "./AdminMusicEditForm";
import AdminMusicAddForm from "./AdminMusicAddForm";


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
    const [addingMusic, setAddingMusic] = useState(false);



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
            .filter(mus => (selectedGenre === "" || mus.categoryname === selectedGenre))
            .filter(mus => (selectedLanguage === "" || mus.languagename === selectedLanguage))
            .filter(mus => (selectedFormat === "" || mus.format === selectedFormat))

        filtered.sort((a, b) =>
            sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );

        const grouped = filtered.reduce((acc, currentmusic) => {
            if (!acc[currentmusic.categoryname]) acc[currentmusic.categoryname] = [];
            acc[currentmusic.categoryname].push(currentmusic);
            return acc;
        }, {});

        const sortedGrouped = Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b, "hu"))
            .reduce((acc, currentCategogy) => {
                acc[currentCategogy] = grouped[currentCategogy];
                return acc;
            }, {});

        setFilteredMusic(sortedGrouped);
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



    const handleAddGenre = async () => {
        const newGenre = window.prompt("Add meg az új műfajt!");
        if(newGenre === null) return;

        const trimmedGenre = newGenre.trim();
        if(trimmedGenre === "") {
            alert("A műfaj nem lehet üres!");
            return;
        }

        const exists = genres.some(
            genr => genr.genre.toLowerCase() === trimmedGenre.toLowerCase()
        );
        if(exists) {
            alert("A megadott műfaj már létezik!");
            return;
        }

        try {
            const res = await fetch(`${ADMINMUSICAPI}/add_genre`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ genre: trimmedGenre }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Hiba történt a hozzáadás során!");
                return;
            }
            alert(data.message);
            const updatedGenres = await fetch(GETMUSICGENRESAPI).then(res => res.json());
            setGenres(updatedGenres);
        } catch(err) {
            console.error(err);
            alert("Hiba a műfaj hozzáadásakor!");
        }
    };



    const handleAddLanguage = async () => {
        const newLanguage = window.prompt("Add meg az új nyelvet!");
        if(newLanguage === null) return;

        const trimmedLanguage = newLanguage.trim();
        if(trimmedLanguage === "") {
            alert("A nyelv nem lehet üres!");
            return;
        }

        const exists = languages.some(
            lang => lang.language.toLowerCase() === trimmedLanguage.toLowerCase()
        );
        if(exists) {
            alert("A megadott nyelv már létezik!");
            return;
        }

        try {
            const res = await fetch(`${ADMINMUSICAPI}/add_language`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ language: trimmedLanguage }),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Hiba történt a hozzáadás során!");
                return;
            }
            alert(data.message);
            const updatedLanguages = await fetch(GETMUSICLANGUAGESAPI).then(res => res.json());
            setLanguages(updatedLanguages);
        } catch(err) {
            console.error(err);
            alert("Hiba a nyelv hozzáadásakor!");
        }
    };



    return (
        <>

            <Navbar/>
            
            <div className="filters">
                <select onChange={e => setSelectedGenre(e.target.value)}>
                    <option value="">Minden műfaj</option>
                    {genres.map(genr => <option key={genr.music_category_id} value={genr.genre}>{genr.genre}</option>)}
                </select>

                <select onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">Minden nyelv</option>
                    {languages.map(lang => <option key={lang.music_language_id} value={lang.language}>{lang.language}</option>)}
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

            <div className="admin-actions">
                <button onClick={handleAddGenre}>Műfaj hozzáadása</button>
                <button onClick={handleAddLanguage}>Nyelv hozzáadása</button>
                <button onClick={() => setAddingMusic(true)}>Zene hozzáadása</button>
            </div>

            {Object.keys(filteredMusic).length === 0 && (
                <div className="no-results">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            <div className="musicList">
                {Object.keys(filteredMusic)
                .filter(category => filteredMusic[category].length > 0)
                .map(category => (
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
                                <button onClick={async () => {
                                            try {
                                                const res = await fetch(`${ADMINMUSICAPI}/${mus.music_id}/has_order`);
                                                const data = await res.json();

                                                if (data.hasOrder) {
                                                    alert("Ez a zene nem szerkeszthető, mert rendelés tartozik hozzá!");
                                                    return;
                                                }

                                                setEditingMusic(mus);

                                            } catch (err) {
                                                console.error(err);
                                                alert("Hiba az ellenőrzés során!");
                                            }
                                        }}
                                >
                                    Szerkesztés
                                </button>
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
                        fetch(GETMUSICFORMATSAPI)
                        .then((res) => res.json())
                        .then((data) => setFormats(data.map(form => form.format)));
                    }}
                />
            )}

            {addingMusic && (
                <AdminMusicAddForm
                    languages={languages}
                    genres={genres}
                    musicList={music}
                    onClose={() => setAddingMusic(false)}
                    onUpdate={async () => {
                        setAddingMusic(false);
                        const updatedMusic = await fetch(`${GETMUSICAPI}?showInactive=true`).then(res => res.json());
                        setMusic(updatedMusic);
                        const updatedFormats = await fetch(GETMUSICFORMATSAPI).then(res => res.json());
                        setFormats(updatedFormats.map(form => form.format));
                    }}
                />
            )}

            <Footer />

        </>

    );

}


export default AdminMusic;

