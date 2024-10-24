import React, { useEffect } from 'react';
import Navbar from '../utils/Navbar';
import AppointmentForm from '../Components/JobBookingPage/AppointmentForm';
import './styles.css'; 
import { useLocation } from 'react-router-dom'; 
import { useUser } from '../utils/UserContext';

const JobBookingPage = () => {
    const { user, setUser } = useUser();

    useEffect(() => {
        console.log(user);
    }, [user])

  return (
    <div>
        <div>
            <Navbar />
        </div>
        <div className="bg-cover bg-[url('../wallpaper.jpg')] text-white cursor-default min-h-screen">
            <div className="text-4xl content-center justify-items-center text-center grid p-6">
                <div className='h-24'></div>
                {user ? 
                <pre>
                    Hire <b><u>{user.profile.name}</u></b> as a <b><u>{user.profile.jobTitle}</u></b> here!
                </pre> :
                <pre></pre>}
                <AppointmentForm />
            </div>
        </div>
    </div>
  );
};

export default JobBookingPage;
