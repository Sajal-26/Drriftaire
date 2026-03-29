import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const GoogleLoginButton = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast("Please login with Google");
            return;
        }

        try {
            const decoded = jwtDecode(token);

            // expiry check
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                toast.error("Session expired");
                return;
            }

            setUser(decoded);
            toast.success("Welcome back");
        } catch {
            localStorage.removeItem("token");
            toast.error("Invalid session");
        }
    }, []);

    const handleSuccess = async (credentialResponse) => {
        const loadingToast = toast.loading("Signing in");

        try {
            const res = await axios.post(
                "http://localhost:3000/api/auth/google",
                {
                    token: credentialResponse.credential,
                }
            );

            // trust backend response for UI
            setUser(res.data.user);

            localStorage.setItem("token", res.data.token);

            toast.dismiss(loadingToast);
            toast.success("Login successful");

        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.message || "Login failed");
            console.error(err);
        }
    };

    const handleError = () => {
        toast.error("Google login failed");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast("Logged out");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {!user ? (
                <>
                    <h2>Login with Google</h2>
                    <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                </>
            ) : (
                <div>
                    <h2>Logged in</h2>

                    <img
                        src={user.picture}
                        alt="profile"
                        style={{ borderRadius: "50%", width: "100px" }}
                    />

                    <h3>{user.name}</h3>
                    <p>{user.email}</p>

                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;