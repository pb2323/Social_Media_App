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
    return true;
  } catch (err) {
    const error = catchErrors(err);
    setError(error);
    return true;
  }
};

export const deletePost = async (postId, setPosts, setShowToastr) => {
  try {
    await Axios.delete(`/${postId}`);
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setShowToastr(true);
    return true;
  } catch (err) {
    console.log(catchErrors(err));
    return true;
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await Axios.post(`/like/${postId}`);
      setLikes((prev) => [...prev, { user: userId }]);
      return true;
    } else {
      await Axios.post(`/unlike/${postId}`);
      setLikes((prev) => prev.filter((like) => like.user !== userId));
      return true;
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
    setText("");
    return true;
  } catch (err) {
    console.log(catchErrors(err));
    return true;
  }
};

export const deleteComment = async (postId, commentId, setComments) => {
  try {
    await Axios.delete(`/${postId}/${commentId}`);
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    return true;
  } catch (err) {
    console.log(catchErrors(err));
    return true;
  }
};

