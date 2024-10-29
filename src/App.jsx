import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import JobProfileForm from "./Pages/JobProfileForm";
import Signup from "./Pages/SignupPage";
import JobBookingPage from "./Pages/JobBookingPage";
import JobDisplay from "./Pages/JobDisplay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<JobProfileForm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/display/:id" element={<JobDisplay />} />
        <Route path="/booking/:profileId" element={<JobBookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}  
export default App;