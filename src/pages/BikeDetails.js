import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { bikes } from "../data/bikes";
import "../styles/styles.css";
import "../styles/components/BikeDetails.css";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  // find bike by id
  const bike = bikes.find((b) => b.id === Number(id));

  if (!bike) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        🚫 Bike not found
      </h2>
    );
  }

  const totalPrice = bike.price + bike.delivery + bike.prepayment;

  const handleBookNow = () => {
    navigate("/login");
  };

  return (
    <div className="bike-details-container">
      <div className="bike-details-card">
        {/* Image Gallery */}
        <div className="bike-gallery">
          <div className="main-image">
            <img src={bike.images[selectedImage]} alt={bike.model} />
          </div>
          <div className="thumbnail-gallery">
            {bike.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${bike.model} ${index + 1}`}
                className={selectedImage === index ? "active" : ""}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Bike Information */}
        <div className="bike-info">
          <div className="bike-header">
            <h1>
              {bike.brand} {bike.model}
            </h1>
            <div className="rating-badge">
              ⭐ {bike.rating} ({bike.reviews} reviews)
            </div>
          </div>

          <div className="bike-tags">
            <span className="tag">{bike.type}</span>
            <span className="tag">{bike.year} Model</span>
            <span className="tag">{bike.color}</span>
          </div>

          {/* Specifications */}
          <div className="specs-section">
            <h3>Key Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span>Engine</span>
                <span>{bike.engine}</span>
              </div>
              <div className="spec-item">
                <span>Power</span>
                <span>{bike.power}</span>
              </div>
              <div className="spec-item">
                <span>Torque</span>
                <span>{bike.torque}</span>
              </div>
              <div className="spec-item">
                <span>Mileage</span>
                <span>{bike.mileage}</span>
              </div>
              <div className="spec-item">
                <span>Transmission</span>
                <span>{bike.transmission}</span>
              </div>
              <div className="spec-item">
                <span>Fuel Capacity</span>
                <span>{bike.fuelCapacity}</span>
              </div>
              <div className="spec-item">
                <span>Weight</span>
                <span>{bike.weight}</span>
              </div>
              <div className="spec-item">
                <span>Top Speed</span>
                <span>{bike.topSpeed}</span>
              </div>
              <div className="spec-item">
                <span>ABS</span>
                <span>{bike.abs ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="features-section">
            <h3>Features & Amenities</h3>
            <div className="features-grid">
              {bike.features.map((f, i) => (
                <div key={i} className="feature-item">
                  ✅ {f}
                </div>
              ))}
            </div>
          </div>

          {/* Owner Information */}
          <div className="owner-section">
            <h3>Owner Information</h3>
            <div className="owner-card">
              <div className="owner-details">
                <h4>{bike.owner.name}</h4>
                <div>
                  ⭐ {bike.owner.rating} •{" "}
                  {bike.owner.verified ? "Verified" : "Not Verified"}
                </div>
                <p>
                  Joined {bike.owner.joined} • {bike.owner.bikes} bikes listed
                </p>
              </div>
              <button className="contact-btn">📞 Contact Owner</button>
            </div>
          </div>

          {/* Location & Availability */}
          <div className="location-section">
            <h3>Location & Availability</h3>
            <p>📍 {bike.location}</p>
            <p>🟢 {bike.availability}</p>
          </div>
        </div>

        {/* Pricing & Booking */}
        <div className="booking-card">
          <h3>Pricing Details</h3>
          <div className="price-item">
            <span>Daily Rental</span>
            <span>₹{bike.price}</span>
          </div>
          <div className="price-item">
            <span>Delivery Charge</span>
            <span>₹{bike.delivery}</span>
          </div>
          <div className="price-item">
            <span>Security Deposit</span>
            <span>₹{bike.prepayment}</span>
          </div>
          <div className="price-item total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <p>🛡️ {bike.insurance}</p>

          <div className="booking-actions">
            <button className="book-btn" onClick={handleBookNow}>
              📅 Book Now
            </button>
            <button className="wishlist-btn">❤️ Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}
