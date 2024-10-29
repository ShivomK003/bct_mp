import React, { useState } from 'react';
import { FormControl, Input, Button } from '@chakra-ui/react';
import './AppointmentForm.css';

const AppointmentForm = () => {
  const [date, setDate] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Date:', date);
    console.log('Hours per day:', hoursPerDay);
    console.log('Number of days:', numberOfDays);
    alert('Appointment Booked Successfully');
  };

  return (
    <div className="appointment-form-container">
      <h2>Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <FormControl className="form-group">
          <label>Choose a Date: </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormControl>
        <FormControl className="form-group">
          <label>Number of Hours per day: </label>
          <Input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
            required
            min="1"
          />
        </FormControl>
        <FormControl className="form-group">
          <label>Number of Days: </label>
          <input
            type="number"
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
            required
            min="1"
          />
        </FormControl>
        <Button type="submit" colorScheme='blue'>Book Appointment</Button>
      </form>
    </div>
  );
};

export default AppointmentForm;
