// import package
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import component

// import assets
import "../../assets/css/ckeditor.css";
import cssModules from "../../assets/css/EditJourney.module.css";

// import config
import { API } from "../../config/api";

function EditDiaryPic() {
  const navigate = useNavigate();
  const pic = () => {
    document.getElementById("thumbnail").click();
  };

  const { idPost } = useParams();

  // alert
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  // store data
  const [form, setForm] = useState({
    thumbnail: "",
  });

  const [diary, setDiary] = useState([]);

  // get data from previous diary
  const getDiary = async () => {
    try {
      const response = await API.get(`/post/${idPost}`);

      setPreview(response.data.data.thumbnail);

      setDiary({
        id: response.data.data.id,
      });
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

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store form data as object
      const formData = new FormData();
      formData.set("thumbnail", form.thumbnail[0], form.thumbnail[0].name);

      const response = await API.patch(`/post/${diary.id}`, formData, config);

      if (response.data.status === "Success") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/");
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
    getDiary();
  }, []);

  return (
    <div className={cssModules.writeContainer}>
      <div className={cssModules.imgContainer}>
        <h1>Update Journey Thumbnail</h1>

        {success ? (
          <h3
            style={{
              width: "40%",
              color: "green",
              background: "#c5fce5",
              textAlign: "center",
              padding: "0.5rem 0",
              fontSize: "1.15rem",
              fontFamily: "avenirs",
            }}
          >
            Update Thumbnail Success
          </h3>
        ) : (
          <></>
        )}

        {fail ? (
          <h3
            style={{
              width: "40%",
              color: "red",
              background: "#e0cecc",
              textAlign: "center",
              padding: "0.5rem 0",
              fontSize: "1.15rem",
              fontFamily: "avenirs",
            }}
          >
            Update Thumbnail Failed
          </h3>
        ) : (
          <></>
        )}
        <div className={cssModules.imgWrapper} onClick={pic}>
          {preview && <img src={preview} alt="Preview" />}
          <div className={cssModules.addText}>
            <h1>Add Thumbnail Here</h1>
          </div>
        </div>
      </div>

      <div className={cssModules.formContainer}>
        <form className={cssModules.formContent} onSubmit={handleSubmit}>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            hidden
            onChange={handleChange}
          />

          <div className={cssModules.btnWrapper}>
            <button
              className={cssModules.backBtn}
              onClick={() => navigate("/")}
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

export default EditDiaryPic;
