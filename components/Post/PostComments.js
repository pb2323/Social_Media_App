import React, { useState } from "react";
import calculateTime from "../../utils/calculateTime";
import { Icon, Comment } from "semantic-ui-react";
import { deleteComment } from "../../utils/postActions";

function PostComments({ comment, user, postId, setComments }) {
  const [disabled, setDisabled] = useState(false);
  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar src={comment.user.profilePicUrl} />
        <Comment.Content>
          <Comment.Author as="a" href={`/${comment.user.username}`}>
            {comment.user.name}
          </Comment.Author>
          <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>
          <Comment.Text>{comment.text}</Comment.Text>
          <Comment.Actions>
            <Comment.Action>
              {(user.role === "root" || user._id === comment.user._id) && (
                <Icon
                  disabled={disabled}
                  name="trash"
                  color="red"
                  onClick={async () => {
                    setDisabled(true);
                    await deleteComment(postId, comment._id, setComments);
                    setDisabled(false);
                  }}
                />
              )}
            </Comment.Action>
          </Comment.Actions>
        </Comment.Content>
      </Comment>
    </Comment.Group>
  );
}

export default PostComments;
