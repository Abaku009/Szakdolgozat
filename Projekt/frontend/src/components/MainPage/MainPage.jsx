import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "../MainPage/mainpage.css";

function MainPage() {
    return (
        <div>
            <Navbar />

            <div className="mainpage-container">
                <h1 className="mainpage-title">Üdv a MediaHaven-ben!</h1>

                <p className="mainpage-intro">
                    Fedezd fel a <strong>legjobb zenéket</strong> és <strong>filmeket, sorozatokat </strong> 
                    helyben vagy online vásárlás/foglalás formájában. Egyszerűen, gyorsan és átláthatóan intézheted a rendeléseidet és foglalásaidat.
                </p>

                <div className="mainpage-grid">
                    <div className="mainpage-box music-box">
                        <h2>Zenék vásárlása</h2>
                        <p>Vásárolj zenéket online vagy helyben. Böngéssz a zenék között, és élvezd a kedvenc előadóid!</p>
                    </div>

                    <div className="mainpage-box movies-box">
                        <h2>Filmek & Sorozatok foglalása</h2>
                        <p>Foglalj filmeket és sorozatokat online vagy helyben. Lépj be a fiókodba, kövesd a foglalásaid, és vedd át időben!</p>
                    </div>
                </div>

                <p className="mainpage-footer-text">
                    MediaHaven – minden médiád egy helyen!
                </p>
            </div>

            <Footer />
        </div>
    );
}

export default MainPage;

