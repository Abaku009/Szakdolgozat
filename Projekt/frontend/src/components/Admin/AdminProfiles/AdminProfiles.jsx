import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import "../AdminProfiles/adminprofiles.css";

function AdminProfiles() {

    
    const [profiles, setProfiles] = useState([]);
    const { user } = useContext(UserContext);

    
    const GETADMINPROFILESAPI = import.meta.env.VITE_API_GET_ADMIN_PROFILES_URL;


    useEffect(() => {
        if (!user || !user.is_admin) return;

        fetch(GETADMINPROFILESAPI, {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setProfiles(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [user]);


    return (

        <>

            <Navbar />

            <div className="admin-profiles-page">
                <h1>Felhasználói profilok</h1>

                {profiles.length === 0 && (
                    <p>Nincs megjeleníthető felhasználó.</p>
                )}

                {profiles.map(profile => (
                    <div key={profile.user_id} className="profile-card">
                        <p><strong>ID:</strong> {profile.user_id}</p>
                        <p>
                            <strong>Név:</strong>{" "}
                            {profile.last_name} {profile.first_name}
                        </p>
                        <p><strong>Email:</strong> {profile.email}</p>
                    </div>
                ))}
            </div>

            <Footer />

        </>

    );

}

export default AdminProfiles;

