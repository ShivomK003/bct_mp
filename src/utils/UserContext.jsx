import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig"; // Adjust this import to your Firebase config file
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firestore

const userContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Fetch user data from Firestore
                const userDocRef = doc(db, "users", currentUser.uid);
                const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
                    setUser({ uid: currentUser.uid, ...doc.data() });
                });

                return () => unsubscribeSnapshot(); // Clean up listener
            } else {
                setUser(null);
                setWalletAddress(null);
            }
        });

        return () => unsubscribe(); // Clean up auth listener
    }, []);

    return (
        <userContext.Provider value={{ user, setUser, walletAddress, setWalletAddress }}>
            {children}
        </userContext.Provider>
    );
};

export const useUser = () => useContext(userContext);
