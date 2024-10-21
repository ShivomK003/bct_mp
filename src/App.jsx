import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/LoginPage";
import HomePage from "./Components/HomePage";
import JobProfile from "./Components/JobProfile";
import Signup from "./Components/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<JobProfile />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}  
export default App;