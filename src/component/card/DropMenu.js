// import package
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";

// import assets
import profile from "../../assets/img/profile.svg";
import write from "../../assets/img/write.svg";
import bookmark from "../../assets/img/bookmark.svg";
import logout from "../../assets/img/logout.svg";
import triangle from "../../assets/img/triangle.svg";
import cssModules from "../../assets/css/DropMenu.module.css";
import { UserContext } from "../../context/UserContext";

function DropMenu(props) {
  const { close } = props;

  // set header
  axios.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.token}`,
  };

  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();

  const removeSession = async () => {
    const URL = process.env.REACT_APP_AUTH_API;

    const response = await axios.post(`${URL}/logout`);
    console.log(response);
  };

  const LogOut = () => {
    navigate("/");
    dispatch({
      type: "LOGOUT",
    });

    removeSession();

    document.location.reload(true);
  };

  return (
    <>
      <div className={cssModules.dropWrapper} onClick={close}></div>
      <div className={cssModules.dropdown}>
        <img src={triangle} alt="triangle" className={cssModules.triangle} />
        <div
          className={cssModules.menuOption}
          onClick={() => {
            navigate("/profile");
            close();
          }}
        >
          <div className={cssModules.imgWrapper}>
            <img src={profile} alt="User" />
          </div>
          <p>Profile</p>
        </div>

        <div
          className={cssModules.menuOption}
          onClick={() => {
            navigate("/write");
            close();
          }}
        >
          <div className={cssModules.imgWrapper}>
            <img src={write} alt="Write" />
          </div>
          <p>New Journey</p>
        </div>

        <div
          className={cssModules.menuOption}
          onClick={() => {
            navigate("/bookmark");
            close();
          }}
        >
          <div className={cssModules.imgWrapper}>
            <img src={bookmark} alt="bookmark" />
          </div>
          <p>Bookmark</p>
        </div>

        <hr />

        <div className={cssModules.menuOption} onClick={LogOut}>
          <div className={cssModules.imgWrapper}>
            <img src={logout} alt="Log Out" />
          </div>
          <p>Log Out</p>
        </div>
      </div>
    </>
  );
}

export default DropMenu;
