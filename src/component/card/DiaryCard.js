// import package
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dateFormat, { masks } from "dateformat";
import DOMPurify from "dompurify";
import { KontenbaseClient } from "@kontenbase/sdk";

// import assets
import bookmark from "../../assets/img/bookmark.svg";
import bookmarked from "../../assets/img/bookmarked.svg";
import love from "../../assets/img/love.svg";
import loved from "../../assets/img/loved.svg";
import comment from "../../assets/img/comment.svg";
import edit from "../../assets/img/edit.svg";
import editimg from "../../assets/img/editimg.svg";
import trash from "../../assets/img/trash.svg";
import cssModules from "../../assets/css/Home.module.css";
import { UserContext } from "../../context/UserContext";

// import config
import { API } from "../../config/api";

function DiaryCard({ item, press }) {
  let navigate = useNavigate();
  const logTrigger = () => {
    document.getElementById("loginbutton").click();
  };
  const [state] = useContext(UserContext);
  const [modal, setModal] = useState(null);

  const [user, setUser] = useState([]);

  const [marked, setMarked] = useState([]);
  const [like, setLike] = useState([]);
  const [allLike, setAllLike] = useState([]);
  const [allComment, setAllComment] = useState([]);

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const getUser = async () => {
    const { data, error } = await kontenbase
      .service("Users")
      .getById(localStorage.id);

    setUser(data);
  };

  const setMark = async (id) => {
    try {
      const { data, error } = await kontenbase.service("Bookmarks").find({
        where: {
          userId: [localStorage.id],
          postId: [item._id],
        },
      });

      if (!data) {
        const { mark, error } = await kontenbase.service("Bookmarks").create({
          userId: [localStorage.id],
          postId: [item._id],
          isMark: 1,
        });
      } else {
        if (data.isMark === 1) {
          const { mark, error } = await kontenbase
            .service("Bookmarks")
            .updateById(data._id, {
              isMark: 0,
            });
        } else {
          const { mark, error } = await kontenbase
            .service("Bookmarks")
            .updateById(data._id, {
              isMark: 1,
            });
        }
      }

      getmark();
      press();
    } catch (error) {
      console.log(error);
    }
  };

  const getmark = async () => {
    try {
      const { data, error } = await kontenbase.service("Bookmarks").find({
        where: {
          userId: localStorage.id,
          postId: item._id,
          isMark: 1,
        },
      });

      setMarked(data);
    } catch (error) {
      console.log(error);
    }
  };

  const clickLike = async () => {
    try {
      const { data, error } = await kontenbase.service("Likes").find({
        where: {
          userId: [localStorage.id],
          postId: [item._id],
        },
      });

      if (!data) {
        const { like, error } = await kontenbase.service("Likes").create({
          userId: [localStorage.id],
          postId: [item._id],
          isLike: 1,
        });
      } else {
        if (data.isLike === 1) {
          const { like, error } = await kontenbase
            .service("Bookmarks")
            .updateById(data._id, {
              isLike: 0,
            });
        } else {
          const { like, error } = await kontenbase
            .service("Bookmarks")
            .updateById(data._id, {
              isLike: 1,
            });
        }
      }

      getLike();
      getAllLike();
      press();
    } catch (error) {
      console.log(error);
    }
  };

  const getLike = async () => {
    try {
      const response = await API.get(`/like/${item.id}`);

      setLike(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLike = async () => {
    try {
      const response = await API.get(`/get-like/${item.id}`);

      setAllLike(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComment = async () => {
    try {
      const response = await API.get(`/comments/${item.id}`);

      setAllComment(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const delModal = (id, name) => {
    const modal = (
      <div className={cssModules.delModal}>
        <div className={cssModules.modalCard}>
          <p>
            Are you sure to delete <strong>{name}</strong>?{" "}
          </p>
          <div className={cssModules.delModalBtn}>
            <button
              className={cssModules.delCancel}
              onClick={() => setModal(null)}
            >
              Cancel
            </button>
            <button className={cssModules.delYes} onClick={() => delPost(id)}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );

    setModal(modal);
  };

  const delPost = async (id) => {
    try {
      await API.delete(`/post/${id}`);

      setModal(null);
      press();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getmark();
    getLike();
    getAllLike();
    getAllComment();
    getUser();
  }, []);

  return (
    <>
      {modal ? modal : <></>}

      <div className={cssModules.cardContent}>
        <div
          className={cssModules.bookmark}
          onClick={() => {
            if (state.isLogin) {
              setMark(item.id);
            } else {
              logTrigger();
            }
          }}
        >
          {localStorage.token ? (
            <>
              {marked === null || marked.isMark === 0 ? (
                <img src={bookmark} alt="Bookmark" />
              ) : (
                <img src={bookmarked} alt="Bookmark" />
              )}
            </>
          ) : (
            <img src={bookmark} alt="Bookmark" />
          )}
        </div>

        {/* edit button */}
        {localStorage.token ? (
          <>
            {item.userId === localStorage.id ? (
              <div className={cssModules.menuEdit}>
                <div
                  className={cssModules.menuImg}
                  onClick={() => navigate(`/write-pic-edit/${item._id}`)}
                >
                  <img src={editimg} alt="Edit" />
                </div>

                <div
                  className={cssModules.menuImg}
                  onClick={() => navigate(`/write-edit/${item._id}`)}
                >
                  <img src={edit} alt="Edit" />
                </div>

                <div
                  className={cssModules.menuImg}
                  onClick={() => delModal(item._id, item.title)}
                >
                  <img src={trash} alt="Trash" />
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        {/* end of edit button */}

        {/* thumbnail */}
        <div
          className={cssModules.thumbnail}
          onClick={() => navigate(`/detail-diary/${item._id}`)}
        >
          <img src={item.thumbnail} alt="Preview" />
        </div>
        {/* end of thumbnail */}

        {/* begin like button and comment counter */}
        <div className={cssModules.love}>
          <div
            className={cssModules.loveWrapper}
            onClick={() => {
              if (state.isLogin) {
                clickLike();
              } else {
                logTrigger();
              }
            }}
          >
            {state.isLogin ? (
              <>
                {like === null || like.isLike === 0 ? (
                  <img
                    src={love}
                    alt="Like"
                    onMouseOver={(e) => (e.currentTarget.src = loved)}
                    onMouseOut={(e) => (e.currentTarget.src = love)}
                  />
                ) : (
                  <img src={loved} alt="Like" />
                )}
              </>
            ) : (
              <img
                src={love}
                alt="Like"
                onMouseOver={(e) => (e.currentTarget.src = loved)}
                onMouseOut={(e) => (e.currentTarget.src = love)}
              />
            )}
          </div>

          {allLike.length === 0 ? <p>Like</p> : <p>{allLike.length} Likes</p>}

          <div
            className={cssModules.loveWrapper}
            onClick={() => navigate(`/detail-diary/${item._id}`)}
          >
            <img src={comment} alt={comment} />
          </div>

          {allComment.length === 0 ? (
            <p onClick={() => navigate(`/detail-diary/${item._id}`)}>Comment</p>
          ) : (
            <p onClick={() => navigate(`/detail-diary/${item._id}`)}>
              {allComment.length} Comments
            </p>
          )}
        </div>
        {/* end of like button and comment counter */}

        <div
          className={cssModules.cardDesc}
          onClick={() => navigate(`/detail-diary/${item._id}`)}
        >
          <h2>{item.title}</h2>
          <p>
            {dateFormat(item.createdAt, "dddd, d mmmm, yyyy")}, {user.firstName}{" "}
            {user.lastName}
          </p>

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(item.content),
            }}
            className={cssModules.h4}
          ></div>
        </div>
      </div>
    </>
  );
}

export default DiaryCard;
