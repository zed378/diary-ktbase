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
  const [user, setUser] = useState("");

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

      setUser(data[0].userId[0].firstName + " " + data[0].userId[0].lastName);
    } catch (error) {
      console.log(error);
    }
  };

  const getDiary = async () => {
    try {
      const { data, error } = await kontenbase.service("Diaries").getById(id);

      setDiary(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLikes = async () => {
    try {
      const { data, error } = await kontenbase.service("Likes").find({
        lookup: { _id: "*" },
        where: {
          diariesId: id,
        },
      });

      setLikes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async () => {
    try {
      const { data, error } = await kontenbase.service("Comments").find({
        lookup: ["userId"],
        where: {
          diariesId: id,
        },
      });

      setComments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const setCommentMenu = async (commentId) => {
    try {
      const { data, error } = await kontenbase
        .service("Comments")
        .getById(commentId);

      if (data.isClick === "0") {
        const { data, error } = await kontenbase
          .service("Comments")
          .updateById(commentId, {
            isClick: "1",
          });
      } else {
        const { data, error } = await kontenbase
          .service("Comments")
          .updateById(commentId, {
            isClick: "0",
          });
      }

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
  };

  const delComment = async (commentId) => {
    try {
      const { data, error } = await kontenbase
        .service("Comments")
        .deleteById(commentId);
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

      const { data, error } = await kontenbase.service("Comments").create({
        userId: [localStorage.id],
        diariesId: [id],
        comment: form.comment,
      });
      console.log(data);

      getComments();
      setForm({ comment: "" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getDiary();
    getLikes();
    getComments();
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
          <p className={cssModules.infoUser}>{user}</p>
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
        {localStorage.token ? (
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
              {comments.map((item, index) => (
                <div className={cssModules.commentData} key={index}>
                  <div className={cssModules.commentUserPic}>
                    <img
                      src={
                        item.userId[0].photo ||
                        process.env.REACT_APP_DEFAULT_PROFILE
                      }
                      alt={
                        item.userId[0].photo ||
                        process.env.REACT_APP_DEFAULT_PROFILE
                      }
                    />
                  </div>

                  <div className={cssModules.commentUserInfo}>
                    <h4>
                      {item.userId[0].firstName} {item.userId[0].lastName}
                      {localStorage.token &&
                      localStorage.id === item.userId[0]._id ? (
                        <>
                          <img
                            src={dots}
                            alt={dots}
                            onClick={() => setCommentMenu(item._id)}
                          />

                          {item.isClick === "1" ? (
                            <div className={cssModules.menuContainer}>
                              <div
                                className={cssModules.menuOption}
                                onClick={() =>
                                  modalEdit(item._id, item.comment)
                                }
                              >
                                <img src={edit} alt={edit} />
                                <p>Edit</p>
                              </div>
                              <div
                                className={cssModules.menuOption}
                                onClick={() => delComment(item._id)}
                              >
                                <img src={trash} alt={trash} />
                                <p>Delete</p>
                              </div>
                              <div
                                className={cssModules.menuOption}
                                onClick={() => setCommentMenu(item._id)}
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
