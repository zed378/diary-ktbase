// import package
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KontenbaseClient } from "@kontenbase/sdk";

// import component
import DiaryCard from "../component/card/DiaryCard";

// import assets
import nodiary from "../assets/img/nodiary.svg";
import edit from "../assets/img/edits.svg";
import cssModules from "../assets/css/Profile.module.css";

// import config
import { API } from "../config/api";

function Profile() {
  let navigate = useNavigate();
  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });
  const defaultProfile = process.env.REACT_APP_DEFAULT_PROFILE;

  const [user, setUser] = useState([]);
  const [diaries, setDiaries] = useState([]);

  const getUser = async () => {
    try {
      const { data, error } = await kontenbase
        .service("Users")
        .getById(`${localStorage.id}`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiaries = async () => {
    try {
      const { data, error } = await kontenbase.service("Diaries").find({
        where: {
          userId: localStorage.id,
        },
      });
      setDiaries(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getDiaries();
  }, []);

  return (
    <div className={cssModules.profileContainer}>
      <h1>Profile</h1>

      <div className={cssModules.imgContainer}>
        <div className={cssModules.imgWrapper}>
          <img src={user.photo ? user.photo : defaultProfile} alt="Profile" />
          <div
            className={cssModules.editBtn}
            onClick={() => navigate(`/profile-pic-edit/${user._id}`)}
          >
            <img src={edit} alt="Edit" />
            <p>Change Pic</p>
          </div>
        </div>
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p>{user.email}</p>
        <p>{user.phoneNumber}</p>
        <button onClick={() => navigate(`/profile-info-edit/${user._id}`)}>
          Edit
        </button>
      </div>

      <h2>My Journey</h2>
      <div className={cssModules.cardContainer}>
        {/* card */}
        {diaries.length === 0 ? (
          <div className={cssModules.nodiary}>
            <h1>No Diary Found</h1>
            <img src={nodiary} alt={nodiary} />
          </div>
        ) : (
          <>
            {diaries?.map((item, index) => (
              <DiaryCard item={item} key={index} press={getDiaries} />
            ))}
          </>
        )}
        {/* end of card */}
      </div>
    </div>
  );
}

export default Profile;
