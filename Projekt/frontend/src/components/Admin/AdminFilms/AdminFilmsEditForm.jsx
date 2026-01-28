import { useState } from "react";
import "../AdminFilms/adminfilmsforms.css";

function AdminFilmsEditForm({ film, languages, genres, onClose, onUpdate }) {

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
        setIsSubmitting(true);

        const body = {};
        if (title) body.title = title;
        if (price) body.price = Number(price);
        if (format) body.format = format;
        if (selectedLanguage) body.film_language_id = Number(selectedLanguage);
        if (selectedGenre) body.film_category_id = Number(selectedGenre);
        if (quantity) body.quantity = Number(quantity);

        try {
            const res = await fetch(`${ADMINFILMSAPI}/${film.film_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Hiba történt a módosítás során!");
            } else {
                alert("Sikeres módosítás!");
                onUpdate(); 
                onClose();
            }
        } catch (err) {
            console.error(err);
            alert("Hiba a módosítás során!");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="form-overlay">
            <div className="form">
                <h2>Film módosítása</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder={`Ár (jelenlegi: ${film.price})`} value={price} onChange={e => setPrice(e.target.value)} />
                    <input type="text" placeholder={`Cím (jelenlegi: ${film.title})`} value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="text" placeholder={`Formátum (jelenlegi: ${film.format})`} value={format} onChange={e => setFormat(e.target.value)} />

                    <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                        <option value="">{`Nyelv nem módosítva - Jelenlegi: ${film.languagename}`}</option>
                        {languages.map(lang => (
                            <option key={lang.film_language_id} value={lang.film_language_id}>{lang.language}</option>
                        ))}
                    </select>

                    <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                        <option value="">{`Műfaj nem módosítva - Jelenlegi: ${film.categoryname}`}</option>
                        {genres.map(genr => (
                            <option key={genr.film_category_id} value={genr.film_category_id}>{genr.genre}</option>
                        ))}
                    </select>

                    <input type="number" placeholder={`Darabszám (jelenlegi: ${film.stock})`} value={quantity} onChange={e => setQuantity(e.target.value)} />

                    <div className="form-buttons">
                        <button type="submit" disabled={isSubmitting}>Mentés</button>
                        <button type="button" onClick={onClose}>Mégse</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default AdminFilmsEditForm;

