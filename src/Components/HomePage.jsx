import { useState } from "react";
import { connectWallet } from "../utils/connectWallet";
import { ethers } from "ethers";
import Navbar from "../utils/Navbar";
import SearchBar from "../utils/SearchBar";
import ProfileDisplay from "../utils/ProfileDisplay";

function HomePage() {
    return (
    <div>
        <Navbar />
        <div className="h-full bg-[url('../wallpaper.jpg')] text-white cursor-default">
            <div className="text-4xl h-screen content-center justify-items-center text-center grid">
                <pre className="m-6">
                    Hire Freelancers using<br></br>
                    Our Decentralised Platform Today!
                </pre>
                <SearchBar />
            </div>  
        </div>
        <div className="h-screen text-black cursor-default">
            <ProfileDisplay />
        </div>
    </div>
    )
}

export default HomePage;