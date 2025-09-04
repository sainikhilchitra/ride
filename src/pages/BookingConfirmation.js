// import { useLocation } from "react-router-dom";
// import "../styles/styles.css";
// import "../styles/components/BookingConfirmation.css";

// export default function BookingConfirmation() {
//   const location = useLocation();
//   const bookingData = location.state;

//   if (!bookingData) {
//     return <p>No booking details found. Please complete your booking first.</p>;
//   }

//   return (
//     <div className="confirmation-container">
//       <div className="confirmation-card">
//         <h1>✅ Booking Confirmation</h1>
//         <p>Thank you for booking, your ride details are below:</p>

//         <div className="confirmation-details">
//           <p><strong>Bike:</strong> {bookingData.bikeModel}</p>
//           <p><strong>Pickup Location:</strong> {bookingData.pickupLocation}</p>
//           <p><strong>Dropoff Location:</strong> {bookingData.dropoffLocation || "N/A"}</p>
//           <p><strong>Start Date:</strong> {bookingData.startDate}</p>
//           <p><strong>End Date:</strong> {bookingData.endDate}</p>
//           <p><strong>Pickup Time:</strong> {bookingData.startTime}</p>
//           <p><strong>Return Time:</strong> {bookingData.endTime}</p>
//           <p><strong>Total Days:</strong> {bookingData.totalDays}</p>
//           <p><strong>Insurance:</strong> {bookingData.insurance ? "Yes" : "No"}</p>
//           <p><strong>Helmets:</strong> {bookingData.helmet}</p>
//           <p><strong>Special Requests:</strong> {bookingData.specialRequests || "None"}</p>
//           <p><strong>Total Price:</strong> ₹{bookingData.totalPrice}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../styles/styles.css";
import "../styles/components/BookingConfirmation.css";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <h1>⚠️ No Booking Found</h1>
          <p>No booking details found. Please complete your booking first.</p>
          <div className="confirmation-actions">
            <Link to="/booking" className="action-button primary">
              🚗 Start Booking
            </Link>
            <Link to="/" className="action-button secondary">
              🏠 Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    navigate("/booking");
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h1>✅ Booking Confirmed!</h1>
        <p>Thank you for booking with SwiftRider. Your ride details are below:</p>

        <div className="confirmation-details">
          <p><strong>Bike:</strong> {bookingData.bikeModel}</p>
          <p><strong>Pickup Location:</strong> {bookingData.pickupLocation}</p>
          <p><strong>Dropoff Location:</strong> {bookingData.dropoffLocation || "Same as pickup"}</p>
          <p><strong>Start Date:</strong> {new Date(bookingData.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(bookingData.endDate).toLocaleDateString()}</p>
          <p><strong>Pickup Time:</strong> {bookingData.startTime}</p>
          <p><strong>Return Time:</strong> {bookingData.endTime}</p>
          <p><strong>Duration:</strong> {bookingData.totalDays} days</p>
          <p><strong>Insurance:</strong> {bookingData.insurance ? "✅ Included" : "❌ Not included"}</p>
          <p><strong>Helmets:</strong> {bookingData.helmet} included</p>
          <p><strong>Special Requests:</strong> {bookingData.specialRequests || "None"}</p>
          <p><strong>Total Amount:</strong> ₹{bookingData.totalPrice}</p>
        </div>

        {/* Optional QR Code for payment reference */}
        <div className="qr-code">
          <h3>Payment Reference</h3>
          <div className="qr-placeholder">
            QR Code
          </div>
        </div>

        <div className="confirmation-actions">
          <button onClick={handlePrint} className="action-button secondary">
            🖨️ Print Receipt
          </button>
          <button onClick={handleNewBooking} className="action-button primary">
            🚗 Book Another Ride
          </button>
          <Link to="/" className="action-button secondary">
            🏠 Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}