import { Message, Icon, Divider } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

export const HeaderMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";
  return (
    <Message
      color="teal"
      attached
      header={signupRoute ? "Get Started" : "Welcome Back"}
      content={
        signupRoute ? "Create New Account" : "Login with Email and Password"
      }
      icon={signupRoute ? "settings" : "privacy"}
    />
  );
};

export const FooterMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";
  return (
    <>
      {signupRoute ? (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Existing User? <Link href="/login">Login here Instead</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" info>
            <Icon name="lock" />
            <Link href="/reset">Forgot Password?</Link>
          </Message>

          <Message attached="bottom" warning>
            <Icon name="help" />
            New User? <Link href="/signup">Signup Here </Link>Instead
          </Message>
        </>
      )}
    </>
  );
};
