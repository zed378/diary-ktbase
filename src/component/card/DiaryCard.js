// import package
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dateFormat, { masks } from "dateformat";
import DOMPurify from "dompurify";
import { KontenbaseClient } from "@kontenbase/sdk";
import axios from "axios";

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

function DiaryCard({ item, press }) {
  let navigate = useNavigate();
  const logTrigger = () => {
    document.getElementById("loginbutton").click();
  };
  const [modal, setModal] = useState(null);

  const [user, setUser] = useState([]);

  const [findMark, setFindMark] = useState(null);
  const [findLike, setFindLike] = useState(null);

  const [marked, setMarked] = useState([]);
  const [like, setLike] = useState([]);
  const [allLike, setAllLike] = useState([]);
  const [allComment, setAllComment] = useState([]);

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  axios.defaults.headers.common = {
    Authorization: `Bearer ${localStorage.token}`,
  };

  const getUser = async () => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/Users/${localStorage.id}`
      );

      setUser(data.data);
    } catch (error) {}
  };

  const setMark = async () => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/Bookmarks?diariesId=${item._id}&userId=${localStorage.id}`
      );
      setFindMark(data.data[0]);

      if (data.data.length === 0) {
        const { data, error } = await kontenbase.service("Bookmarks").create({
          userId: [localStorage.id],
          diariesId: [item._id],
        });
      } else {
        delMark(findMark._id);
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
          diariesId: item._id,
        },
      });

      setMarked(data);
      setFindMark(null);
    } catch (error) {
      console.log(error);
    }
  };

  const delMark = async (idMark) => {
    try {
      const { data, error } = await kontenbase
        .service("Bookmarks")
        .deleteById(`${idMark}`);
    } catch (error) {
      console.log(error);
    }
  };

  const clickLike = async () => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/Likes?diariesId=${item._id}&userId=${localStorage.id}`
      );
      setFindLike(data.data[0]);

      if (data.data.length === 0) {
        const { data, error } = await kontenbase.service("Likes").create({
          userId: [localStorage.id],
          diariesId: [item._id],
        });
      } else {
        delLike(findLike._id);
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
      const { data, error } = await kontenbase.service("Likes").find({
        where: {
          userId: localStorage.id,
          diariesId: item._id,
        },
      });
      setLike(data);
      setFindLike(null);
    } catch (error) {
      console.log(error);
    }
  };

  const delLike = async (idLike) => {
    try {
      const { data, error } = await kontenbase
        .service("Likes")
        .deleteById(`${idLike}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLike = async () => {
    try {
      const { data, error } = await kontenbase.service("Likes").find({
        lookup: { _id: "*" },
        where: {
          diariesId: item._id,
        },
      });

      setAllLike(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllComment = async () => {
    try {
      const { data, error } = await kontenbase.service("Comments").find({
        lookup: { _id: "*" },
        where: {
          diariesId: item._id,
        },
      });
      setAllComment(data);
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
      const { data, error } = await kontenbase.service("posts").deleteById(id);

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
            if (localStorage.token) {
              setMark();
            } else {
              logTrigger();
            }
          }}
        >
          {localStorage.token ? (
            <>
              {marked === null || marked.length === 0 ? (
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
            {item.userId[0]._id === localStorage.id ? (
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
              if (localStorage.token) {
                clickLike();
              } else {
                logTrigger();
              }
            }}
          >
            {localStorage.token ? (
              <>
                {like === null || like.length === 0 ? (
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
