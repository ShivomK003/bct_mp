import React from 'react';
import Navbar from '../utils/Navbar';
import AppointmentForm from '../Components/JobBookingPage/AppointmentForm';
import './styles.css'; // Import the CSS file here
import { useLocation } from 'react-router-dom'; // Import useLocation

const JobBookingPage = () => {
  const location = useLocation(); // Get the current location
  const { name, jobTitle } = location.state || {}; // Destructure name and jobTitle from state

  return (
    <div>
        <div>
            <Navbar />
        </div>
        <br />
        <br />
        <br />
        <div className="bg-cover bg-[url('../wallpaper.jpg')] text-white cursor-default min-h-screen">
            <div className="text-4xl content-center justify-items-center text-center grid p-6">
                <pre>
                    Hire <b><u>{name}</u></b> for <b><u>{jobTitle}</u></b> here!
                </pre>
                <AppointmentForm />
            </div>
        </div>
    </div>
  );
};

export default JobBookingPage;
