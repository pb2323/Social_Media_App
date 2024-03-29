import App from "next/app";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Layout from "../components/Layout/Layout";
import Loader from '../components/Layout/Loader';
import { ContextProvider } from '../utils/Context'
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);
    let pageProps = {};

    const protectedRoutes =
      ctx.pathname === "/" ||
      ctx.pathname === "/[username]" ||
      ctx.pathname === "/notifications" ||
      ctx.pathname === "/post/[postId]" ||
      ctx.pathname === "/messages" ||
      ctx.pathname === "/search" ||
      ctx.pathname === "/contracts" ||
      ctx.pathname === "/contracts/new" ||
      ctx.pathname === "/contracts/guarantor" ||
      ctx.pathname === "/contracts/[address]" ||
      ctx.pathname === "/contracts/[address]/requests" ||
      ctx.pathname === "/contracts/[address]/requests/new";
    
    if (!token) {
      destroyCookie(ctx, "token");
      protectedRoutes && redirectUser(ctx, "/login");
    }
    //
    else {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      try {
        const res = await axios.get(`${baseUrl}/api/auth`, {
          headers: { Authorization: token },
        });

        const { user, userFollowStats, Wallet } = res.data;

        if (user) !protectedRoutes && redirectUser(ctx, "/");

        pageProps.user = user;
        pageProps.userFollowStats = userFollowStats;
        pageProps.Wallet = Wallet;
      } catch (error) {
        destroyCookie(ctx, "token");
        redirectUser(ctx, "/login");
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ContextProvider>
        <Layout {...pageProps}>
          <Component {...pageProps} />
          <Loader />
        </Layout>
      </ContextProvider>
    );
  }
}

export default MyApp;
