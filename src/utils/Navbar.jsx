import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from "../firebaseConfig";
import { useUser } from "../utils/UserContext";
import { signOut } from "firebase/auth";
import { connectWallet } from './connectWallet';
import { Tooltip } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IoPersonCircle } from "react-icons/io5"; // Placeholder icon

const Navbar = () => {
    const { user, setUser, walletAddress, setWalletAddress } = useUser(); 
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [imageError, setImageError] = useState(false);

    const navigate = useNavigate('/');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setWalletAddress(null);
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error.message);
        }
    };

    const handleConnectWallet = async () => {
        const wallet = await connectWallet();
        if (wallet) {
            setWalletAddress(wallet.address);
        }
    };

    const shortenAddress = (address) => {
        return address ? `${address.slice(0, 5)}...${address.slice(-4)}` : '';
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setTooltipVisible(true);
            setTimeout(() => {
                setTooltipVisible(false);
            }, 1000);
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    };

    const [windowLoc, setWindowLoc] = useState(window.location.pathname)
    useEffect(() => {
        setWindowLoc(window.location.pathname)
    }, [window])

    
    const [userProfile, setUserProfile] = useState(null)
    useEffect(() => {
        if(user) {
            setUserProfile(user.profile)
        } else {
            setUserProfile(null)
        }
    }, [user])

    return (
        <div className="w-screen flex text-white justify-between items-center font-medium text-xl shadow-2xl fixed z-10 bg-gradient-to-r from-[#110f8a] to-[#1e70de]">
            <div className="flex items-center">
                {user ? (
                    user.profileImage && !imageError ? (
                        <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover ml-5 mr-3"
                            onError={() => setImageError(true)} // Set the error state when image fails
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <IoPersonCircle className="ml-6 w-10 h-10 text-gray-400 mr-3" />
                    )
                ) : null}
                <div>
                    <Link to='/'>
                        <h1 className="p-3 text-3xl">TrustWork</h1>
                    </Link>
                </div>
                
            </div>
            <div className="navbar flex h-20">
                {
                    windowLoc != "/profile" && !userProfile &&
                    <Link className="p-3 px-3 hover:bg-black/40 content-center" to={user ? '/profile' : '/login'}>
                        <div>
                            Join as a Freelancer Today!
                        </div>
                    </Link>
                }
                {user ? (
                    <>
                        {walletAddress ?  
                            <Tooltip label="Address has been copied" isOpen={tooltipVisible} aria-label='A tooltip'>
                                <div
                                    className="p-3 px-3 content-center hover:bg-black/40 cursor-pointer"
                                    onClick={(e) => {copyToClipboard(e.target.textContent)}}
                                >
                                    {shortenAddress(walletAddress)}
                                </div>
                            </Tooltip> :
                            <div 
                                className="p-3 px-3 content-center hover:bg-black/40 cursor-pointer"
                                onClick={handleConnectWallet}
                            >
                                Connect Wallet
                            </div>
                        }
                        <div
                            className="p-3 px-3 cursor-pointer content-center hover:bg-black/40 mr-6"
                            onClick={handleLogout} 
                        >
                            Logout
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="p-3 px-3 content-center hover:bg-black/40">
                        <div>Log In</div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
