import Navbar from "../../Navbar/Navbar"
import Footer from "../../Footer/Footer"
import { useState, useEffect } from "react";
import "../AdminSeries/adminseries.css";
import AdminSeriesEditForm from "./AdminSeriesEditForm";
import AdminSeriesAddForm from "./AdminSeriesAddForm";


function AdminSeries() {


    const GETSERIESAPI = import.meta.env.VITE_API_GET_SERIES_URL;
    const GETSERIESGENRESAPI = import.meta.env.VITE_API_GET_SERIES_GENRES_URL;
    const GETSERIESLANGUAGESAPI = import.meta.env.VITE_API_GET_SERIES_LANGUAGES_URL;
    const GETSERIESFORMATSAPI = import.meta.env.VITE_API_GET_SERIES_FORMATS_URL;


    const ADMINSERIESAPI = import.meta.env.VITE_API_ADMIN_SERIES_URL;


    const [series, setSeries] = useState([]);
    const [filtered, setFiltered] = useState({});
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedFormat, setSelectedFormat] = useState("");
    const [selectedOrder, setSelectedOrder] = useState("asc"); 

    const [isDeleting, setIsDeleting] = useState(false);
    const [editingSerie, setEditingSerie] = useState(null);
    const [addingSerie, setAddingSerie] = useState(false);



    useEffect(() => {
        const fetchSeriesData = async () => {
            const [seriesRes, genresRes, languagesRes, formatsRes] = await Promise.all([
                fetch(`${GETSERIESAPI}?showInactive=true`).then(res => res.json()),
                fetch(GETSERIESGENRESAPI).then(res => res.json()),
                fetch(GETSERIESLANGUAGESAPI).then(res => res.json()),
                fetch(GETSERIESFORMATSAPI).then(res => res.json())
            ]);

            setSeries(seriesRes);
            setGenres(genresRes);
            setLanguages(languagesRes);
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
            if (!acc[currentSerie.categoryname]) acc[currentSerie.categoryname] = [];
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
    }, [series, selectedGenre, selectedLanguage, selectedFormat, selectedOrder]);


    
    const handleDelete = async (serieID) => {
        const confirmDelete = window.confirm("Adott sorozat törlése?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINSERIESAPI}/${serieID}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Hiba a törlés során!");
            } else {
                alert(data.message);
                setSeries((prev) => prev.filter((serie) => serie.series_id !== serieID));
            }
        } catch(err) {
            console.error(err);
            alert("Hiba a törlés során!");
        } finally {
            setIsDeleting(false);
        }
    };



    const handleDeactivate = async (serieID) => {
        const confirmDelete = window.confirm("Adott sorozat deaktiválása?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINSERIESAPI}/${serieID}/deactivate`, {
                method: "PATCH",
            });
            const data = await res.json();
            alert(data.message);
            setSeries((prev) => prev.map(serie => serie.series_id === serieID ? { ...serie, is_active: false } : serie));
        } catch(err) {
            console.error(err);
            alert("Hiba a deaktiválás során!");
        } finally {
            setIsDeleting(false);
        }
    };



    const handleRestore = async (serieID) => {
        const confirmDelete = window.confirm("Adott sorozat visszaállítása?");
        if(!confirmDelete) return;

        try {
            setIsDeleting(true);
            const res = await fetch(`${ADMINSERIESAPI}/${serieID}/restore`, {
                method: "PATCH",
            });
            const data = await res.json();
            alert(data.message);
            setSeries((prev) => prev.map(serie => serie.series_id === serieID ? { ...serie, is_active: true } : serie));
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
            const res = await fetch(`${ADMINSERIESAPI}/add_genre`, {
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
            const updatedGenres = await fetch(GETSERIESGENRESAPI).then(res => res.json());
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
            const res = await fetch(`${ADMINSERIESAPI}/add_language`, {
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
            const updatedLanguages = await fetch(GETSERIESLANGUAGESAPI).then(res => res.json());
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
                    {genres.map(genr => <option key={genr.series_category_id} value={genr.genre}>{genr.genre}</option>)}
                </select>

                <select onChange={e => setSelectedLanguage(e.target.value)}>
                    <option value="">Minden nyelv</option>
                    {languages.map(lang => <option key={lang.series_language_id} value={lang.language}>{lang.language}</option>)}
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
                <button onClick={() => setAddingSerie(true)}>Sorozat hozzáadása</button>
            </div>

            {Object.keys(filtered).length === 0 && (
                <div className="no-results">
                    <p>A keresett termék nem elérhető!</p>
                </div>
            )}

            <div className="seriesList">
                {Object.keys(filtered)
                .filter(category => filtered[category].length > 0)
                .map(category => (
                    <div key={category} className="seriesCategory">
                        <h2>{category}</h2>
                        {filtered[category].map(serie => (
                            <div key={serie.series_id} className="seriesItem">
                                <p><strong>Cím: </strong>{serie.title}</p>
                                <p><strong>Alkotó: </strong>{serie.creator}</p>
                                <p><strong>Nyelv: </strong>{serie.languagename}</p>
                                <p><strong>Formátum: </strong>{serie.format}</p>
                                <p><strong>Ár: </strong>{serie.price} Ft</p>
                                <p><strong>Darabszám: </strong>{serie.stock}</p>
                                {serie.is_active ? (
                                    <>
                                        <button onClick={() => handleDeactivate(serie.series_id)} className="delete-Button" disabled={isDeleting}>
                                            Deaktiválás
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleRestore(serie.series_id)} className="delete-Button" disabled={isDeleting}>
                                            Visszaállítás
                                        </button>
                                    </>
                                )}
                                <button className="delete-Button" onClick={() => handleDelete(serie.series_id)} disabled={isDeleting}>Törlés</button>
                                <button onClick={async () => {
                                            try {
                                                const res = await fetch(`${ADMINSERIESAPI}/${serie.series_id}/has_order`);
                                                const data = await res.json();

                                                if (data.hasOrder) {
                                                    alert("Ez a sorozat nem szerkeszthető, mert foglalás tartozik hozzá!");
                                                    return;
                                                }

                                                setEditingSerie(serie);

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

            {editingSerie && (
                <AdminSeriesEditForm
                    serie={editingSerie}
                    languages={languages}
                    genres={genres}
                    onClose={() => setEditingSerie(null)}
                    onUpdate={() => {
                        setEditingSerie(null);
                        fetch(`${GETSERIESAPI}?showInactive=true`)
                        .then((res) => res.json())
                        .then((data) => setSeries(data));
                        fetch(GETSERIESFORMATSAPI)
                        .then((res) => res.json())
                        .then((data) => setFormats(data.map(form => form.format)));
                    }}
                />
            )}

            {addingSerie && (
                <AdminSeriesAddForm
                    languages={languages}
                    genres={genres}
                    seriesList={series}
                    onClose={() => setAddingSerie(false)}
                    onUpdate={async () => {
                        setAddingSerie(false);
                        const updatedSeries = await fetch(`${GETSERIESAPI}?showInactive=true`).then(res => res.json());
                        setSeries(updatedSeries);
                        const updatedFormats = await fetch(GETSERIESFORMATSAPI).then(res => res.json());
                        setFormats(updatedFormats.map(form => form.format));
                    }}
                />
            )}

            <Footer />

        </>

    );

}


export default AdminSeries;

