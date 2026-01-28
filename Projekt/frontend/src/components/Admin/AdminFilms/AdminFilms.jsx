import Navbar from "../../Navbar/Navbar"
import Footer from "../../Footer/Footer"
import { useState, useEffect } from "react";
import "../AdminFilms/adminfilms.css";
import AdminFilmsEditForm from "./AdminFilmsEditForm";
import AdminFilmsAddForm from "./AdminFilmsAddForm";


function AdminFilms() {


    const GETFILMSAPI = import.meta.env.VITE_API_GET_FILMS_URL;
    const GETFILMSGENRESAPI = import.meta.env.VITE_API_GET_FILMS_GENRES_URL;
    const GETFILMSLANGUAGESAPI = import.meta.env.VITE_API_GET_FILMS_LANGUAGES_URL;
    const GETFILMSFORMATSAPI = import.meta.env.VITE_API_GET_FILMS_FORMATS_URL;


    const ADMINFILMSAPI = import.meta.env.VITE_API_ADMIN_FILMS_URL;


    const [films, setFilms] = useState([]);
    const [filtered, setFiltered] = useState({});
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");
    const [selectedOrder, setSelectedOrder] = useState("asc"); 

    const [isDeleting, setIsDeleting] = useState(false);
    const [editingFilm, setEditingFilm] = useState(null);
    const [addingFilm, setAddingFilm] = useState(false);



    useEffect(() => {
        const fetchFilmsData = async () => {
            const [filmsRes, genresRes, languagesRes, formatsRes] = await Promise.all([
                fetch(`${GETFILMSAPI}?showInactive=true`).then(res => res.json()),
                fetch(GETFILMSGENRESAPI).then(res => res.json()),
                fetch(GETFILMSLANGUAGESAPI).then(res => res.json()),
                fetch(GETFILMSFORMATSAPI).then(res => res.json())
            ]);

            setFilms(filmsRes);
            setGenres(genresRes);
            setLanguages(languagesRes);
            setFormats(formatsRes.map(form => form.format));
        };

        fetchFilmsData();
    }, []);



    useEffect(() => {
        const filtered = films
            .filter(film => (selectedGenre === "" || film.categoryname === selectedGenre))
            .filter(film => (selectedLanguage === "" || film.languagename === selectedLanguage))
            .filter(film => (selectedFormat === "" || film.format === selectedFormat))
            .sort((a, b) =>
                selectedOrder === "asc" ? a.price - b.price : b.price - a.price
            );

        const grouped = filtered.reduce((acc, currentFilm) => {
            if (!acc[currentFilm.categoryname]) acc[currentFilm.categoryname] = [];
            acc[currentFilm.categoryname].push(currentFilm);
            return acc;
        }, {});

        setFiltered(grouped);
    }, [films, selectedGenre, selectedLanguage, selectedFormat, selectedOrder]);


    
    const handleDelete = async (filmID) => {
        const confirmDelete = window.confirm("Adott film törlése?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINFILMSAPI}/${filmID}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Hiba a törlés során!");
            } else {
                alert(data.message);
                setFilms((prev) => prev.filter((film) => film.film_id !== filmID));
            }
        } catch(err) {
            console.error(err);
            alert("Hiba a törlés során!");
        } finally {
            setIsDeleting(false);
        }
    };



    const handleDeactivate = async (filmID) => {
        const confirmDelete = window.confirm("Adott film deaktiválása?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINFILMSAPI}/${filmID}/deactivate`, {
                method: "PATCH",
            });
            const data = await res.json();
            alert(data.message);
            setFilms((prev) => prev.map(film => film.film_id === filmID ? { ...film, is_active: false } : film));
        } catch(err) {
            console.error(err);
            alert("Hiba a deaktiválás során!");
        } finally {
            setIsDeleting(false);
        }
    };



    const handleRestore = async (filmID) => {
        const confirmDelete = window.confirm("Adott film visszaállítása?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINFILMSAPI}/${filmID}/restore`, {
                method: "PATCH",
            });
            const data = await res.json();
            alert(data.message);
            setFilms((prev) => prev.map(film => film.film_id === filmID ? { ...film, is_active: true } : film));
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
            const res = await fetch(`${ADMINFILMSAPI}/add_genre`, {
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
            const updatedGenres = await fetch(GETFILMSGENRESAPI).then(res => res.json());
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
            const res = await fetch(`${ADMINFILMSAPI}/add_language`, {
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
            const updatedLanguages = await fetch(GETFILMSLANGUAGESAPI).then(res => res.json());
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
                    {genres.map(genr => <option key={genr.film_category_id} value={genr.genre}>{genr.genre}</option>)}
                </select>

                <select onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">Minden nyelv</option>
                    {languages.map(lang => <option key={lang.film_language_id} value={lang.language}>{lang.language}</option>)}
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

            <div className="admin-actions">
                <button onClick={handleAddGenre}>Műfaj hozzáadása</button>
                <button onClick={handleAddLanguage}>Nyelv hozzáadása</button>
                <button onClick={() => setAddingFilm(true)}>Film hozzáadása</button>
            </div>

            {Object.keys(filtered).length === 0 && (
                <div className="no-results">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            <div className="filmList">
                {Object.keys(filtered)
                .filter(category => filtered[category].length > 0)
                .map(category => (
                    <div key={category} className="filmCategory">
                        <h2>{category}</h2>
                        {filtered[category].map(film => (
                            <div key={film.film_id} className="filmItem">
                                <p><strong>Cím:</strong> {film.title}</p>
                                <p><strong>Nyelv:</strong> {film.languagename}</p>
                                <p><strong>Formátum:</strong> {film.format}</p>
                                <p><strong>Ár:</strong> {film.price} Ft</p>
                                <p><strong>Darabszám:</strong> {film.stock}</p>
                                {film.is_active ? (
                                    <>
                                        <button onClick={() => handleDeactivate(film.film_id)} className="delete-Button" disabled={isDeleting}>
                                            Deaktiválás
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleRestore(film.film_id)} className="delete-Button" disabled={isDeleting}>
                                            Visszaállítás
                                        </button>
                                    </>
                                )}
                                <button className="delete-Button" onClick={() => handleDelete(film.film_id)} disabled={isDeleting}>Törlés</button>
                                <button onClick={() => setEditingFilm(film)}>Szerkesztés</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {editingFilm && (
                <AdminFilmsEditForm
                    film={editingFilm}
                    languages={languages}
                    genres={genres}
                    onClose={() => setEditingFilm(null)}
                    onUpdate={() => {
                        setEditingFilm(null);
                        fetch(`${GETFILMSAPI}?showInactive=true`)
                        .then((res) => res.json())
                        .then((data) => setFilms(data));
                        fetch(GETFILMSFORMATSAPI)
                        .then((res) => res.json())
                        .then((data) => setFormats(data.map(form => form.format)));
                    }}
                />
            )}

            {addingFilm && (
                <AdminFilmsAddForm
                    languages={languages}
                    genres={genres}
                    filmList={films}
                    onClose={() => setAddingFilm(false)}
                    onUpdate={async () => {
                        setAddingFilm(false);
                        const updatedFilms = await fetch(`${GETFILMSAPI}?showInactive=true`).then(res => res.json());
                        setFilms(updatedFilms);
                        const updatedFormats = await fetch(GETFILMSFORMATSAPI).then(res => res.json());
                        setFormats(updatedFormats.map(form => form.format));
                    }}
                />
            )}

            <Footer />

        </>

    );

}


export default AdminFilms;

