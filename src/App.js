import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import RideBooking from './pages/RideBooking';
import BikeDetails from './pages/BikeDetails';
import Payment from './pages/Payment';
import SendRequest from './pages/SendRequest';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ridebooking" element={<RideBooking />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/send-request" element={<SendRequest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
