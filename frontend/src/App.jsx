//Configuración de las rutas de navegación sincronizadas por medio de URLs

//Importa las rutas de las pantallas que deben verse
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash"; 
import Portal from "./pages/Portal";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; 
import Profile from "./pages/Profile";
import EmergencyContacts from "./pages/EmergencyContacts"; 
import EditProfile from "./pages/EditProfile"; 
import MyQRcode from "./pages/MyQRcode";
import PublicProfile from "./pages/PublicProfile";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import "./App.css";

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/my-qr-code" element={<MyQRcode />} />
        <Route path="/public-profile/:id" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

//Router indica que toda la navegación se maneja mediante URLs
//Routes y Route son como el mapa, es el mapeo de las rutas
//Navigate to maneja los errores en la navegación