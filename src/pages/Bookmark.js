// import package
import { useState, useEffect } from "react";
import { KontenbaseClient } from "@kontenbase/sdk";

// import component
import BookmarkCard from "../component/card/BookmarkCard";

// import assets
import nomark from "../assets/img/nomark.svg";
import cssModules from "../assets/css/Home.module.css";

function Bookmark() {
  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const [marked, setMarked] = useState([]);
  const getMarked = async () => {
    try {
      const { data, error } = await kontenbase.service("Bookmarks").find({
        lookup: "*",
        where: {
          userId: localStorage.id,
        },
      });
      setMarked(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMarked();
  }, []);

  return (
    <div className={cssModules.homeContainer}>
      <h1 className={cssModules.bookmarkTitle}>Bookmark</h1>

      <div className={cssModules.cardContainer}>
        {/* card */}
        {marked.length === 0 ? (
          <div className={cssModules.nomark}>
            <img src={nomark} alt={nomark} />
            <h1>No Bookmark</h1>
          </div>
        ) : (
          <>
            {marked?.map((item, index) => (
              <BookmarkCard item={item} key={index} press={getMarked} />
            ))}
          </>
        )}
        {/* end of card */}
      </div>
    </div>
  );
}

export default Bookmark;
