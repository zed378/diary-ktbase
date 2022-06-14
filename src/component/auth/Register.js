// import package
import { useState } from "react";
import { KontenbaseClient } from "@kontenbase/sdk";

// import assets
import cssModules from "../../assets/css/Register.module.css";

function Register(props) {
  const { close, logCard } = props;

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  // alert
  const [success, setSuccess] = useState(false);
  const [registered, setRegistered] = useState(false);

  // store data
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const { firstName, lastName, email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { user, token, error } = await kontenbase.auth.register({
        firstName,
        lastName,
        email,
        password,
      });

      if (!error) {
        setSuccess(true);
        localStorage.setItem("id", user._id);
        setTimeout(() => {
          setSuccess(false);
        }, 4000);
      } else {
        setRegistered(true);
        setTimeout(() => {
          setRegistered(false);
        }, 4000);
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={cssModules.clickArea} onClick={close}></div>
      <div className={cssModules.regCard}>
        <h1>Register</h1>
        {success ? (
          <h3
            style={{
              color: "green",
              background: "#c5fce5",
              textAlign: "center",
              padding: "0.5rem 0",
              fontSize: "1rem",
              fontFamily: "avenirs",
            }}
          >
            Register Success
          </h3>
        ) : (
          <></>
        )}

        {registered ? (
          <h3
            style={{
              color: "red",
              background: "#e0cecc",
              textAlign: "center",
              padding: "0.5rem 0",
              fontSize: "1rem",
              fontFamily: "avenirs",
            }}
          >
            Email Already Registered
          </h3>
        ) : (
          <></>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p onClick={logCard}>
          Already have an account? Click <strong>Here</strong>
        </p>
      </div>
    </>
  );
}

export default Register;
