import { Link, useParams } from "react-router-dom";
import "../styles/styles.css";
import "../styles/components/RideBooking.css";

export default function RideBooking() {
  const { id } = useParams();  // ✅ Hook inside component

  const bikes = [
    { id: 1, model: "Yamaha MT-15", price: 500,
      image: "https://tse1.mm.bing.net/th/id/OIP.vbN9YIRbZJsQCpOXXEadOgHaFj",
      type: "Sports Bike", cc: "155cc", mileage: "45 kmpl", rating: 4.8 },
    { id: 2, model: "Royal Enfield Classic 350", price: 700,
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
      type: "Cruiser", cc: "346cc", mileage: "35 kmpl", rating: 4.7 },
    { id: 3, model: "Honda Activa", price: 300,
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87",
      type: "Scooter", cc: "109cc", mileage: "60 kmpl", rating: 4.6 },
    { id: 4, model: "Bajaj Pulsar NS200", price: 550,
      image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65",
      type: "Naked Sports", cc: "199.5cc", mileage: "40 kmpl", rating: 4.5 },
    { id: 5, model: "TVS Apache RTR 160", price: 450,
      image: "https://www.bing.com/th/id/OIP.UB8o-rU9CeXAUVp3YHyRhgHaEc",
      type: "Street Bike", cc: "159.7cc", mileage: "50 kmpl", rating: 4.4 },
    { id: 6, model: "KTM Duke 200", price: 650,
      image: "https://www.bing.com/th/id/OIP.z2qn97538wQHuqbG5DGIbwHaE7",
      type: "Performance Bike", cc: "199.5cc", mileage: "35 kmpl", rating: 4.9 }
  ];

  const bike = bikes.find(b => b.id === parseInt(id)); // ✅ Now safe

  return (
    <div className="ride-booking-container">
      <div className="booking-header">
        <h1>Available Bikes</h1>
        <p>Choose your perfect ride for the journey</p>
      </div>

      <div className="bikes-grid">
        {bikes.map((bike) => (
          <div key={bike.id} className="bike-card">
            <div className="bike-image">
              <img src={bike.image} alt={bike.model} />
              <span className="bike-type">{bike.type}</span>
              <div className="bike-rating">⭐ {bike.rating}</div>
            </div>

            <div className="bike-info">
              <h3>{bike.model}</h3>
              <p className="bike-specs">
                <span>🏍️ {bike.cc}</span>
                <span>⛽ {bike.mileage}</span>
              </p>

              <div className="price-section">
                <p className="bike-price">₹{bike.price} / day</p>
                <p className="security-deposit">+ ₹2000 security deposit</p>
              </div>

              <div className="bike-features">
                <span>🔒 ABS</span>
                <span>📱 Digital Display</span>
                <span>💡 LED Lights</span>
              </div>
            </div>

            <div className="card-actions">
              <Link to={`/bike/${bike.id}`} className="view-button">👀 View Details</Link>
              <Link to="/login" className="book-button">📅 Book Now</Link>
              <button className="wishlist-button">♡</button>
            </div>
          </div>
        ))}
      </div>

      <div className="booking-footer">
        <p>🔒 All bikes are fully insured • 🛠️ Regular maintenance • 🚗 Free delivery within city</p>
      </div>
    </div>
  );
}
