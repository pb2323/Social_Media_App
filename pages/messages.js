import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import {
  Segment,
  Header,
  Divider,
  Comment,
  Grid,
  Icon,
} from "semantic-ui-react";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { useRouter } from "next/router";
import { NoMessages } from "../components/Layout/NoData";

function Messages({ chatsData, errorLoading, user }) {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const socket = useRef();

  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });

  const openChatId = useRef();

  //CONNECTION useEffect
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });

      if (chats.length > 0 && !router.query.message) {
        router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
          shallow: true,
        });
      }
    }

    return () => {
      if (socket.current) {
        socket.current.emit("remove", {});
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    const loadMessage = () => {
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.on("messagesLoaded", ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });

        openChatId.current = chat.messagesWith._id;
      });
    };

    if (socket.current) {
      loadMessage();
    }
  }, [router.query.message]);
  return (
    <>
      <Segment padded basic size="large" style={{ marginTop: "5px" }}>
        <Header
          icon="home"
          content="Go Back"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        />
        <Divider hidden />

        <div style={{ marginBottom: "10px" }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>

        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{ overflow: "auto", maxHeight: "32rem" }}
                  >
                    {chats.map((chat, i) => (
                      <Chat
                        key={i}
                        chat={chat}
                        connectedUsers={connectedUsers}
                        // deleteChat={deleteChat}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <NoMessages />
        )}
      </Segment>
    </>
  );
}

Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });

    return { chatsData: res.data };
  } catch (err) {
    return { errorLoading: true };
  }
};

export default Messages;
