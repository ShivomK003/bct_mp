import { useState, useEffect } from "react";
import { auth, db, googleProvider, storage } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useUser } from '../utils/UserContext'
import { Link } from "react-router-dom";
import { Divider } from '@chakra-ui/react'
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { IoPersonCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const { setUser } = useUser(); 
    const navigate = useNavigate();

    useEffect(() => {
        console.log({
            "profileImage": profileImage,
            "email": email,
            "username": username,
            "password": password
        });
    }, [profileImage, username, email, password])


    //Handle any sign up
    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const storageRef = ref(storage, `profileImages/${user.uid}`);
            await uploadBytes(storageRef, profileImage);

            const imageUrl = await getDownloadURL(storageRef);


            await setDoc(doc(db, "users", user.uid), {
                username, 
                profileImage: imageUrl,
                email,
            })
            
            setUser({
                uid: user.uid,
                email,
                username,
                profileImage: imageUrl
            });

            console.log("User signed up and data saved:", user.uid);
            navigate('/');
        } catch (error) {
            console.error("Error with sign-up: ", error.message);
        }

    };

    // handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setProfileImagePreview(null);
        }
    };

    // handle google sign up
    const handleSignUpWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            
            await setDoc(doc(db, "users", user.uid), {
                username: user.displayName || "User",
                profileImage: user.photoURL || null,
                email: user.email,
            });

            setUser({
                uid: user.uid,
                email: user.email,
                username: user.displayName || "User",
                profileImage: user.photoURL || null,
            });

            console.log("Google User signed up and data saved:", user);
            navigate('/');
        } catch (error) {
            console.error("Error with Google login: ", error.message);
        }
    };

    return (
        <div className="h-screen bg-[url('../wallpaper.jpg')] text-white cursor-default">
            <h1 className="text-5xl font-medium text-center p-9"><Link to="/" className="cursor-pointer">TrustWork</Link></h1>
            <div className=" flex flex-col items-center justify-center bg-black/30 h-4/5 w-2/5 mx-auto">
                <h2 className=" text-3xl font-medium mb-4">SignUp</h2>
                    <div className="flex flex-col w-full items-center">
                        <div className="relative mb-4">
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profileImageInput"
                            />
                            <label htmlFor="profileImageInput" className="cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-500">
                                    {profileImagePreview ? (
                                        <img
                                            src={profileImagePreview}
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <IoPersonCircle className="text-gray-400 w-12 h-12" />
                                    )}
                                </div>
                            </label>
                        </div>
                        <input 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-4 w-3/4 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                        />
                        <input 
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                            onClick={handleSignUp}
                            className="mb-6 w-3/4 bg-blue-500 text-white p-2 rounded-lg w-32 transition duration-300 hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                        <div className="w-3/4">
                            <Divider orientation="horizontal" />
                        </div>
                        <button 
                            onClick={handleSignUpWithGoogle}
                            className="mt-7 bg-red-500 text-white p-2 rounded-lg w-44 transition duration-300 hover:bg-red-600"
                        >
                            Sign Up with Google
                        </button>
                        <p className="mt-4">Have an Account? <Link to='/login' className="underlined hover:text-blue-500 ">Log In here!</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
