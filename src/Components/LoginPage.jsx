import { useState } from "react";
import { auth, googleProvider, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { Divider } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserContext";
import { doc, getDoc } from "firebase/firestore";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLoginwithEmail = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user);
            
            // const userDoc = await getDoc(doc(db, "users", userCredential.uid));

            // if (userDoc.exists()) {
            //     setUser({
            //         uid: userCredential.uid,
            //         email: userCredential.email, 
            //         username: userDoc.data().username,
            //         profileImage: userDoc.data().profileImage,
            //     });
            // }

            // console.log("User Details: ", userCredential);
            navigate('/');
        } catch (error) {
            console.error("Error with email login: ", error.message);
        }
    };

    const handleLoginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    username: userDoc.data().username,
                    profileImage: userDoc.data().profileImage,
                });
            }

            console.log("Google User Data: ", user);
            navigate('/');
        } catch (error) {
            console.error("Error with Google login: ", error.message);
        }
    };

    return (
        <div className="h-screen bg-[url('../wallpaper.jpg')] text-white cursor-default">
            <h1 className="text-5xl font-medium text-center p-16"><Link to="/" className="cursor-pointer">TrustWork</Link></h1>
            <div className="flex flex-col items-center justify-center bg-black/30 h-3/5 w-2/5 mx-auto">
                <h2 className=" text-3xl font-medium mb-5">Login</h2>
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
