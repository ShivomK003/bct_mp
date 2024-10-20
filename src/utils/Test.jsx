import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "./UserContext";

function Test() {
    const { user } = useUser();
    const [profileData, setProfileData] = useState(null);

    const getProfiles = async (userId) => {
        const profileRef = doc(db, "profiles", userId); 
        const profileDoc = await getDoc(profileRef);

        if (profileDoc.exists()) {
            return profileDoc.data(); 
        } else {
            console.log("No such document!");
            return null;
        }
    };

    useEffect(() => {
        if (user) {
            getProfiles(user.uid).then((data) => {
                setProfileData(data);
            });
        }
    }, [user]);

    return (
        <div>
            <div className="h-24"></div>
            <h4>User Id: {user ? user.uid: "no user"}</h4>
            {profileData ? (
                <div>
                    <h3>Profile Data:</h3>
                    <pre>{JSON.stringify(profileData, null, 2)}</pre>
                </div>
            ) : (
                <p>Loading profile data...</p>
            )}
        </div>
    );
}

export default Test;
