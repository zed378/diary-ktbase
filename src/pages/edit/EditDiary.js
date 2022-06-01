// import package
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { KontenbaseClient } from "@kontenbase/sdk";

// import component
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import assets
import "../../assets/css/ckeditor.css";
import cssModules from "../../assets/css/AddDiary.module.css";

function EditDiary() {
  const navigate = useNavigate();

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const { idPost } = useParams();

  // store data
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [diary, setDiary] = useState([]);

  // alert
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  // get data from previous diary
  const getDiary = async () => {
    try {
      const { data, error } = await kontenbase
        .service("Diaries")
        .getById(idPost);

      setForm({
        ...form,
        title: data.title,
        content: data.content,
      });

      setDiary({
        id: data._id,
        content: data.content,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data, error } = await kontenbase
        .service("Diaries")
        .updateById(idPost, {
          title: form.title,
          content: form.content,
        });

      if (data) {
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

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setForm({ ...form, content: data });
  };

  useEffect(() => {
    getDiary();
  }, []);

  return (
    <div className={cssModules.writeContainer}>
      <h1 style={{ textAlign: "center" }}>Edit Journey Content</h1>

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

          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Input Title"
            onChange={handleChange}
          />

          <CKEditor
            editor={ClassicEditor}
            data={diary.content}
            config={{
              placeholder:
                "Type something here & make sure you only add thumbnail using that big box.",
            }}
            onChange={handleEditorChange}
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

export default EditDiary;
