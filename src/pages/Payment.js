import { useNavigate, useLocation } from "react-router-dom";
import "../styles/styles.css";
import "../styles/components/Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>⚠️ No Booking Found</h2>
        <p>Please complete your booking before making a payment.</p>
      </div>
    );
  }

  const handleDone = () => {
    alert("Bike booked successfully!");
    navigate("/booking-confirmation", { state: bookingData });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment</h2>
      <p>Scan QR to Pay</p>
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?data=SwiftRiderPayment"
        alt="QR"
      />
      <br /><br />
      <input type="file" accept="image/*" />
      <br /><br />
      <button onClick={handleDone}>Done</button>
    </div>
  );
}
