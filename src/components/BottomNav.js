import "./styles/BottomNav.css";
import { PiChatsBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { RiChatSearchFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Account } from "./Account";

export const BottomNav = () => {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    setSelected({
    chats: true,
    search: false,
    profile: false,
    community: false,
  })
  }, [])

  const handleNavClick = (nav) => {
    setSelected({
      chats: nav === "chats",
      search: nav === "search",
      profile: nav === "profile",
      community: nav === "community",
    });
  };

  return (
    <>
      <div className="bottom-nav">
        <a href="/" onClick={() => setSelected("chats")}>
          {" "}
          <span className={`icon-text ${selected.chats ? "decorate" : null}`}>
            {" "}
            <span className="icon">
              {" "}
              <PiChatsBold />{" "}
            </span>{" "}
            Chats
          </span>{" "}
        </a>
        {/* <a href="/"><PiChatsBold /> Home</a> */}
        <a href="/search" onClick={() => handleNavClick("search")}>
          <span className={`icon-text ${selected.search ? "decorate" : null}`}>
            <span className="icon">
              {" "}
              <RiChatSearchFill />
            </span>{" "}
            Search
          </span>
        </a>

        <a href="/community" onClick={() => handleNavClick("community")}>
          <span
            className={`icon-text ${selected.community ? "decorate" : null}`}
          >
            <span className="icon">
              {" "}
              <FaUsers />
            </span>{" "}
            Community
          </span>
        </a>
        {/* <a href="/profile" onClick={() => handleNavClick("profile")}>
          <span className={`icon-text ${selected.profile ? "decorate" : null}`}>
            <span className="icon">
              {" "}
              <CgProfile />
            </span>{" "}
            Profile
          </span>
        </a> */}
        
        <span onClick={() => setSelected({
            profile: !selected.profile,
        })} style={{cursor: 'pointer'}}>
          <span className={`icon-text ${selected.profile ? "decorate" : null}`}>
            <span className="icon">
              {" "}
              <CgProfile />
            </span>{" "}
            Account
          </span>
        </span>
      </div>

{   selected.profile ? <Account setSelected={setSelected} /> : null
}
      {/* <div className={`account-dialog ${selected.profile ? "hide" : "show"}`}>
        <Account setSelected={setSelected} />
      </div> */}
    </>
  );
};
