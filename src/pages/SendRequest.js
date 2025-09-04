import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/components/SendRequest.css";

export default function SendRequest() {
  const [form, setForm] = useState({
    bikeImages: [],
    bikeModel: "",
    bikeBrand: "",
    year: "",
    mileage: "",
    engineCC: "",
    fuelType: "Petrol",
    transmission: "Manual",
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    description: "",
    features: [],
    documents: [],
    contactNumber: "",
    availability: "Available"
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fuelTypes = ["Petrol", "Diesel", "Electric", "CNG"];
  const transmissionTypes = ["Manual", "Automatic", "Semi-Automatic"];
  const availabilityOptions = ["Available", "Not Available", "Coming Soon"];

  const bikeFeatures = [
    "ABS", "LED Lights", "Digital Display", "GPS", "USB Charging",
    "Disc Brakes", "Alloy Wheels", "Self Start", "Kick Start", "Storage Space"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!form.bikeModel) newErrors.bikeModel = "Bike model is required";
    if (!form.bikeBrand) newErrors.bikeBrand = "Bike brand is required";
    if (!form.year) newErrors.year = "Manufacturing year is required";
    if (!form.mileage) newErrors.mileage = "Mileage is required";
    if (!form.engineCC) newErrors.engineCC = "Engine capacity is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.minPrice) newErrors.minPrice = "Minimum price is required";
    if (!form.maxPrice) newErrors.maxPrice = "Maximum price is required";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.contactNumber) newErrors.contactNumber = "Contact number is required";
    if (form.bikeImages.length === 0) newErrors.bikeImages = "At least one bike image is required";
    if (parseFloat(form.minPrice) >= parseFloat(form.maxPrice)) {
      newErrors.maxPrice = "Maximum price must be greater than minimum price";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    console.log("Submitting bike rental request:", form);
    // TODO: Connect with backend API
    
    alert("Bike rental request submitted successfully!");
    navigate("/");
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + form.bikeImages.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setForm(prev => ({
      ...prev,
      bikeImages: [...prev.bikeImages, ...newImages]
    }));
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      bikeImages: prev.bikeImages.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureToggle = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  return (
    <div className="send-request-container">
      <div className="send-request-card">
        <div className="send-request-header">
          <h1>🚲 List Your Bike for Rent</h1>
          <p>Fill in the details to start earning from your bike</p>
        </div>

        <form onSubmit={handleSubmit} className="send-request-form">
          {/* Bike Images */}
          <div className="form-section">
            <h3>Bike Photos</h3>
            <div className="image-upload-container">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
                id="bikeImages"
              />
              <label htmlFor="bikeImages" className="image-upload-label">
                📸 Upload Photos (Max 5)
              </label>
              {errors.bikeImages && <span className="error-text">{errors.bikeImages}</span>}
              
              <div className="image-previews">
                {form.bikeImages.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={image.preview} alt={`Bike ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Bike Model *</label>
                <input
                  type="text"
                  value={form.bikeModel}
                  onChange={(e) => handleInputChange('bikeModel', e.target.value)}
                  className={errors.bikeModel ? 'error' : ''}
                  placeholder="e.g., Yamaha MT-15"
                />
                {errors.bikeModel && <span className="error-text">{errors.bikeModel}</span>}
              </div>

              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  value={form.bikeBrand}
                  onChange={(e) => handleInputChange('bikeBrand', e.target.value)}
                  className={errors.bikeBrand ? 'error' : ''}
                  placeholder="e.g., Yamaha"
                />
                {errors.bikeBrand && <span className="error-text">{errors.bikeBrand}</span>}
              </div>

              <div className="form-group">
                <label>Manufacturing Year *</label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={form.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={errors.year ? 'error' : ''}
                  placeholder="e.g., 2023"
                />
                {errors.year && <span className="error-text">{errors.year}</span>}
              </div>

              <div className="form-group">
                <label>Mileage (kmpl) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className={errors.mileage ? 'error' : ''}
                  placeholder="e.g., 45.2"
                />
                {errors.mileage && <span className="error-text">{errors.mileage}</span>}
              </div>

              <div className="form-group">
                <label>Engine Capacity (cc) *</label>
                <input
                  type="number"
                  value={form.engineCC}
                  onChange={(e) => handleInputChange('engineCC', e.target.value)}
                  className={errors.engineCC ? 'error' : ''}
                  placeholder="e.g., 155"
                />
                {errors.engineCC && <span className="error-text">{errors.engineCC}</span>}
              </div>

              <div className="form-group">
                <label>Fuel Type *</label>
                <select
                  value={form.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                >
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Transmission *</label>
                <select
                  value={form.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                >
                  {transmissionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Rental Details */}
          <div className="form-section">
            <h3>Rental Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Available From *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={errors.startDate ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <span className="error-text">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label>Available Until *</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={errors.endDate ? 'error' : ''}
                  min={form.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <span className="error-text">{errors.endDate}</span>}
              </div>

              <div className="form-group">
                <label>Minimum Price (₹/day) *</label>
                <input
                  type="number"
                  value={form.minPrice}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  className={errors.minPrice ? 'error' : ''}
                  placeholder="e.g., 300"
                />
                {errors.minPrice && <span className="error-text">{errors.minPrice}</span>}
              </div>

              <div className="form-group">
                <label>Maximum Price (₹/day) *</label>
                <input
                  type="number"
                  value={form.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  className={errors.maxPrice ? 'error' : ''}
                  placeholder="e.g., 500"
                />
                {errors.maxPrice && <span className="error-text">{errors.maxPrice}</span>}
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={errors.location ? 'error' : ''}
                  placeholder="e.g., Bangalore, Karnataka"
                />
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="tel"
                  value={form.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className={errors.contactNumber ? 'error' : ''}
                  placeholder="e.g., +91 9876543210"
                />
                {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="form-section">
            <h3>Bike Features</h3>
            <div className="features-grid">
              {bikeFeatures.map(feature => (
                <label key={feature} className="feature-checkbox">
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  <span className="checkmark"></span>
                  {feature}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h3>Description</h3>
            <div className="form-group">
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your bike's condition, any special features, rental terms, etc."
                rows="4"
                className="description-textarea"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="form-section">
            <h3>Additional Documents</h3>
            <div className="form-group">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleDocumentUpload}
                className="file-input"
                id="documents"
              />
              <label htmlFor="documents" className="file-input-label">
                📄 Upload RC Book, Insurance, etc.
              </label>
              {form.documents.length > 0 && (
                <div className="documents-list">
                  {form.documents.map((doc, index) => (
                    <span key={index} className="document-item">
                      {doc.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-request-btn">
            🚀 Submit Rental Request
          </button>
        </form>
      </div>
    </div>
  );
}