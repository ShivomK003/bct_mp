import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const contractABI =[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "appointmentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "hoursPerWeek",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "numberOfDays",
				"type": "uint8"
			}
		],
		"name": "AppointmentBooked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "appointmentId",
				"type": "uint256"
			}
		],
		"name": "AppointmentConfirmed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_date",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_hoursPerWeek",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "_numberOfDays",
				"type": "uint8"
			}
		],
		"name": "bookAppointment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_appointmentId",
				"type": "uint256"
			}
		],
		"name": "confirmAppointment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "appointmentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "appointments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "hoursPerWeek",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "numberOfDays",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isConfirmed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xB9c6d851482fe026a1021a4D5481409c0D86020c';

function useFreelancerBooking() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initializeProvider = async () => {
            if (window.ethereum) {
                const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
                const tempSigner = tempProvider.getSigner();
                const tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);

                setProvider(tempProvider);
                setSigner(tempSigner);
                setContract(tempContract);
            } else {
                console.log("Please install MetaMask!");
            }
        };
        initializeProvider();
    }, []);

    const bookAppointment = async (date, hoursPerWeek, numberOfDays) => {
        if (!contract) return;
        try {
            const tx = await contract.bookAppointment(date, hoursPerWeek, numberOfDays);
            await tx.wait(); // Wait for the transaction to be confirmed
            console.log("Appointment booked successfully:", tx);
        } catch (error) {
            console.error("Failed to book appointment:", error);
        }
    };

    const confirmAppointment = async (appointmentId) => {
        if (!contract) return;
        try {
            const tx = await contract.confirmAppointment(appointmentId);
            await tx.wait(); // Wait for the transaction to be confirmed
            console.log("Appointment confirmed successfully:", tx);
        } catch (error) {
            console.error("Failed to confirm appointment:", error);
        }
    };

    return { bookAppointment, confirmAppointment };
}

export default useFreelancerBooking;
