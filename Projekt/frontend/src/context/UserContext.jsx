import { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
    
    const [user, setUser] = useState(null);

    const GETCURRENTUSERAPI = import.meta.env.VITE_API_GET_CURRENT_USER_URL;

    useEffect(() => {
        fetch(GETCURRENTUSERAPI, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(err => console.log(err));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

