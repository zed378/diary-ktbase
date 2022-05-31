// import package
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dateFormat, { masks } from "dateformat";
import DOMPurify from "dompurify";

// import assets
import bookmark from "../../assets/img/bookmark.svg";
import bookmarked from "../../assets/img/bookmarked.svg";
import cssModules from "../../assets/css/Home.module.css";
import { UserContext } from "../../context/UserContext";

// import config
import { API } from "../../config/api";

function BookmarkCard({ item, press }) {
  let navigate = useNavigate();
  const [state] = useContext(UserContext);

  const [marked, setMarked] = useState([]);

  const setMark = async (id) => {
    try {
      await API.get(`/mark/${id}`);

      getmark();
      press();
    } catch (error) {
      console.log(error);
    }
  };

  const getmark = async () => {
    try {
      const response = await API.get(
        `/getmark/${state.user.id}/${item.post.id}`
      );

      setMarked(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getmark();
  }, []);

  return (
    <div className={cssModules.cardContent}>
      <div
        className={cssModules.bookmark}
        onClick={() => setMark(item.post.id)}
      >
        {marked === null ? (
          <img src={bookmark} alt="Bookmark" />
        ) : (
          <img src={bookmarked} alt="Bookmark" />
        )}
      </div>

      <div
        className={cssModules.thumbnail}
        onClick={() => navigate(`/detail-diary/${item.post.id}`)}
      >
        <img src={item.thumbnail} alt="Preview" />
      </div>

      <div
        className={cssModules.cardDesc}
        onClick={() => navigate(`/detail-diary/${item.post.id}`)}
      >
        <h2>{item.post.title}</h2>
        <p>
          {dateFormat(item.post.createdAt, "dddd, d mmmm, yyyy")},{" "}
          {item.post.user.name}
        </p>

        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.post.content),
          }}
          className={cssModules.h4}
        ></div>
      </div>
    </div>
  );
}

export default BookmarkCard;
