import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/styles.css";
import "../styles/components/Booking.css";

export default function Booking() {
  const [bookingData, setBookingData] = useState({
    bikeId: "",
    bikeModel: "",
    bikePrice: 0,
    pickupLocation: "",
    dropoffLocation: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    totalDays: 1,
    totalPrice: 0,
    insurance: true,
    helmet: 1,
    paymentMethod: "credit_card",
    specialRequests: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Sample bike data (in real app, this would come from API or state)
  const bikes = [
    { id: 1, model: "Yamaha MT-15", price: 500 },
    { id: 2, model: "Royal Enfield Classic 350", price: 700 },
    { id: 3, model: "Honda Activa", price: 300 }
  ];

  useEffect(() => {
    // Get bike ID from URL params or location state
    const urlParams = new URLSearchParams(location.search);
    const bikeId = urlParams.get('bikeId') || location.state?.bikeId;
    
    if (bikeId) {
      const selectedBike = bikes.find(bike => bike.id === parseInt(bikeId));
      if (selectedBike) {
        setBookingData(prev => ({
          ...prev,
          bikeId: selectedBike.id,
          bikeModel: selectedBike.model,
          bikePrice: selectedBike.price,
          totalPrice: selectedBike.price
        }));
      }
    }
  }, [location]);

  useEffect(() => {
    // Calculate total price when dates change
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      let total = bookingData.bikePrice * daysDiff;
      
      // Add insurance cost
      if (bookingData.insurance) {
        total += 100 * daysDiff; // ₹100 per day for insurance
      }
      
      // Add helmet cost
      total += bookingData.helmet * 50; // ₹50 per helmet
      
      setBookingData(prev => ({
        ...prev,
        totalDays: daysDiff > 0 ? daysDiff : 1,
        totalPrice: total
      }));
    }
  }, [bookingData.startDate, bookingData.endDate, bookingData.insurance, bookingData.helmet, bookingData.bikePrice]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!bookingData.pickupLocation || !bookingData.startDate || !bookingData.endDate) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (new Date(bookingData.startDate) >= new Date(bookingData.endDate)) {
      alert("End date must be after start date");
      return;
    }
    
    console.log("Booking submitted:", bookingData);
    // TODO: Connect with backend API
    
    navigate("/payment", { state: bookingData });
  };

  const isFormValid = bookingData.pickupLocation && bookingData.startDate && bookingData.endDate;

  return (
    <div className="booking-container">
      <div className="booking-card">
        <div className="booking-header">
          <h1>🚲 Complete Your Booking</h1>
          <p>Fill in the details to confirm your ride</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Bike Selection */}
          <div className="form-section">
            <h3>Bike Details</h3>
            <div className="form-group">
              <label>Select Bike *</label>
              <select
                value={bookingData.bikeId}
                onChange={(e) => {
                  const selectedBike = bikes.find(bike => bike.id === parseInt(e.target.value));
                  if (selectedBike) {
                    setBookingData(prev => ({
                      ...prev,
                      bikeId: selectedBike.id,
                      bikeModel: selectedBike.model,
                      bikePrice: selectedBike.price,
                      totalPrice: selectedBike.price * prev.totalDays
                    }));
                  }
                }}
                className="form-input"
                required
              >
                <option value="">Select a bike</option>
                {bikes.map(bike => (
                  <option key={bike.id} value={bike.id}>
                    {bike.model} - ₹{bike.price}/day
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Details */}
          <div className="form-section">
            <h3>Location Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Pickup Location *</label>
                <input
                  type="text"
                  value={bookingData.pickupLocation}
                  onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                  placeholder="Enter pickup address"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Dropoff Location</label>
                <input
                  type="text"
                  value={bookingData.dropoffLocation}
                  onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                  placeholder="Enter dropoff address (optional)"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-section">
            <h3>Date & Time</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pickup Time</label>
                <input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Return Time</label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="form-section">
            <h3>Additional Services</h3>
            <div className="form-grid">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={bookingData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Insurance Coverage (₹100/day)
                </label>
              </div>

              <div className="form-group">
                <label>Number of Helmets</label>
                <select
                  value={bookingData.helmet}
                  onChange={(e) => handleInputChange('helmet', parseInt(e.target.value))}
                  className="form-input"
                >
                  <option value={0}>No helmet</option>
                  <option value={1}>1 Helmet (₹50)</option>
                  <option value={2}>2 Helmets (₹100)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="form-section">
            <h3>Special Requests</h3>
            <div className="form-group">
              <textarea
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requirements or notes..."
                rows="3"
                className="form-textarea"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <h3>Price Summary</h3>
            <div className="price-details">
              <div className="price-row">
                <span>Base Price ({bookingData.totalDays} days)</span>
                <span>₹{bookingData.bikePrice * bookingData.totalDays}</span>
              </div>
              {bookingData.insurance && (
                <div className="price-row">
                  <span>Insurance ({bookingData.totalDays} days)</span>
                  <span>₹{100 * bookingData.totalDays}</span>
                </div>
              )}
              {bookingData.helmet > 0 && (
                <div className="price-row">
                  <span>Helmets ({bookingData.helmet})</span>
                  <span>₹{bookingData.helmet * 50}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{bookingData.totalPrice}</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="booking-button"
            disabled={!isFormValid}
          >
            🚀 Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}