import { useState } from "react";
import "../AdminSeries/adminseriesforms.css";

function AdminSeriesEditForm({ serie, languages, genres, onClose, onUpdate }) {

    const [price, setPrice] = useState("");
    const [title, setTitle] = useState("");
    const [creator, setCreator] = useState("");
    const [format, setFormat] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [quantity, setQuantity] = useState("");


    const [isSubmitting, setIsSubmitting] = useState(false);


    const ADMINSERIESAPI = import.meta.env.VITE_API_ADMIN_SERIES_URL;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const body = {};
        if (title) body.title = title;
        if (price) body.price = Number(price);
        if (creator) body.creator = creator;
        if (format) body.format = format;
        if (selectedLanguage) body.series_language_id = Number(selectedLanguage);
        if (selectedGenre) body.series_category_id = Number(selectedGenre);
        if (quantity) body.quantity = Number(quantity);

        try {
            const res = await fetch(`${ADMINSERIESAPI}/${serie.series_id}`, {
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
                <h2>Sorozat módosítása</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" placeholder={`Ár (jelenlegi: ${serie.price})`} value={price} onChange={e => setPrice(e.target.value)} />
                    <input type="text" placeholder={`Cím (jelenlegi: ${serie.title})`} value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="text" placeholder={`Alkotó (jelenlegi: ${serie.creator})`} value={creator} onChange={e => setCreator(e.target.value)} />
                    <input type="text" placeholder={`Formátum (jelenlegi: ${serie.format})`} value={format} onChange={e => setFormat(e.target.value)} />

                    <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                        <option value="">{`Nyelv nem módosítva - Jelenlegi: ${serie.languagename}`}</option>
                        {languages.map(lang => (
                            <option key={lang.series_language_id} value={lang.series_language_id}>{lang.language}</option>
                        ))}
                    </select>

                    <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                        <option value="">{`Műfaj nem módosítva - Jelenlegi: ${serie.categoryname}`}</option>
                        {genres.map(genr => (
                            <option key={genr.series_category_id} value={genr.series_category_id}>{genr.genre}</option>
                        ))}
                    </select>

                    <input type="number" placeholder={`Darabszám (jelenlegi: ${serie.stock})`} value={quantity} onChange={e => setQuantity(e.target.value)} />

                    <div className="form-buttons">
                        <button type="submit" disabled={isSubmitting}>Mentés</button>
                        <button type="button" onClick={onClose}>Mégse</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default AdminSeriesEditForm;

