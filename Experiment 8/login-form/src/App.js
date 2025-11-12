import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple login validation
    if (formData.username === "admin" && formData.password === "1234") {
      setMessage("✅ Login Successful!");
    } else {
      setMessage("❌ Invalid Username or Password!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔐 Login Form</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>Login</button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

// Basic inline CSS styling
const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    fontWeight: "bold",
  },
};

export default App;
