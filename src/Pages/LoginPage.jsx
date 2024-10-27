import { useEffect, useState } from "react";
import { auth, googleProvider, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { Divider, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserContext";
import { doc, getDoc } from "firebase/firestore";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [alertMessage, setAlertMessage] = useState(null); 
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const handleLoginwithEmail = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Retrieve the profile data from the "profiles" collection
                const profileDocRef = doc(db, "profiles", userCredential.user.uid);
                const profileDoc = await getDoc(profileDocRef);
                const userProfileData = profileDoc.exists() ? profileDoc.data() : null;

                setUser({
                    uid: userCredential.user.uid,
                    email: userData.email,
                    username: userData.username,
                    profileImage: userData.profileImage,
                    profile: userProfileData, // Add the profile data if it exists
                });

                setAlertMessage({ status: 'success', title: "Success: ", description: 'Login successful!' });
                navigate('/');
            } else {
                setAlertMessage({ status: 'error', title: "Login Error: ", description: 'User has not signed up!' });
            }
            
        } catch (error) {
            console.error("Error with email login: ", error.message);
            setAlertMessage({ status: 'error', title: "Login Error: ", description: 'Unfortunate error logging in. Please try again.' });
        }
    };

    const handleLoginWithGoogle = async () => {
        try {
            // Call signInWithPopup first to get user's email without creating a new user
            const result = await signInWithPopup(auth, googleProvider);
            const res_user = result.user;

            // Check if the user exists in Firestore based on the uid
            const userDocRef = doc(db, "users", res_user.uid);
            const userDoc = await getDoc(userDocRef);

            // If the user doesn't exist in Firestore, show an alert and sign them out
            if (!userDoc.exists()) {
                await auth.signOut(); // Sign the user out to avoid keeping the created auth user
                setAlertMessage({
                    status: 'error',
                    title: 'Login Error',
                    description: 'User has not signed up. Please sign up first.',
                });
            } else {
                // Retrieve the profile data from the "profiles" collection
                const profileDocRef = doc(db, "profiles", res_user.uid);
                const profileDoc = await getDoc(profileDocRef);
                const userProfileData = profileDoc.exists() ? profileDoc.data() : null;

                // Set the user context and add profile data if the user exists
                const userData = userDoc.data();
                setUser({
                    uid: res_user.uid,
                    email: res_user.email,
                    username: userData.username,
                    profileImage: userData.profileImage,
                    profile: userProfileData, // Add the profile data if it exists
                });

                setAlertMessage({
                    status: 'success',
                    title: 'Login Successful',
                    description: 'You have successfully logged in!',
                });

                navigate('/');
            }
        } catch (error) {
            console.error("Error with Google login: ", error.message);
            setAlertMessage({
                status: 'error',
                title: 'Login Error',
                description: error.message,
            });
        }
    };

    return (
        <div className="h-screen bg-[url('../wallpaper.jpg')] text-white cursor-default">
            <h1 className="text-5xl font-medium text-center p-16"><Link to="/" className="cursor-pointer">TrustWork</Link></h1>
            {alertMessage && (
                <Alert status={alertMessage.status} mb={4} textColor={"black"}>
                    <AlertIcon />
                    <AlertTitle>{alertMessage.title}</AlertTitle>
                    <AlertDescription>{alertMessage.description}</AlertDescription>
                </Alert>
            )}
            <div className="flex flex-col items-center justify-center bg-black/30 h-3/5 w-2/5 mx-auto">
                <h2 className=" text-3xl font-medium mb-5 text-white">Login</h2>
                <div className="flex flex-col w-full items-center">
                    <input 
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-3/4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-4 w-3/4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button 
                        onClick={handleLoginwithEmail}
                        className="mb-6 w-3/4 bg-blue-500 text-white p-2 rounded-lg w-32 transition duration-300 hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <div className="w-3/4">
                        <Divider orientation="horizontal" />
                    </div>
                    <button 
                        onClick={handleLoginWithGoogle}
                        className="mt-7 bg-red-500 text-white p-2 rounded-lg w-32 transition duration-300 hover:bg-red-600"
                    >
                        Login with Google
                    </button>
                    <p className="mt-4">Don't have an account? <Link to='/signup' className="hover:text-blue-500">Sign Up here!</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
