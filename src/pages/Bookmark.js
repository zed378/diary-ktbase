// import package
import { useState, useEffect, useContext } from "react";

// import component
import BookmarkCard from "../component/card/BookmarkCard";
import { UserContext } from "../context/UserContext";

// import assets
import nomark from "../assets/img/nomark.svg";
import cssModules from "../assets/css/Home.module.css";

import { API } from "../config/api";

function Bookmark() {
  const [state] = useContext(UserContext);

  const [marked, setMarked] = useState([]);
  const getMarked = async () => {
    try {
      const response = await API.get(`/marks/${state.user.id}`);

      setMarked(response.data.data);
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
