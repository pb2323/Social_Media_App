import axios from "axios";

const uploadPic = async (media) => {
  try {
    const form = new FormData();
    form.append("file", media);
    // form.append("upload_preset", "social_media_app");
    // form.append("cloud_name", "indersingh");

    const res = await axios.post(process.env.INFURA_IPFS_URL, form);
    console.log(res);
    return `https://infura-ipfs.io/ipfs/${res.data.Hash}`;    //Comment if using cloudinary 
  } catch (error) {
    console.log(error.message);
    return;
  }
};

export default uploadPic;
