import React, { useState } from "react";
import { List, Image, Search } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import baseUrl from "../../utils/baseUrl";
import { route } from "next/dist/next-server/server/router";
let cancel;

function ChatListSearch({ chats, setChats }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleChange = async (e) => {
    const { value } = e.target;
    if (value && value.length > 0) {
      setText(value);
      setLoading(true);
      try {
        cancel && cancel();
        const CancelToken = axios.CancelToken;
        const token = cookie.get("token");
        const res = await axios.get(`${baseUrl}/api/search/${value}`, {
          headers: { Authorization: token },
          cancelToken: new CancelToken((canceller) => {
            cancel = canceller;
          }),
        });

        if (res.data.length === 0) setLoading(false);
        setResults(res.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    } else {
      setText(value);
      setResults([]);
    }
  };

  const addChat = (result) => {
    const alreadyInChat =
      chats.length > 0 &&
      chats.filter((chat) => chat.messagesWith === result._id).length > 0;
    if (alreadyInChat) {
      return router.push(`/messages?message=${result._id}`);
    } else {
      const newChat = {
        messagesWith: result._id,
        name: result.name,
        profilePicUrl: result.profilePicUrl,
        lastMessage: "",
        date: Date.now(),
      };

      setChats((prev) => [newChat, ...prev]);
      return router.push(`/messages?message=${result._id}`);
    }
  };

  return (
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
        loading && setLoading(false);
        setText("");
      }}
      loading={loading}
      value={text}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => addChat(data.result)}
    />
  );
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} avatar alt="ProfilePic" />
        <List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default ChatListSearch;
