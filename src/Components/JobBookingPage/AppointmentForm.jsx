import React, { useState } from 'react';
import './AppointmentForm.css'; // Import the CSS file

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
        <div className="form-group">
          <label>Choose a Date: </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Hours per day: </label>
          <input
            type="number"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label>Number of Days: </label>
          <input
            type="number"
            value={numberOfDays}
            onChange={(e) => setNumberOfDays(parseInt(e.target.value))}
            required
            min="1"
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
