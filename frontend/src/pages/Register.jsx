import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({
        username: "",
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
            const res = await api.post("/api/users/register", formData);
            console.log(res.data);

            setUser(res.data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="body-login">
            <div className="card">
                <h1>Register</h1>
                <p>Don't have an account? Sign up!</p>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-fields">
                        <label>
                            Username
                        </label>
                        <input
                            type="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="off"
                            required
                        />
                    </div>
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
                    <button className="button">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;