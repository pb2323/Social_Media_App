import React, { useRef } from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import {
  Container,
  Divider,
  Visibility,
  Ref,
  Sticky,
  Grid,
  Segment,
} from "semantic-ui-react";
import nprogress from "nprogress";
import Router, { useRouter } from "next/router";
import Search from "./Search";
import SideMenu from "./SideMenu";

function Layout({ children, user }) {
  const contextRef = useRef();
  const router = useRouter();

  const messageRoute = router.pathname === "/messages";
  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();
  return (
    <>
      <HeadTags />
      {user ? (
        <>
          <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
            <Ref innerRef={contextRef}>
              <Grid>
                {!messageRoute ? (
                  <>
                    <Grid.Column floated="left" width={2}>
                      <Sticky context={contextRef}>
                        <SideMenu user={user} />
                      </Sticky>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <Visibility context={contextRef}>{children}</Visibility>
                    </Grid.Column>
                    <Grid.Column width={4} floated="left">
                      <Sticky context={contextRef}>
                        <Segment basic>
                          <Search />
                        </Segment>
                      </Sticky>
                    </Grid.Column>
                  </>
                ) : (
                  <>
                    <Grid.Column floated="left" width={1}></Grid.Column>
                    <Grid.Column width={15}>{children}</Grid.Column>
                  </>
                )}
              </Grid>
            </Ref>
          </div>
        </>
      ) : (
        <>
          <Navbar />

          <Container style={{ paddingTop: "1rem" }} text>
            {children}
          </Container>
        </>
      )}
    </>
  );
}

export default Layout;
