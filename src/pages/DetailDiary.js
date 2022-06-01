// import package
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import dateFormat, { masks } from "dateformat";
import DOMPurify from "dompurify";
import { KontenbaseClient } from "@kontenbase/sdk";

// import assets
import love from "../assets/img/love.svg";
import comment from "../assets/img/comment.svg";
import nocomments from "../assets/img/comments.svg";
import dots from "../assets/img/dots.svg";
import edit from "../assets/img/editg.svg";
import trash from "../assets/img/trash.svg";
import close from "../assets/img/close.svg";
import cssModules from "../assets/css/DetailDiary.module.css";

// import component
import EditCommentModal from "../component/card/EditCommentModal";

// import config
import { API } from "../config/api";
import { UserContext } from "../context/UserContext";
const path = "http://localhost:5000/uploads/profile/";

function DetailDiary() {
  let navigate = useNavigate();
  const [state] = useContext(UserContext);
  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const { id } = useParams();
  const [diary, setDiary] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [modal, setModal] = useState(null);
  const [user, setUser] = useState([]);

  const [form, setForm] = useState({
    comment: "",
  });

  const getUser = async () => {
    try {
      const { data, error } = await kontenbase.service("Diaries").find({
        lookup: ["userId"],
        where: {
          _id: id,
        },
      });

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user);

  const getDiary = async () => {
    try {
      const { data, error } = await kontenbase.service("Diaries").getById(id);
      console.log(data);

      setDiary(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(diary);

  const getLikes = async () => {
    try {
      const response = await API.get(`/get-like/${id}`);

      setLikes(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await API.get(`/comments/${id}`);

      setComments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const setCommentMenu = async (commentId) => {
    try {
      await API.get(`/comment-menu/${commentId}`);

      getComments();
    } catch (error) {
      console.log(error);
    }
  };

  const modalEdit = (commentId, contents) => {
    setCommentMenu(commentId);

    const modal = (
      <EditCommentModal
        press={() => {
          setModal(null);
          getComments();
        }}
        param={commentId}
        val={contents}
      />
    );

    setModal(modal);
    console.log(form);
  };

  const delComment = async (commentId) => {
    try {
      await API.delete(`/comment/${commentId}`);
      getComments();
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

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      await API.post(`/comment/${state.user.id}/${diary.id}`, body, config);

      getComments();
      setForm({ comment: "" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDiary();
    getLikes();
    getComments();
    getUser();
  }, []);

  return (
    <>
      {modal ? modal : <></>}
      <div className={cssModules.diaryContainer}>
        <button className={cssModules.backBtn} onClick={() => navigate("/")}>
          {" "}
          &larr; Back
        </button>

        <h1>{diary.title}</h1>
        <div className={cssModules.info}>
          <p className={cssModules.infoDate}>
            {" "}
            {dateFormat(diary.createdAt, "dddd, d mmmm, yyyy")}
          </p>
          <p className={cssModules.infoUser}>
            {user[0].userId[0].firstName} {user[0].userId[0].lastName}
          </p>
        </div>

        <div className={cssModules.sumAll}>
          <img src={love} alt={love} />
          <p>{likes.length} Likes</p>
          <img src={comment} alt={comment} />
          <p>{comments.length} Comments</p>
        </div>

        <div className={cssModules.imgContainer}>
          <img src={diary.thumbnail} alt="Thumbnail" />
        </div>
        <div
          className={cssModules.contentText}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(diary.content),
          }}
        ></div>
        <button className={cssModules.backBtn} onClick={() => navigate("/")}>
          {" "}
          &larr; Back
        </button>
      </div>

      <div className={cssModules.commentSection}>
        <h1>All Comments</h1>
        {state.isLogin ? (
          <form onSubmit={handleSubmit} className={cssModules.commentPost}>
            <textarea
              name="comment"
              placeholder="Tell me your thought about my diary"
              onChange={handleChange}
              value={form.comment}
            ></textarea>
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <></>
        )}

        {/* comment */}
        <div className={cssModules.commentContainer}>
          {comments.length !== 0 ? (
            <>
              {comments.map((item) => (
                <div className={cssModules.commentData}>
                  <div className={cssModules.commentUserPic}>
                    <img src={path + item.user.photo} alt={item.user.photo} />
                  </div>

                  <div className={cssModules.commentUserInfo}>
                    <h4>
                      {item.user.name}{" "}
                      {state.isLogin && state.user.id === item.user.id ? (
                        <>
                          <img
                            src={dots}
                            alt={dots}
                            onClick={() => setCommentMenu(item.id)}
                          />

                          {item.menuClick === 1 ? (
                            <div className={cssModules.menuContainer}>
                              <div
                                className={cssModules.menuOption}
                                onClick={() => modalEdit(item.id, item.comment)}
                              >
                                <img src={edit} alt={edit} />
                                <p>Edit</p>
                              </div>
                              <div
                                className={cssModules.menuOption}
                                onClick={() => delComment(item.id)}
                              >
                                <img src={trash} alt={trash} />
                                <p>Delete</p>
                              </div>
                              <div
                                className={cssModules.menuOption}
                                onClick={() => setCommentMenu(item.id)}
                              >
                                <img src={close} alt={close} />
                                <p>Close</p>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </h4>
                    <h6>
                      {dateFormat(item.createdAt, "dddd, d mmmm, yyyy, HH:MM")}{" "}
                      WIB
                    </h6>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className={cssModules.noComment}>
              <h1>No Comment</h1>
              <img src={nocomments} alt={nocomments} />
            </div>
          )}
        </div>
        {/* end of comment */}
      </div>
    </>
  );
}

export default DetailDiary;
