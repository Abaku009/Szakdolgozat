import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const GETCURRENTUSERAPI = import.meta.env.VITE_API_GET_CURRENT_USER_URL;

    useEffect(() => {
        fetch(GETCURRENTUSERAPI, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                setUser(data.user);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

