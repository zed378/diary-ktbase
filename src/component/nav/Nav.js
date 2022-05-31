// import package
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

// import component
import Login from "../auth/Login";
import Register from "../auth/Register";

// import assets
import logo from "../../assets/img/logo.svg";
import banner from "../../assets/img/banner.mp4";
import cssModules from "../../assets/css/Nav.module.css";
import { UserContext } from "../../context/UserContext";

function Nav() {
  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();
  return (
    <>
      {state.logModal ? (
        <Login
          close={() =>
            dispatch({
              type: "logClose",
            })
          }
          regCard={() =>
            dispatch({
              type: "regShow",
            })
          }
        />
      ) : (
        <></>
      )}

      {state.regModal ? (
        <Register
          close={() =>
            dispatch({
              type: "regClose",
            })
          }
          logCard={() =>
            dispatch({
              type: "logShow",
            })
          }
        />
      ) : (
        <></>
      )}

      <div className={cssModules.navContainer}>
        <video
          className={cssModules.bgVid}
          autoPlay
          loop
          muted
          src={banner}
        ></video>
        <div className={cssModules.navWrapper}>
          <img src={logo} alt="Logo" onClick={() => navigate("/")} />
          <div className={cssModules.btnGroup}>
            <button
              className={cssModules.btnLog}
              onClick={() => dispatch({ type: "logShow" })}
              id="loginbutton"
            >
              Login
            </button>
            <button
              className={cssModules.btnReg}
              onClick={() => dispatch({ type: "regShow" })}
            >
              Register
            </button>
          </div>
        </div>
        <div className={cssModules.navBanner}>
          <h1 className={cssModules.bannerTitle}>
            The Journey <br /> you ever dreamed of.
          </h1>
          <p className={cssModules.bannerDesc}>
            We made a tool so you can easily keep & share your travel memories.{" "}
            <br />
            But there is a lot more
          </p>
        </div>
      </div>
    </>
  );
}

export default Nav;
