import { useState } from "react";
import "./hire.css";

export default function Hire() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "waiter",
    email: "",
    waiterId: "",
  });

  const [popup, setPopup] = useState({ visible: false, status: "loading", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate password
  const generatePassword = (firstName, lastName) => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${firstName[0]}${randomDigits}${lastName[0]}`;
  };

  // Generate unique waiterId → first 2 letters + 4 digits
  const generateWaiterId = (firstName) => {
    const letters = firstName.slice(0, 2).toLowerCase();
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `${letters}${digits}`;
  };

  const handleHire = async (e) => {
    e.preventDefault();
    setPopup({ visible: true, status: "loading", message: "Hiring..." });

    let waiterId = "";

    if (formData.role === "waiter") {
      waiterId = generateWaiterId(formData.firstName);
    }

    const password = generatePassword(formData.firstName, formData.lastName);

    const userData = {
      ...formData,
      waiterId,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to save user");

      const successMsg =
        formData.role === "waiter"
          ? `User created. Waiter ID: ${waiterId}`
          : `User created successfully`;

      setPopup({
        visible: true,
        status: "success",
        message: successMsg,
      });

      // ⭐ CLEAR FORM after 2 seconds ONLY IF success
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          role: "waiter",
          email: "",
          waiterId: "",
        });
      }, 2000);

    } catch (err) {
      console.error(err);
      setPopup({ visible: true, status: "error", message: "Please try again" });
    }

    // Hide popup after 6 seconds
    setTimeout(() => {
      setPopup({ visible: false, status: "loading", message: "" });
    }, 6000);
  };

  return (
    <div className="hire-page">
      <h1 className="page-title">Hire Staff</h1>
      <p className="page-desc">Add new employees to your restaurant system.</p>

      <form className="hire-form" onSubmit={handleHire}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="host">Host</option>
          <option value="chef">Chef</option>
          <option value="waiter">Waiter</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit">Hire</button>
      </form>

      {popup.visible && (
        <div className="popup">
          {popup.status === "loading" && <div className="loader"></div>}
          {popup.status === "success" && <div className="icon done">✔</div>}
          {popup.status === "error" && <div className="icon error">✖</div>}
          <p>{popup.message}</p>
        </div>
      )}
    </div>
  );
}
