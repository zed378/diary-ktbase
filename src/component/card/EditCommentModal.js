// import package
import { useState } from "react";

// import assets
import cssModules from "../../assets/css/DetailDiary.module.css";

// import config
import { API } from "../../config/api";

function EditCommentModal({ press, param, val }) {
  const [form, setForm] = useState("");

  const handleChange = (e) => {
    setForm(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await API.patch(`/comments/${param}/${form}`);

      setForm("");
      press();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cssModules.modalContainer}>
      <div className={cssModules.modalCard}>
        <div className={cssModules.textWrap}>
          <textarea name="comment" onChange={handleChange}>
            {val}
          </textarea>
        </div>
        <div className={cssModules.modalBtn}>
          <button className={cssModules.modalCancel} onClick={press}>
            Cancel
          </button>
          <button
            type="submit"
            className={cssModules.modalSave}
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditCommentModal;
