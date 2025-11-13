import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed!");
        return;
      }

      toast.success("Registration successful! Redirecting...");

      // ✅ token store (optional)
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // ✅ Redirect to profile/login/homepage after 1 sec
      setTimeout(() => {
        navigate("/profile");
      }, 800);

    } catch (error) {
      toast.error("Server error, please try again!");
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto", marginTop: "50px" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          Register
        </button>
      </form>
    </div>
  );
}
