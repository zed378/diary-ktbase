// import package
import { useContext, useState } from "react";
import { KontenbaseClient } from "@kontenbase/sdk";

// import assets
import cssModules from "../../assets/css/Login.module.css";
import { UserContext } from "../../context/UserContext";

function Login(props) {
  const { close, regCard } = props;
  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  // alert
  const [failed, setFailed] = useState(false);

  // store data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [state, dispatch] = useContext(UserContext);

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { user, token, error } = await kontenbase.auth.login({
        email,
        password,
      });
      console.log(error);

      if (error === undefined || null || "") {
        dispatch({
          type: "LOGIN",
          payload: { user, token },
        });
        localStorage.setItem("id", user._id);
        close();
        document.location.reload(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={cssModules.clickArea} onClick={close}></div>
      <div className={cssModules.loginCard} id="card">
        <h1>Login</h1>

        {failed ? (
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
            Password or Email doesn't match
          </h3>
        ) : (
          <></>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p onClick={regCard}>
          Don't have an account? Click <strong>Here</strong>
        </p>
      </div>
    </>
  );
}

export default Login;
