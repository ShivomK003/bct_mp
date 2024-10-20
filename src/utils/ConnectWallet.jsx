import { ethers } from "ethers";

export const connectWallet = async () => {
    
    if(window.ethereum) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            console.log(address);
            

            return { provider, signer, address };
            
        } catch (error) {
            console.error("MetaMask connection error:", error);
        } 
    } else {
        alert("Please Install MetaMask!")
    }
};
