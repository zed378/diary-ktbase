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
import cssModules from "../../assets/css/Home.module.css";

function BookmarkCard({ item, press }) {
  let navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [marked, setMarked] = useState([]);
  const [findMark, setFindMark] = useState(null);

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const getUser = async () => {
    try {
      const { data, error } = await kontenbase.service("Diaries").find({
        lookup: ["userId"],
        where: {
          _id: item.diariesId[0]._id,
        },
      });

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const setMark = async () => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL}/Bookmarks?diariesId=${item.diariesId[0]._id}&userId=${localStorage.id}`
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
          diariesId: item.diariesId[0]._id,
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

  useEffect(() => {
    getmark();
    getUser();
  }, []);

  return (
    <div className={cssModules.cardContent}>
      <div
        className={cssModules.bookmark}
        onClick={() => setMark(item.diariesId[0]._id)}
      >
        {marked === null ? (
          <img src={bookmark} alt="Bookmark" />
        ) : (
          <img src={bookmarked} alt="Bookmark" />
        )}
      </div>

      <div
        className={cssModules.thumbnail}
        onClick={() => navigate(`/detail-diary/${item.diariesId[0]._id}`)}
      >
        <img src={item.diariesId[0].thumbnail} alt="Preview" />
      </div>

      <div
        className={cssModules.cardDesc}
        onClick={() => navigate(`/detail-diary/${item.diariesId[0]._id}`)}
      >
        <h2>{item.diariesId[0].title}</h2>
        <p>
          {dateFormat(item.diariesId[0].createdAt, "dddd, d mmmm, yyyy")},{" "}
          {user[0].userId[0].firstName} {user[0].userId[0].lastName}
        </p>

        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.diariesId[0].content),
          }}
          className={cssModules.h4}
        ></div>
      </div>
    </div>
  );
}

export default BookmarkCard;
