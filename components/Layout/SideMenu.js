import React from "react";
import { List, Icon } from "semantic-ui-react";
import Link from "next/link";
import { logoutUser } from "../../utils/authUser";
import { useRouter } from "next/router";

function SideMenu({
  user: { unreadNotification, email, unreadMessage, username },
}) {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;

  return (
    <>
      <List
        style={{ paddingTop: "1rem" }}
        size="big"
        verticalAlign="middle"
        selection
      >
        <Link href="/">
          <List.Item active={isActive("/")}>
            <Icon size="large" name="home" color={isActive("/") && "teal"} />
            <List.Content>
              <List.Header content="Home" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link href="/messages">
          <List.Item active={isActive("/messages")}>
            <Icon
              size="large"
              name={unreadMessage ? "hand point right" : "mail outline"}
              color={
                (isActive("/messages") && "teal") || (unreadMessage && "orange")
              }
            />
            <List.Content>
              <List.Header content="Messages" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link href="/notifications">
          <List.Item active={isActive("/notifications")}>
            <Icon
              size="large"
              name={unreadNotification ? "hand point right" : "bell outline"}
              color={
                (isActive("/notifications") && "teal") ||
                (unreadNotification && "orange")
              }
            />
            <List.Content>
              <List.Header content="Notifications" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link href={`/${username}`}>
          <List.Item active={router.query.username === username}>
            <Icon
              size="large"
              name="user"
              color={router.query.username === username && "teal"}
            />
            <List.Content>
              <List.Header content="Account" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <List.Item onClick={() => logoutUser(email)}>
          <Icon size="large" name="log out" />
          <List.Content>
            <List.Header content="Logout" />
          </List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default SideMenu;
