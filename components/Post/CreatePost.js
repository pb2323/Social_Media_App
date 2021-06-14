import React, { useState, useRef, createRef } from "react";
import { Form, Image, Icon, Button, Divider, Message } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = createRef();
  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    } else setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const addStyles = () => ({
    textAlign: "center",
    height: "150px",
    width: "150px",
    border: "dotted",
    paddingTop: media === null && "60px",
    cursor: "pointer",
    borderColor: highlighted ? "green" : "black",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let picUrl;
    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error uploading Image");
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />

        <Form.Group>
          <Image src={user.profilePicUrl} avatar circular inline />
          <Form.TextArea
            placeholder="Whats happening"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            placeholder="Want to add a location?"
            name="location"
            value={newPost.location}
            onChange={handleChange}
            icon="map marker alternate"
            label="Add Location"
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
          />
        </Form.Group>

        <div
          style={addStyles()}
          onClick={() => inputRef.current.click()}
          onDrag={(e) => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(true);
            const droppedFile = Array.from(e.dataTransfer.files);
            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
        >
          {media === null ? (
            <Icon name="plus" size="big" />
          ) : (
            <>
              <Image
                style={{ height: "150px", width: "150px" }}
                src={mediaPreview}
                alt="PostImage"
                centered
                size="medium"
              />
            </>
          )}
        </div>

        <Divider hidden />

        <Button
          loading={loading}
          icon="send"
          content={<strong>Post</strong>}
          disabled={newPost.text === "" || loading}
          circular
          style={{ backgroundColor: "#1DA1F2", color: "white" }}
        />

        <Divider />
      </Form>
    </>
  );
}

export default CreatePost;
