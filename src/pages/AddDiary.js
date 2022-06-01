// import package
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { KontenbaseClient } from "@kontenbase/sdk";

// import component
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import assets
import "../assets/css/ckeditor.css";
import cssModules from "../assets/css/AddDiary.module.css";

function AddDiary() {
  const navigate = useNavigate();
  const pic = () => {
    document.getElementById("thumbnail").click();
  };

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  // alert
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [picFail, setPicFail] = useState(false);

  // store data
  const [form, setForm] = useState({
    userId: [localStorage.id],
    title: "",
    content: "",
    thumbnail: "",
  });

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

      const file = form.thumbnail[0];

      const { data, error } = await kontenbase.storage.upload(file);

      if (data) {
        const { text, err } = await kontenbase.service("Diaries").create({
          userId: form.userId,
          title: form.title,
          content: form.content,
          thumbnail: data.url,
        });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/");
          document.location.reload(true);
        }, 1500);
      } else {
        setPicFail(true);
        setTimeout(() => setPicFail(false), 3000);
      }
    } catch (error) {
      setFail(true);
      setTimeout(() => {
        setFail(false);
      }, 3000);
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setForm({ ...form, content: data });
  };

  return (
    <div className={cssModules.writeContainer}>
      <h1>New Journey</h1>
      <div className={cssModules.imgPreview}>
        <div className={cssModules.imgWrapper} onClick={pic}>
          {!preview ? (
            <div className={cssModules.textPreview}>
              <h1>Add Image</h1>
            </div>
          ) : (
            <>{preview && <img src={preview} alt="Preview" />}</>
          )}
        </div>
      </div>

      <div className={cssModules.formContainer}>
        <form className={cssModules.formContent} onSubmit={handleSubmit}>
          {success ? (
            <h3
              style={{
                color: "green",
                background: "#c5fce5",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
              }}
            >
              Add Journey Success
            </h3>
          ) : (
            <></>
          )}

          {fail ? (
            <h3
              style={{
                color: "red",
                background: "#e0cecc",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
              }}
            >
              Add Journey Failed
            </h3>
          ) : (
            <></>
          )}

          {picFail ? (
            <h3
              style={{
                color: "red",
                background: "#e0cecc",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
              }}
            >
              Add Image Before Submit, Please
            </h3>
          ) : (
            <></>
          )}

          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            hidden
            onChange={handleChange}
          />
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Input Title"
            onChange={handleChange}
          />

          <CKEditor
            editor={ClassicEditor}
            config={{
              placeholder:
                "Type something here & make sure you only add thumbnail using that big box.",
            }}
            onChange={handleEditorChange}
          />

          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}

export default AddDiary;
