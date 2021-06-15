import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: { Authorization: cookie.get("token") },
});

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError
) => {
  try {
    const res = await Axios.post("/", { text, location, picUrl });

    setPosts((prev) => [res.data, ...prev]);
    setNewPost({ text: "", location: "" });
  } catch (err) {
    const error = catchErrors(err);
    setError(error);
  }
};

export const deletePost = async (postId, setPosts, setShowToastr) => {
  try {
    await Axios.delete(`/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setShowToastr(true);
  } catch (err) {
    console.log(catchErrors(err));
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await Axios.post(`/like/${postId}`);
      return setLikes((prev) => [...prev, { user: userId }]);
    } else {
      await Axios.post(`/unlike/${postId}`);
      return setLikes((prev) => prev.filter((like) => like.user !== userId));
    }
  } catch (err) {
    console.log(catchErrors(err));
    return true;
  }
};

export const postComment = async (postId, user, text, setComments, setText) => {
  try {
    const res = await Axios.post(`/comment/${postId}`, { text });
    const newComment = {
      _id: res.data,
      user,
      text,
      date: Date.now(),
    };

    setComments((prev) => [newComment, ...prev]);
    return setText("");
  } catch (err) {
    console.log(catchErrors(err));
    return true;
  }
};

export const deleteComment = async (postId, commentId, setComments) => {
  try {
    await Axios.delete(`/${postId}/${commentId}`);
    return setComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );
  } catch (err) {
    console.log(catchErrors(err));
    return true;
  }
};
