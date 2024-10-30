import React, { useEffect, useState } from 'react';
import { FormControl, Input, Button, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { db } from '../firebaseConfig'; // Import Firestore
import { useUser } from '../utils/UserContext'; // Import user context
import { addDoc, collection } from 'firebase/firestore';
import "./AppointmentForm.css"

const AppointmentForm = ({ pricePerHour }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(0);
  const { user } = useUser();
  const [alertMessage, setAlertMessage] = useState(null); 

  const ethToInrRate = 282000;

  const calculateTotalHours = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
    const totalHours = numberOfDays * hoursPerDay;
    return { numberOfDays, totalHours };
  };

  const convertInrToEth = (amountInInr) => {
    const amountInEth = amountInInr / ethToInrRate;
    return amountInEth.toFixed(6);
  };

  const handleSubmit = async (e) => {
    const { numberOfDays, totalHours } = calculateTotalHours();
    const totalAmount = totalHours * pricePerHour;
    const totalAmountInEth = convertInrToEth(totalAmount);
    
    try {
      const userDocRef = doc(db, "users", user.id);
      const bookingsCollectionRef = collection(userDocRef, "bookings");
      const bookingAddDoc = await addDoc(bookingsCollectionRef, {
        startDate: startDate,
        endDate: endDate,
        hoursPerDay: hoursPerDay,
        numberOfDays: numberOfDays,
        totalHours: totalHours,
        totalAmount: totalAmountInEth,
      });
      setAlertMessage({ status: 'success', title: "Success: ", description: 'Appointment booked successfully' });
    } catch (e) {
      console.error('Error booking appointment:', error);
      setAlertMessage({ status: 'error', title: "Appointment Set Error: ", description: 'Error booking appointment:' + error.message });
    }
  }

  useEffect(() => {
    const { numberOfDays, totalHours } = calculateTotalHours();
    const totalAmount = totalHours * pricePerHour;
    console.log({
      startDate: startDate,
      endDate: endDate,
      hoursPerDay: hoursPerDay,
      numberOfDays: numberOfDays,
      totalHours: totalHours,
      totalAmount: totalAmount,
    });
  }, [startDate, endDate, hoursPerDay])

  return (
    <div className="appointment-form-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <FormControl className="form-group">
          <label>Start Date: </label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </FormControl>
        <FormControl className="form-group">
          <label>End Date: </label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </FormControl>
        <FormControl className="form-group">
          <label>Number of Hours per Day: </label>
          <Input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(parseInt(e.target.value))} required min="1" />
        </FormControl>
        <Button type="submit" colorScheme='blue'>Book Appointment</Button>
      </form>
      {alertMessage && (
        <Alert status={alertMessage.status} mb={4} textColor={"black"}>
            <AlertIcon />
            <AlertTitle>{alertMessage.title}</AlertTitle>
            <AlertDescription>{alertMessage.description}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AppointmentForm;
