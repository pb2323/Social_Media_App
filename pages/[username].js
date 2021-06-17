import React, { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { useRouter } from "next/router";
import { NoProfile } from "../components/Layout/NoData";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { Grid } from "semantic-ui-react";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";
import CardPost from "../components/Post/CardPost";
import moduleName from '../components/Common/'

function ProfilePage({
  profile,
  followersLength,
  followingLength,
  errorLoading,
  user,
  userFollowStats,
}) {
  if (errorLoading) return <NoProfile />;
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeItem, setActiveItem] = useState("profile");
  const handleItemClick = (item) => setActiveItem(item);
  const [loggedUserFollowStats, setLoggedUserFollowStats] =
    useState(userFollowStats);

  const ownAccount = profile.user._id === user._id;

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const { username } = router.query;
        const token = cookie.get("token");

        const res = await axios.get(
          `${baseUrl}/api/profile/posts/${username}`,
          { headers: { Authorization: token } }
        );

        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    getPosts();
  }, []);
  return (
    <>
      <Grid stackable>
        <Grid.Column>
          <ProfileMenuTabs
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            followersLength={followersLength}
            followingLength={followingLength}
            loggedUserFollowStats={loggedUserFollowStats}
            ownAccount={ownAccount}
          />
        </Grid.Column>
      </Grid>
    </>
  );
}

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token },
    });

    const { profile, followersLength, followingLength } = res.data;

    return { profile, followersLength, followingLength };
  } catch (err) {
    return { errorLoading: true };
  }
};

export default ProfilePage;
