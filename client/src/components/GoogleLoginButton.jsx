import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = () => {
    const [user, setUser] = useState(null);
    const [bookingData, setBookingData] = useState({
        phone: "",
        location: "",
        farmSize: "",
        date: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                return;
            }
            setUser(decoded);
        } catch {
            localStorage.removeItem("token");
        }
    }, []);

    const handleSuccess = async (credentialResponse) => {
        const loadingToast = toast.loading("Signing in...");
        try {
            const res = await axios.post("http://localhost:3000/api/auth/google", {
                token: credentialResponse.credential,
            });
            
            // Note: Ensure your backend sends back the user object in res.data.user
            localStorage.setItem("token", res.data.token);
            setUser(jwtDecode(res.data.token)); 
            
            toast.dismiss(loadingToast);
            toast.success("Login successful");
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Login failed");
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const loadingToast = toast.loading("Sending booking to Sheets...");

        try {
            await axios.post("http://localhost:3000/api/auth/book", bookingData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.dismiss(loadingToast);
            toast.success("Saved to Google Sheets! 🚀");
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
            {!user ? (
                <>
                    <h2>Drriftaire Login Test</h2>
                    <GoogleLogin onSuccess={handleSuccess} onError={() => toast.error("Failed")} />
                </>
            ) : (
                <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <img src={user.picture} alt="pfp" style={{ borderRadius: "50%", width: "80px" }} />
                    <h3>Welcome, {user.name}</h3>
                    
                    <hr />
                    
                    <h4>Test Booking Form</h4>
                    <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input type="text" placeholder="Phone" required 
                            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
                        <input type="text" placeholder="Location" required 
                            onChange={(e) => setBookingData({...bookingData, location: e.target.value})} />
                        <input type="text" placeholder="Farm Size (e.g. 5 Acres)" required 
                            onChange={(e) => setBookingData({...bookingData, farmSize: e.target.value})} />
                        <input type="date" required 
                            onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                        
                        <button type="submit" style={{ padding: "10px", background: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}>
                            Submit Booking
                        </button>
                    </form>

                    <button onClick={() => { localStorage.removeItem("token"); setUser(null); }} 
                            style={{ marginTop: "20px", background: "none", border: "none", color: "red", cursor: "pointer" }}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;