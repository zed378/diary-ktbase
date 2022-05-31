// import package
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KontenbaseClient } from "@kontenbase/sdk";

// import assets
import cssModules from "../../assets/css/EditProfile.module.css";

function EditProfilePic() {
  const { id } = useParams();
  const defaultProfile = process.env.REACT_APP_DEFAULT_PROFILE;

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const pic = () => {
    document.getElementById("thumb").click();
  };
  let navigate = useNavigate();

  // store data
  const [form, setForm] = useState({
    photo: null,
  });

  const [user, setUser] = useState([]);

  // alert
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const getUser = async () => {
    try {
      const { data, error } = await kontenbase.service("Users").getById(id);
      setUser(data);

      setForm({
        photo: data.photo,
      });

      setPreview(data.photo || defaultProfile);
    } catch (error) {
      console.log(error);
    }
  };

  // set preview image
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const file = form.photo[0];

      const { data, error } = await kontenbase.storage.upload(file);
      setForm({
        photo: data.url,
      });

      if (data) {
        const { pic, err } = await kontenbase.service("Users").updateById(id, {
          photo: data.url,
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/profile");
          document.location.reload(true);
        }, 1500);
      }
    } catch (error) {
      setFail(true);
      setTimeout(() => {
        setFail(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={cssModules.editContainer}>
      <div className={cssModules.formContainer}>
        <form className={cssModules.editForm} onSubmit={handleSubmit}>
          <h1>Edit Profile Pic</h1>

          {success ? (
            <h3
              style={{
                width: "100%",
                color: "green",
                background: "#c5fce5",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
              }}
            >
              Update Profile Picture Success
            </h3>
          ) : (
            <></>
          )}

          {fail ? (
            <h3
              style={{
                width: "100%",
                color: "red",
                background: "#e0cecc",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
              }}
            >
              Update Profile Picture Failed
            </h3>
          ) : (
            <></>
          )}

          <div className={cssModules.imgContainer} onClick={pic}>
            {preview && <img src={preview} alt="Preview" />}
            <div className={cssModules.addText}>
              <h1>Add Image Here</h1>
            </div>
          </div>

          <input
            type="file"
            name="photo"
            id="thumb"
            onChange={handleChange}
            hidden
          />
          <div className={cssModules.btnWrapper}>
            <button
              className={cssModules.backBtn}
              onClick={() => navigate("/profile")}
            >
              CANCEL
            </button>
            <button type="submit" className={cssModules.saveBtn}>
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePic;
