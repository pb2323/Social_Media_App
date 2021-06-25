import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";
import Router from "next/router";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: cookie.get("token") },
});

export const followUser = async (userToFollowId, setUserFollowStats) => {
  try {
    await Axios.post(`/follow/${userToFollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }],
    }));
  } catch (err) {
    console.log(catchErrors(err));
  }
};

export const unfollowUser = async (userToUnfollowId, setUserFollowStats) => {
  try {
    await Axios.put(`/unfollow/${userToUnfollowId}`);

    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (following) => following.user !== userToUnfollowId
      ),
    }));
  } catch (err) {
    console.log(catchErrors(err));
  }
};

export const profileUpdate = async (
  profile,
  setLoading,
  setError,
  profilePicUrl
) => {
  try {
    const { bio, youtube, twitter, instagram, facebook } = profile;
    await Axios.post(`/update`, {
      bio,
      facebook,
      youtube,
      twitter,
      instagram,
      profilePicUrl,
    });
    setLoading(false);
    Router.reload();
  } catch (err) {
    setError(catchErrors(err));
    setLoading(false);
  }
};

export const passwordUpdate = async (setSuccess, userPasswords) => {
  try {
    const { currentPassword, newPassword } = userPasswords;
    await Axios.post(`/settings/password`, { currentPassword, newPassword });
    setSuccess(true);
    return true;
  } catch (err) {
    console.log(catchErrors(err));
    return false;
  }
};

export const toggleMessagePopup = async (
  popupSetting,
  setPopupSetting,
  setSuccess
) => {
  try {
    await Axios.post(`/settings/messagePopup`);
    setPopupSetting(!popupSetting);
    setSuccess(true);
  } catch (err) {
    console.log(catchErrors(err));
    return false;
  }
};
