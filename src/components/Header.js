import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css"; // import CSS
import "../styles/components/Header.css";
export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🚲 SwiftRider</Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/ridebooking">Booking</Link>
          </li>
          <li>
            <Link to="/signup">Sign In/Sign UP To Rent a Bike</Link>
          </li>
          <li>
            <Link to="/login">Login/Register To Book a Bike</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
