import { useState } from "react";
import "../AdminFilms/adminfilmsforms.css";


function AdminFilmsAddForm({ languages, genres, filmList, onClose, onUpdate }) {

    const [price, setPrice] = useState("");
    const [title, setTitle] = useState("");
    const [format, setFormat] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [quantity, setQuantity] = useState("");


    const [isSubmitting, setIsSubmitting] = useState(false);


    const ADMINFILMSAPI = import.meta.env.VITE_API_ADMIN_FILMS_URL;


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!price || !title || !format || !selectedLanguage || !selectedGenre || !quantity) {
            alert("Minden mezőt ki kell tölteni!");
            return;
        }

        setIsSubmitting(true);

        const normalize = string => string
            .replace(/\s+/g, '') 
            .toLowerCase();

        const exists = filmList.some(
            film => normalize(film.title) === normalize(title)
        );
        if (exists) {
            alert("Ez a cím már létezik az adatbázisban!");
            setIsSubmitting(false);
            return;
        }

        const body = {
            title: title,
            price: Number(price),
            format: format,
            film_language_id: Number(selectedLanguage),
            film_category_id: Number(selectedGenre),
            quantity: Number(quantity),
        };

        try {
            const res = await fetch(`${ADMINFILMSAPI}/add_film`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Hiba történt a hozzáadás során!");
            } else {
                alert("Film sikeresen hozzáadva!");
                onUpdate();
                onClose();
            }
        } catch(err) {
            console.error(err);
            alert("Hiba a film hozzáadásakor!");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="form-overlay">
            <div className="form">
                <h2>Új film hozzáadása</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder="Ár" value={price} onChange={e => setPrice(e.target.value)} />
                    <input type="text" placeholder="Cím" value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="text" placeholder="Formátum" value={format} onChange={e => setFormat(e.target.value)} />

                    <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                        <option value="">Válassz nyelvet</option>
                        {languages.map(lang => <option key={lang.film_language_id} value={lang.film_language_id}>{lang.language}</option>)}
                    </select>

                    <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                        <option value="">Válassz műfajt</option>
                        {genres.map(genr => <option key={genr.film_category_id} value={genr.film_category_id}>{genr.genre}</option>)}
                    </select>

                    <input type="number" placeholder="Darabszám" value={quantity} onChange={e => setQuantity(e.target.value)} />

                    <div className="form-buttons">
                        <button type="submit" disabled={isSubmitting}>Mentés</button>
                        <button type="button" onClick={onClose}>Mégse</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminFilmsAddForm;

