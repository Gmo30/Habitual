import "./login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/users/login", formData);
            console.log(res.data);

            setUser(res.data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="body-login">
            <div className="card">
                <h1>Log in</h1>
                <p>
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/register")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#007bff",
                            cursor: "pointer",
                            textDecoration: "underline",
                            padding: 0,
                            font: "inherit",
                        }}
                    >
                        Sign up!
                    </button>
                </p>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-fields">
                        <label>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="input-fields">
                        <label>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button className="button">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;