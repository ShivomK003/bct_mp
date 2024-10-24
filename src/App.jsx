import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import JobProfile from "./Pages/JobProfile";
import Signup from "./Pages/SignupPage";
import JobBookingPage from "./Pages/JobBookingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<JobProfile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking" element={<JobBookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}  
export default App;