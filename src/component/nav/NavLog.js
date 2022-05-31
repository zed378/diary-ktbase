// import package
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KontenbaseClient } from "@kontenbase/sdk";

// import component
import DropMenu from "../card/DropMenu";

// import assets
import logo1 from "../../assets/img/logo1.svg";
import cssModules from "../../assets/css/NavLog.module.css";

function NavLog() {
  const defaultProfile = process.env.REACT_APP_DEFAULT_PROFILE;
  const [user, setUser] = useState([]);
  const [dropModal, setDropModal] = useState(false);
  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  let navigate = useNavigate();

  const getUser = async () => {
    try {
      const { data, error } = await kontenbase
        .service("Users")
        .getById(`${localStorage.id}`);
      console.log(data);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {dropModal ? <DropMenu close={() => setDropModal(false)} /> : <></>}

      <div className={cssModules.navWrapper}>
        <img src={logo1} alt="Logo" onClick={() => navigate("/")} />
        <div
          className={cssModules.profileWrapper}
          onClick={() => setDropModal(true)}
        >
          <img src={user.photo ? user.photo : defaultProfile} alt="Profile" />
        </div>
      </div>
    </>
  );
}

export default NavLog;
