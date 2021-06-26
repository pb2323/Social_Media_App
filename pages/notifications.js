import React from "react";
import axios from "axios";
import { Feed, Segment, Divider, Container } from "semantic-ui-react";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import cookie from "js-cookie";
import { NoNotifications } from "../components/Layout/NoData";
import LikeNotification from "../components/Notifications/LikeNotification";
import CommentNotification from "../components/Notifications/CommentNotification";
import FollowerNotification from "../components/Notifications/FollowerNotification";

function Notifications({ notifications, errorLoading, user, userFollowStats }) {
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  useEffect(() => {
    const notificationRead = async () => {
      try {
        const res = await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          { headers: { Authorization: cookie.get("token") } }
        );
      } catch (err) {
        console.log(err);
      }
    };
    return () => {
      notificationRead();
    };
  }, [input]);

  return (
    <>
      <Container style={{ marginTop: "1.5rem" }}>
        {notifications.length > 0 ? (
          <>
            <Segment color="teal" raised>
              <div
                style={{
                  maxHeight: "40rem",
                  overflow: "auto",
                  height: "40rem",
                  position: "relative",
                  width: "100%",
                }}
              >
                <Feed size="small">
                  {notifications.map((notification) => (
                    <>
                      {notification.type === "newLike" &&
                        notification.post !== null && (
                          <LikeNotification
                            key={notification._id}
                            notification={notification}
                          />
                        )}

                      {notification.type === "newComment" &&
                        notification.post !== null && (
                          <CommentNotification
                            key={notification._id}
                            notification={notification}
                          />
                        )}

                      {notification.type === "newFollower" &&
                        notification.post !== null && (
                          <FollowerNotification
                            key={notification._id}
                            loggedUserFollowStats={loggedUserFollowStats}
                            setUserFollowStats={setUserFollowStats}
                            notification={notification}
                          />
                        )}
                    </>
                  ))}
                </Feed>
              </div>
            </Segment>
          </>
        ) : (
          <NoNotifications />
        )}

        <Divider hidden />
      </Container>
    </>
  );
}

Notifications.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: { Authorization: token },
    });

    return { notifications: res.data };
  } catch (err) {
    return { errorLoading: true };
  }
};

export default Notifications;
