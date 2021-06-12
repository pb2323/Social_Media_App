import React, { useEffect } from "react";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function HomePage({ user, userFollowStats }) {
  useEffect(() => {
    document.title = `Welcome ${user.name.split(" ")[0]}`;
  }, []);
  return <div>Home Page</div>;
}

export default HomePage;
