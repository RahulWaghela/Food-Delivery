import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import PlaceOrder from './pages/PlaceOrders/PlaceOrders';
import Footer from "./components/Footer/Footer";
import LoginPopUp from "./components/LoginPopup/LoginPopUp";
import Veryfy from "./pages/Verify/Veryfy";
import Myorders from "./pages/Myoders/Myorders.jsx";
function App() {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <>
    {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Veryfy />} />
          <Route path="/myorders" element={<Myorders />} />
          
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
