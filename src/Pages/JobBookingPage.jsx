import React, { useEffect, useState } from 'react';
import Navbar from '../utils/Navbar';
import AppointmentForm from './AppointmentForm';
import './styles.css'; 
import { useLocation, useParams } from 'react-router-dom'; 
import { useUser } from '../utils/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const JobBookingPage = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null)
    const location = useLocation();
    const pricePerHour = location.state?.pricePerHour;

    useEffect(() => {
        const fetchProfiles = async () => {
            const profileDocRef = doc(db, "profiles", id);
            const profileDoc = await getDoc(profileDocRef);
            
            if(profileDoc.exists()) {
                setProfileData(profileDoc.data())
            } else {
                console.log("No profile exists");
            }
        }
        fetchProfiles();
    }, [])

    useEffect(() => {
        console.log(profileData);
    }, [profileData])  

  return (
    <div>
        <div>
            <Navbar />
        </div>
        <div className="bg-cover bg-[url('../wallpaper.jpg')] text-white cursor-default min-h-screen">
            <div className="text-4xl content-center justify-items-center text-center grid p-6">
                <div className='h-24'></div>
                {id && profileData ? 
                <pre>
                    Hire <b><u>{profileData.name}</u></b> as a <b><u>{profileData.jobTitle}</u></b> here!
                </pre> :
                <pre></pre>}
                <AppointmentForm pricePerHour={pricePerHour}/>
            </div>
        </div>
    </div>
  );
};

export default JobBookingPage;
