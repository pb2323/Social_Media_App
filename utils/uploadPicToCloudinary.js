import axios from "axios";

const uploadPic = async (media) => {
  try {
    const form = new FormData();
    form.append("file", media);
    // form.append("Authorization", process.env.BASIC_AUTH_INFURA)
    // form.append("upload_preset", "social_media_app");
    // form.append("cloud_name", "indersingh");

    const res = await axios.post(process.env.INFURA_IPFS_URL, form, { headers: { "Authorization": process.env.BASIC_AUTH_INFURA } });
    console.log(res);
    return `https://${process.env.DEDICATED_GATEWAY_INFURA}/ipfs/${res.data.Hash}`;    //Comment if using cloudinary 
  } catch (error) {
    console.log(error.message);
    return;
  }
};

export default uploadPic;
