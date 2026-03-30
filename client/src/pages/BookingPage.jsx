import { useState } from "react";
import axios from "axios";

const BookingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    pinCode: "",
    acres: "",
    cropType: "",
    date: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/bookings/book", formData);
      alert("Booking successful 🚀");

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        state: "",
        district: "",
        pinCode: "",
        acres: "",
        cropType: "",
        date: ""
      });

    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Book a Drone Service 🚁</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
        <input name="district" placeholder="District" value={formData.district} onChange={handleChange} required />
        <input name="pinCode" placeholder="Pin Code" value={formData.pinCode} onChange={handleChange} required />
        <input name="acres" type="number" placeholder="Farm Size (Acres)" value={formData.acres} onChange={handleChange} required />
        <input name="cropType" placeholder="Crop Type (e.g. Rice, Wheat)" value={formData.cropType} onChange={handleChange} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;