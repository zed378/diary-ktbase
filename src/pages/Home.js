// import package
import { useState, useEffect } from "react";
import { KontenbaseClient } from "@kontenbase/sdk";

// import component
import DiaryCard from "../component/card/DiaryCard";

// import assets
import nopost from "../assets/img/nopost.svg";
import cssModules from "../assets/css/Home.module.css";

function Home() {
  const [diaries, setDiaries] = useState([]);
  const [search, setSearch] = useState("");

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  const getDiaries = async () => {
    try {
      const { data, error } = await kontenbase.service("Diaries").find({
        lookup: "*",
      });
      setDiaries(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDiaries();
  }, []);

  return (
    <div className={cssModules.homeContainer}>
      <h1 className={cssModules.homeTitle}>Journey</h1>

      <div className={cssModules.searchContainer}>
        <input
          type="text"
          placeholder="Find Journey"
          name="search"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className={cssModules.cardContainer}>
        {/* card */}
        {diaries.length === 0 ? (
          <div className={cssModules.nopost}>
            <h1>No Diary Found</h1>
            <img src={nopost} alt={nopost} />
          </div>
        ) : (
          <>
            {diaries
              .filter((val) => {
                if (search === "") {
                  return val;
                } else if (
                  val.title.toLowerCase().includes(search.toLocaleLowerCase())
                ) {
                  return val;
                }
              })
              .map((item, index) => (
                <DiaryCard item={item} key={index} press={getDiaries} />
              ))}
          </>
        )}
        {/* end of card */}
      </div>
    </div>
  );
}

export default Home;
