import { useState } from "react";
import { connectWallet } from "../utils/connectWallet";
import { ethers } from "ethers";
import Navbar from "../utils/Navbar";

function HomePage() {
    
    const [jobDescription, setJobDescription] = useState("")
    const [jobBudget, setJobBudget] = useState("")




    const handleCreateJob = async () => {
        if(!provider) return;
        const contract = getContract(provider);
        try {
            const tx = await contract.createJob(jobDescription, ethers.utils.parseEther(jobBudget));
            await tx.wait();
            alert("Job created Successfully");
        } catch (error) {
            console.error("Job creation error: ", error);
        }
    };

    return (
    <div className="h-screen bg-[url('../wallpaper.jpg')] text-white cursor-default">
    <Navbar />

    {/* <div>
        <h2>Create a Job</h2>
        <input
        type="text"
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        />
        <input
        type="text"
        placeholder="Budget in ETH"
        value={jobBudget}
        onChange={(e) => setJobBudget(e.target.value)}
        />
        <button onClick={handleCreateJob}>Create Job</button>
    </div> */}
    </div>
    )
}

export default HomePage;